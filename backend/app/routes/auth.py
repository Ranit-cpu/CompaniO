from fastapi import APIRouter, HTTPException, Form
from sqlmodel import Session, select, create_engine
from passlib.context import CryptContext
from pydantic import BaseModel
from ..models.models import User
from ..config import DB_FILE, JWT_SECRET, JWT_ALGO, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import datetime, timedelta
import jwt

class SignupRequest(BaseModel):
    email: str
    password: str

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
engine = create_engine(f"sqlite:///{DB_FILE}")

def create_access_token(subject: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(subject), "exp": expire.isoformat()}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGO)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/signup")
def signup(payload: SignupRequest):
    email = payload.email
    password = payload.password

    with Session(engine) as s:
        existing = s.exec(select(User).where(User.email == email)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        user = User(email=email, password_hash=get_password_hash(password))
        s.add(user)
        s.commit()
        s.refresh(user)
        token = create_access_token(user.id)
        return {"user": {"id": user.id, "email": user.email}, "token": token}

@router.post("/login")
def login(payload:SignupRequest):
    email = payload.email
    password = payload.password

    with Session(engine) as s:
        user = s.exec(select(User).where(User.email == email)).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token(user.id)
        return {"token": token}
