import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import {
  GAMI,
  FONTS,
  GlowBlob,
  BrutalBox,
  BrutalButton,
  Title,
  Label,
  Body,
  ChevronLeftIcon,
  QrIcon,
  CopyIcon,
  CheckIcon,
} from '@/ui';
import { useWallet } from '@/features/wallet/localWallet';

export default function ReceiveScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { address } = useWallet();
  const [copied, setCopied] = useState(false);

  const addr = address ?? '0x0000000000000000000000000000000000000000';

  const copy = async () => {
    await Clipboard.setStringAsync(addr).catch(() => {});
    Haptics.selectionAsync().catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const share = () => Share.share({ message: addr }).catch(() => {});

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GlowBlob color={GAMI.success} size={300} top={-90} right={-70} opacity={0.3} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <ChevronLeftIcon size={16} color="#fff" />
        </Pressable>
        <Title>Receive</Title>
        <View style={{ width: 32 }} />
      </View>

      <View style={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        <Body style={{ textAlign: 'center' }}>Share your address to receive tokens on Gami L2, Base or Polygon.</Body>

        {/* QR placeholder tile */}
        <BrutalBox offset={6} borderWidth={3} background="#fff" style={styles.qrTile}>
          <QrIcon size={120} color="#000" />
        </BrutalBox>

        {/* Address */}
        <View style={{ width: '100%', gap: 8 }}>
          <Label>YOUR ADDRESS</Label>
          <BrutalBox fill offset={4} background={GAMI.bgElev} style={styles.addrCard}>
            <Text style={styles.addr} selectable>{addr}</Text>
          </BrutalBox>
        </View>

        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <BrutalButton
              label={copied ? 'COPIED' : 'COPY'}
              variant={copied ? 'success' : 'primary'}
              onPress={copy}
              icon={copied ? <CheckIcon size={18} color="#000" /> : <CopyIcon size={18} color="#fff" />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <BrutalButton label="SHARE" variant="ghost" onPress={share} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAMI.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: GAMI.borderStrong, backgroundColor: GAMI.bgElev },
  body: { flex: 1, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', gap: 26 },
  qrTile: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center' },
  addrCard: { padding: 16 },
  addr: { fontFamily: FONTS.mono, fontSize: 13, color: '#fff', lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 12, width: '100%' },
});
