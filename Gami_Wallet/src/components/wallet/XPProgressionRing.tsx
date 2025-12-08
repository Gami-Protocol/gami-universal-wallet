import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { NeobrutlisTheme } from '../../design/neobrultis-theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface XPProgressionRingProps {
  currentXP: number;
  maxXP: number;
  level: number;
  size?: number;
  strokeWidth?: number;
}

export const XPProgressionRing: React.FC<XPProgressionRingProps> = ({
  currentXP,
  maxXP,
  level,
  size = 200,
  strokeWidth = 12,
}) => {
  const progress = useSharedValue(0);
  const glowOpacity = useSharedValue(0.6);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressPercentage = (currentXP / maxXP) * 100;
  
  useEffect(() => {
    progress.value = withTiming(progressPercentage / 100, {
      duration: NeobrutlisTheme.animations.durations.slow,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    
    // Pulsing glow effect
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.6, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [currentXP, maxXP]);
  
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });
  
  const animatedGlowProps = useAnimatedProps(() => {
    return {
      opacity: glowOpacity.value,
    };
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.ringContainer}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={NeobrutlisTheme.colors.accent.xp} />
              <Stop offset="50%" stopColor={NeobrutlisTheme.colors.accent.points} />
              <Stop offset="100%" stopColor={NeobrutlisTheme.colors.accent.reward} />
            </LinearGradient>
          </Defs>
          
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={NeobrutlisTheme.colors.border.default}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Glow effect */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={NeobrutlisTheme.colors.accent.xpGlow}
            strokeWidth={strokeWidth + 4}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progressPercentage / 100)}
            strokeLinecap="round"
            animatedProps={animatedGlowProps}
          />
          
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#xpGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
            animatedProps={animatedProps}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        
        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={styles.levelLabel}>LEVEL</Text>
          <Text style={styles.levelNumber}>{level}</Text>
          <View style={styles.xpContainer}>
            <Text style={styles.xpText}>
              {currentXP.toLocaleString()}
            </Text>
            <Text style={styles.xpDivider}>/</Text>
            <Text style={styles.xpMaxText}>
              {maxXP.toLocaleString()}
            </Text>
          </View>
          <Text style={styles.xpLabel}>XP</Text>
        </View>
      </View>
      
      {/* Progress percentage */}
      <View style={styles.progressBar}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercentage.toFixed(1)}% TO NEXT LEVEL
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: NeobrutlisTheme.spacing.lg,
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelLabel: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.xs,
    color: NeobrutlisTheme.colors.text.tertiary,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.widest,
  },
  levelNumber: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes['5xl'],
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.accent.xp,
    textShadowColor: NeobrutlisTheme.colors.accent.xpGlow,
    textShadowRadius: 20,
    marginVertical: NeobrutlisTheme.spacing.xs,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: NeobrutlisTheme.spacing.xs,
  },
  xpText: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.base,
    color: NeobrutlisTheme.colors.text.primary,
    fontWeight: NeobrutlisTheme.typography.weights.bold,
  },
  xpDivider: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.sm,
    color: NeobrutlisTheme.colors.text.tertiary,
  },
  xpMaxText: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.sm,
    color: NeobrutlisTheme.colors.text.secondary,
  },
  xpLabel: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.xs,
    color: NeobrutlisTheme.colors.text.tertiary,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.widest,
    marginTop: NeobrutlisTheme.spacing.xs,
  },
  progressBar: {
    width: '100%',
    gap: NeobrutlisTheme.spacing.sm,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: NeobrutlisTheme.colors.border.default,
    borderRadius: NeobrutlisTheme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: NeobrutlisTheme.colors.accent.xp,
    shadowColor: NeobrutlisTheme.colors.accent.xpGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  progressText: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.xs,
    color: NeobrutlisTheme.colors.text.secondary,
    textAlign: 'center',
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.wider,
  },
});
