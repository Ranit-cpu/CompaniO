
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routes import upload_routes, chat_routes
from .config import BASE_DIR

app = FastAPI(title="Avatar Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=f"{BASE_DIR}/static"), name="static")

app.include_router(upload_routes.router)
app.include_router(chat_routes.router)
