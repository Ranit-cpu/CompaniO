import json
import os

DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "dataset.json")

with open(DATASET_PATH, "r", encoding="utf-8") as f:
    dataset = json.load(f)

def get_response(user_message: str) -> str:
    for item in dataset:
        if item["question"].lower() in user_message.lower():
            return item["answer"]
    return "Sorry, I don't know that yet."
