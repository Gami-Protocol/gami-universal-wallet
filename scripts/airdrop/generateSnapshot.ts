import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';

export type SnapshotUser = {
  wallet: string;
  xp: number;
  questsCompleted: number;
  streakDays: number;
  extensionEvents: number;
  fraudScore: number;
};

function scoreUser(user: SnapshotUser) {
  if (user.fraudScore >= 0.75) return 0;

  const xpScore = Math.min(user.xp / 10_000, 1) * 0.4;
  const questScore = Math.min(user.questsCompleted / 50, 1) * 0.3;
  const streakScore = Math.min(user.streakDays / 30, 1) * 0.2;
  const extensionScore = Math.min(user.extensionEvents / 500, 1) * 0.1;

  return xpScore + questScore + streakScore + extensionScore;
}

function allocationFromScore(score: number) {
  const min = 100;
  const max = 10_000;
  return Math.floor(min + score * (max - min));
}

function hashLeaf(wallet: string, amount: string) {
  return ethers.keccak256(ethers.solidityPacked(['address', 'uint256'], [wallet, amount]));
}

function hashPair(a: string, b: string) {
  return ethers.keccak256(ethers.concat([a < b ? a : b, a < b ? b : a]));
}

function buildMerkleRoot(leaves: string[]) {
  if (leaves.length === 0) return ethers.ZeroHash;
  let level = leaves;
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      next.push(i + 1 < level.length ? hashPair(level[i], level[i + 1]) : level[i]);
    }
    level = next;
  }
  return level[0];
}

const inputPath = process.argv[2] || 'scripts/airdrop/users.json';
const outputDir = process.argv[3] || 'scripts/airdrop/output';

const users = JSON.parse(fs.readFileSync(inputPath, 'utf8')) as SnapshotUser[];
const allocations = users
  .map((user) => {
    const score = scoreUser(user);
    const tokens = allocationFromScore(score);
    const amount = ethers.parseEther(tokens.toString()).toString();
    return { ...user, score, tokens, amount, leaf: hashLeaf(user.wallet, amount) };
  })
  .filter((user) => user.tokens > 0);

const root = buildMerkleRoot(allocations.map((a) => a.leaf));

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'allocations.json'), JSON.stringify(allocations, null, 2));
fs.writeFileSync(path.join(outputDir, 'root.json'), JSON.stringify({ merkleRoot: root, totalWallets: allocations.length }, null, 2));

console.log(`Merkle root: ${root}`);
console.log(`Wallets: ${allocations.length}`);
