from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import os
import random
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")

app = FastAPI(title="Gami Wallet API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(MONGO_URL)
db = client[DB_NAME]


def serialize_doc(doc):
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc


def serialize_list(docs):
    return [serialize_doc(d) for d in docs]


# ─── Seed Data ───────────────────────────────────────────────────────

def seed_database():
    if db.users.count_documents({}) > 0:
        return

    now = datetime.now(timezone.utc)

    # User
    user = {
        "username": "GamiUser",
        "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=gami",
        "xp": 2321,
        "level": 12,
        "xp_to_next": 5000,
        "tokens": 450.75,
        "streak_days": 199,
        "streak_start": (now - timedelta(days=199)).isoformat(),
        "total_spins": 47,
        "referral_code": "GAMI-X7K2",
        "created_at": now.isoformat(),
    }
    user_result = db.users.insert_one(user)
    user_id = str(user_result.inserted_id)

    # Rewards
    rewards = [
        {
            "title": "Zalora Shopping Voucher",
            "description": "Get $25 off your next fashion purchase",
            "cost": 250,
            "category": "voucher",
            "brand": "Zalora",
            "image": "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80",
            "stock": 50,
            "featured": True,
            "expires": (now + timedelta(days=30)).isoformat(),
        },
        {
            "title": "Starbucks Large Coffee",
            "description": "Free grande coffee at any Starbucks location",
            "cost": 150,
            "category": "voucher",
            "brand": "Starbucks",
            "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
            "stock": 100,
            "featured": True,
            "expires": (now + timedelta(days=14)).isoformat(),
        },
        {
            "title": "Hotel Discount Voucher",
            "description": "15% off your next hotel booking worldwide",
            "cost": 450,
            "category": "voucher",
            "brand": "Hotels.com",
            "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
            "stock": 25,
            "featured": True,
            "expires": (now + timedelta(days=60)).isoformat(),
        },
        {
            "title": "Gami Genesis NFT",
            "description": "Exclusive genesis collection digital art NFT",
            "cost": 800,
            "category": "nft",
            "brand": "Gami",
            "image": "https://images.unsplash.com/photo-1639454276085-9f55d2db6570?w=400&q=80",
            "stock": 10,
            "featured": False,
            "expires": None,
        },
        {
            "title": "Smart Watch Band",
            "description": "Premium silicon watch band for Apple/Samsung",
            "cost": 350,
            "category": "gadget",
            "brand": "TechWear",
            "image": "https://images.unsplash.com/photo-1640901764423-3195244b8e77?w=400&q=80",
            "stock": 30,
            "featured": False,
            "expires": (now + timedelta(days=45)).isoformat(),
        },
        {
            "title": "Spotify Premium 1 Month",
            "description": "One month of Spotify Premium subscription",
            "cost": 200,
            "category": "digital",
            "brand": "Spotify",
            "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&q=80",
            "stock": 200,
            "featured": False,
            "expires": (now + timedelta(days=90)).isoformat(),
        },
        {
            "title": "Amazon $10 Gift Card",
            "description": "Digital gift card for Amazon.com",
            "cost": 300,
            "category": "voucher",
            "brand": "Amazon",
            "image": "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&q=80",
            "stock": 75,
            "featured": False,
            "expires": (now + timedelta(days=120)).isoformat(),
        },
        {
            "title": "Gaming Mouse Pad XL",
            "description": "Premium RGB gaming mouse pad",
            "cost": 500,
            "category": "gadget",
            "brand": "GameGear",
            "image": "https://images.unsplash.com/photo-1668069225941-37356a72faac?w=400&q=80",
            "stock": 15,
            "featured": False,
            "expires": None,
        },
    ]
    db.rewards.insert_many(rewards)

    # Missions
    missions = [
        {
            "title": "Complete Your Profile",
            "description": "Fill in all profile fields to earn XP",
            "xp_reward": 20,
            "type": "one_time",
            "category": "profile",
            "completed": True,
            "icon": "user-check",
        },
        {
            "title": "Daily Login Streak - 3 Days",
            "description": "Log in for 3 consecutive days",
            "xp_reward": 20,
            "type": "streak",
            "category": "engagement",
            "completed": False,
            "progress": 2,
            "target": 3,
            "icon": "flame",
        },
        {
            "title": "Redeem Your First Reward",
            "description": "Use your XP to redeem any reward",
            "xp_reward": 20,
            "type": "one_time",
            "category": "reward",
            "completed": False,
            "icon": "gift",
        },
        {
            "title": "Browse 5 Rewards",
            "description": "Visit 5 different reward pages",
            "xp_reward": 50,
            "type": "progressive",
            "category": "exploration",
            "completed": False,
            "progress": 2,
            "target": 5,
            "icon": "search",
        },
        {
            "title": "Use a Reward at Partner Store",
            "description": "Redeem a reward at any partner location",
            "xp_reward": 50,
            "type": "one_time",
            "category": "partner",
            "completed": False,
            "icon": "store",
        },
        {
            "title": "Refer a Friend",
            "description": "Share your referral code with someone",
            "xp_reward": 100,
            "type": "one_time",
            "category": "referral",
            "completed": False,
            "icon": "users",
        },
        {
            "title": "Spin the Wheel 5 Times",
            "description": "Use the daily spin wheel 5 times",
            "xp_reward": 30,
            "type": "progressive",
            "category": "engagement",
            "completed": False,
            "progress": 3,
            "target": 5,
            "icon": "disc",
        },
        {
            "title": "7-Day Login Streak",
            "description": "Log in for 7 consecutive days",
            "xp_reward": 75,
            "type": "streak",
            "category": "engagement",
            "completed": False,
            "progress": 5,
            "target": 7,
            "icon": "calendar",
        },
        {
            "title": "Collect 1000 XP",
            "description": "Accumulate 1000 total XP",
            "xp_reward": 100,
            "type": "milestone",
            "category": "progress",
            "completed": True,
            "icon": "trophy",
        },
        {
            "title": "Complete 5 Missions",
            "description": "Finish any 5 missions to unlock bonus",
            "xp_reward": 150,
            "type": "progressive",
            "category": "meta",
            "completed": False,
            "progress": 2,
            "target": 5,
            "icon": "target",
        },
    ]
    db.missions.insert_many(missions)

    # Check-in history (last ~30 days, with some gaps)
    checkins = []
    for i in range(30):
        day = now - timedelta(days=i)
        if random.random() > 0.15:  # 85% check-in rate
            checkins.append({
                "user_id": user_id,
                "date": day.strftime("%Y-%m-%d"),
                "xp_earned": random.choice([5, 10, 15, 20]),
                "created_at": day.isoformat(),
            })
    db.checkins.insert_many(checkins)

    # Spin history
    spin_segments = ["10 XP", "25 XP", "50 XP", "100 XP", "5 Tokens", "NFT Badge", "Try Again", "2x Bonus"]
    spins = []
    for i in range(10):
        day = now - timedelta(days=i)
        spins.append({
            "user_id": user_id,
            "result": random.choice(spin_segments),
            "date": day.strftime("%Y-%m-%d"),
            "created_at": day.isoformat(),
        })
    db.spins.insert_many(spins)

    # Transactions
    txns = [
        {"type": "xp_earn", "amount": 20, "source": "Daily Check-in", "date": (now - timedelta(hours=2)).isoformat()},
        {"type": "xp_earn", "amount": 50, "source": "Mission Complete", "date": (now - timedelta(hours=5)).isoformat()},
        {"type": "redeem", "amount": -150, "source": "Starbucks Coffee", "date": (now - timedelta(days=1)).isoformat()},
        {"type": "xp_earn", "amount": 25, "source": "Spin Wheel", "date": (now - timedelta(days=1)).isoformat()},
        {"type": "xp_earn", "amount": 100, "source": "Referral Bonus", "date": (now - timedelta(days=2)).isoformat()},
        {"type": "token_earn", "amount": 10.5, "source": "Staking Reward", "date": (now - timedelta(days=3)).isoformat()},
    ]
    for t in txns:
        t["user_id"] = user_id
    db.transactions.insert_many(txns)

    print("Database seeded successfully!")


seed_database()


# ─── API Routes ──────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/user")
def get_user():
    user = db.users.find_one({}, {"_id": 0})
    return user


@app.put("/api/user/checkin")
def daily_checkin():
    user = db.users.find_one()
    user_id = str(user["_id"])
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    existing = db.checkins.find_one({"user_id": user_id, "date": today})
    if existing:
        return {"success": False, "message": "Already checked in today"}

    xp_earned = random.choice([5, 10, 15, 20, 25])
    db.checkins.insert_one({
        "user_id": user_id,
        "date": today,
        "xp_earned": xp_earned,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    db.users.update_one(
        {"_id": user["_id"]},
        {"$inc": {"xp": xp_earned, "streak_days": 1}}
    )

    return {"success": True, "xp_earned": xp_earned, "date": today}


@app.get("/api/checkins")
def get_checkins():
    checkins = list(db.checkins.find({}, {"_id": 0}).sort("date", -1).limit(90))
    return checkins


@app.get("/api/rewards")
def get_rewards(category: str = None, search: str = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    rewards = list(db.rewards.find(query, {"_id": 0}))
    return rewards


@app.post("/api/rewards/redeem")
def redeem_reward(data: dict):
    title = data.get("title")
    reward = db.rewards.find_one({"title": title})
    if not reward:
        return {"success": False, "message": "Reward not found"}

    user = db.users.find_one()
    if user["xp"] < reward["cost"]:
        return {"success": False, "message": "Not enough XP"}

    db.users.update_one({"_id": user["_id"]}, {"$inc": {"xp": -reward["cost"]}})
    db.rewards.update_one({"_id": reward["_id"]}, {"$inc": {"stock": -1}})
    db.transactions.insert_one({
        "user_id": str(user["_id"]),
        "type": "redeem",
        "amount": -reward["cost"],
        "source": reward["title"],
        "date": datetime.now(timezone.utc).isoformat(),
    })

    return {"success": True, "message": f"Redeemed {title}!"}


@app.get("/api/missions")
def get_missions():
    missions = list(db.missions.find({}, {"_id": 0}))
    return missions


@app.put("/api/missions/complete")
def complete_mission(data: dict):
    title = data.get("title")
    mission = db.missions.find_one({"title": title})
    if not mission:
        return {"success": False, "message": "Mission not found"}
    if mission.get("completed"):
        return {"success": False, "message": "Already completed"}

    db.missions.update_one({"_id": mission["_id"]}, {"$set": {"completed": True}})
    user = db.users.find_one()
    db.users.update_one({"_id": user["_id"]}, {"$inc": {"xp": mission["xp_reward"]}})
    db.transactions.insert_one({
        "user_id": str(user["_id"]),
        "type": "xp_earn",
        "amount": mission["xp_reward"],
        "source": f"Mission: {title}",
        "date": datetime.now(timezone.utc).isoformat(),
    })

    return {"success": True, "xp_earned": mission["xp_reward"]}


@app.post("/api/spin")
def spin_wheel():
    user = db.users.find_one()
    user_id = str(user["_id"])
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    existing = db.spins.find_one({"user_id": user_id, "date": today})
    if existing:
        return {"success": False, "message": "Already spun today", "result": existing.get("result")}

    segments = [
        {"label": "10 XP", "xp": 10, "weight": 25},
        {"label": "25 XP", "xp": 25, "weight": 20},
        {"label": "50 XP", "xp": 50, "weight": 15},
        {"label": "100 XP", "xp": 100, "weight": 5},
        {"label": "5 Tokens", "xp": 0, "tokens": 5, "weight": 10},
        {"label": "NFT Badge", "xp": 0, "weight": 3},
        {"label": "Try Again", "xp": 0, "weight": 15},
        {"label": "2x Bonus", "xp": 0, "weight": 7},
    ]

    weights = [s["weight"] for s in segments]
    result = random.choices(segments, weights=weights, k=1)[0]

    db.spins.insert_one({
        "user_id": user_id,
        "result": result["label"],
        "date": today,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    xp_gain = result.get("xp", 0)
    token_gain = result.get("tokens", 0)
    updates = {}
    if xp_gain:
        updates["xp"] = xp_gain
    if token_gain:
        updates["tokens"] = token_gain
    updates["total_spins"] = 1

    if updates:
        db.users.update_one({"_id": user["_id"]}, {"$inc": updates})

    return {"success": True, "result": result["label"], "xp_earned": xp_gain, "tokens_earned": token_gain}


@app.get("/api/transactions")
def get_transactions():
    txns = list(db.transactions.find({}, {"_id": 0}).sort("date", -1).limit(20))
    return txns


@app.get("/api/spin/history")
def get_spin_history():
    spins = list(db.spins.find({}, {"_id": 0}).sort("date", -1).limit(30))
    return spins
