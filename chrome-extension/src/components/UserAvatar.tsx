import { useMemo } from 'react';
import { generateAvatarSVG, getAvatarColors } from '../shared/avatar';

interface UserAvatarProps {
  /** User identifier - wallet address, username, or email */
  identifier: string;
  /** Size of the avatar in pixels */
  size?: number;
  /** Custom image URL (overrides generated avatar) */
  imageUrl?: string;
  /** Show online indicator */
  showOnlineIndicator?: boolean;
  /** Is user online */
  isOnline?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export default function UserAvatar({
  identifier,
  size = 40,
  imageUrl,
  showOnlineIndicator = false,
  isOnline = false,
  className = '',
}: UserAvatarProps) {
  const avatarSrc = useMemo(() => {
    if (imageUrl) return imageUrl;
    return generateAvatarSVG(identifier, size);
  }, [identifier, imageUrl, size]);

  const colors = useMemo(() => getAvatarColors(identifier), [identifier]);
  const indicatorSize = Math.max(8, size / 5);

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={avatarSrc}
        alt="User avatar"
        className="rounded-full object-cover"
        style={{ 
          width: size, 
          height: size,
          boxShadow: `0 0 20px ${colors.primary}40`,
        }}
      />
      {showOnlineIndicator && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-gray-900"
          style={{
            width: indicatorSize,
            height: indicatorSize,
            backgroundColor: isOnline ? '#10B981' : '#6B7280',
          }}
        />
      )}
    </div>
  );
}
