import React from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useWalletConnection } from '@/features/gami/walletConnectService';
import { useProfile, useQuests, useCompleteQuest, useClaimQuest, useRewardDecision } from '@/features/gami/useGamiHooks';
import { GamiAPI } from '@/features/gami/apiClient';
import { DEFAULT_GAMI_CHAIN } from '@/features/gami/chainConfig';

export default function QuestsScreen() {
  const { address } = useWalletConnection();
  const { data: profile } = useProfile(address);
  const { data: quests, isLoading } = useQuests();
  const completeQuest = useCompleteQuest();
  const claimQuest = useClaimQuest();
  const rewardDecision = useRewardDecision();

  async function handleComplete(quest: any) {
    if (!profile?.userId) return;
    await GamiAPI.submitXPEvent({
      eventId: `${quest.id}-${Date.now()}`,
      eventType: 'quest_completed',
      userId: profile.userId,
      walletAddress: address as `0x${string}`,
      questId: quest.id,
      chainId: DEFAULT_GAMI_CHAIN.chainId,
    });
    await completeQuest.mutateAsync(quest.id);
    await rewardDecision.mutateAsync({
      userId: profile.userId,
      walletAddress: address as `0x${string}`,
      level: profile.level,
      questId: quest.id,
      chainId: DEFAULT_GAMI_CHAIN.chainId,
      context: { source: 'expo-wallet' },
    });
  }

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator color="#7C3AED" /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Quests</Text>
      {quests?.map((quest: any) => (
        <View key={quest.id} style={styles.card}>
          <Text style={styles.title}>{quest.title}</Text>
          <Text style={styles.desc}>{quest.description}</Text>
          <Text style={styles.meta}>{quest.progress}/{quest.target} • {quest.xpReward} XP • {quest.pointReward} Points</Text>
          <View style={styles.progressOuter}><View style={[styles.progressInner, { width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }]} /></View>
          {quest.status === 'claimable' ? (
            <Pressable style={styles.button} onPress={() => claimQuest.mutateAsync(quest.id)}><Text style={styles.buttonText}>Claim Reward</Text></Pressable>
          ) : quest.status === 'claimed' ? (
            <Text style={styles.claimed}>Claimed</Text>
          ) : (
            <Pressable style={styles.button} onPress={() => handleComplete(quest)}><Text style={styles.buttonText}>Complete Quest</Text></Pressable>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0A10' },
  content: { padding: 16, gap: 14 },
  center: { flex: 1, backgroundColor: '#0B0A10', alignItems: 'center', justifyContent: 'center' },
  header: { color: '#fff', fontSize: 32, fontWeight: '900' },
  card: { backgroundColor: '#15121F', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#2B2440' },
  title: { color: '#fff', fontSize: 18, fontWeight: '900' },
  desc: { color: '#A5A0B8', marginTop: 6 },
  meta: { color: '#DDD6FE', marginTop: 10, fontWeight: '700' },
  progressOuter: { height: 8, backgroundColor: '#2B2440', borderRadius: 8, marginTop: 12, overflow: 'hidden' },
  progressInner: { height: 8, backgroundColor: '#7C3AED' },
  button: { backgroundColor: '#7C3AED', borderRadius: 16, padding: 14, marginTop: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '900' },
  claimed: { color: '#4ADE80', marginTop: 14, fontWeight: '900' },
});
