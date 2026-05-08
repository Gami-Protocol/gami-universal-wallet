import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_COMPLETED_KEY = "@onboarding_completed";
const MINIMUM_SPLASH_TIME = 2000; // 2 seconds minimum

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Parallel animations for logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Check onboarding status and navigate
    const checkOnboardingAndNavigate = async () => {
      const startTime = Date.now();
      
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          ONBOARDING_COMPLETED_KEY
        );
        
        // Ensure minimum splash time
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MINIMUM_SPLASH_TIME - elapsedTime);
        
        setTimeout(() => {
          setIsReady(true);
          if (hasCompletedOnboarding === "true") {
            router.replace("/(tabs)/home");
          } else {
            router.replace("/onboarding");
          }
        }, remainingTime);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // Default to onboarding on error
        setTimeout(() => {
          setIsReady(true);
          router.replace("/onboarding");
        }, MINIMUM_SPLASH_TIME);
      }
    };

    checkOnboardingAndNavigate();
  }, [router, fadeAnim, scaleAnim]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0F0F13",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar style="light" />
      
      {/* Glow behind logo (soft aura) */}
      <Animated.View
        style={{
          opacity: fadeAnim,
        }}
      >
        <LinearGradient
          colors={["#B026FF55", "#00F0FF33", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: 160,
            opacity: 0.8,
          }}
        />
      </Animated.View>

      {/* Logo / Hero image with animations */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Image
          source={{
            uri: "https://ucarecdn.com/60afe17e-96de-412e-b2be-fb767cd2b684/-/format/auto/",
          }}
          style={{
            width: 160,
            height: 160,
            borderRadius: 32,
            overflow: "hidden",
          }}
          contentFit="cover"
          transition={250}
        />
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            marginTop: 20,
            color: "white",
            fontSize: 28,
            fontFamily: "Inter_700Bold",
            letterSpacing: 0.5,
          }}
        >
          Gami
        </Text>
        <Text
          style={{
            marginTop: 6,
            color: "#9CA3AF",
            fontSize: 14,
            fontFamily: "Inter_400Regular",
          }}
        >
          Universal Wallet
        </Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View
        style={{
          marginTop: 40,
          opacity: fadeAnim,
        }}
      >
        <ActivityIndicator size="small" color="#B026FF" />
      </Animated.View>
    </View>
  );
}
