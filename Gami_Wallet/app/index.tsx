import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { GamiConnectCard } from '@/components/gami/GamiConnectCard';
import { useWalletConnection } from '@/features/gami/walletConnectService';
import { useProfile, useQuests } from '@/features/gami/useGamiHooks';

export default function HomeScreen() {
  const { address } = useWalletConnection();
  const { data: profile } = useProfile(address);
  const { data: quests } = useQuests();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GamiConnectCard />

      {profile && (
        <View style={styles.card}>
          <Text style={styles.title}>Level {profile.level}</Text>
          <Text style={styles.subtitle}>{profile.totalXp} XP • {profile.universalPoints} Points</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>Quests</Text>
        {quests?.slice(0, 5).map((q: any) => (
          <View key={q.id} style={styles.quest}>
            <Text style={styles.questTitle}>{q.title}</Text>
            <Text style={styles.questMeta}>{q.progress}/{q.target} • {q.xpReward} XP</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0A10' },
  content: { padding: 16, gap: 16 },
  card: { backgroundColor: '#15121F', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#2B2440' },
  title: { color: '#fff', fontSize: 20, fontWeight: '900' },
  subtitle: { color: '#A5A0B8', marginTop: 6 },
  quest: { marginTop: 10, padding: 12, backgroundColor: '#1C1630', borderRadius: 14 },
  questTitle: { color: '#EDE9FE', fontWeight: '800' },
  questMeta: { color: '#A5A0B8', marginTop: 4 },
});
