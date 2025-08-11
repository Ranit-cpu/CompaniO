import os
from fastapi import UploadFile
from ..config import AVATAR_FOLDER, HOST_URL

current_avatar_url = f"{HOST_URL}/static/avatars/default.png"

def save_avatar(file: UploadFile) -> str:
    global current_avatar_url
    filename = file.filename
    file_path = os.path.join(AVATAR_FOLDER, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    current_avatar_url = f"{HOST_URL}/static/avatars/{filename}"
    return current_avatar_url

def get_current_avatar() -> str:
    return current_avatar_url
