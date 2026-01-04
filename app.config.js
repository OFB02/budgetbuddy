export default {
  name: 'budgetbuddy',
  slug: 'budgetbuddy',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/logo.PNG',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/logo.PNG',
    resizeMode: 'contain',
    backgroundColor: '#1a1a2e',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.budgetbuddy.budgetapp',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/logo.PNG',
      backgroundColor: '#1a1a2e',
    },
    package: 'com.budgetbuddy.budgetapp',
    edgeToEdgeEnabled: true,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'react-native-google-mobile-ads',
      {
        // Android AdMob App ID (Google test ID - replace after launch)
        androidAppId: 'ca-app-pub-3940256099942544~3347511713',
        // iOS AdMob App ID (Google test ID - replace after launch)
        iosAppId: 'ca-app-pub-3940256099942544~1458002511',
        // Optional: Set to true during development to use test ads
        userTrackingPermission: 'This identifier will be used to deliver personalized ads to you.',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: '9b4ee123-4065-4a88-bde8-04951a2fbc32',
    },
    // RevenueCat API Keys
    revenuecat: {
      iosApiKey: process.env.REVENUECAT_IOS_KEY || 'sk_CkwyxlEtXHtNSBdPPrzsWwBDKcMQu',
      androidApiKey: process.env.REVENUECAT_ANDROID_KEY || 'YOUR_ANDROID_API_KEY_HERE',
    },
    // AdMob Configuration (Google test IDs - replace after launch)
    admob: {
      useTestAds: true, // Set to false after adding real AdMob IDs
      ios: {
        appId: process.env.ADMOB_IOS_APP_ID || 'ca-app-pub-3940256099942544~1458002511',
        bannerId: 'ca-app-pub-3940256099942544/2934735716',
        interstitialId: 'ca-app-pub-3940256099942544/4411468910',
        rewardedAdUnitId: process.env.ADMOB_IOS_REWARDED_ID || 'ca-app-pub-3940256099942544/1712485313',
      },
      android: {
        appId: process.env.ADMOB_ANDROID_APP_ID || 'ca-app-pub-3940256099942544~3347511713',
        bannerId: 'ca-app-pub-3940256099942544/6300978111',
        interstitialId: 'ca-app-pub-3940256099942544/1033173712',
        rewardedAdUnitId: process.env.ADMOB_ANDROID_REWARDED_ID || 'ca-app-pub-3940256099942544/5224354917',
      },
    },
  },
};
