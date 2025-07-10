# app/db/homepage_neo4j.py
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI"),
    auth=(os.getenv("NEO4J_USER"), os.getenv("NEO4J_PASSWORD"))
)

def get_homepage_recommendations():
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
