import httpx
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, HTTPException, status
from sqlmodel import Session
from typing import Dict, Set, Optional
import json
from datetime import datetime

from ..db import get_session
from ..models.models import Message

router = APIRouter()
manager: Dict[str, Set[WebSocket]] = {}
personality_contexts: Dict[str, dict] = {}  # Store personality data per session

async def connect_ws(session_id: str, websocket: WebSocket):
    await websocket.accept()
    manager.setdefault(session_id, set()).add(websocket)

def disconnect_ws(session_id: str, websocket: WebSocket):
    if session_id in manager:
        manager[session_id].discard(websocket)
    # Clean up personality context when user disconnects
    if session_id in personality_contexts:
        del personality_contexts[session_id]

async def broadcast(session_id: str, message: dict):
    sockets = list(manager.get(session_id, set()))
    for ws in sockets:
        try:
            await ws.send_json(message)
        except:
            manager[session_id].discard(ws)

def create_personality_prompt(personality_data: dict, user_message: str) -> str:
    """Create a customized prompt based on personality traits"""
    base_context = personality_data.get('context', '')
    companion_name = personality_data.get('companionName', 'Assistant')
    moon_sign = personality_data.get('moonSign', '')
    traits = personality_data.get('personalityTraits', [])
    
    # Build personality-aware prompt
    prompt = f"{base_context}\n\n"
    prompt += f"As {companion_name}, respond to this message naturally: '{user_message}'\n\n"
    
    if moon_sign:
        prompt += f"Remember you have {moon_sign} moon sign characteristics. "
        
        # Add moon sign specific traits
        moon_traits = {
            "Aries": "be bold, energetic, and direct",
            "Taurus": "be calm, reliable, and grounded", 
            "Gemini": "be curious, witty, and communicative",
            "Cancer": "be nurturing, empathetic, and intuitive",
            "Leo": "be confident, warm, and dramatic",
            "Virgo": "be analytical, helpful, and detail-oriented",
            "Libra": "be harmonious, diplomatic, and charming",
            "Scorpio": "be intense, mysterious, and passionate",
            "Sagittarius": "be adventurous, optimistic, and philosophical",
            "Capricorn": "be ambitious, practical, and disciplined",
            "Aquarius": "be innovative, independent, and humanitarian",
            "Pisces": "be compassionate, creative, and dreamy"
        }
        
        if moon_sign in moon_traits:
            prompt += f"This means you tend to {moon_traits[moon_sign]}. "
    
    if traits:
        prompt += f"Your key personality traits are: {', '.join(traits)}. "
        prompt += "Let these traits shine through in your response naturally. "
    
    prompt += "\n\nRespond in a conversational, engaging way that feels personal and authentic to your character. Keep responses relatively concise but meaningful."
    
    return prompt

async def get_ai_response(user_text: str, session_id: str) -> str:
    """Call your AI chat endpoint to get a response with personality context"""
    try:
        # Get personality context for this session
        personality_data = personality_contexts.get(session_id, {})
        
        # Create personality-aware prompt if we have personality data
        if personality_data:
            enhanced_prompt = create_personality_prompt(personality_data, user_text)
        else:
            enhanced_prompt = user_text
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8000/api/chat",
                json={
                    "text": enhanced_prompt,
                    "session_id": session_id,
                    "personality_context": personality_data
                },
                headers={"Content-Type": "application/json"},
                timeout=30.0  # Add timeout for AI requests
            )
            if response.status_code == 200:
                data = response.json()
                return data.get("response", "I'm having trouble responding right now.")
            else:
                return "I'm having trouble responding right now."
    except Exception as e:
        print(f"Error calling AI endpoint: {e}")
        return "I'm having trouble responding right now."

# Optional: Add a simple token verification function
async def verify_ws_token(token: Optional[str] = Query(None)):
    """
    Verify WebSocket connection token.
    If you don't need auth, just return True.
    """
    # For now, allow all connections (remove auth requirement)
    # You can add proper token verification later
    return True
    
    # If you want to enforce auth, uncomment below:
    # if not token:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="No authentication token provided"
    #     )
    # # Add your token verification logic here
    # return True

@router.websocket("/ws/sessions/{session_id}")
async def session_ws(
    websocket: WebSocket, 
    session_id: str,
    token: Optional[str] = Query(None),  # Accept token as query param
    db: Session = Depends(get_session)
):
    # Verify authentication (currently allows all)
    try:
        await verify_ws_token(token)
    except HTTPException:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    await connect_ws(session_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Handle personality context setup
            if payload.get("type") == "personality_context":
                personality_contexts[session_id] = {
                    "context": payload.get("context", ""),
                    "companionName": payload.get("companionName", ""),
                    "companionGender": payload.get("companionGender", ""),
                    "moonSign": payload.get("moonSign", ""),
                    "personalityTraits": payload.get("personalityTraits", [])
                }
                print(f"Personality context set for session {session_id}: {personality_contexts[session_id]}")
                continue
            
            if payload.get("type") == "user_message":
                user_text = payload.get("text", "")
                
                # Save user message
                user_message = Message(
                    session_id=session_id,
                    sender="user",
                    text=user_text,
                    timestamp=datetime.utcnow()
                )
                db.add(user_message)
                db.commit()
                
                # Get AI response with personality context
                reply_text = await get_ai_response(user_text, session_id)
                
                # Save bot message
                bot_message = Message(
                    session_id=session_id,
                    sender="avatar",
                    text=reply_text,
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