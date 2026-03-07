import unittest

from backend.gamification import (
    get_agent_integration_payload,
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
        deterministic_choice = lambda values: {"label": "25 XP", "xp": 25, "tokens": 0}
        result = resolve_spin_result(segment, deterministic_choice)

        self.assertTrue(result["bonus_applied"])
        self.assertEqual(result["xp"], 50)
        self.assertEqual(result["label"], "2x Bonus (25 XP)")

    def test_agent_integration_payload_includes_webapp_and_rewards_endpoints(self):
        profile = get_agent_tooling_profile()
        payload = get_agent_integration_payload(profile)

        self.assertEqual(payload["webapp_repository"], "https://github.com/Gami-Protocol/gami-webapp")
        self.assertEqual(payload["endpoints"]["rewards"]["path"], "/api/rewards")
        self.assertEqual(payload["endpoints"]["rewards_redeem"]["path"], "/api/rewards/redeem")
        self.assertEqual(payload["endpoints"]["agent_tooling"]["path"], "/api/agent/tooling")


if __name__ == "__main__":
    unittest.main()
