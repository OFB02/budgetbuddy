export default {
  name: 'budgetbuddy',
  slug: 'budgetbuddy',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/logo.jpg',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/logo.jpg',
    resizeMode: 'contain',
    backgroundColor: '#1a1a2e',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourname.budgetbuddy', // CHANGE THIS to your bundle ID
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/logo.jpg',
      backgroundColor: '#1a1a2e',
    },
    package: 'com.yourname.budgetbuddy', // CHANGE THIS to your package name
    edgeToEdgeEnabled: true,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'react-native-google-mobile-ads',
      {
        // Android AdMob App ID (replace with yours from AdMob console)
        androidAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
        // iOS AdMob App ID (replace with yours from AdMob console)
        iosAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
        // Optional: Set to true during development to use test ads
        userTrackingPermission: 'This identifier will be used to deliver personalized ads to you.',
      },
    ],
  ],
  extra: {
    // RevenueCat API Keys
    revenuecat: {
      iosApiKey: process.env.REVENUECAT_IOS_KEY || 'YOUR_IOS_API_KEY_HERE',
      androidApiKey: process.env.REVENUECAT_ANDROID_KEY || 'YOUR_ANDROID_API_KEY_HERE',
    },
    // AdMob Configuration
    admob: {
      useTestAds: process.env.NODE_ENV === 'development',
      ios: {
        appId: process.env.ADMOB_IOS_APP_ID || 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
        rewardedAdUnitId: process.env.ADMOB_IOS_REWARDED_ID || 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      },
      android: {
        appId: process.env.ADMOB_ANDROID_APP_ID || 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
        rewardedAdUnitId: process.env.ADMOB_ANDROID_REWARDED_ID || 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      },
    },
  },
};
