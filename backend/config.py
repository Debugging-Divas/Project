import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # OpenAI Configuration
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    OPENAI_MODEL = "gpt-3.5-turbo"  # You can change to "gpt-4" if you have access
    
    # Server Config
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = True  # Set to False in production
    
    # When friend finishes frontend and tells you her URL:
    # Example: "http://localhost:5500" or "https://her-app.vercel.app"
    # Add it to this list:
    ALLOWED_ORIGINS = [
        "http://localhost:3000",      # React dev server
        "http://localhost:5500",      # VS Code Live Server (most common for HTML/JS)
        "http://localhost:8000",      # Python http.server
        "http://127.0.0.1:5500",
        "http://127.0.0.1:8000",
        # !!! ADD YOUR FRIEND'S URL HERE WHEN SHE GIVES IT !!!
        
    ]
   