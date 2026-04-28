export type RewardEvent = {
  userId: string;
  walletAddress?: string;
  eventType: string;
  questId?: string;
  partnerId?: string;
  sessionSeconds?: number;
  repeatRate?: number;
  timeBetweenEventsMs?: number;
  streakDays?: number;
  conversionValue?: number;
  metadata?: Record<string, unknown>;
};

export type RewardDecision = {
  allowed: boolean;
  xp: number;
  points: number;
  riskScore: number;
  multiplier: number;
  reason: string[];
  rewards: Array<{
    type: 'xp' | 'universal_points' | 'xp_boost' | 'review_required';
    amount: number;
    label: string;
  }>;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function scoreFraudRisk(event: RewardEvent) {
  let risk = 0;

  if ((event.repeatRate ?? 0) > 12) risk += 0.45;
  if ((event.timeBetweenEventsMs ?? 999999) < 800) risk += 0.3;
  if (!event.userId) risk += 0.2;
  if (event.eventType === 'click' && (event.sessionSeconds ?? 0) < 3) risk += 0.15;

  return clamp(risk, 0, 1);
}

export function scoreEngagement(event: RewardEvent) {
  const sessionScore = clamp((event.sessionSeconds ?? 0) / 180, 0, 1);
  const streakScore = clamp((event.streakDays ?? 0) / 14, 0, 1);
  const conversionScore = clamp((event.conversionValue ?? 0) / 100, 0, 1);

  const actionWeight: Record<string, number> = {
    click: 0.25,
    scroll: 0.2,
    form_submit: 0.75,
    signup: 0.9,
    purchase: 1,
    quest_completed: 1,
    referral_completed: 1,
  };

  return clamp((actionWeight[event.eventType] ?? 0.35) + sessionScore * 0.2 + streakScore * 0.25 + conversionScore * 0.3, 0, 1);
}

export function calculateRewardDecision(event: RewardEvent): RewardDecision {
  const riskScore = scoreFraudRisk(event);
  const engagementScore = scoreEngagement(event);
  const reason: string[] = [];

  if (riskScore >= 0.75) {
    return {
      allowed: false,
      xp: 0,
      points: 0,
      riskScore,
      multiplier: 0,
      reason: ['high_risk', 'reward_blocked'],
      rewards: [{ type: 'review_required', amount: 0, label: 'Manual review required' }],
    };
  }

  const riskPenalty = 1 - riskScore;
  const multiplier = clamp(0.75 + engagementScore * 1.5, 0.75, 2.25) * riskPenalty;
  const baseXp = event.eventType === 'purchase' ? 200 : event.eventType === 'quest_completed' ? 150 : event.eventType === 'signup' ? 120 : 25;
  const xp = Math.round(baseXp * multiplier);
  const points = Math.round(xp * 0.6);

  if (engagementScore > 0.75) reason.push('high_engagement');
  if ((event.streakDays ?? 0) >= 7) reason.push('streak_bonus');
  if (riskScore < 0.25) reason.push('low_risk');
  if (riskScore >= 0.5) reason.push('risk_penalty_applied');

  const rewards: RewardDecision['rewards'] = [
    { type: 'xp', amount: xp, label: 'Dynamic XP reward' },
    { type: 'universal_points', amount: points, label: 'Universal points' },
  ];

  if ((event.streakDays ?? 0) >= 7) {
    rewards.push({ type: 'xp_boost', amount: 15, label: '7-day streak boost' });
  }

  return {
    allowed: true,
    xp,
    points,
    riskScore,
    multiplier: Number(multiplier.toFixed(2)),
    reason,
    rewards,
  };
}
