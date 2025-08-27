import httpx
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlmodel import Session
from typing import Dict, Set
import json
from datetime import datetime

from ..db import get_session
from ..models.models import Message

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
            manager[session_id].discard(ws)

async def get_ai_response(user_text: str) -> str:
    """Call your AI chat endpoint to get a response"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8000/api/chat",
                json={"text": user_text},
                headers={"Content-Type": "application/json"}
            )
            if response.status_code == 200:
                data = response.json()
                return data.get("response", "I'm having trouble responding right now.")
            else:
                return "I'm having trouble responding right now."
    except Exception as e:
        print(f"Error calling AI endpoint: {e}")
        return "I'm having trouble responding right now."

@router.websocket("/ws/sessions/{session_id}")
async def session_ws(websocket: WebSocket, session_id: str, db: Session = Depends(get_session)):
    await connect_ws(session_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            if payload.get("type") == "user_message":
                user_text = payload.get("text", "")
                
                # Save user message (using 'text' field from your model)
                user_message = Message(
                    session_id=session_id,
                    sender="user",
                    text=user_text,  # Changed from 'content' to 'text'
                    timestamp=datetime.utcnow()
                )
                db.add(user_message)
                db.commit()
                
                # Get AI response
                reply_text = await get_ai_response(user_text)
                
                # Save bot message (using 'text' field from your model)
                bot_message = Message(
                    session_id=session_id,
                    sender="avatar",  # Changed from 'companion' to 'avatar' to match your model
                    text=reply_text,  # Changed from 'content' to 'text'
                    timestamp=datetime.utcnow()
                )
                db.add(bot_message)
                db.commit()
                
                # Send response
                await broadcast(session_id, {
                    "type": "bot_message", 
                    "text": reply_text
                })
                
    except WebSocketDisconnect:
        disconnect_ws(session_id, websocket)