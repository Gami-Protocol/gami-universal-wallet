import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useSignMessage } from 'wagmi';
import { useWalletConnection } from '@/features/gami/walletConnectService';
import { verifySiwe } from '@/features/gami/authService';
import { DEFAULT_GAMI_CHAIN } from '@/features/gami/chainConfig';

function shortAddress(address?: string) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function GamiConnectCard() {
  const { address, isConnected, connectWallet, disconnect } = useWalletConnection();
  const { signMessageAsync } = useSignMessage();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'signed-in' | 'error'>('idle');

  async function handleSignIn() {
    if (!address) return;
    setIsSigningIn(true);
    setAuthStatus('idle');
    try {
      await verifySiwe({
        address: address as `0x${string}`,
        chainId: DEFAULT_GAMI_CHAIN.chainId,
        domain: 'gamiprotocol.xyz',
        uri: 'https://gamiprotocol.xyz',
        signMessage: signMessageAsync,
      });
      setAuthStatus('signed-in');
    } catch {
      setAuthStatus('error');
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Gami Wallet</Text>
      <Text style={styles.title}>{isConnected ? shortAddress(address) : 'Connect your wallet'}</Text>
      <Text style={styles.subtitle}>{isConnected ? `Network: ${DEFAULT_GAMI_CHAIN.name}` : 'Connect with WalletConnect, then sign in with Ethereum.'}</Text>

      <View style={styles.row}>
        {!isConnected ? (
          <Pressable style={styles.primaryButton} onPress={connectWallet}>
            <Text style={styles.primaryText}>Connect</Text>
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.primaryButton} onPress={handleSignIn} disabled={isSigningIn}>
              {isSigningIn ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>SIWE Login</Text>}
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => disconnect()}>
              <Text style={styles.secondaryText}>Disconnect</Text>
            </Pressable>
          </>
        )}
      </View>

      {authStatus === 'signed-in' && <Text style={styles.success}>Signed in successfully</Text>}
      {authStatus === 'error' && <Text style={styles.error}>Sign-in failed. Try again.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#15121F', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#2B2440' },
  eyebrow: { color: '#A78BFA', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 8 },
  subtitle: { color: '#A5A0B8', fontSize: 14, marginTop: 6, lineHeight: 20 },
  row: { flexDirection: 'row', gap: 10, marginTop: 16 },
  primaryButton: { backgroundColor: '#7C3AED', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, minWidth: 116, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '900' },
  secondaryButton: { backgroundColor: '#241C36', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16 },
  secondaryText: { color: '#DDD6FE', fontWeight: '900' },
  success: { color: '#4ADE80', marginTop: 12, fontWeight: '700' },
  error: { color: '#FB7185', marginTop: 12, fontWeight: '700' },
});
