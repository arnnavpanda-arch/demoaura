import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    print("FATAL ERROR: MONGODB_URI environment variable is not set.")
    exit(1)

PORT = int(os.getenv("PORT", 10000))

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=10000, connect=False)
db = client['mall_shopping_system']

# --- DATABASE SEEDING ---
def seed_database():
    try:
        if db.settings.count_documents({}) == 0:
            db.settings.insert_one({
                "key": "global_config",
                "totalCouriersPool": 10,
                "baseDeliveryFee": 30.00,
                "perKmDeliveryFee": 10.00,
                "tieredCommissionRules": {
                    "enabled": False,
                    "tier1Limit": 5,
                    "tier1Rate": 10,
                    "tier2Limit": 10,
                    "tier2Rate": 15,
                    "tier3Rate": 20
                },
                "dailyCommissions": {}
            })
            print("Seeded default settings into database.")
    except Exception as e:
        print("Database seeding error:", e)

seed_database()

# --- HELPER FUNCTIONS ---
def serialize_mongo(doc):
    if doc is None:
        return None
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def serialize_mongo_list(docs):
    return [serialize_mongo(doc) for doc in docs]


# --- API ROUTES ---

@app.route('/api/state', methods=['GET'])
def get_state():
    try:
        shops = list(db.shops.find({}))
        deliveries = list(db.deliveries.find({}))
        offers = list(db.offers.find({}))
        customers = list(db.customers.find({}))
        settings = db.settings.find_one({"key": "global_config"})
        
        return jsonify({
            "shops": serialize_mongo_list(shops),
            "deliveries": serialize_mongo_list(deliveries),
            "offers": serialize_mongo_list(offers),
            "customers": serialize_mongo_list(customers),
            "settings": serialize_mongo(settings)
        })
    except Exception as e:
        print("Error fetching state:", e)
        return jsonify({"error": "Failed to fetch state"}), 500


@app.route('/api/state', methods=['POST'])
def update_state():
    try:
        data = request.json
        shops = data.get('shops')
        deliveries = data.get('deliveries')
        offers = data.get('offers')
        customers = data.get('customers')
        
        # UPSERT Shops
        if isinstance(shops, list) and len(shops) > 0:
            shop_ops = [UpdateOne({"id": s.get("id")}, {"$set": s}, upsert=True) for s in shops if "id" in s]
            if shop_ops:
                db.shops.bulk_write(shop_ops)

        # UPSERT Deliveries
        if isinstance(deliveries, list) and len(deliveries) > 0:
            del_ops = [UpdateOne({"id": d.get("id")}, {"$set": d}, upsert=True) for d in deliveries if "id" in d]
            if del_ops:
                db.deliveries.bulk_write(del_ops)

        # UPSERT Offers
        if isinstance(offers, list) and len(offers) > 0:
            offer_ops = [UpdateOne({"id": o.get("id")}, {"$set": o}, upsert=True) for o in offers if "id" in o]
            if offer_ops:
                db.offers.bulk_write(offer_ops)

        # UPSERT Customers
        if isinstance(customers, list) and len(customers) > 0:
            cust_ops = [UpdateOne({"phone": c.get("phone")}, {"$set": c}, upsert=True) for c in customers if "phone" in c]
            if cust_ops:
                db.customers.bulk_write(cust_ops)

        # Sync Settings
        totalCouriersPool = data.get('totalCouriersPool', 10)
        baseDeliveryFee = data.get('baseDeliveryFee', 30.00)
        perKmDeliveryFee = data.get('perKmDeliveryFee', 10.00)
        dailyCommissions = data.get('dailyCommissions', {})
        tieredCommissionRules = data.get('tieredCommissionRules')

        update_fields = {
            "totalCouriersPool": totalCouriersPool,
            "baseDeliveryFee": baseDeliveryFee,
            "perKmDeliveryFee": perKmDeliveryFee,
            "dailyCommissions": dailyCommissions
        }
        if tieredCommissionRules:
            update_fields["tieredCommissionRules"] = tieredCommissionRules

        db.settings.update_one(
            {"key": "global_config"},
            {"$set": update_fields},
            upsert=True
        )

        return jsonify({"success": True, "message": "State synced (upsert)."})
    except Exception as e:
        print("Error syncing state:", e)
        return jsonify({"error": "Failed to sync state"}), 500


@app.route('/api/shops/<shop_id>', methods=['DELETE'])
def delete_shop(shop_id):
    try:
        result = db.shops.delete_one({"id": shop_id})
        if result.deleted_count == 0:
            return jsonify({"error": "Shop not found"}), 404
        
        print(f"Deleted shop: {shop_id}")
        return jsonify({"success": True, "message": f"Shop {shop_id} deleted."})
    except Exception as e:
        print("Error deleting shop:", e)
        return jsonify({"error": "Failed to delete shop"}), 500


@app.route('/api/deliveries/<delivery_id>', methods=['DELETE'])
def delete_delivery(delivery_id):
    try:
        # Decode the URL-encoded ID
        from urllib.parse import unquote
        delivery_id = unquote(delivery_id)
        
        result = db.deliveries.delete_one({"id": delivery_id})
        if result.deleted_count == 0:
            return jsonify({"error": "Delivery not found"}), 404
        
        print(f"Deleted delivery: {delivery_id}")
        return jsonify({"success": True, "message": f"Delivery {delivery_id} deleted."})
    except Exception as e:
        print("Error deleting delivery:", e)
        return jsonify({"error": "Failed to delete delivery"}), 500


@app.route('/api/offers/<offer_id>', methods=['DELETE'])
def delete_offer(offer_id):
    try:
        result = db.offers.delete_one({"id": offer_id})
        if result.deleted_count == 0:
            return jsonify({"error": "Offer not found"}), 404
        
        print(f"Deleted offer: {offer_id}")
        return jsonify({"success": True, "message": "Offer removed"})
    except Exception as e:
        print("Error deleting offer:", e)
        return jsonify({"error": "Failed to delete offer"}), 500


@app.route('/api/deliveries/bulk-delete', methods=['POST'])
def bulk_delete_deliveries():
    try:
        data = request.json
        ids = data.get('ids')
        if not ids or not isinstance(ids, list):
            return jsonify({"error": "Missing or invalid ids array"}), 400
            
        result = db.deliveries.delete_many({"id": {"$in": ids}})
        print(f"Bulk deleted {result.deleted_count} deliveries from database")
        
        return jsonify({"success": True, "deletedCount": result.deleted_count})
    except Exception as e:
        print("Error bulk deleting deliveries:", e)
        return jsonify({"error": "Failed to bulk delete deliveries"}), 500


# --- STATIC FILE SERVING ---

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    # Fallback to index.html for SPA routing if the file doesn't exist
    if not os.path.exists(os.path.join('.', path)):
        return send_from_directory('.', 'index.html')
    return send_from_directory('.', path)


if __name__ == '__main__':
    print(f"✅ Flask server is running on port {PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=True)
