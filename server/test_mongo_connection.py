from pymongo import MongoClient

try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client.bookwise_db
    result = db.search_logs.insert_one({
        "user_id": "test_user",
        "query": "testing MongoDB",
        "timestamp": "2025-07-03"
    })
    print("✅ Inserted with ID:", result.inserted_id)
except Exception as e:
    print("❌ MongoDB connection failed:", e)
