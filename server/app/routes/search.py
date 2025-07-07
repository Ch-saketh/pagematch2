from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import datetime
import requests
import os

from app.db.neo4j_client import log_search_to_neo4j  # Neo4j logging function

search_bp = Blueprint("search", __name__)

# ✅ MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["bookwise"]
search_logs = db["search_logs"]

# ✅ Log search only (used by frontend separately)
@search_bp.route("/log-search", methods=["POST"])
def log_search():
    data = request.json
    query = data.get("query")
    user_id = data.get("user_id", "guest")

    if not query:
        return jsonify({"error": "Query is required"}), 400

    # MongoDB Logging
    search_logs.insert_one({
        "query": query,
        "user_id": user_id,
        "timestamp": datetime.datetime.utcnow()
    })

    # Neo4j Logging
    try:
        log_search_to_neo4j(user_id, query)
    except Exception as e:
        print("❌ Neo4j log error:", str(e))

    return jsonify({"message": "Search logged successfully"}), 200


# ✅ 🔥 NEW: Unified Search via POST (for Postman)
@search_bp.route("/search-books", methods=["POST"])
def search_books_post():
    data = request.json
    query = data.get("query")
    user_id = data.get("user_id", "guest")

    if not query:
        return jsonify({"error": "Query is required"}), 400

    # MongoDB Logging
    search_logs.insert_one({
        "query": query,
        "user_id": user_id,
        "timestamp": datetime.datetime.utcnow()
    })

    # Neo4j Logging
    try:
        log_search_to_neo4j(user_id, query)
    except Exception as e:
        print("❌ Neo4j log error:", str(e))

    # Google Books API Search
    try:
        res = requests.get("https://www.googleapis.com/books/v1/volumes", params={
            "q": query,
            "maxResults": 15
        })
        res.raise_for_status()
        data = res.json()

        books = []
        for item in data.get("items", []):
            info = item.get("volumeInfo", {})
            books.append({
                "title": info.get("title"),
                "authors": info.get("authors", []),
                "averageRating": info.get("averageRating"),
                "description": info.get("description"),
                "thumbnail": info.get("imageLinks", {}).get("thumbnail", None)
            })

        return jsonify({"results": books}), 200

    except Exception as e:
        return jsonify({"error": "Book fetch failed", "details": str(e)}), 500


# ✅ GET Search (used by frontend with /search?q=...)
@search_bp.route("/search", methods=["GET"])
def search_books():
    query = request.args.get("query")
    if not query:
        return jsonify({"results": []}), 200

    try:
        response = requests.get("https://www.googleapis.com/books/v1/volumes", params={
            "q": query,
            "maxResults": 15
        })
        response.raise_for_status()

        data = response.json()
        books = []
        for item in data.get("items", []):
            info = item.get("volumeInfo", {})
            books.append({
                "title": info.get("title"),
                "authors": info.get("authors", []),
                "averageRating": info.get("averageRating"),
                "description": info.get("description"),
                "thumbnail": info.get("imageLinks", {}).get("thumbnail", None)
            })

        return jsonify({"results": books}), 200

    except requests.exceptions.RequestException as e:
        print("❌ Error fetching from Google Books API:", str(e))
        return jsonify({"error": "Failed to fetch books"}), 500
