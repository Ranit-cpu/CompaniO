from fastapi import APIRouter, UploadFile, File
from ..models.upload_models import UploadResponse
from ..services.image_service import save_avatar

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_avatar(file: UploadFile = File(...)):
    avatar_url = save_avatar(file)
    return {"avatar_url": avatar_url}
