import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AVATAR_FOLDER = os.path.join(BASE_DIR, "static", "avatars")
os.makedirs(AVATAR_FOLDER, exist_ok=True)

HOST_URL = "http://127.0.0.1:8000"
