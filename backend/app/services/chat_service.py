# app/services/chat_service.py
import json
import random
from pathlib import Path

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


def generate_fallback_reply(user_text: str) -> str:
    """Fallback response similar to frontend generateReply()."""
    emojis = ["😊", "✨", "🌸", "💖", "🥰", "🌟", "💕", "🔥"]

    responses = {
        "greetings": [
            "Hey there! So lovely to hear from you",
            "Hi! I've been waiting to chat with you",
            "Hello! How's your day going"
        ],
        "questions": [
            "I'm doing great! What about you?",
            "I'm fantastic! Talking with you makes me happy",
            "All good here! Thanks for asking"
        ],
        "compliments": [
            "Aww, you're so sweet! That means a lot",
            "Thank you! You always make me smile",
            "You're amazing! I'm lucky to know you"
        ],
        "default": [
            "That's so interesting! Tell me more",
            "I love hearing your thoughts! What else is on your mind?",
            "You always have such cool ideas",
            "This is fun! Keep going"
        ]
    }

    text = user_text.lower()
    if any(word in text for word in ["hello", "hi", "hey"]):
        reply = random.choice(responses["greetings"])
    elif any(word in text for word in ["how are you", "how do you feel"]):
        reply = random.choice(responses["questions"])
    elif any(word in text for word in ["beautiful", "cute", "love"]):
        reply = random.choice(responses["compliments"])
    else:
        reply = random.choice(responses["default"])

    return f"{reply} {random.choice(emojis)}"


def find_reply(user_text: str) -> str:
    """Find reply from dataset.json (case-insensitive), else fallback."""
    key = user_text.strip().lower()
    if key in dataset:
        return dataset[key]
    return generate_fallback_reply(user_text)


def handle_user_message(user_text: str):
    """
    Return a reply + TTS path.
    No database storage, only dataset + fallback logic.
    """
    reply_text = find_reply(user_text)
    return reply_text
