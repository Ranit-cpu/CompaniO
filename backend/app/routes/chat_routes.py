from fastapi import APIRouter
from ..models.chat_models import ChatRequest, ChatResponse
from ..services.chatbot_service import get_response
from ..services.image_service import get_current_avatar

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(request: ChatRequest):
    reply = get_response(request.message)
    avatar_url = get_current_avatar()
    return {"reply": reply, "avatar_url": avatar_url}
