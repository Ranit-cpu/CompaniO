from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from pydantic import ConfigDict
import uuid

class User(SQLModel, table=True):
    __tablename__ = "user"  # Fixed: changed from **tablename** to __tablename__

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    username:str= Field(nullable=False, index=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Asset(SQLModel, table=True):
    __tablename__ = "asset"  # Fixed: changed from **tablename** to __tablename__

    id: str = Field(primary_key=True)
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    type: str  # photo | model | generated
    storage_path: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Avatar(SQLModel, table=True):
    __tablename__ = "avatar"  # Fixed: changed from **tablename** to __tablename__

    # Add this to resolve the protected namespace warning
    model_config = ConfigDict(protected_namespaces=())

    id: str = Field(primary_key=True)
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    photo_asset: Optional[str] = Field(default=None, foreign_key="asset.id")
    model_asset: Optional[str] = Field(default=None, foreign_key="asset.id")
    asset_id: Optional[str] = Field(default=None, foreign_key="asset.id")
    status: str = "pending"  # pending | ready | failed
    generated_assets: Optional[str] = None
    consent_text: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Session(SQLModel, table=True):
    __tablename__ = "session"  # Fixed: changed from **tablename** to __tablename__

    id: str = Field(primary_key=True)
    avatar_id: Optional[str] = Field(default=None, foreign_key="avatar.id")
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None


class Message(SQLModel, table=True):
    __tablename__ = "message"  # Fixed: changed from **tablename** to __tablename__

    id: str = Field(primary_key=True)
    session_id: Optional[str] = Field(default=None, foreign_key="session.id")
    sender: str  # user | avatar | system
    text: Optional[str] = None
    tts_path: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
