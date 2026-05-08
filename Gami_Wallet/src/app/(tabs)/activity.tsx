import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeobrutlisTheme } from '../../design/neobrultis-theme';

interface Activity {
  id: string;
  type: 'xp_earned' | 'points_earned' | 'level_up' | 'quest_completed' | 'reward_claimed';
  title: string;
  description: string;
  value?: string;
  timestamp: string;
  icon: string;
}

export default function ActivityScreen() {
  const [filter, setFilter] = useState<'all' | 'xp' | 'quests' | 'rewards'>('all');

  const activities: Activity[] = [
    {
      id: '1',
      type: 'level_up',
      title: 'Level Up!',
      description: 'Reached Level 5',
      value: 'LVL 5',
      timestamp: '2 hours ago',
      icon: '⭐',
    },
    {
      id: '2',
      type: 'xp_earned',
      title: 'XP Earned',
      description: 'Website interaction',
      value: '+50 XP',
      timestamp: '3 hours ago',
      icon: '💎',
    },
    {
      id: '3',
      type: 'quest_completed',
      title: 'Quest Completed',
      description: 'Daily Login Streak',
      value: '+100 XP',
      timestamp: '5 hours ago',
      icon: '🎯',
    },
    {
      id: '4',
      type: 'points_earned',
      title: 'Points Earned',
      description: 'Community contribution',
      value: '+25 PTS',
      timestamp: '1 day ago',
      icon: '🏆',
    },
    {
      id: '5',
      type: 'reward_claimed',
      title: 'Reward Claimed',
      description: 'Weekly bonus',
      value: '+200 XP',
      timestamp: '2 days ago',
      icon: '🎁',
    },
  ];

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'level_up':
        return NeobrutlisTheme.colors.accent.reward;
      case 'xp_earned':
        return NeobrutlisTheme.colors.accent.xp;
      case 'quest_completed':
        return NeobrutlisTheme.colors.accent.points;
      case 'points_earned':
        return NeobrutlisTheme.colors.accent.points;
      case 'reward_claimed':
        return NeobrutlisTheme.colors.accent.reward;
      default:
        return NeobrutlisTheme.colors.accent.xp;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ACTIVITY</Text>
        <Text style={styles.subtitle}>Track your progress and rewards</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              ALL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'xp' && styles.filterTabActive]}
            onPress={() => setFilter('xp')}
          >
            <Text style={[styles.filterText, filter === 'xp' && styles.filterTextActive]}>
              XP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'quests' && styles.filterTabActive]}
            onPress={() => setFilter('quests')}
          >
            <Text style={[styles.filterText, filter === 'quests' && styles.filterTextActive]}>
              QUESTS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'rewards' && styles.filterTabActive]}
            onPress={() => setFilter('rewards')}
          >
            <Text style={[styles.filterText, filter === 'rewards' && styles.filterTextActive]}>
              REWARDS
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Activity List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {activities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={styles.activityCard}
            activeOpacity={0.7}
          >
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>{activity.icon}</Text>
            </View>
            
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
            </View>
            
            {activity.value && (
              <View style={styles.activityValueContainer}>
                <Text
                  style={[
                    styles.activityValue,
                    { color: getActivityColor(activity.type) },
                  ]}
                >
                  {activity.value}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeobrutlisTheme.colors.background.primary,
  },
  header: {
    padding: NeobrutlisTheme.spacing.lg,
    gap: NeobrutlisTheme.spacing.xs,
  },
  title: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes['3xl'],
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.text.primary,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.wider,
  },
  subtitle: {
    fontFamily: NeobrutlisTheme.typography.fonts.secondary,
    fontSize: NeobrutlisTheme.typography.sizes.sm,
    color: NeobrutlisTheme.colors.text.secondary,
  },
  filterContainer: {
    paddingHorizontal: NeobrutlisTheme.spacing.lg,
    paddingBottom: NeobrutlisTheme.spacing.md,
  },
  filterTab: {
    paddingVertical: NeobrutlisTheme.spacing.sm,
    paddingHorizontal: NeobrutlisTheme.spacing.lg,
    borderRadius: NeobrutlisTheme.borderRadius.sm,
    backgroundColor: NeobrutlisTheme.colors.background.secondary,
    borderWidth: 1,
    borderColor: NeobrutlisTheme.colors.border.default,
    marginRight: NeobrutlisTheme.spacing.sm,
  },
  filterTabActive: {
    backgroundColor: NeobrutlisTheme.colors.accent.xp,
    borderColor: NeobrutlisTheme.colors.accent.xp,
  },
  filterText: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.xs,
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.text.secondary,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.wider,
  },
  filterTextActive: {
    color: NeobrutlisTheme.colors.text.inverse,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: NeobrutlisTheme.spacing.lg,
    gap: NeobrutlisTheme.spacing.md,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeobrutlisTheme.components.card.backgroundColor,
    borderWidth: NeobrutlisTheme.components.card.borderWidth,
    borderColor: NeobrutlisTheme.components.card.borderColor,
    borderRadius: NeobrutlisTheme.components.card.borderRadius,
    padding: NeobrutlisTheme.spacing.md,
    gap: NeobrutlisTheme.spacing.md,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: NeobrutlisTheme.borderRadius.md,
    backgroundColor: NeobrutlisTheme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIconText: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
    gap: NeobrutlisTheme.spacing.xs,
  },
  activityTitle: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.base,
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.text.primary,
  },
  activityDescription: {
    fontFamily: NeobrutlisTheme.typography.fonts.secondary,
    fontSize: NeobrutlisTheme.typography.sizes.sm,
    color: NeobrutlisTheme.colors.text.secondary,
  },
  activityTimestamp: {
    fontFamily: NeobrutlisTheme.typography.fonts.secondary,
    fontSize: NeobrutlisTheme.typography.sizes.xs,
    color: NeobrutlisTheme.colors.text.tertiary,
  },
  activityValueContainer: {
    paddingVertical: NeobrutlisTheme.spacing.xs,
    paddingHorizontal: NeobrutlisTheme.spacing.sm,
    borderRadius: NeobrutlisTheme.borderRadius.sm,
    backgroundColor: NeobrutlisTheme.colors.background.tertiary,
  },
  activityValue: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.sm,
    fontWeight: NeobrutlisTheme.typography.weights.bold,
  },
});
