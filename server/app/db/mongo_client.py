from pymongo import MongoClient, UpdateOne
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["bookwise_db"]
pagematch = db["pagematch"]

def log_user_search(user_id, query):
    pagematch.update_one(
        {"user_id": user_id},
        {
            "$push": {
                "search_history": {
                    "query": query,
                    "timestamp": datetime.utcnow()
                }
            }
        },
        upsert=True
    )
