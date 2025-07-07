import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import search blueprint
from app.routes.search import search_bp
from app.routes.user import user_bp


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow frontend access from localhost:5173

# Register blueprints
app.register_blueprint(search_bp)
app.register_blueprint(user_bp)


# Run server
if __name__ == "__main__":
    print("✅ Flask server running on http://localhost:5000")
    app.run(debug=True, port=5000)
