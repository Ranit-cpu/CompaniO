# app/services/chat_service.py
import json
from pathlib import Path
from ..services.tts import synthesize_text_to_file

# Load dataset from file
DATASET_FILE = Path(__file__).resolve().parent.parent / "dataset.json"
if DATASET_FILE.exists():
    with open(DATASET_FILE, "r", encoding="utf-8") as f:
        raw_dataset = json.load(f)
        # Convert list format into a dict for lookup
        if isinstance(raw_dataset, list):
            dataset = {item["question"].strip().lower(): item["answer"] for item in raw_dataset}
        else:
            dataset = raw_dataset
else:
    dataset = {}
    print("⚠️ dataset.json not found, replies will fallback to default message.")


def find_reply(user_text: str) -> str:
    """Find reply from dataset.json (case-insensitive)."""
    key = user_text.strip().lower()
    return dataset.get(key, "Sorry, I don't understand.")


def handle_user_message(session_id: str, user_text: str):
    """
    Just return a reply + TTS path based on dataset.json.
    No database storage.
    """
    reply_text = find_reply(user_text)
    tts_path = synthesize_text_to_file(reply_text)
    return reply_text, tts_path
