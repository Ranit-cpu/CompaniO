import google.generativeai as genai
from ..config import GEMINI_API_KEY
import logging

# Configure Gemini API
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set. Check your .env file.")

genai.configure(api_key=GEMINI_API_KEY)


def get_ai_response(user_message: str) -> str:
    try:
        # List available models for debugging
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        print(f"Available models: {available_models}")

        # Try different model names
        model_names = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'models/gemini-pro']

        model = None
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                break
            except:
                continue

        if not model:
            # Fallback: use the first available model
            if available_models:
                model = genai.GenerativeModel(available_models[0])
            else:
                return "No available models found for your API key."

        # Create the prompt with system instruction
        prompt = f"""You are a friendly AI talking avatar named CompaniO. 
        Respond to the user in a helpful and conversational way.

        User: {user_message}
        CompaniO:"""

        # Generate response
        response = model.generate_content(prompt)

        return response.text

    except Exception as e:
        logging.error(f"Gemini API error: {e}")
        return f"Sorry, I'm having trouble processing your request. Error: {str(e)}"


# Optional: Test function to verify connection
def test_gemini_connection():
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Hello, respond with just 'Connection successful!'")
        print(f"Gemini test response: {response.text}")
        return True
    except Exception as e:
        print(f"Gemini connection failed: {e}")
        return False

# from openai import OpenAI
# from app.config import OPENAI_API_KEY

# client = OpenAI(api_key=OPENAI_API_KEY)

# def get_ai_response(user_message: str) -> str:
#     response = client.chat.completions.create(
#         model="gpt-4o-mini",   # or "gpt-4o" if available
#         messages=[
#             {"role": "system", "content": "You are a friendly AI talking avatar named as CompaniO."},
#             {"role": "user", "content": user_message}
#         ]
#     )

#     return response.choices[0].message.content


