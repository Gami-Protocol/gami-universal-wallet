import os
from copy import deepcopy


BASE_SPIN_SEGMENTS = [
    {"label": "10 XP", "xp": 10, "weight": 25},
    {"label": "25 XP", "xp": 25, "weight": 20},
    {"label": "50 XP", "xp": 50, "weight": 15},
    {"label": "100 XP", "xp": 100, "weight": 5},
    {"label": "5 Tokens", "xp": 0, "tokens": 5, "weight": 10},
    {"label": "NFT Badge", "xp": 0, "weight": 3},
    {"label": "Try Again", "xp": 0, "weight": 15},
    {"label": "2x Bonus", "xp": 0, "weight": 7},
]

BONUS_BASE_SEGMENTS = [
    {"label": "25 XP", "xp": 25, "tokens": 0},
    {"label": "50 XP", "xp": 50, "tokens": 0},
    {"label": "5 Tokens", "xp": 0, "tokens": 5},
]


def _read_float(env_key: str, default: float) -> float:
    raw = os.environ.get(env_key)
    if raw is None:
        return default
    try:
        return float(raw)
    except (TypeError, ValueError):
        return default


def _read_int(env_key: str, default: int) -> int:
    raw = os.environ.get(env_key)
    if raw is None:
        return default
    try:
        return int(raw)
    except (TypeError, ValueError):
        return default


def get_agent_tooling_profile():
    quality_multiplier = _read_float("AGENT_TOOLING_QUALITY_MULTIPLIER", 1.2)
    reward_bonus = _read_int("AGENT_TOOLING_REWARD_BONUS_XP", 15)
    spin_bonus_weight = _read_int("AGENT_TOOLING_SPIN_BONUS_WEIGHT", 4)
    return {
        "integration_enabled": True,
        "mode": os.environ.get("AGENT_TOOLING_MODE", "agent_to_agent"),
        "gami_chain": {
            "name": "Gami Chain",
            "chain_id": os.environ.get("GAMI_CHAIN_ID", "gami-1"),
        },
        "quality_multiplier": max(1.0, quality_multiplier),
        "reward_bonus_xp": max(0, reward_bonus),
        "spin_bonus_weight": max(0, spin_bonus_weight),
    }


def enrich_rewards_with_agent_quality(rewards, profile):
    quality_multiplier = profile.get("quality_multiplier", 1.0)
    bonus_xp = profile.get("reward_bonus_xp", 0)
    enriched = []
    for reward in rewards:
        item = deepcopy(reward)
        base_cost = item.get("cost", 0)
        quality_score = int(max(0, (1000 - base_cost) * quality_multiplier))
        item["agent_quality_score"] = quality_score
        item["agent_bonus_xp"] = bonus_xp
        item["gamification_tier"] = "elite" if quality_score >= 950 else "boosted"
        item["supports_agent_to_agent"] = True
        enriched.append(item)
    enriched.sort(key=lambda r: (-int(r.get("featured", False)), -r.get("agent_quality_score", 0), r.get("cost", 0)))
    return enriched


def get_spin_segments(profile):
    segments = deepcopy(BASE_SPIN_SEGMENTS)
    bonus_weight = profile.get("spin_bonus_weight", 0)
    if bonus_weight > 0:
        segments.append(
            {
                "label": "Agent Boost XP",
                "xp": profile.get("reward_bonus_xp", 0),
                "weight": bonus_weight,
                "agent_boost": True,
            }
        )
    return segments


def resolve_spin_result(selected_segment, random_choice):
    result = deepcopy(selected_segment)
    if result.get("label") == "2x Bonus":
        base = random_choice(BONUS_BASE_SEGMENTS)
        result["label"] = f"2x Bonus ({base['label']})"
        result["xp"] = base.get("xp", 0) * 2
        result["tokens"] = base.get("tokens", 0) * 2
        result["bonus_applied"] = True
    return result
