import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  ViewToken,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingSlide } from './OnboardingSlide';
import { onboardingData } from './onboardingData';

const { width } = Dimensions.get('window');
const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

const BG    = '#0E0E12';
const CARD  = '#1C1C26';
const PURPLE = '#6E3CFB';
const PURPLE_LIGHT = '#9C6CFF';

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const complete = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    router.replace('/auth/signup');
  }, [router]);

  const handleNext = useCallback(() => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      complete();
    }
  }, [currentIndex, complete]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const isLast = currentIndex === onboardingData.length - 1;
  const currentSlide = onboardingData[currentIndex];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* Terminal header bar */}
      <View style={styles.termBar}>
        <Text style={styles.termBarLabel}>▸ gami://onboard/{currentSlide.step}</Text>
        <View style={styles.termBarDots}>
          {['#FF4FA8', '#FFB23F', '#3FE0A0'].map((c, i) => (
            <View key={i} style={[styles.termDot, { backgroundColor: c }]} />
          ))}
        </View>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => <OnboardingSlide data={item} />}
        style={styles.flatList}
      />

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Step dots */}
        <View style={styles.dotsRow}>
          {onboardingData.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => flatListRef.current?.scrollToIndex({ index: i, animated: true })}
              style={[
                styles.dot,
                i === currentIndex && { width: 22, backgroundColor: currentSlide.accentColor },
              ]}
            />
          ))}
        </View>

        {/* Nav buttons */}
        <View style={styles.btnRow}>
          {/* Skip */}
          {!isLast && (
            <TouchableOpacity onPress={complete} style={styles.skipBtn}>
              <Text style={styles.skipText}>$ skip --remind-later</Text>
            </TouchableOpacity>
          )}

          {/* Next / Get started */}
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.nextBtn, { backgroundColor: isLast ? currentSlide.accentColor : PURPLE }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.nextText, isLast && { color: '#000' }]}>
              {isLast ? './GET_STARTED →' : 'NEXT ▸'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Auth options on last slide */}
        {isLast && (
          <View style={styles.authRow}>
            {[
              { label: './oauth --google', icon: '🌐' },
              { label: './oauth --apple',  icon: '🍎' },
              { label: './import --seed',  icon: '🔑' },
            ].map((opt, i) => (
              <TouchableOpacity key={i} onPress={complete} style={styles.authOption}>
                <Text style={styles.authOptionText}>{opt.icon}  {opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  termBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#16161D',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(110,60,251,0.5)',
  },
  termBarLabel: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 10,
    color: PURPLE_LIGHT,
    letterSpacing: 1,
  },
  termBarDots: {
    flexDirection: 'row',
    gap: 5,
  },
  termDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    marginLeft: 4,
  },
  flatList: {
    flex: 1,
  },
  controls: {
    backgroundColor: BG,
    borderTopWidth: 2,
    borderTopColor: '#000',
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 16,
    gap: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  skipBtn: {
    flex: 1,
    paddingVertical: 10,
  },
  skipText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.38)',
    letterSpacing: 0.5,
  },
  nextBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderWidth: 2.5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  nextText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 13,
    letterSpacing: 1.5,
    color: '#fff',
    textTransform: 'uppercase',
  },
  authRow: {
    gap: 8,
  },
  authOption: {
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  authOptionText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
  },
});
