import os
import logging
import tempfile
from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import FileResponse
import google.generativeai as genai
from gtts import gTTS
import speech_recognition as sr
from ..config import GEMINI_API_KEY
from pydub import AudioSegment

router = APIRouter()

# --- Configure Gemini API ---
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set. Check your .env file.")

genai.configure(api_key=GEMINI_API_KEY)

# --- Initialize recognizer for STT ---
recognizer = sr.Recognizer()

def convert_to_wav(input_path: str, output_path: str):
    """Convert any audio file to WAV, mono, 16kHz."""
    audio = AudioSegment.from_file(input_path)  # automatically detects format
    audio = audio.set_channels(1)  # mono
    audio = audio.set_frame_rate(16000)  # 16kHz
    audio.export(output_path, format="wav")

def transcribe_audio(file_path: str) -> str:
    """Convert user's voice input to text."""
    try:
        with sr.AudioFile(file_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            logging.info(f"Transcribed text: {text}")
            return text
    except Exception as e:
        logging.error(f"Speech recognition error: {e}")
        raise HTTPException(status_code=500, detail=f"Speech recognition failed: {str(e)}")


def get_ai_text_response(user_text: str) -> str:
    """Generate AI response text using Gemini."""
    try:
        model_names = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-pro']
        model = None

        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                break
            except Exception:
                continue

        if not model:
            raise Exception("No suitable Gemini model found.")

        prompt = f"""You are CompaniO — a friendly, natural-sounding AI companion.
Respond conversationally to the user in a helpful way.

User: {user_text}
CompaniO:"""

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        logging.error(f"Gemini API error: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini error: {str(e)}")


def synthesize_speech(text: str, output_path: str):
    """Convert text reply to speech using gTTS."""
    try:
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(output_path)
    except Exception as e:
        logging.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Text-to-speech failed: {str(e)}")

from fastapi import BackgroundTasks

@router.post("/ai/voice")
async def handle_voice_interaction(file: UploadFile, background_tasks: BackgroundTasks):
    temp_audio_path = None
    wav_path = None
    output_audio_path = None

    try:
        # 1️⃣ Save uploaded file
        with tempfile.NamedTemporaryFile(delete=False) as temp_audio:
            temp_audio.write(await file.read())
            temp_audio_path = temp_audio.name

        # 2️⃣ Convert to WAV
        wav_path = tempfile.mktemp(suffix=".wav")
        convert_to_wav(temp_audio_path, wav_path)

        # 3️⃣ STT
        user_text = transcribe_audio(wav_path)
        if not user_text:
            raise HTTPException(status_code=400, detail="Could not transcribe audio")

        # 4️⃣ AI Response
        ai_reply_text = get_ai_text_response(user_text)

        # 5️⃣ TTS
        output_audio_path = tempfile.mktemp(suffix=".mp3")
        synthesize_speech(ai_reply_text, output_audio_path)

        # 6️⃣ Cleanup temp files in background (after response is sent)
        for path in [temp_audio_path, wav_path, output_audio_path]:
            if path:
                background_tasks.add_task(os.remove, path)

        # 7️⃣ Return audio
        return FileResponse(
            output_audio_path,
            media_type="audio/mpeg",
            filename="ai_reply.mp3"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
