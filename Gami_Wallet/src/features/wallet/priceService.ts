/**
 * Token price feed. Fetches live USD prices (+ 24h change) from a configurable
 * endpoint — CoinGecko's free simple-price API by default. Returns an empty map
 * on failure so callers fall back to their own estimates; never throws.
 */
const BASE = process.env.EXPO_PUBLIC_PRICE_API_URL || 'https://api.coingecko.com/api/v3';

/** Our token symbols → CoinGecko ids. Symbols without a listing (e.g. GAMI) fall back. */
export const COINGECKO_IDS: Record<string, string> = {
  ETH: 'ethereum',
  SOL: 'solana',
  USDC: 'usd-coin',
};

export interface TokenPrice {
  usd: number;
  change: number;
}

export async function fetchPrices(): Promise<Record<string, TokenPrice>> {
  const ids = Object.values(COINGECKO_IDS).join(',');
  const url = `${BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`price feed ${res.status}`);
  const json = (await res.json()) as Record<string, { usd: number; usd_24h_change?: number }>;

  const out: Record<string, TokenPrice> = {};
  for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
    const entry = json[id];
    if (entry && typeof entry.usd === 'number') {
      out[symbol] = { usd: entry.usd, change: entry.usd_24h_change ?? 0 };
    }
  }
  return out;
}
