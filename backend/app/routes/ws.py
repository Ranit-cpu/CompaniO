from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Set
from sqlmodel import Session, select
from ..db import get_session
import json
from pathlib import Path

from ..services.tts import synthesize_text_to_file
from ..models.models import Message  # adjust if your Message model is in models.py
# from ..db import get_session

router = APIRouter()

manager: Dict[str, Set[WebSocket]] = {}

DATASET_FILE = Path(__file__).resolve().parent.parent / "dataset.json"
if DATASET_FILE.exists():
    with open(DATASET_FILE, "r", encoding="utf-8") as f:
        dataset = json.load(f)
else:
    dataset = {}
    print("⚠️ dataset.json not found, replies will fallback to default message.")


def find_reply(user_text: str) -> str:
    """
    Look up a reply from dataset.json based on the user_text.
    Simple case-insensitive exact match.
    """
    key = user_text.strip().lower()
    return dataset.get(key, "Sorry, I don't understand.")


async def connect_ws(session_id: str, websocket: WebSocket):
    await websocket.accept()
    manager.setdefault(session_id, set()).add(websocket)

def disconnect_ws(session_id: str, websocket: WebSocket):
    if session_id in manager:
        manager[session_id].discard(websocket)

async def broadcast(session_id: str, message: dict):
    sockets = list(manager.get(session_id, set()))
    for ws in sockets:
        try:
            await ws.send_json(message)
        except:
            pass

@router.get("/chat/{session_id}/connect")
async def get_chat_connection_info(session_id: str):
    ws_url = f"ws://127.0.0.1:8000/ws/sessions/{session_id}"
    return JSONResponse({"websocket_url": ws_url})


@router.get("/sessions/{session_id}/messages")
async def get_session_messages(
    session_id: str,
    db: Session = Depends(get_session)
):
    messages = db.exec(
        select(Message).where(Message.session_id == session_id).order_by(Message.timestamp)
    ).all()
    return messages

@router.websocket("/ws/sessions/{session_id}")
async def session_ws(websocket: WebSocket, session_id: str):
    await connect_ws(session_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            # Example: { "type": "user_message", "text": "hello" }
            if payload.get("type") == "user_message":
                user_text = payload.get("text", "")
                # Placeholder response: echo + TTS
                reply_text = f"Avatar: Echoing -> {user_text}"
                tts_path = synthesize_text_to_file(reply_text)
                await broadcast(session_id, {"type": "avatar_message", "text": reply_text, "tts_path": tts_path})
            else:
                # forward the message to other peers (signaling)
                await broadcast(session_id, {"type": "signal", "payload": payload})
    except WebSocketDisconnect:
        disconnect_ws(session_id, websocket)
