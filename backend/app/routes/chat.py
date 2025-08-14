from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, Set
from sqlmodel import Session
from ..db import get_session
from ..services.chat_service import handle_user_message

router = APIRouter()

manager: Dict[str, Set[WebSocket]] = {}


async def connect_ws(session_id: str, websocket: WebSocket):
    await websocket.accept()
    manager.setdefault(session_id, set()).add(websocket)

def disconnect_ws(session_id: str, websocket: WebSocket):
    if session_id in manager:
        manager[session_id].discard(websocket)

async def broadcast(session_id: str, message: dict):
    for ws in list(manager.get(session_id, set())):
        try:
            await ws.send_json(message)
        except:
            pass


@router.websocket("/ws/chat/{session_id}")
async def chat_ws(websocket: WebSocket, session_id: str, db: Session = Depends(get_session)):
    await connect_ws(session_id, websocket)
    try:
        while True:
            payload = await websocket.receive_json()

            if payload.get("type") == "user_message":
                user_text = payload.get("text", "")
                reply_text, tts_path = handle_user_message(session_id, user_text, db)

                # Send bot reply
                await broadcast(session_id, {
                    "type": "bot_message",
                    "text": reply_text,
                    "tts_path": tts_path
                })

            else:
                await broadcast(session_id, payload)

    except WebSocketDisconnect:
        disconnect_ws(session_id, websocket)

@router.post("/chat/{session_id}/send")
def send_chat_message(session_id: str, text: str):
    reply_text, tts_path = handle_user_message(session_id, text)
    return {"reply": reply_text, "tts_path": tts_path}
