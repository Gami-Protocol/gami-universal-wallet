import { ReactNode, CSSProperties } from 'react';

interface GamiButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'pink' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<string, CSSProperties> = {
  primary:   { background: '#6E3CFB', color: '#fff', border: '2.5px solid #000', boxShadow: '5px 5px 0 0 #000' },
  secondary: { background: '#1C1C26', color: '#9C6CFF', border: '2px solid #6E3CFB', boxShadow: '4px 4px 0 0 #6E3CFB' },
  ghost:     { background: 'transparent', color: '#9C6CFF', border: '2px solid #6E3CFB', boxShadow: '4px 4px 0 0 #6E3CFB' },
  glass:     { background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.15)', boxShadow: '3px 3px 0 0 #000' },
  pink:      { background: '#FF4FA8', color: '#fff', border: '2.5px solid #000', boxShadow: '5px 5px 0 0 #000' },
  success:   { background: '#3FE0A0', color: '#000', border: '2.5px solid #000', boxShadow: '5px 5px 0 0 #000' },
};

const sizeStyles: Record<string, CSSProperties> = {
  sm: { padding: '7px 13px', fontSize: 11 },
  md: { padding: '11px 16px', fontSize: 13 },
  lg: { padding: '14px 20px', fontSize: 14 },
};

export default function GamiButton({
  variant = 'primary', size = 'md', children, className = '',
  loading = false, disabled, onClick, type = 'button', style,
}: GamiButtonProps) {
  const base: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
    letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: 0,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform 0.08s, box-shadow 0.08s',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      type={type}
      style={base}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={(e) => {
        const t = e.currentTarget;
        t.style.transform = 'translate(3px,3px)';
        t.style.boxShadow = 'none';
      }}
      onMouseUp={(e) => {
        const t = e.currentTarget;
        t.style.transform = '';
        t.style.boxShadow = base.boxShadow as string;
      }}
      onMouseLeave={(e) => {
        const t = e.currentTarget;
        t.style.transform = '';
        t.style.boxShadow = base.boxShadow as string;
      }}
    >
      {loading ? (
        <div style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      ) : children}
    </button>
  );
}
