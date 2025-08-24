import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "static" / "uploads"
GENERATED_DIR = BASE_DIR / "static" / "generated"
DB_FILE = BASE_DIR.parent / "companio.db"

JWT_SECRET = os.environ.get("COMPANIO_JWT_SECRET", "change_this_secret")
JWT_ALGO = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Google Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", None)

# ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(GENERATED_DIR, exist_ok=True)
