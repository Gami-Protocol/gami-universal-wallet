/**
 * Avatar Generator Utility for Chrome Extension
 * Generates unique, deterministic avatars based on user address/identifier
 */

// Gami brand colors
const GAMI_COLORS = [
  '#8B5CF6', // Primary purple
  '#A78BFA', // Light purple
  '#7C3AED', // Dark purple
  '#6366F1', // Indigo
  '#818CF8', // Light indigo
  '#4F46E5', // Deep indigo
  '#EC4899', // Pink accent
  '#F472B6', // Light pink
  '#06B6D4', // Cyan accent
  '#22D3EE', // Light cyan
  '#10B981', // Green accent
  '#34D399', // Light green
];

/**
 * Simple hash function for string to number
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Generate initials from address or name
 */
function getInitials(identifier: string): string {
  if (identifier.startsWith('0x')) {
    return identifier.slice(2, 4).toUpperCase();
  }
  const words = identifier.split(/[\s._-]+/);
  return words.slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

/**
 * Generate a gradient avatar as SVG data URI
 */
export function generateAvatarSVG(identifier: string, size: number = 100): string {
  const hash = hashCode(identifier);
  const color1 = GAMI_COLORS[hash % GAMI_COLORS.length];
  const color2 = GAMI_COLORS[(hash + 4) % GAMI_COLORS.length];
  const initials = getInitials(identifier);
  const angle = hash % 360;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="g" gradientTransform="rotate(${angle})">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#g)"/>
      <text x="50" y="55" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Generate avatar URL using DiceBear API (online fallback)
 */
export function generateDiceBearAvatar(identifier: string, style: string = 'identicon'): string {
  const seed = encodeURIComponent(identifier);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=8B5CF6,7C3AED,6366F1`;
}

/**
 * Get avatar colors for a user (useful for backgrounds/accents)
 */
export function getAvatarColors(identifier: string): { primary: string; secondary: string } {
  const hash = hashCode(identifier);
  return {
    primary: GAMI_COLORS[hash % GAMI_COLORS.length],
    secondary: GAMI_COLORS[(hash + 4) % GAMI_COLORS.length],
  };
}

export default generateAvatarSVG;
