from gtts import gTTS
from pathlib import Path
import uuid
from ..config import GENERATED_DIR

def synthesize_text_to_file(text: str) -> str:
    tts = gTTS(text=text, lang="en")
    filename = f"{uuid.uuid4().hex}.mp3"
    path = Path(GENERATED_DIR) / filename
    tts.save(str(path))
    return str(path)
