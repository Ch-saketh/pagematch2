from flask import Blueprint, request, jsonify
from uuid import uuid4
import datetime
from app.db.mongo import get_db

user_bp = Blueprint("user", __name__)

@user_bp.route("/check-username", methods=["POST"])
def check_username():
    data = request.json or {}
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    db = get_db()
    if db is not None:
        try:
            exists = db["users"].find_one({"username": username}) is not None
            return jsonify({"exists": exists}), 200
        except Exception as e:
            print("Mongo check error:", e)
    
    return jsonify({"exists": False}), 200


@user_bp.route("/create-user", methods=["POST"])
def create_user():
    data = request.json or {}
    username = data.get("username")
    avatar = data.get("avatar")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    db = get_db()
    user_id = str(uuid4())
    if db is not None:
        try:
            if db["users"].find_one({"username": username}):
                return jsonify({"error": "Username already exists"}), 400

            db["users"].insert_one({
                "user_id": user_id,
                "username": username,
                "avatar": avatar,
                "created_at": datetime.datetime.utcnow()
            })
        except Exception as e:
            print("Mongo create user notice:", e)

    return jsonify({"message": "User created successfully", "user_id": user_id}), 201
