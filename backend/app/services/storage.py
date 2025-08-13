import shutil
import uuid
from pathlib import Path
from ..config import UPLOAD_DIR, GENERATED_DIR

def save_upload_file(upload_file) -> str:
    ext = Path(upload_file.filename).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / filename
    with open(dest, "wb") as f:
        shutil.copyfileobj(upload_file.file, f)
    return str(dest)

def save_generated_file(binary_bytes: bytes, ext=".glb") -> str:
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = GENERATED_DIR / filename
    with open(dest, "wb") as f:
        f.write(binary_bytes)
    return str(dest)
