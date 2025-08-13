from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Set
from ..services.tts import synthesize_text_to_file
import json

router = APIRouter()

manager: Dict[str, Set[WebSocket]] = {}

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
