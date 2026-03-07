import unittest

from backend.gamification import (
    enrich_rewards_with_agent_quality,
    get_agent_tooling_profile,
    get_spin_segments,
    resolve_spin_result,
)


class GamificationHelpersTests(unittest.TestCase):
    def test_rewards_are_enriched_and_sorted(self):
        rewards = [
            {"title": "A", "cost": 500, "featured": False},
            {"title": "B", "cost": 100, "featured": True},
        ]
        profile = get_agent_tooling_profile()
        result = enrich_rewards_with_agent_quality(rewards, profile)

        self.assertEqual(result[0]["title"], "B")
        self.assertIn("agent_quality_score", result[0])
        self.assertTrue(result[0]["supports_agent_to_agent"])

    def test_spin_segments_include_agent_boost(self):
        profile = get_agent_tooling_profile()
        segments = get_spin_segments(profile)

        self.assertTrue(any(segment["label"] == "Agent Boost XP" for segment in segments))

    def test_two_x_bonus_segment_applies_multiplier(self):
        segment = {"label": "2x Bonus", "xp": 0}
        result = resolve_spin_result(segment, lambda values: values[0])

        self.assertTrue(result["bonus_applied"])
        self.assertEqual(result["xp"], 50)
        self.assertEqual(result["label"], "2x Bonus (25 XP)")


if __name__ == "__main__":
    unittest.main()
