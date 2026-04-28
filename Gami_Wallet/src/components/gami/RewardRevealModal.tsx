import React from 'react';
import { Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn, BounceIn } from 'react-native-reanimated';

export function RewardRevealModal({ visible, xp, points, onClose }: { visible: boolean; xp: number; points: number; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(280)} style={styles.card}>
          <Animated.Text entering={BounceIn.delay(120)} style={styles.emoji}>🎉</Animated.Text>
          <Animated.Text entering={FadeIn.delay(180)} style={styles.title}>Reward Unlocked</Animated.Text>
          <Text style={styles.reward}>+{xp} XP</Text>
          <Text style={styles.reward}>+{points} Points</Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#15121F', borderRadius: 28, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#7C3AED' },
  emoji: { fontSize: 54 },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', marginTop: 10 },
  reward: { color: '#DDD6FE', fontSize: 20, fontWeight: '900', marginTop: 10 },
  button: { backgroundColor: '#7C3AED', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 18, marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '900' },
});
