from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime, timezone, timedelta
import os
import random
from dotenv import load_dotenv
try:
    from backend.gamification import (
        get_agent_tooling_profile,
        enrich_rewards_with_agent_quality,
        get_spin_segments,
        resolve_spin_result,
    )
except ImportError:
    from gamification import (
        get_agent_tooling_profile,
        enrich_rewards_with_agent_quality,
        get_spin_segments,
        resolve_spin_result,
    )

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


# ─── Seed Data ───────────────────────────────────────────────────────

def seed_database():
    # Drop and reseed for the redesign
    db.users.drop()
    db.rewards.drop()
    db.missions.drop()
    db.checkins.drop()
    db.spins.drop()
    db.transactions.drop()
    db.tokens.drop()
    db.nfts.drop()
    db.staking.drop()
    db.pools.drop()
    db.networks.drop()

    now = datetime.now(timezone.utc)

    # Networks
    networks = [
        {"name": "Gami Chain", "chain_id": "gami-1", "icon": "hexagon", "color": "#6E3CFB", "active": True},
        {"name": "Ethereum", "chain_id": "eth-1", "icon": "diamond", "color": "#627EEA", "active": True},
        {"name": "Solana", "chain_id": "sol-1", "icon": "zap", "color": "#9945FF", "active": True},
        {"name": "Polygon", "chain_id": "matic-137", "icon": "triangle", "color": "#8247E5", "active": True},
        {"name": "Arbitrum", "chain_id": "arb-42161", "icon": "layers", "color": "#28A0F0", "active": False},
    ]
    db.networks.insert_many(networks)

    # User / Profile
    user = {
        "username": "GamiUser",
        "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=gami",
        "xp": 2321,
        "level": 12,
        "xp_to_next": 5000,
        "tokens_balance": 450.75,
        "total_usd_balance": 12847.32,
        "streak_days": 199,
        "streak_start": (now - timedelta(days=199)).isoformat(),
        "total_spins": 47,
        "referral_code": "GAMI-X7K2",
        "reputation_score": 87,
        "connected_wallets": [
            {"chain": "Gami Chain", "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38", "primary": True},
            {"chain": "Ethereum", "address": "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12", "primary": False},
            {"chain": "Solana", "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", "primary": False},
        ],
        "staking_total_usd": 3200.00,
        "claimable_rewards": 45.8,
        "created_at": now.isoformat(),
    }
    user_result = db.users.insert_one(user)
    user_id = str(user_result.inserted_id)

    # Token Balances
    tokens = [
        {"symbol": "GAMI", "name": "Gami Token", "balance": 4500.0, "usd_value": 4500.0, "price": 1.0, "change_24h": 2.4, "chain": "Gami Chain", "icon_color": "#6E3CFB"},
        {"symbol": "ETH", "name": "Ethereum", "balance": 1.85, "usd_value": 5920.0, "price": 3200.0, "change_24h": -1.2, "chain": "Ethereum", "icon_color": "#627EEA"},
        {"symbol": "SOL", "name": "Solana", "balance": 12.5, "usd_value": 1875.0, "price": 150.0, "change_24h": 5.7, "chain": "Solana", "icon_color": "#9945FF"},
        {"symbol": "MATIC", "name": "Polygon", "balance": 850.0, "usd_value": 552.32, "price": 0.65, "change_24h": -0.8, "chain": "Polygon", "icon_color": "#8247E5"},
        {"symbol": "USDC", "name": "USD Coin", "balance": 500.0, "usd_value": 500.0, "price": 1.0, "change_24h": 0.0, "chain": "Ethereum", "icon_color": "#2775CA"},
    ]
    db.tokens.insert_many(tokens)

    # NFTs
    nfts = [
        {"name": "Gami Genesis #042", "collection": "Gami Genesis", "image": "https://images.unsplash.com/photo-1639454276085-9f55d2db6570?w=300&q=80", "chain": "Gami Chain", "rarity": "Legendary"},
        {"name": "Pixel Warrior #128", "collection": "Pixel Warriors", "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80", "chain": "Ethereum", "rarity": "Rare"},
        {"name": "Gami Badge: Early", "collection": "Gami Badges", "image": "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=300&q=80", "chain": "Gami Chain", "rarity": "Common"},
        {"name": "DeFi Miner #007", "collection": "DeFi Miners", "image": "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=300&q=80", "chain": "Solana", "rarity": "Epic"},
    ]
    db.nfts.insert_many(nfts)

    # Staking Pools
    pools = [
        {"name": "GAMI Staking", "token": "GAMI", "apy": 12.5, "tvl": 2450000, "min_stake": 100, "lock_period": "30 days", "status": "active", "icon_color": "#6E3CFB"},
        {"name": "ETH Yield Pool", "token": "ETH", "apy": 4.2, "tvl": 18500000, "min_stake": 0.01, "lock_period": "Flexible", "status": "active", "icon_color": "#627EEA"},
        {"name": "SOL LP Farm", "token": "SOL", "apy": 8.7, "tvl": 5200000, "min_stake": 1.0, "lock_period": "14 days", "status": "active", "icon_color": "#9945FF"},
        {"name": "GAMI-USDC LP", "token": "GAMI-USDC", "apy": 22.3, "tvl": 890000, "min_stake": 50, "lock_period": "7 days", "status": "active", "icon_color": "#22C55E"},
        {"name": "Polygon Yield", "token": "MATIC", "apy": 6.1, "tvl": 3100000, "min_stake": 100, "lock_period": "Flexible", "status": "coming_soon", "icon_color": "#8247E5"},
    ]
    db.pools.insert_many(pools)

    # User Staking Positions
    staking = [
        {"user_id": user_id, "pool": "GAMI Staking", "token": "GAMI", "amount": 2000, "usd_value": 2000, "earned": 38.5, "apy": 12.5, "staked_at": (now - timedelta(days=45)).isoformat(), "status": "active"},
        {"user_id": user_id, "pool": "ETH Yield Pool", "token": "ETH", "amount": 0.5, "usd_value": 1600, "earned": 7.3, "apy": 4.2, "staked_at": (now - timedelta(days=30)).isoformat(), "status": "active"},
    ]
    db.staking.insert_many(staking)

    # Rewards
    rewards = [
        {"title": "Zalora Shopping Voucher", "description": "Get $25 off your next fashion purchase", "cost": 250, "category": "voucher", "brand": "Zalora", "image": "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80", "stock": 50, "featured": True},
        {"title": "Starbucks Large Coffee", "description": "Free grande coffee at any Starbucks location", "cost": 150, "category": "voucher", "brand": "Starbucks", "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80", "stock": 100, "featured": True},
        {"title": "Hotel Discount Voucher", "description": "15% off your next hotel booking worldwide", "cost": 450, "category": "voucher", "brand": "Hotels.com", "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80", "stock": 25, "featured": True},
        {"title": "Gami Genesis NFT", "description": "Exclusive genesis collection digital art NFT", "cost": 800, "category": "nft", "brand": "Gami", "image": "https://images.unsplash.com/photo-1639454276085-9f55d2db6570?w=400&q=80", "stock": 10, "featured": False},
        {"title": "Smart Watch Band", "description": "Premium silicon watch band for Apple/Samsung", "cost": 350, "category": "gadget", "brand": "TechWear", "image": "https://images.unsplash.com/photo-1640901764423-3195244b8e77?w=400&q=80", "stock": 30, "featured": False},
        {"title": "Spotify Premium 1 Month", "description": "One month of Spotify Premium subscription", "cost": 200, "category": "digital", "brand": "Spotify", "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&q=80", "stock": 200, "featured": False},
        {"title": "Amazon $10 Gift Card", "description": "Digital gift card for Amazon.com", "cost": 300, "category": "voucher", "brand": "Amazon", "image": "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&q=80", "stock": 75, "featured": False},
        {"title": "Gaming Mouse Pad XL", "description": "Premium RGB gaming mouse pad", "cost": 500, "category": "gadget", "brand": "GameGear", "image": "https://images.unsplash.com/photo-1668069225941-37356a72faac?w=400&q=80", "stock": 15, "featured": False},
    ]
    db.rewards.insert_many(rewards)

    # Missions
    missions = [
        {"title": "Complete Your Profile", "description": "Fill in all profile fields", "xp_reward": 20, "type": "one_time", "category": "profile", "completed": True, "icon": "user-check"},
        {"title": "Daily Login Streak - 3 Days", "description": "Log in 3 consecutive days", "xp_reward": 20, "type": "streak", "category": "engagement", "completed": False, "progress": 2, "target": 3, "icon": "flame"},
        {"title": "Redeem Your First Reward", "description": "Use XP to redeem any reward", "xp_reward": 20, "type": "one_time", "category": "reward", "completed": False, "icon": "gift"},
        {"title": "Browse 5 Rewards", "description": "Visit 5 different reward pages", "xp_reward": 50, "type": "progressive", "category": "exploration", "completed": False, "progress": 2, "target": 5, "icon": "search"},
        {"title": "Stake GAMI Tokens", "description": "Stake at least 100 GAMI tokens", "xp_reward": 100, "type": "one_time", "category": "defi", "completed": True, "icon": "lock"},
        {"title": "First Swap Transaction", "description": "Complete your first token swap", "xp_reward": 50, "type": "one_time", "category": "defi", "completed": False, "icon": "repeat"},
        {"title": "Refer a Friend", "description": "Share your referral code", "xp_reward": 100, "type": "one_time", "category": "referral", "completed": False, "icon": "users"},
        {"title": "Spin the Wheel 5 Times", "description": "Use the daily spin 5 times", "xp_reward": 30, "type": "progressive", "category": "engagement", "completed": False, "progress": 3, "target": 5, "icon": "disc"},
        {"title": "7-Day Login Streak", "description": "Log in 7 consecutive days", "xp_reward": 75, "type": "streak", "category": "engagement", "completed": False, "progress": 5, "target": 7, "icon": "calendar"},
        {"title": "Collect 1000 XP", "description": "Accumulate 1000 total XP", "xp_reward": 100, "type": "milestone", "category": "progress", "completed": True, "icon": "trophy"},
    ]
    db.missions.insert_many(missions)

    # Check-ins
    checkins = []
    for i in range(30):
        day = now - timedelta(days=i)
        if random.random() > 0.15:
            checkins.append({"user_id": user_id, "date": day.strftime("%Y-%m-%d"), "xp_earned": random.choice([5, 10, 15, 20]), "created_at": day.isoformat()})
    db.checkins.insert_many(checkins)

    # Spins
    spins = []
    for i in range(10):
        day = now - timedelta(days=i)
        spins.append({"user_id": user_id, "result": random.choice(["10 XP", "25 XP", "50 XP", "5 Tokens"]), "date": day.strftime("%Y-%m-%d"), "created_at": day.isoformat()})
    db.spins.insert_many(spins)

    # Transactions
    txns = [
        {"type": "send", "amount": -0.25, "token": "ETH", "to": "0xabc...def", "date": (now - timedelta(hours=3)).isoformat(), "status": "confirmed", "chain": "Ethereum"},
        {"type": "receive", "amount": 500, "token": "GAMI", "from": "0x123...456", "date": (now - timedelta(hours=8)).isoformat(), "status": "confirmed", "chain": "Gami Chain"},
        {"type": "stake", "amount": 2000, "token": "GAMI", "pool": "GAMI Staking", "date": (now - timedelta(days=2)).isoformat(), "status": "confirmed", "chain": "Gami Chain"},
        {"type": "swap", "amount": 100, "token": "USDC", "to_token": "GAMI", "to_amount": 100, "date": (now - timedelta(days=3)).isoformat(), "status": "confirmed", "chain": "Gami Chain"},
        {"type": "claim", "amount": 38.5, "token": "GAMI", "source": "Staking Reward", "date": (now - timedelta(days=5)).isoformat(), "status": "confirmed", "chain": "Gami Chain"},
        {"type": "receive", "amount": 2.5, "token": "SOL", "from": "Exchange", "date": (now - timedelta(days=7)).isoformat(), "status": "confirmed", "chain": "Solana"},
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
    return db.users.find_one({}, {"_id": 0})


@app.get("/api/profile")
def get_profile():
    user = db.users.find_one({}, {"_id": 0})
    return {
        "username": user["username"],
        "wallet_address": user["wallet_address"],
        "avatar": user["avatar"],
        "xp": user["xp"],
        "level": user["level"],
        "xp_to_next": user["xp_to_next"],
        "reputation_score": user["reputation_score"],
        "connected_wallets": user["connected_wallets"],
        "referral_code": user["referral_code"],
        "streak_days": user["streak_days"],
        "created_at": user["created_at"],
    }


@app.get("/api/tokens")
def get_tokens():
    return list(db.tokens.find({}, {"_id": 0}))


@app.get("/api/nfts")
def get_nfts():
    return list(db.nfts.find({}, {"_id": 0}))


@app.get("/api/networks")
def get_networks():
    return list(db.networks.find({}, {"_id": 0}))


@app.get("/api/staking")
def get_staking():
    return list(db.staking.find({}, {"_id": 0}))


@app.get("/api/pools")
def get_pools():
    return list(db.pools.find({}, {"_id": 0}))


@app.get("/api/rewards")
def get_rewards(category: str = None, search: str = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    rewards = list(db.rewards.find(query, {"_id": 0}))
    return enrich_rewards_with_agent_quality(rewards, get_agent_tooling_profile())


@app.get("/api/missions")
def get_missions():
    return list(db.missions.find({}, {"_id": 0}))


@app.get("/api/checkins")
def get_checkins():
    return list(db.checkins.find({}, {"_id": 0}).sort("date", -1).limit(90))


@app.get("/api/transactions")
def get_transactions():
    return list(db.transactions.find({}, {"_id": 0}).sort("date", -1).limit(20))


@app.put("/api/user/checkin")
def daily_checkin():
    user = db.users.find_one()
    user_id = str(user["_id"])
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if db.checkins.find_one({"user_id": user_id, "date": today}):
        return {"success": False, "message": "Already checked in today"}
    xp_earned = random.choice([5, 10, 15, 20, 25])
    db.checkins.insert_one({"user_id": user_id, "date": today, "xp_earned": xp_earned, "created_at": datetime.now(timezone.utc).isoformat()})
    db.users.update_one({"_id": user["_id"]}, {"$inc": {"xp": xp_earned, "streak_days": 1}})
    return {"success": True, "xp_earned": xp_earned, "date": today}


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
    profile = get_agent_tooling_profile()
    db.transactions.insert_one(
        {
            "user_id": str(user["_id"]),
            "type": "redeem",
            "amount": -reward["cost"],
            "token": "XP",
            "source": reward["title"],
            "date": datetime.now(timezone.utc).isoformat(),
            "status": "confirmed",
            "chain": "Gami Chain",
            "agent_mode": profile["mode"],
        }
    )
    return {
        "success": True,
        "message": f"Redeemed {title}!",
        "agent_tooling": {"mode": profile["mode"], "chain_id": profile["gami_chain"]["chain_id"]},
    }


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
    return {"success": True, "xp_earned": mission["xp_reward"]}


@app.post("/api/spin")
def spin_wheel():
    user = db.users.find_one()
    user_id = str(user["_id"])
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    existing = db.spins.find_one({"user_id": user_id, "date": today})
    if existing:
        return {"success": False, "message": "Already spun today", "result": existing.get("result")}
    profile = get_agent_tooling_profile()
    segments = get_spin_segments(profile)
    weights = [s["weight"] for s in segments]
    selected = random.choices(segments, weights=weights, k=1)[0]
    result = resolve_spin_result(selected, random.choice)
    db.spins.insert_one({"user_id": user_id, "result": result["label"], "date": today, "created_at": datetime.now(timezone.utc).isoformat()})
    updates = {"total_spins": 1}
    if result.get("xp", 0):
        updates["xp"] = result["xp"]
    if result.get("tokens", 0):
        updates["tokens_balance"] = result["tokens"]
    db.users.update_one({"_id": user["_id"]}, {"$inc": updates})
    return {
        "success": True,
        "result": result["label"],
        "xp_earned": result.get("xp", 0),
        "tokens_earned": result.get("tokens", 0),
        "gamification_quality": "agent_boosted" if result.get("agent_boost") or result.get("bonus_applied") else "standard",
        "agent_tooling": {"mode": profile["mode"], "chain_id": profile["gami_chain"]["chain_id"]},
    }


@app.get("/api/agent/integration")
def get_agent_integration():
    profile = get_agent_tooling_profile()
    return {
        "enabled": profile["integration_enabled"],
        "integration_mode": profile["mode"],
        "chain": profile["gami_chain"],
        "features": {
            "agent_to_agent_wallet": True,
            "enhanced_rewards": True,
            "enhanced_spin_wheel": True,
        },
    }
