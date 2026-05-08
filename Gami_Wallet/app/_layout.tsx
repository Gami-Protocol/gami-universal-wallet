import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Home, Trophy, Gift, Wallet, User } from 'lucide-react-native';
import { GamiTheme } from '../src/theme/gamiTheme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: GamiTheme.colors.surface,
            borderTopColor: GamiTheme.colors.border,
            height: 86,
            paddingTop: 8,
            paddingBottom: 18,
          },
          tabBarActiveTintColor: GamiTheme.colors.primary,
          tabBarInactiveTintColor: GamiTheme.colors.muted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
          },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
        <Tabs.Screen name="quests" options={{ title: 'Quests', tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} /> }} />
        <Tabs.Screen name="rewards" options={{ title: 'Rewards', tabBarIcon: ({ color, size }) => <Gift color={color} size={size} /> }} />
        <Tabs.Screen name="wallet" options={{ title: 'Wallet', tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} /> }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
      </Tabs>
    </>
  );
}
