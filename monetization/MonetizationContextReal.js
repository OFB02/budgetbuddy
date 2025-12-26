import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// Storage keys
const STORAGE_KEYS = {
  EXPORT_CREDITS: '@budgetbuddy_export_credits',
  IS_PREMIUM: '@budgetbuddy_is_premium',
};

// Initial credits for new users
const INITIAL_CREDITS = 3;

// RevenueCat API Keys - Replace with your actual keys
const REVENUECAT_CONFIG = {
  ios: 'YOUR_IOS_API_KEY_HERE', // Replace with actual iOS API key
  android: 'YOUR_ANDROID_API_KEY_HERE', // Replace with actual Android API key
};

// Product/Entitlement identifiers
const ENTITLEMENT_ID = 'premium';
const PRODUCT_ID = 'budgetbuddy_premium_monthly';

// Create the context
const MonetizationContext = createContext();

/**
 * MonetizationProvider Component
 * Manages user credits, premium status, and export functionality with RevenueCat
 */
export const MonetizationProvider = ({ children }) => {
  const [exportCredits, setExportCredits] = useState(INITIAL_CREDITS);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingExportCallback, setPendingExportCallback] = useState(null);
  const [purchaseError, setPurchaseError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Initialize RevenueCat on mount
   */
  useEffect(() => {
    initializeRevenueCat();
  }, []);

  /**
   * Initialize RevenueCat SDK
   */
  const initializeRevenueCat = async () => {
    try {
      // Configure SDK with appropriate API key
      const apiKey = Platform.OS === 'ios' 
        ? REVENUECAT_CONFIG.ios 
        : REVENUECAT_CONFIG.android;

      // Enable debug logging in development
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Configure Purchases with API key
      await Purchases.configure({ apiKey });

      console.log('✅ RevenueCat initialized successfully');

      // Load user data
      await loadUserData();

      // Check subscription status
      await checkSubscriptionStatus();

      // Listen for purchase updates
      Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdate);
    } catch (error) {
      console.error('❌ Error initializing RevenueCat:', error);
      // Fallback to loading from AsyncStorage only
      await loadUserData();
      setIsLoading(false);
    }
  };

  /**
   * Handle customer info updates from RevenueCat
   */
  const handleCustomerInfoUpdate = async (customerInfo) => {
    console.log('📱 Customer info updated:', customerInfo);
    await updatePremiumStatus(customerInfo);
  };

  /**
   * Check current subscription status with RevenueCat
   */
  const checkSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      await updatePremiumStatus(customerInfo);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      // Fallback to AsyncStorage
      const storedPremium = await AsyncStorage.getItem(STORAGE_KEYS.IS_PREMIUM);
      if (storedPremium !== null) {
        setIsPremium(storedPremium === 'true');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update premium status based on RevenueCat customer info
   */
  const updatePremiumStatus = async (customerInfo) => {
    const hasPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    
    console.log(`Premium status: ${hasPremium ? '⭐ Active' : '❌ Inactive'}`);
    
    setIsPremium(hasPremium);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, hasPremium.toString());
  };

  /**
   * Load credits from AsyncStorage
   */
  const loadUserData = async () => {
    try {
      const credits = await AsyncStorage.getItem(STORAGE_KEYS.EXPORT_CREDITS);

      // Set credits (default to INITIAL_CREDITS if not found)
      if (credits !== null) {
        setExportCredits(parseInt(credits, 10));
      } else {
        // First time user - set initial credits
        await AsyncStorage.setItem(STORAGE_KEYS.EXPORT_CREDITS, INITIAL_CREDITS.toString());
        setExportCredits(INITIAL_CREDITS);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  /**
   * Save export credits to AsyncStorage
   */
  const saveCredits = async (credits) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPORT_CREDITS, credits.toString());
      setExportCredits(credits);
    } catch (error) {
      console.error('Error saving credits:', error);
    }
  };

  /**
   * Main export handler
   * @param {Function} exportCallback - Function to execute when export is allowed
   * @returns {Promise<boolean>} - Returns true if export is allowed, false otherwise
   */
  const handleExport = async (exportCallback) => {
    // Check 1: Premium user has unlimited exports
    if (isPremium) {
      console.log('⭐ Premium user - allowing export');
      if (exportCallback) exportCallback();
      return true;
    }

    // Check 2: User has available credits
    if (exportCredits > 0) {
      console.log(`🎟️ User has ${exportCredits} credits - allowing export`);
      const newCredits = exportCredits - 1;
      await saveCredits(newCredits);
      if (exportCallback) exportCallback();
      return true;
    }

    // Check 3: No credits available - show paywall
    console.log('❌ No credits available - showing paywall');
    setPendingExportCallback(() => exportCallback);
    setShowPaywall(true);
    return false;
  };

  /**
   * Purchase subscription using RevenueCat
   */
  const purchaseSubscription = async () => {
    setIsProcessing(true);
    setPurchaseError(null);

    try {
      console.log('🛒 Starting subscription purchase...');

      // Get available packages
      const offerings = await Purchases.getOfferings();
      
      if (offerings.current === null || offerings.current.availablePackages.length === 0) {
        throw new Error('No subscription packages available');
      }

      // Get the monthly package (or first available)
      const packageToPurchase = offerings.current.monthly || offerings.current.availablePackages[0];

      console.log(`📦 Purchasing package: ${packageToPurchase.identifier}`);

      // Make the purchase
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);

      // Check if user is now premium
      await updatePremiumStatus(customerInfo);

      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        console.log('✅ Subscription activated successfully!');
        setShowPaywall(false);
        
        // Execute pending export if exists
        if (pendingExportCallback) {
          pendingExportCallback();
          setPendingExportCallback(null);
        }

        setIsProcessing(false);
        return { success: true };
      } else {
        throw new Error('Subscription not activated');
      }
    } catch (error) {
      console.error('❌ Purchase error:', error);
      
      // Handle specific error cases
      let errorMessage = 'Purchase failed. Please try again.';
      
      if (error.code === 'USER_CANCELLED') {
        errorMessage = 'Purchase cancelled';
        console.log('User cancelled the purchase');
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'PRODUCT_NOT_AVAILABLE') {
        errorMessage = 'Product not available. Please try again later.';
      }

      setPurchaseError(errorMessage);
      setIsProcessing(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Restore previous purchases
   */
  const restorePurchases = async () => {
    setIsProcessing(true);
    setPurchaseError(null);

    try {
      console.log('🔄 Restoring purchases...');
      
      const customerInfo = await Purchases.restorePurchases();
      await updatePremiumStatus(customerInfo);

      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        console.log('✅ Purchases restored successfully!');
        setShowPaywall(false);
        setIsProcessing(false);
        return { success: true, message: 'Subscription restored!' };
      } else {
        setIsProcessing(false);
        return { success: false, message: 'No active subscriptions found' };
      }
    } catch (error) {
      console.error('❌ Restore error:', error);
      setPurchaseError('Failed to restore purchases');
      setIsProcessing(false);
      return { success: false, error: 'Failed to restore purchases' };
    }
  };

  /**
   * Add credits after watching rewarded ad
   * This should be called after ad completion
   */
  const awardAdCredit = async () => {
    try {
      console.log('🎁 Awarding 1 credit for ad completion');
      const newCredits = exportCredits + 1;
      await saveCredits(newCredits);
      setShowPaywall(false);
      
      // Automatically trigger the pending export
      if (pendingExportCallback) {
        pendingExportCallback();
        setPendingExportCallback(null);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error awarding ad credit:', error);
      return { success: false };
    }
  };

  /**
   * Close paywall without action
   */
  const closePaywall = () => {
    setShowPaywall(false);
    setPendingExportCallback(null);
    setPurchaseError(null);
  };

  /**
   * Add credits manually (for testing or promotions)
   */
  const addCredits = async (amount) => {
    const newCredits = exportCredits + amount;
    await saveCredits(newCredits);
  };

  /**
   * Reset to free tier (for testing)
   */
  const resetToFreeTier = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, 'false');
    await saveCredits(INITIAL_CREDITS);
    setIsPremium(false);
  };

  /**
   * Get current offering details
   */
  const getOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return null;
    }
  };

  const value = {
    // State
    exportCredits,
    isPremium,
    isLoading,
    showPaywall,
    purchaseError,
    isProcessing,
    
    // Actions
    handleExport,
    purchaseSubscription,
    restorePurchases,
    awardAdCredit,
    closePaywall,
    addCredits,
    resetToFreeTier,
    getOfferings,
    
    // For backward compatibility with mock functions
    mockPurchaseSubscription: purchaseSubscription,
    mockShowRewardedAd: awardAdCredit,
  };

  return (
    <MonetizationContext.Provider value={value}>
      {children}
    </MonetizationContext.Provider>
  );
};

/**
 * Custom hook to use monetization context
 */
export const useMonetization = () => {
  const context = useContext(MonetizationContext);
  if (!context) {
    throw new Error('useMonetization must be used within a MonetizationProvider');
  }
  return context;
};

export default MonetizationContext;
