import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMonetization } from './MonetizationContextReal';
import adMobService from './AdMobService';

/**
 * PaywallModal Component (Real Integration)
 * Shows when user has no export credits
 * Options: Subscribe or Watch Rewarded Ad
 */
export default function PaywallModalReal() {
  const {
    showPaywall,
    closePaywall,
    exportCredits,
    purchaseSubscription,
    awardAdCredit,
    isProcessing,
    purchaseError,
    restorePurchases,
  } = useMonetization();

  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [adError, setAdError] = useState(null);
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);

  // Preload ad when paywall opens
  useEffect(() => {
    if (showPaywall && !adMobService.isAdReady()) {
      loadAd();
    }
  }, [showPaywall]);

  const loadAd = async () => {
    setIsLoadingAd(true);
    setAdError(null);
    
    try {
      await adMobService.loadRewardedAd();
      setIsLoadingAd(false);
    } catch (error) {
      console.error('Error loading ad:', error);
      setAdError('Failed to load ad. Please try again.');
      setIsLoadingAd(false);
    }
  };

  const handleWatchAd = async () => {
    setAdError(null);

    // Check if ad is ready
    if (!adMobService.isAdReady()) {
      setAdError('Ad not ready. Loading...');
      await loadAd();
      return;
    }

    // Show the ad
    const result = await adMobService.showRewardedAd();

    if (result.success) {
      // Set up listener for when user completes the ad
      const unsubscribe = adMobService.addListener(async (event, data) => {
        if (event === 'earned') {
          console.log('🎁 User earned reward, awarding credit');
          await awardAdCredit();
          unsubscribe();
        }
      });
    } else {
      setAdError(result.error || 'Failed to show ad');
    }
  };

  const handleSubscribe = async () => {
    const result = await purchaseSubscription();
    
    if (!result.success && result.error) {
      if (result.error !== 'Purchase cancelled') {
        Alert.alert('Purchase Failed', result.error);
      }
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoringPurchases(true);
    const result = await restorePurchases();
    setIsRestoringPurchases(false);

    if (result.success) {
      Alert.alert('Success', result.message || 'Subscription restored!');
    } else {
      Alert.alert(
        'No Subscription Found',
        result.message || 'No active subscriptions found. You may need to purchase first.'
      );
    }
  };

  if (!showPaywall) return null;

  return (
    <Modal
      visible={showPaywall}
      transparent
      animationType="fade"
      onRequestClose={closePaywall}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closePaywall}>
            <MaterialCommunityIcons name="close" size={24} color="#94a3b8" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="file-export" size={40} color="#3b82f6" />
            </View>
            <Text style={styles.title}>Out of Export Credits</Text>
            <Text style={styles.subtitle}>
              You've used all your free exports. Choose an option below:
            </Text>
          </View>

          {/* Credits Display */}
          <View style={styles.creditsCard}>
            <MaterialCommunityIcons name="ticket" size={24} color="#94a3b8" />
            <Text style={styles.creditsText}>
              Free Credits Remaining: <Text style={styles.creditsNumber}>{exportCredits}</Text>
            </Text>
          </View>

          {/* Premium Option */}
          <View style={styles.option}>
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons name="crown" size={24} color="#FFD700" />
              <Text style={styles.optionTitle}>Go Premium</Text>
            </View>
            <Text style={styles.optionDescription}>
              Get unlimited exports, no ads, and support development
            </Text>
            <View style={styles.benefits}>
              <View style={styles.benefit}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#10b981" />
                <Text style={styles.benefitText}>Unlimited Exports</Text>
              </View>
              <View style={styles.benefit}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#10b981" />
                <Text style={styles.benefitText}>No Ads Ever</Text>
              </View>
              <View style={styles.benefit}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#10b981" />
                <Text style={styles.benefitText}>Priority Support</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.subscribeButton, isProcessing && styles.buttonDisabled]}
              onPress={handleSubscribe}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.subscribeButtonText}>
                    Subscribe for $1.99/month
                  </Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Watch Ad Option */}
          <View style={styles.option}>
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons name="video" size={24} color="#8b5cf6" />
              <Text style={styles.optionTitle}>Watch an Ad</Text>
            </View>
            <Text style={styles.optionDescription}>
              Watch a short video and earn 1 export credit
            </Text>
            {adError && (
              <Text style={styles.errorText}>{adError}</Text>
            )}
            <TouchableOpacity
              style={[styles.adButton, (isLoadingAd || !adMobService.isAdReady()) && styles.buttonDisabled]}
              onPress={handleWatchAd}
              disabled={isLoadingAd || !adMobService.isAdReady()}
            >
              {isLoadingAd ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.adButtonText}>Loading Ad...</Text>
                </>
              ) : !adMobService.isAdReady() ? (
                <>
                  <MaterialCommunityIcons name="alert-circle" size={20} color="#fff" />
                  <Text style={styles.adButtonText}>Ad Not Ready</Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons name="play-circle" size={20} color="#fff" />
                  <Text style={styles.adButtonText}>Watch Video (Free)</Text>
                </>
              )}
            </TouchableOpacity>
            {!adMobService.isAdReady() && !isLoadingAd && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadAd}
              >
                <Text style={styles.retryText}>Retry Loading Ad</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Restore Purchases Button */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestorePurchases}
            disabled={isRestoringPurchases}
          >
            {isRestoringPurchases ? (
              <ActivityIndicator size="small" color="#64748b" />
            ) : (
              <Text style={styles.restoreText}>Restore Purchases</Text>
            )}
          </TouchableOpacity>

          {/* Error Message */}
          {purchaseError && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.errorTextMain}>{purchaseError}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#334155',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  creditsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 10,
  },
  creditsText: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  creditsNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ef4444',
  },
  option: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  optionDescription: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 18,
  },
  benefits: {
    marginBottom: 16,
    gap: 8,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  subscribeButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  adButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  adButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  restoreButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
  restoreText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    alignItems: 'center',
    padding: 8,
    marginTop: 8,
  },
  retryText: {
    color: '#8b5cf6',
    fontSize: 13,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  errorTextMain: {
    color: '#ef4444',
    fontSize: 13,
    flex: 1,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
});
