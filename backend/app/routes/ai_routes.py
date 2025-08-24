from fastapi import APIRouter
from pydantic import BaseModel
from ..services.ai_service import get_ai_response

router = APIRouter()

class UserMessage(BaseModel):
    text: str

@router.post("/chat")
async def chat_with_ai(user_message: UserMessage):
    ai_reply = get_ai_response(user_message.text)
    return {"response": ai_reply}
