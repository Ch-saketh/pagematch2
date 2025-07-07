from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from uuid import uuid4
import datetime  # ✅ Required for timestamp

user_bp = Blueprint("user", __name__)

client = MongoClient("mongodb://localhost:27017/")
db = client["bookwise"]
users = db["users"]

@user_bp.route("/check-username", methods=["POST"])
def check_username():
    data = request.json
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    exists = users.find_one({"username": username}) is not None
    return jsonify({"exists": exists}), 200


@user_bp.route("/create-user", methods=["POST"])
def create_user():
    data = request.json
    username = data.get("username")
    avatar = data.get("avatar")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    if users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    user_id = str(uuid4())
    users.insert_one({
        "user_id": user_id,
        "username": username,
        "avatar": avatar,
        "created_at": datetime.datetime.utcnow()
    })

    return jsonify({"message": "User created successfully", "user_id": user_id}), 201
