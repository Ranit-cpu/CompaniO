from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks
from sqlmodel import Session, create_engine
from ..services.avatar_worker import run_avatar_generation
from ..config import DB_FILE
from ..services.storage import save_upload_file
from ..models.models import Asset, Avatar
import uuid

router = APIRouter(prefix="/upload", tags=["upload"])
engine = create_engine(f"sqlite:///{DB_FILE}")

# NOTE: simple owner_id param used for demo;
# replace by authenticated user from JWT
@router.post("/photo")
async def upload_photo(
    background_tasks: BackgroundTasks,
    owner_id: int = Form(...),
    file: UploadFile = File(...),
    consent_text: str = Form("I have consent")
):
    # Save uploaded photo
    path = save_upload_file(file)
    asset_id = str(uuid.uuid4())
    asset = Asset(id=asset_id, owner_id=owner_id, type="photo", storage_path=path)

    with Session(engine) as s:
        s.add(asset)
        s.commit()
        s.refresh(asset)

        # Create avatar entry with status pending
        avatar_id = str(uuid.uuid4())  # Generate unique ID for avatar
        avatar = Avatar(
            id=avatar_id,
            owner_id=owner_id,
            photo_asset=asset.id,
            model_asset=None,  # This field exists in your model now
            asset_id=asset_id,
            status="pending",
            consent_text=consent_text
        )
        s.add(avatar)
        s.commit()

    # Trigger avatar generation in background
    background_tasks.add_task(run_avatar_generation, avatar_id)

    return {
        "avatar_id": avatar_id,
        "status": "pending",
        "photo_asset_id": asset_id  # Use the asset_id we created instead of asset.id
    }

# @router.post("/model")
# async def upload_model(owner_id: int = Form(...), file: UploadFile = File(...)):
#     path = save_upload_file(file)
#     asset = Asset(id=str(uuid.uuid4()), owner_id=owner_id, type="model", storage_path=path)
#     with Session(engine) as s:
#         s.add(asset); s.commit()
#     return {"asset_id": asset.id, "path": path}