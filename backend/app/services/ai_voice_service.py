import os, subprocess
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

# --- SET FFMPEG PATH (ADD THIS SECTION) ---
FFMPEG_PATH = r"C:\ffmpeg\bin\ffmpeg.exe"
FFPROBE_PATH = r"C:\ffmpeg\bin\ffprobe.exe"

# Check if FFmpeg exists and set it
if os.path.exists(FFMPEG_PATH):
    AudioSegment.converter = FFMPEG_PATH
    AudioSegment.ffprobe = FFPROBE_PATH
    logging.info(f"✅ FFmpeg found at: {FFMPEG_PATH}")
else:
    logging.warning(f"⚠️ FFmpeg not found at: {FFMPEG_PATH}")
    logging.warning("Please download FFmpeg from: https://www.gyan.dev/ffmpeg/builds/")
# --- END FFMPEG CONFIGURATION ---

# --- Configure Gemini API ---
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set. Check your .env file.")

genai.configure(api_key=GEMINI_API_KEY)

# --- Initialize recognizer for STT ---
recognizer = sr.Recognizer()

def convert_to_wav(input_path: str, output_path: str):
    """Convert any audio file to WAV, mono, 16kHz."""
    try:
        # Force ffmpeg to decode it correctly using file extension
        print(f"🎧 Converting {input_path} → {output_path}")
        audio = AudioSegment.from_file(input_path, format="webm")
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export(output_path, format="wav")
        print(f"✅ Conversion successful!")
    except Exception as e:
        print(f"⚠️ Primary conversion failed: {e}")
        print("🔁 Trying fallback ffmpeg command...")
        try:
            # Use full path for fallback too
            ffmpeg_exe = FFMPEG_PATH if os.path.exists(FFMPEG_PATH) else "ffmpeg"
            cmd = [
                ffmpeg_exe, "-y", "-i", input_path,
                "-ac", "1", "-ar", "16000", output_path
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            print(f"✅ Fallback conversion successful!")
        except Exception as inner:
            print(f"❌ Fallback ffmpeg failed: {inner}")
            raise

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
    import traceback
    temp_audio_path = None
    wav_path = None
    output_audio_path = None

    try:
        # 1️⃣ Save uploaded file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
            temp_audio.write(await file.read())
            temp_audio_path = temp_audio.name
        logging.info(f"Uploaded file saved to: {temp_audio_path}")

        # 2️⃣ Convert to WAV
        wav_path = tempfile.mktemp(suffix=".wav")
        logging.info("Converting audio to wav...")
        convert_to_wav(temp_audio_path, wav_path)
        logging.info(f"Converted WAV: {wav_path}")

        # 3️⃣ STT
        logging.info("Transcribing audio...")
        user_text = transcribe_audio(wav_path)
        logging.info(f"Transcribed text: {user_text}")

        if not user_text:
            raise HTTPException(status_code=400, detail="Could not transcribe audio")

        # 4️⃣ AI Response
        logging.info("Getting AI text reply...")
        ai_reply_text = get_ai_text_response(user_text)
        logging.info(f"AI Reply: {ai_reply_text}")

        # 5️⃣ TTS
        logging.info("Synthesizing speech...")
        output_audio_path = tempfile.mktemp(suffix=".mp3")
        synthesize_speech(ai_reply_text, output_audio_path)
        logging.info(f"Generated MP3: {output_audio_path}")

        # 6️⃣ Cleanup temp files in background
        for path in [temp_audio_path, wav_path, output_audio_path]:
            if path:
                background_tasks.add_task(os.remove, path)

        return FileResponse(
            output_audio_path,
            media_type="audio/mpeg",
            filename="ai_reply.mp3"
        )

    except Exception as e:
        logging.error(f"❌ Error in /ai/voice: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))