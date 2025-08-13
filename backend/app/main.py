from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine
from .config import DB_FILE
from .routes import auth, upload, avatars, ws
from pathlib import Path

app = FastAPI(title="CompaniO Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# create DB file & engine
engine = create_engine(f"sqlite:///{DB_FILE}")
SQLModel.metadata.create_all(engine)

# include routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(avatars.router)
app.include_router(ws.router)

@app.get("/")
def root():
    return {"status": "CompaniO backend running"}
