import os
from flask import Flask, after_this_request
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import search blueprint
from app.routes.search import search_bp
from app.routes.user import user_bp
from app.routes.home_recommendations import home_bp
from app.routes.gemini_chat import gemini_bp



# Initialize Flask app
app = Flask(__name__)

# Configure CORS - Allow all origins for development
CORS(app)

# Add additional CORS headers manually
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Max-Age', '3600')
    return response

# Register blueprints
app.register_blueprint(search_bp)
app.register_blueprint(user_bp)
app.register_blueprint(home_bp)
app.register_blueprint(gemini_bp)


# Run server
if __name__ == "__main__":
    print("✅ Flask server running on http://0.0.0.0:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
