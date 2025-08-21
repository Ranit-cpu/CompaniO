from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select, create_engine
from passlib.context import CryptContext
from pydantic import BaseModel
from ..models.models import User
from ..config import DB_FILE, JWT_SECRET, JWT_ALGO, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import datetime, timedelta
import jwt
import uuid

class SignupRequest(BaseModel):
    username : str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
engine = create_engine(f"sqlite:///{DB_FILE}")

def create_access_token(subject: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(subject), "exp": expire}  # use datetime, jwt will convert
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGO)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user_id() -> str:
    return str(uuid.uuid4())

@router.post("/signup")
def signup(payload: SignupRequest):
    username = payload
    email = payload.email
    password = payload.password

    with Session(engine) as s:
        existing = s.exec(select(User).where(User.email == email)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        user = User(id = get_user_id(),username = username,email=email, password_hash=get_password_hash(password))
        s.add(user)
        s.commit()
        s.refresh(user)
        token = create_access_token(user.id)
        return {"user": {"id": user.id, "email": user.email}, "token": token}

@router.post("/login")
def login(payload:LoginRequest):
    email = payload.email
    password = payload.password

    with Session(engine) as s:
        user = s.exec(select(User).where(User.email == email)).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token(user.id)
        return {"token": token}
