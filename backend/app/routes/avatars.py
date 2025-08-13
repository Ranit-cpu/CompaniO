from fastapi import APIRouter, BackgroundTasks, HTTPException, Form
from sqlmodel import create_engine, Session, select
from ..config import DB_FILE
from ..models.models import Avatar
import uuid
from ..services.avatar_worker import run_avatar_generation

router = APIRouter(prefix="/avatars", tags=["avatars"])
engine = create_engine(f"sqlite:///{DB_FILE}")

@router.post("")
def create_avatar(background_tasks: BackgroundTasks,
                  owner_id: int = Form(...),
                  photo_asset_id: str = Form(...),
                  asset_id: str = Form(...),
                  consent_text: str = Form(...)):
    avatar_id = str(uuid.uuid4())
    avatar = Avatar(id=avatar_id, owner_id=owner_id, photo_asset=photo_asset_id,
                    model_asset=asset_id, status="pending", consent_text=consent_text)
    with Session(engine) as s:
        s.add(avatar); s.commit()
    # enqueue background task (local BackgroundTasks; for production use Celery)
    background_tasks.add_task(run_avatar_generation, avatar_id)
    return {"avatar_id": avatar_id, "status": "pending"}

@router.get("/{avatar_id}/status")
def avatar_status(avatar_id: str):
    with Session(engine) as s:
        avatar = s.get(Avatar, avatar_id)
        if not avatar:
            raise HTTPException(404, "Avatar not found")
        return {"id": avatar.id, "status": avatar.status, "generated_assets": avatar.generated_assets}
