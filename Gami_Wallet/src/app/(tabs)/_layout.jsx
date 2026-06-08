import React from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import {
  Home,
  ListChecks,
  User,
  Sparkles,
  Wallet2,
} from "lucide-react-native";

function IconWithGlow({ focused, children }) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        borderRadius: 14,
        backgroundColor: focused ? "#1A1A24" : "transparent",
        shadowColor: focused ? "#B026FF" : "transparent",
        shadowOpacity: focused ? 0.6 : 0,
        shadowRadius: focused ? 10 : 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: focused ? 10 : 0,
      }}
    >
      {children}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0F0F13",
          borderTopWidth: 1,
          borderTopColor: "#2A2A35",
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconWithGlow focused={focused}>
              <Home size={24} color={color} />
            </IconWithGlow>
          ),
        }}
      />
      <Tabs.Screen
        name="airdrop"
        options={{
          title: "Airdrop",
          tabBarIcon: ({ color, focused }) => (
            <IconWithGlow focused={focused}>
              <Sparkles size={24} color={color} />
            </IconWithGlow>
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <IconWithGlow focused={focused}>
              <Wallet2 size={24} color={color} />
            </IconWithGlow>
          ),
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: "Quests",
          tabBarIcon: ({ color, focused }) => (
            <IconWithGlow focused={focused}>
              <ListChecks size={24} color={color} />
            </IconWithGlow>
          ),
        }}
      />
      <Tabs.Screen
        name="identity"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <IconWithGlow focused={focused}>
              <User size={24} color={color} />
            </IconWithGlow>
          ),
        }}
      />
      {/* Hidden dynamic routes if needed later */}
      <Tabs.Screen name="item/[id]" options={{ href: null }} />
    </Tabs>
  );
}
