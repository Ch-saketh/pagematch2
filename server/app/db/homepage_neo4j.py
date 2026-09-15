# app/db/homepage_neo4j.py
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Try to initialize Neo4j driver if environment is configured and neo4j package is available.
try:
    from neo4j import GraphDatabase
except Exception:
    GraphDatabase = None

NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

driver = None
if GraphDatabase and NEO4J_URI:
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    except Exception:
        driver = None


def get_homepage_recommendations():
    """If Neo4j is available and configured, query it. Otherwise fall back to the
    packaged JSON dataset located in server/datasets/bookwise_homepage_recs.json."""
    if driver:
        query = """
        MATCH (b:Book)
        RETURN b.book_id AS book_id,
               b.title AS title,
               b.type AS type,
               b.description AS description,
               b.image_url AS image_url,
               b.rating AS rating
        ORDER BY b.rating DESC
        LIMIT 10
        """
        with driver.session(database="homepage") as session:
            result = session.run(query)
            return [record.data() for record in result]

    # Fallback: load static recommendations JSON
    try:
        base = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        data_path = os.path.join(base, 'datasets', 'bookwise_homepage_recs.json')
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        # Expecting a list of recommendation objects in the JSON
        return data[:10]
    except Exception:
        return []
