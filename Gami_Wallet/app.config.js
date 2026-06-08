/**
 * Expo App Configuration
 * Dynamic configuration with environment variable support
 */

export default ({ config }) => {
  // Environment detection.
  // EAS build profiles (eas.json) inject EXPO_PUBLIC_APP_ENV / APP_ENV, so read
  // those first; EXPO_PUBLIC_ENV is kept as a legacy fallback for local runs.
  const ENV =
    process.env.EXPO_PUBLIC_APP_ENV ||
    process.env.APP_ENV ||
    process.env.EAS_BUILD_PROFILE ||
    process.env.EXPO_PUBLIC_ENV ||
    'development';
  const IS_PRODUCTION = ENV === 'production';
  const IS_TESTNET = ['testnet', 'staging', 'testflight', 'preview'].includes(ENV);

  // TestFlight distributes the production App Store record, so a `testflight`
  // build shares the production app identity (display name + bundle id /
  // package). Only its runtime env (API URLs, EAS channel) differs — that is
  // driven separately by eas.json. Other non-prod envs stay suffixed so they
  // can be installed side-by-side.
  const USES_PROD_IDENTITY = IS_PRODUCTION || ENV === 'testflight';
  const APP_ID = 'com.gamiprotocol.wallet';

  return {
    ...config,
    name: USES_PROD_IDENTITY ? 'Gami Wallet' : `Gami Wallet (${ENV})`,
    slug: 'gami-universal-wallet',
    scheme: 'gamiwallet',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0E0E12',
    },
    ios: {
      ...config.ios,
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      bundleIdentifier: USES_PROD_IDENTITY ? APP_ID : `${APP_ID}.${ENV}`,
      associatedDomains: [
        'applinks:app.gamiprotocol.com',
        ...(IS_TESTNET ? ['applinks:testnet.gamiprotocol.com'] : []),
      ],
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#0E0E12',
      },
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.MODIFY_AUDIO_SETTINGS',
      ],
      package: USES_PROD_IDENTITY ? APP_ID : `${APP_ID}.${ENV}`,
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'gamiwallet',
              host: 'oauth',
              pathPrefix: '/discord',
            },
            {
              scheme: 'gamiwallet',
              host: 'oauth',
              pathPrefix: '/twitter',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    plugins: [
      [
        'expo-router',
        {
          root: 'src',
          sitemap: false,
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#0E0E12',
        },
      ],
      'expo-audio',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
      'expo-video',
      'expo-secure-store',
      'expo-web-browser',
      'expo-font',
      'expo-asset',
    ],
    web: {
      bundler: 'metro',
      favicon: './assets/images/favicon.png',
    },
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
        sitemap: false,
      },
      eas: {
        projectId: '65e1fbf7-27fd-499a-a805-b3e69d348f48',
      },
      // Environment configuration
      ENV,
      IS_PRODUCTION,
      IS_TESTNET,
      
      // Privy Authentication
      PRIVY_APP_ID: process.env.EXPO_PUBLIC_PRIVY_APP_ID,
      
      // API Configuration
      API_URL: process.env.EXPO_PUBLIC_API_URL || (
        IS_PRODUCTION
          ? 'https://api.gamiprotocol.io'
          : IS_TESTNET
          ? 'https://testnet-api.gamiprotocol.io'
          : 'http://localhost:4000'
      ),
      
      // Blockchain Configuration
      RPC_URL: process.env.EXPO_PUBLIC_RPC_URL || (
        IS_PRODUCTION
          ? 'https://rpc.gamiprotocol.io'
          : IS_TESTNET
          ? 'https://testnet-rpc.gamiprotocol.io'
          : 'http://localhost:8545'
      ),
      
      // Feature Flags
      ENABLE_BRIDGE: process.env.EXPO_PUBLIC_ENABLE_BRIDGE !== 'false',
      ENABLE_STAKING: process.env.EXPO_PUBLIC_ENABLE_STAKING === 'true',
      ENABLE_AGENTS: process.env.EXPO_PUBLIC_ENABLE_AGENTS !== 'false',
      
      // Monitoring
      SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/65e1fbf7-27fd-499a-a805-b3e69d348f48',
    },
    owner: 'gami-protocols-organization',
  };
};
