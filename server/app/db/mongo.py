import os
from pymongo import MongoClient

_client = None
_db = None

def get_db():
    global _client, _db
    if _db is not None:
        return _db
    
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        mongo_uri = "mongodb://localhost:27017/bookwise"
        
    try:
        _client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2500, connectTimeoutMS=2500)
        _db = _client["bookwise"]
        return _db
    except Exception as e:
        print(f"⚠️ MongoDB connection notice: {e}")
        return None
