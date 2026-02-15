from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import openai
import logging
import uuid
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from config import Config
from prompts import Prompts
import webbrowser
from threading import Timer

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the absolute path to frontend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), 'frontend')
print(f"📁 Looking for frontend files in: {FRONTEND_DIR}")

# Initialize Flask app
app = Flask(__name__, static_folder=None)
CORS(app, origins="*")

# =============================================
# FRONTEND ROUTES - Serve the website
# =============================================

@app.route('/')
def serve_frontend():
    """Serve the main index.html from frontend folder"""
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def serve_frontend_files(path):
    """Serve CSS, JS, images from frontend folder"""
    return send_from_directory(FRONTEND_DIR, path)

# =============================================
# OPENROUTER CONFIGURATION
# =============================================
print("=" * 50)
print("🔑 CHECKING OPENROUTER API KEY...")

if not Config.OPENAI_API_KEY:
    print("❌ ERROR: No API key found in .env file!")
    print("📝 Please create a .env file in the backend folder with:")
    print('   OPENAI_API_KEY=sk-or-your-key-here')
    print("=" * 50)
elif Config.OPENAI_API_KEY == "your-key-here" or Config.OPENAI_API_KEY == "YOUR_KEY_HERE":
    print("❌ ERROR: You haven't set your real API key yet!")
    print("📝 Edit the .env file and add your actual OpenRouter key")
    print("=" * 50)
else:
    print(f"✅ API key found: {Config.OPENAI_API_KEY[:15]}...")
    print("=" * 50)
    
    # Set OpenRouter as the API base
    openai.api_key = Config.OPENAI_API_KEY
    openai.api_base = "https://openrouter.ai/api/v1"

# List of models that should work (updated)
FREE_MODELS = [
    "openai/gpt-3.5-turbo",  # Not free but has free tier sometimes
    "anthropic/claude-3-haiku",  # Not free but reliable for testing
    "meta-llama/llama-3.2-3b-instruct",  # Remove :free suffix
    "mistralai/mistral-7b-instruct",  # Remove :free suffix
]

# Store conversations
conversations = {}

def generate_session_id():
    """Generate unique session ID"""
    return str(uuid.uuid4())

def clean_old_sessions():
    """Clean conversations older than 1 hour"""
    current_time = datetime.now()
    expired = []
    for session_id, data in conversations.items():
        if current_time - data['last_active'] > timedelta(hours=1):
            expired.append(session_id)
    for session_id in expired:
        del conversations[session_id]

def get_ai_response(messages, mode):
    """Get response from OpenRouter"""
    
    # Check if API key is missing
    if not Config.OPENAI_API_KEY or Config.OPENAI_API_KEY == "your-key-here" or Config.OPENAI_API_KEY == "YOUR_KEY_HERE":
        return "⚠️ hey bestie! i need an API key to work. tell the dev to add it in the .env file! 💅"
    
    system_prompt = Prompts.TRANSLATE_SYSTEM_PROMPT if mode == 'translate' else Prompts.CHAT_SYSTEM_PROMPT
    
    api_messages = [{"role": "system", "content": system_prompt}]
    
    if mode == 'chat':
        recent_messages = messages[-10:]
        for msg in recent_messages:
            api_messages.append({
                "role": msg['role'],
                "content": msg['content']
            })
    else:
        api_messages.append({
            "role": "user",
            "content": messages[-1]["content"]
        })
    
    # Try each model
    for model in FREE_MODELS:
        try:
            print(f"🔄 Trying model: {model}")
            response = openai.ChatCompletion.create(
                model=model,
                messages=api_messages,
                temperature=0.8,
                max_tokens=200,
                headers={
                    "HTTP-Referer": "http://localhost:5000",
                    "X-Title": "GenZ Chatbot"
                }
            )
            print(f"✅ Success with: {model}")
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"❌ {model} failed: {str(e)[:100]}")
            continue
    
    # If all models fail, use a simple fallback
    return "yo my brain's buffering rn bestie, but i'll be back! try again in a bit 💀"

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'online',
        'message': 'GenZ Bot is ready to slay! ✨'
    })

@app.route('/test-openrouter', methods=['GET'])
def test_openrouter():
    """Test OpenRouter connection"""
    results = {}
    
    for model in FREE_MODELS[:2]:  # Test first 2 models
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[{"role": "user", "content": "Say hello in one word"}],
                max_tokens=10,
                headers={
                    "HTTP-Referer": "http://localhost:5000",
                    "X-Title": "GenZ Chatbot Test"
                }
            )
            results[model] = {
                "status": "✅ Working",
                "response": response.choices[0].message.content
            }
        except Exception as e:
            results[model] = {
                "status": "❌ Failed",
                "error": str(e)[:100]
            }
    
    return jsonify({
        "api_key": f"{Config.OPENAI_API_KEY[:15]}...",
        "results": results
    })

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '').strip()
        mode = data.get('mode', 'chat')
        session_id = data.get('session_id', generate_session_id())
        
        if not message:
            return jsonify({'error': 'message is required'}), 400
        
        if mode not in ['chat', 'translate']:
            return jsonify({'error': 'mode must be chat or translate'}), 400
        
        # Initialize session
        if session_id not in conversations:
            conversations[session_id] = {
                'messages': [],
                'created_at': datetime.now(),
                'last_active': datetime.now()
            }
        
        # Add user message
        conversations[session_id]['messages'].append({
            'role': 'user',
            'content': message,
            'timestamp': datetime.now().isoformat()
        })
        
        # Get bot response
        bot_response = get_ai_response(conversations[session_id]['messages'], mode)
        
        # Add bot response
        conversations[session_id]['messages'].append({
            'role': 'assistant',
            'content': bot_response,
            'timestamp': datetime.now().isoformat()
        })
        
        # Update last active
        conversations[session_id]['last_active'] = datetime.now()
        
        # Clean old sessions
        clean_old_sessions()
        
        return jsonify({
            'response': bot_response,
            'mode': mode,
            'session_id': session_id
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'Something went wrong'}), 500

def open_browser():
    webbrowser.open(f'http://localhost:{port}')

if __name__ == '__main__':
    port = int(os.getenv('PORT', Config.PORT))
    Timer(1.5, open_browser).start()
    
    print("=" * 50)
    print("🚀 GENZ CHATBOT - Starting up!")
    print("=" * 50)
    print(f"📁 Frontend path: {FRONTEND_DIR}")
    print(f"🌐 Website: http://localhost:{port}")
    print(f"🔧 Test route: http://localhost:{port}/test-openrouter")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=port, debug=Config.DEBUG)