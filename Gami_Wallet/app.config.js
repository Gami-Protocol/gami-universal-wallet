/**
 * Expo App Configuration
 * Dynamic configuration with environment variable support
 */

export default ({ config }) => {
  // Environment detection
  const ENV = process.env.EXPO_PUBLIC_ENV || 'development';
  const IS_PRODUCTION = ENV === 'production';
  const IS_TESTNET = ENV === 'testnet' || ENV === 'staging';

  return {
    ...config,
    name: IS_PRODUCTION ? 'Gami Wallet' : `Gami Wallet (${ENV})`,
    slug: 'gami-wallet',
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
      bundleIdentifier: IS_PRODUCTION 
        ? 'com.gamiprotocol.wallet'
        : `com.gamiprotocol.wallet.${ENV}`,
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
      package: IS_PRODUCTION
        ? 'com.gamiprotocol.wallet'
        : `com.gamiprotocol.wallet.${ENV}`,
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
    owner: 'gami-protocols-organization',
  };
};
