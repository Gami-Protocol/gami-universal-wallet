/**
 * Lucide-style line icons ported to react-native-svg.
 * Mirrors the `I` icon map from the uploaded `gami-primitives.jsx`.
 */
import React from 'react';
import Svg, { Path, Rect, Circle, Line, G } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color?: string;
}

export const ArrowIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const CheckIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 12l5 5L20 6" />
  </Svg>
);

export const XIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
    <Path d="M5 5l14 14M19 5L5 19" />
  </Svg>
);

export const BoltIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
  </Svg>
);

export const ShieldIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
  </Svg>
);

export const WalletIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3} y={6} width={18} height={14} rx={2} />
    <Path d="M3 10h18M17 14h2" />
  </Svg>
);

export const TrophyIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M8 4h8v6a4 4 0 01-8 0V4z" />
    <Path d="M8 6H5v2a3 3 0 003 3M16 6h3v2a3 3 0 01-3 3M10 16h4M9 20h6" />
  </Svg>
);

export const SwordIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 4l6 6-9 9-3 1 1-3 9-9zM4 20l4-4M14 14l4 4" />
  </Svg>
);

export const SparkIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16zM5 14l.5 1.5L7 16l-1.5.5L5 18l-.5-1.5L3 16l1.5-.5L5 14z" />
  </Svg>
);

export const FaceIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2M9 10v1M15 10v1M9 15c1 1 5 1 6 0" />
  </Svg>
);

export const BellIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 004 0" />
  </Svg>
);

export const FingerprintIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
    <Path d="M5 13a7 7 0 0114 0v3M8 17v-4a4 4 0 018 0v4M11 13v6M14 17v3" />
  </Svg>
);

export const GoogleIcon = ({ size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill="#fff" d="M22 12.2c0-.8-.1-1.4-.2-2H12v3.8h5.7c-.2 1.3-1 2.4-2.2 3.2v2.6h3.5c2-1.9 3.2-4.7 3.2-7.6z" />
    <Path fill="#fff" opacity={0.6} d="M12 22c2.9 0 5.4-1 7.2-2.6l-3.5-2.6c-1 .6-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.6H2.2v2.6A10 10 0 0012 22z" />
  </Svg>
);

export const AppleIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16 1c0 1-.4 2-1 2.7-.7.8-1.7 1.4-2.7 1.3-.1-1 .4-2 1-2.7.7-.7 1.7-1.3 2.7-1.3zM19 17c-.5 1-.7 1.5-1.3 2.5-.9 1.3-2.1 3-3.7 3-1.4 0-1.7-.9-3.6-.9-1.9 0-2.3.9-3.6.9-1.5 0-2.7-1.5-3.5-2.8C2 17 1.7 13 3 10.5c1-1.7 2.6-2.8 4-2.8 1.5 0 2.4 1 3.6 1 1.2 0 1.9-1 3.6-1 1.3 0 2.7.7 3.7 2-3.4 1.8-2.8 6.6-1 7.3z" />
  </Svg>
);

export const CopyIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={9} y={9} width={11} height={11} rx={2} />
    <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </Svg>
);

export const QrIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round">
    <Rect x={3} y={3} width={7} height={7} />
    <Rect x={14} y={3} width={7} height={7} />
    <Rect x={3} y={14} width={7} height={7} />
    <Path d="M14 14h3v3M21 14v7M14 21h7" />
  </Svg>
);

export const GameIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={2} y={6} width={20} height={12} rx={3} />
    <Path d="M7 11v2M6 12h2M15 11h.01M18 13h.01M16 14h.01M17 12h.01" />
  </Svg>
);

export const ArtIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={12} cy={12} r={10} />
    <Circle cx={8} cy={9} r={1.5} />
    <Circle cx={15} cy={8} r={1.5} />
    <Circle cx={17} cy={13} r={1.5} />
    <Path d="M12 22a3 3 0 003-3c0-1-1-2-1-3s1-1 2-1h2" />
  </Svg>
);

export const DefiIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={12} cy={12} r={10} />
    <Path d="M8 13c0 1.5 1.5 3 4 3s4-1.2 4-2.5c0-3-8-2-8-5 0-1.3 1.5-2.5 4-2.5s4 1.5 4 3M12 4v2M12 18v2" />
  </Svg>
);

export const AiIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={4} y={6} width={16} height={14} rx={3} />
    <Path d="M9 2v4M15 2v4M9 12h.01M15 12h.01M9 16c1 1 5 1 6 0" />
  </Svg>
);

export const FlameIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2s4 4 4 8c0 1.5-.5 2.5-1.5 3 .5-1.5-.5-3-1.5-3 0 2-3 3-3 6a4 4 0 008 0c0-5-6-9-6-14z" />
  </Svg>
);

export const ChevronLeftIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 6l-6 6 6 6" />
  </Svg>
);

export const GearIcon = ({ size = 18, color = '#fff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={12} cy={12} r={3} />
    <Path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
  </Svg>
);

export { Svg, Path, Rect, Circle, Line, G };
