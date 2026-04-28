import express from 'express';
import { calculateRewardDecision } from '../ai/rewardEngine';

const router = express.Router();

router.post('/agent/reward-decision', (req, res) => {
  try {
    const decision = calculateRewardDecision(req.body);
    res.json(decision);
  } catch (e) {
    res.status(500).json({ error: 'reward_engine_error' });
  }
});

export default router;
