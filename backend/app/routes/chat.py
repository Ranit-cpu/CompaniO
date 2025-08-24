# app/routers/chat.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Set
from ..services.chat_service import handle_user_message
from ..services.ai_service import get_ai_response
from pydantic import BaseModel

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

class UserMessage(BaseModel):
    text: str


@router.websocket("/ws/chat/{session_id}")
async def chat_with_ai(user_message: UserMessage):
    ai_reply = get_ai_response(user_message.text)
    return {"response": ai_reply}


@router.post("/chat/{session_id}/send")
def send_chat_message(session_id: str, text: str):
    reply_text = handle_user_message(text)
    return {"reply": reply_text}
