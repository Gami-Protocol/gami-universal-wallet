import { ReactNode, CSSProperties } from 'react';

interface BrutalCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'purple' | 'pink' | 'elevated';
  onClick?: () => void;
  style?: CSSProperties;
  hover?: boolean;
}

const variantStyles: Record<string, CSSProperties> = {
  default:  { background: 'var(--gami-bg-card)', border: '2px solid #000', boxShadow: '5px 5px 0 0 #000' },
  purple:   { background: 'var(--gami-bg-card)', border: '1.5px solid var(--gami-purple)', boxShadow: '5px 5px 0 0 var(--gami-purple)' },
  pink:     { background: 'var(--gami-bg-card)', border: '1.5px solid var(--gami-pink)', boxShadow: '5px 5px 0 0 var(--gami-pink)' },
  elevated: { background: 'var(--gami-bg-elev)', border: '2px solid #000', boxShadow: '4px 4px 0 0 #000' },
};

export default function GlassCard({ children, className = '', variant = 'default', onClick, style }: BrutalCardProps) {
  const baseStyle = variantStyles[variant];
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className={className} style={{ ...baseStyle, ...style, ...(onClick ? { width: '100%', textAlign: 'left', cursor: 'pointer' } : {}) }} onClick={onClick}>
      {children}
    </Tag>
  );
}
