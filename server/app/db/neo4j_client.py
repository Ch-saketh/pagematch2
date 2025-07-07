from neo4j import GraphDatabase
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "neo4j123")
NEO4J_DB = os.getenv("NEO4J_DB", "pagedbms")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def log_search_to_neo4j(user_id: str, query: str):
    timestamp = datetime.utcnow().isoformat()
    print(f"Attempting to log: {user_id}, {query}, {timestamp}")

    cypher = """
        MERGE (u:User {user_id: $user_id})
        CREATE (s:Search {query: $query, timestamp: $timestamp})
        MERGE (u)-[:SEARCHED]->(s)
        RETURN s
    """
    
    try:
        with driver.session(database=NEO4J_DB) as session:
            # Explicitly use write_transaction
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
    
    