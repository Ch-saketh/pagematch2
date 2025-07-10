# gemini_chat.py
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import requests
import os
import json
from datetime import datetime

load_dotenv()

gemini_bp = Blueprint("gemini", __name__)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
HISTORY_FILE = "chat_history.json"

def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def save_history(history_data):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history_data, f, indent=4)

@gemini_bp.route("/api/gemini-chat", methods=["POST"])
def gemini_chat():
    try:
        if not GEMINI_API_KEY:
            return jsonify({"error": "GEMINI_API_KEY not configured"}), 500

        data = request.json
        prompt = data.get("prompt", "").strip()
        if not prompt:
            return jsonify({"error": "Prompt is empty"}), 400

        print("📥 Prompt received:", prompt)
        print("🔑 Using API key:", GEMINI_API_KEY[:8] + "*****")

        # ✅ Correct endpoint from official Gemini docs
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY  # ✅ REQUIRED, not ?key=...
        }

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        gemini_data = response.json()

        print("📨 Gemini response:", gemini_data)

        candidates = gemini_data.get("candidates", [])
        reply = "Sorry, Gemini didn't return a response."

        if candidates:
            reply = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", reply)

        history = load_history()
        history.append({
            "timestamp": datetime.now().isoformat(),
            "query": prompt,
            "answer": reply
        })
        save_history(history)

        return jsonify({"reply": reply}), 200

    except requests.exceptions.HTTPError as err:
        print("❌ HTTP error:", err)
        if err.response is not None:
            print("🧾 Gemini error response:", err.response.text)
        return jsonify({
            "error": "Gemini API failed",
            "details": err.response.text if err.response else str(err)
        }), 502
    except Exception as e:
        print("❌ Unexpected error:", e)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@gemini_bp.route("/api/history", methods=["GET"])
def get_history():
    return jsonify(load_history()), 200
