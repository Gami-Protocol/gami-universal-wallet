export interface OnboardingSlideData {
  id: string;
  step: string;
  title: string;
  titleAccent: string;
  lines: string[];
  icon: string;
  accentColor: string;
  tag?: string;
  xpReward?: number;
}

export const onboardingData: OnboardingSlideData[] = [
  {
    id: '1',
    step: '01',
    tag: 'NEW PLAYER',
    title: 'Your wallet,\nbut make it',
    titleAccent: 'FUN.',
    lines: ['> stack xp on every action', '> quests pay real rewards', '> you keep your keys, always'],
    icon: '🎮',
    accentColor: '#FF4FA8',
    xpReward: 50,
  },
  {
    id: '2',
    step: '02',
    title: 'Multi-chain.\nNon-custodial.',
    titleAccent: 'Yours.',
    lines: ['> ETH, SOL, MATIC + more', '> bank-grade encryption', '> self-sovereign keys'],
    icon: '🔐',
    accentColor: '#6E3CFB',
  },
  {
    id: '3',
    step: '03',
    title: 'Quests. XP.',
    titleAccent: 'Real rewards.',
    lines: ['> daily + weekly missions', '> on-chain XP that compounds', '> leaderboard bragging rights'],
    icon: '🏆',
    accentColor: '#3FE0A0',
  },
  {
    id: '4',
    step: '04',
    title: 'NOVA — your',
    titleAccent: 'AI co-pilot.',
    lines: ['> trades while you sleep', '> scans yield + NFT alpha', '> gets smarter over time'],
    icon: '🤖',
    accentColor: '#4FE3FF',
  },
  {
    id: '5',
    step: '05',
    tag: 'READY TO DEPLOY',
    title: "Let's load\nyour wallet.",
    titleAccent: 'GM anon.',
    lines: ['> create wallet  +50 XP', '> import existing wallet', '> sign in with google / apple'],
    icon: '🚀',
    accentColor: '#9C6CFF',
    xpReward: 50,
  },
];
