from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Make Neo4j optional — if the driver or configuration is missing we treat
# Neo4j logging as a no-op so the server can run without a Neo4j instance.
try:
    from neo4j import GraphDatabase
except Exception:
    GraphDatabase = None

NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
NEO4J_DB = os.getenv("NEO4J_DB", "pagedbms")

driver = None
if GraphDatabase and NEO4J_URI:
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    except Exception:
        driver = None


def log_search_to_neo4j(user_id: str, query: str):
    """Attempt to log a search to Neo4j if available. Returns True on success,
    False if Neo4j is not configured or logging failed."""
    timestamp = datetime.utcnow().isoformat()
    print(f"Attempting to log: {user_id}, {query}, {timestamp}")

    if not driver:
        print("Neo4j not configured — skipping search log")
        return False

    cypher = """
        MERGE (u:User {user_id: $user_id})
        CREATE (s:Search {query: $query, timestamp: $timestamp})
        MERGE (u)-[:SEARCHED]->(s)
        RETURN s
    """

    try:
        with driver.session(database=NEO4J_DB) as session:
            result = session.execute_write(
                lambda tx: tx.run(cypher, {
                    "user_id": user_id,
                    "query": query,
                    "timestamp": timestamp
                }).single()
            )
            print(f"Success! Created: {result}")
            return True
    except Exception as e:
        print(f"FAILED: {str(e)}")
        return False

