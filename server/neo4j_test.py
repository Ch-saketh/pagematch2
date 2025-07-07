from neo4j import GraphDatabase
import os
from dotenv import load_dotenv
from datetime import datetime, timezone

# Load .env variables
load_dotenv()

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI"),
    auth=(os.getenv("NEO4J_USER"), os.getenv("NEO4J_PASSWORD"))
)

def test_log():
    with driver.session(database=os.getenv("NEO4J_DB")) as session:
        session.run(
            """
            MERGE (u:User {user_id: $user_id})
            CREATE (s:Search {query: $search_text, timestamp: $timestamp})
            MERGE (u)-[:SEARCHED]->(s)
            """,
            user_id="test_user",
            search_text="test_query",
            timestamp=datetime.now(timezone.utc).isoformat()
        )
    print("✅ Neo4j test log inserted successfully")

test_log()
    