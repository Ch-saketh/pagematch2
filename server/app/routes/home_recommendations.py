from flask import Blueprint, jsonify
from app.utils.model_engine import BookModelEngine

home_bp = Blueprint("home", __name__)

@home_bp.route("/homepage-recommendations", methods=["GET"])
def homepage_recommendations():
    try:
        engine = BookModelEngine.get_instance()
        clusters = engine.get_curated_clusters()
        return jsonify({
            "clusters": clusters,
            "engine": "cs22/book-engine",
            "algorithm": "TF-IDF + Cosine Similarity Hybrid"
        }), 200
    except Exception as e:
        print("Homepage model recs notice:", e)
        return jsonify({"clusters": [], "error": str(e)}), 500
