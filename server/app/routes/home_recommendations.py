# app/routes/home_recommendations.py
from flask import Blueprint, jsonify
from app.db.homepage_neo4j import get_homepage_recommendations

home_bp = Blueprint("home", __name__)

@home_bp.route("/homepage-recommendations", methods=["GET"])
def homepage_recommendations():
    try:
        data = get_homepage_recommendations()
        return jsonify({"recommendations": data}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch homepage recs", "details": str(e)}), 500
