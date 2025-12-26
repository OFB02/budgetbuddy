import { Platform } from 'react-native';
import { 
  RewardedAd, 
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

/**
 * AdMob Service for Rewarded Video Ads
 * Handles loading and showing rewarded ads for earning export credits
 */

// Ad Unit IDs - Replace with your actual ad unit IDs from AdMob
const AD_UNIT_IDS = {
  ios: {
    production: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // Replace with real iOS ad unit ID
    test: TestIds.REWARDED,
  },
  android: {
    production: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // Replace with real Android ad unit ID
    test: TestIds.REWARDED,
  },
};

// Use test ads in development
const USE_TEST_ADS = __DEV__;

class AdMobService {
  constructor() {
    this.rewardedAd = null;
    this.isLoading = false;
    this.isShowing = false;
    this.listeners = [];
  }

  /**
   * Get the appropriate ad unit ID based on platform and environment
   */
  getAdUnitId() {
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';
    return USE_TEST_ADS 
      ? AD_UNIT_IDS[platform].test 
      : AD_UNIT_IDS[platform].production;
  }

  /**
   * Initialize and load a rewarded ad
   */
  async loadRewardedAd() {
    if (this.isLoading || this.rewardedAd?.loaded) {
      console.log('Ad already loading or loaded');
      return;
    }

    try {
      this.isLoading = true;
      const adUnitId = this.getAdUnitId();
      
      console.log(`📺 Loading rewarded ad: ${adUnitId}`);

      // Create rewarded ad instance
      this.rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false,
      });

      // Set up event listeners
      this.setupAdListeners();

      // Start loading the ad
      this.rewardedAd.load();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.isLoading = false;
          reject(new Error('Ad loading timeout'));
        }, 30000); // 30 second timeout

        this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
          clearTimeout(timeout);
          this.isLoading = false;
          console.log('✅ Rewarded ad loaded successfully');
          resolve(true);
        });

        this.rewardedAd.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
          clearTimeout(timeout);
          this.isLoading = false;
          console.error('❌ Error loading rewarded ad:', error);
          reject(error);
        });
      });
    } catch (error) {
      this.isLoading = false;
      console.error('❌ Failed to load rewarded ad:', error);
      throw error;
    }
  }

  /**
   * Set up ad event listeners
   */
  setupAdListeners() {
    if (!this.rewardedAd) return;

    // Ad earned reward
    this.rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('🎉 User earned reward:', reward);
        this.notifyListeners('earned', reward);
      }
    );

    // Ad shown
    this.rewardedAd.addAdEventListener(
      RewardedAdEventType.OPENED,
      () => {
        console.log('📺 Rewarded ad opened');
        this.isShowing = true;
        this.notifyListeners('opened');
      }
    );

    // Ad closed
    this.rewardedAd.addAdEventListener(
      RewardedAdEventType.CLOSED,
      () => {
        console.log('📺 Rewarded ad closed');
        this.isShowing = false;
        this.notifyListeners('closed');
        // Preload next ad
        this.loadRewardedAd().catch(console.error);
      }
    );
  }

  /**
   * Show the rewarded ad
   */
  async showRewardedAd() {
    try {
      // If no ad is loaded, try to load one first
      if (!this.rewardedAd?.loaded) {
        console.log('No ad loaded, loading now...');
        await this.loadRewardedAd();
      }

      // Check if ad is ready
      if (!this.rewardedAd?.loaded) {
        throw new Error('Ad not ready to show');
      }

      console.log('📺 Showing rewarded ad...');
      await this.rewardedAd.show();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error showing rewarded ad:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to show ad' 
      };
    }
  }

  /**
   * Check if an ad is ready to show
   */
  isAdReady() {
    return this.rewardedAd?.loaded === true;
  }

  /**
   * Add listener for ad events
   */
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of ad events
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      callback(event, data);
    });
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.rewardedAd) {
      this.rewardedAd = null;
    }
    this.listeners = [];
    this.isLoading = false;
    this.isShowing = false;
  }
}

// Create singleton instance
const adMobService = new AdMobService();

// Preload first ad
if (!__DEV__ || USE_TEST_ADS) {
  adMobService.loadRewardedAd().catch(error => {
    console.warn('Failed to preload ad:', error);
  });
}

export default adMobService;

/**
 * Hook for using AdMob in React components
 */
export const useRewardedAd = () => {
  const [isAdReady, setIsAdReady] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Check ad status
    const checkAdStatus = () => {
      setIsAdReady(adMobService.isAdReady());
      setIsLoading(adMobService.isLoading);
    };

    // Set up listener for ad events
    const unsubscribe = adMobService.addListener((event) => {
      if (event === 'loaded' || event === 'closed') {
        checkAdStatus();
      }
    });

    // Initial check
    checkAdStatus();

    // Check periodically
    const interval = setInterval(checkAdStatus, 1000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return {
    isAdReady,
    isLoading,
    showAd: () => adMobService.showRewardedAd(),
    loadAd: () => adMobService.loadRewardedAd(),
  };
};
