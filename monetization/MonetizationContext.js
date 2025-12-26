import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  EXPORT_CREDITS: '@budgetbuddy_export_credits',
  IS_PREMIUM: '@budgetbuddy_is_premium',
};

// Initial credits for new users
const INITIAL_CREDITS = 3;

// Create the context
const MonetizationContext = createContext();

/**
 * MonetizationProvider Component
 * Manages user credits, premium status, and export functionality
 */
export const MonetizationProvider = ({ children }) => {
  const [exportCredits, setExportCredits] = useState(INITIAL_CREDITS);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingExportCallback, setPendingExportCallback] = useState(null);

  /**
   * Load user data from AsyncStorage on mount
   */
  useEffect(() => {
    loadUserData();
  }, []);

  /**
   * Load credits and premium status from storage
   */
  const loadUserData = async () => {
    try {
      const [credits, premium] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.EXPORT_CREDITS),
        AsyncStorage.getItem(STORAGE_KEYS.IS_PREMIUM),
      ]);

      // Set credits (default to INITIAL_CREDITS if not found)
      if (credits !== null) {
        setExportCredits(parseInt(credits, 10));
      } else {
        // First time user - set initial credits
        await AsyncStorage.setItem(STORAGE_KEYS.EXPORT_CREDITS, INITIAL_CREDITS.toString());
        setExportCredits(INITIAL_CREDITS);
      }

      // Set premium status
      if (premium !== null) {
        setIsPremium(premium === 'true');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
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
   * Save premium status to AsyncStorage
   */
  const savePremiumStatus = async (status) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, status.toString());
      setIsPremium(status);
    } catch (error) {
      console.error('Error saving premium status:', error);
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
      console.log('Premium user - allowing export');
      if (exportCallback) exportCallback();
      return true;
    }

    // Check 2: User has available credits
    if (exportCredits > 0) {
      console.log(`User has ${exportCredits} credits - allowing export`);
      const newCredits = exportCredits - 1;
      await saveCredits(newCredits);
      if (exportCallback) exportCallback();
      return true;
    }

    // Check 3: No credits available - show paywall
    console.log('No credits available - showing paywall');
    setPendingExportCallback(() => exportCallback);
    setShowPaywall(true);
    return false;
  };

  /**
   * Mock subscription purchase
   * Simulates a subscription purchase with a delay
   */
  const mockPurchaseSubscription = async () => {
    return new Promise((resolve) => {
      console.log('Processing subscription purchase...');
      
      // Simulate API call delay (2 seconds)
      setTimeout(async () => {
        await savePremiumStatus(true);
        setShowPaywall(false);
        console.log('Subscription activated! User is now Premium.');
        
        // Execute pending export if exists
        if (pendingExportCallback) {
          pendingExportCallback();
          setPendingExportCallback(null);
        }
        
        resolve(true);
      }, 2000);
    });
  };

  /**
   * Mock rewarded ad viewing
   * Simulates watching a 5-second video ad and grants 1 credit
   */
  const mockShowRewardedAd = async () => {
    return new Promise((resolve) => {
      console.log('Loading rewarded ad...');
      
      // Simulate 5-second video ad
      setTimeout(async () => {
        console.log('Ad completed! Granting 1 export credit.');
        const newCredits = exportCredits + 1;
        await saveCredits(newCredits);
        setShowPaywall(false);
        
        // Automatically trigger the pending export
        if (pendingExportCallback) {
          pendingExportCallback();
          setPendingExportCallback(null);
        }
        
        resolve(true);
      }, 5000);
    });
  };

  /**
   * Close paywall without action
   */
  const closePaywall = () => {
    setShowPaywall(false);
    setPendingExportCallback(null);
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
    await savePremiumStatus(false);
    await saveCredits(INITIAL_CREDITS);
  };

  const value = {
    // State
    exportCredits,
    isPremium,
    isLoading,
    showPaywall,
    
    // Actions
    handleExport,
    mockPurchaseSubscription,
    mockShowRewardedAd,
    closePaywall,
    addCredits,
    resetToFreeTier,
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
