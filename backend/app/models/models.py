from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    username: str = Field(nullable=False, index=True, unique=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Asset(SQLModel, table=True):
    __tablename__ = "asset"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    owner_id: Optional[str] = Field(default=None, foreign_key="user.id")
    type: str  # photo | model | generated
    storage_path: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Avatar(SQLModel, table=True):
    __tablename__ = "avatar"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    owner_id: Optional[str] = Field(default=None, foreign_key="user.id")
    name: Optional[str] = None  # e.g., Mom, Best Friend
    relationship_to_user: Optional[str] = None  # mother, friend, sibling, etc.
    photo_asset: Optional[str] = Field(default=None, foreign_key="asset.id")
    model_asset: Optional[str] = Field(default=None, foreign_key="asset.id")
    asset_id: Optional[str] = Field(default=None, foreign_key="asset.id")
    status: str = "pending"  # pending | ready | failed
    generated_assets: Optional[str] = None
    consent_text: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AvatarPersonality(SQLModel, table=True):
    __tablename__ = "avatar_personality"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    avatar_id: str = Field(foreign_key="avatar.id")

    tone: Optional[str] = None  # warm | strict | playful | supportive | sarcastic
    communication_style: Optional[str] = None  # talkative | short replies | storyteller
    favorite_phrases: Optional[str] = None  # e.g., "Did you eat?"
    humor_style: Optional[str] = None  # dry | witty | silly | none
    emotional_style: Optional[str] = None  # calm | expressive | quick-tempered
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AvatarHabits(SQLModel, table=True):
    __tablename__ = "avatar_habits"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    avatar_id: str = Field(foreign_key="avatar.id")

    daily_routine: Optional[str] = None  # "Wakes at 6am, morning tea"
    hobbies: Optional[str] = None  # cooking, gardening, movies
    quirks: Optional[str] = None  # "double-checks doors"
    likes: Optional[str] = None  # sweets, family dinners
    dislikes: Optional[str] = None  # loud music
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Session(SQLModel, table=True):
    __tablename__ = "session"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    avatar_id: Optional[str] = Field(default=None, foreign_key="avatar.id")
    owner_id: Optional[str] = Field(default=None, foreign_key="user.id")
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None


class Message(SQLModel, table=True):
    __tablename__ = "message"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    session_id: Optional[str] = Field(default=None, foreign_key="session.id")
    sender: str  # user | avatar | system
    text: Optional[str] = None
    tts_path: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
