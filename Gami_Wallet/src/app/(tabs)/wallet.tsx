import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AssetCard } from '../../components/wallet/AssetCard';
import { NeobrutlisTheme } from '../../design/neobrultis-theme';

interface WalletStats {
  level: number;
  currentXP: number;
  maxXP: number;
  totalXP: number;
}

interface Asset {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  value?: string;
}

export default function WalletScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<WalletStats>({
    level: 5,
    currentXP: 3450,
    maxXP: 5000,
    totalXP: 18450,
  });

  const [assets] = useState<Asset[]>([
    { id: '1', symbol: 'ETH', name: 'Ethereum', balance: '2.45', value: '4,850.00' },
    { id: '2', symbol: 'GAMI', name: 'Gami Token', balance: '1,500', value: '750.00' },
    { id: '3', symbol: 'USDC', name: 'USD Coin', balance: '1,200', value: '1,200.00' },
  ]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // TODO: Fetch data from API
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={NeobrutlisTheme.colors.accent.xp}
            colors={[NeobrutlisTheme.colors.accent.xp]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>UNIVERSAL WALLET</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>0x1234...5678</Text>
          </View>
        </View>

        {/* XP Section - Simplified */}
        <View style={styles.xpSection}>
          <View style={styles.xpCard}>
            <Text style={styles.xpLevel}>LEVEL {stats.level}</Text>
            <Text style={styles.xpText}>{stats.currentXP.toLocaleString()} / {stats.maxXP.toLocaleString()} XP</Text>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${(stats.currentXP / stats.maxXP) * 100}%` }]} />
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL XP</Text>
            <Text style={styles.statValue}>{stats.totalXP.toLocaleString()}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>RANK</Text>
            <Text style={styles.statValue}>#248</Text>
          </View>
        </View>

        {/* Assets Section */}
        <View style={styles.assetsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ASSETS</Text>
            <Text style={styles.totalValue}>$6,800.00</Text>
          </View>
          
          <View style={styles.assetsList}>
            {assets.map((asset) => (
              <AssetCard
                key={asset.id}
                symbol={asset.symbol}
                name={asset.name}
                balance={asset.balance}
                value={asset.value}
                onPress={() => console.log('Asset pressed:', asset.symbol)}
              />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>+50 XP</Text>
                <Text style={styles.activityTime}>Completed quest · 2h ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>+100 XP</Text>
                <Text style={styles.activityTime}>Website interaction · 5h ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeobrutlisTheme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: NeobrutlisTheme.spacing.lg,
    gap: NeobrutlisTheme.spacing.xl,
  },
  header: {
    gap: NeobrutlisTheme.spacing.md,
  },
  title: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes['3xl'],
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.text.primary,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.wider,
  },
  addressContainer: {
    backgroundColor: NeobrutlisTheme.colors.background.secondary,
    borderWidth: 1,
    borderColor: NeobrutlisTheme.colors.border.default,
    borderRadius: NeobrutlisTheme.borderRadius.md,
    paddingVertical: NeobrutlisTheme.spacing.sm,
    paddingHorizontal: NeobrutlisTheme.spacing.md,
    alignSelf: 'flex-start',
  },
  address: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.sm,
    color: NeobrutlisTheme.colors.text.secondary,
  },
  xpSection: {
    alignItems: 'center',
    paddingVertical: NeobrutlisTheme.spacing.lg,
  },
  xpCard: {
    width: '100%',
    backgroundColor: NeobrutlisTheme.colors.background.secondary,
    borderWidth: 2,
    borderColor: NeobrutlisTheme.colors.border.default,
    borderRadius: NeobrutlisTheme.borderRadius.lg,
    padding: NeobrutlisTheme.spacing.xl,
    alignItems: 'center',
    gap: NeobrutlisTheme.spacing.md,
  },
  xpLevel: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes['2xl'],
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.accent.xp,
  },
  xpText: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.lg,
    color: NeobrutlisTheme.colors.text.primary,
  },
  xpBar: {
    width: '100%',
    height: 12,
    backgroundColor: NeobrutlisTheme.colors.background.primary,
    borderRadius: NeobrutlisTheme.borderRadius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: NeobrutlisTheme.colors.border.default,
  },
  xpFill: {
    height: '100%',
    backgroundColor: NeobrutlisTheme.colors.accent.xp,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: NeobrutlisTheme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: NeobrutlisTheme.components.card.backgroundColor,
    borderWidth: NeobrutlisTheme.components.card.borderWidth,
    borderColor: NeobrutlisTheme.components.card.borderColor,
    borderRadius: NeobrutlisTheme.components.card.borderRadius,
    padding: NeobrutlisTheme.spacing.lg,
    gap: NeobrutlisTheme.spacing.sm,
  },
  statLabel: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.xs,
    color: NeobrutlisTheme.colors.text.tertiary,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.widest,
  },
  statValue: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes['2xl'],
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.accent.xp,
  },
  assetsSection: {
    gap: NeobrutlisTheme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.lg,
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.text.primary,
    letterSpacing: NeobrutlisTheme.typography.letterSpacing.wider,
  },
  totalValue: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.xl,
    fontWeight: NeobrutlisTheme.typography.weights.bold,
    color: NeobrutlisTheme.colors.accent.points,
  },
  assetsList: {
    gap: NeobrutlisTheme.spacing.md,
  },
  activitySection: {
    gap: NeobrutlisTheme.spacing.md,
  },
  activityList: {
    gap: NeobrutlisTheme.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: NeobrutlisTheme.spacing.md,
    paddingVertical: NeobrutlisTheme.spacing.sm,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: NeobrutlisTheme.colors.accent.xp,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
    gap: NeobrutlisTheme.spacing.xs,
  },
  activityText: {
    fontFamily: NeobrutlisTheme.typography.fonts.primary,
    fontSize: NeobrutlisTheme.typography.sizes.base,
    fontWeight: NeobrutlisTheme.typography.weights.semibold,
    color: NeobrutlisTheme.colors.text.primary,
  },
  activityTime: {
    fontFamily: NeobrutlisTheme.typography.fonts.secondary,
    fontSize: NeobrutlisTheme.typography.sizes.sm,
    color: NeobrutlisTheme.colors.text.secondary,
  },
});
