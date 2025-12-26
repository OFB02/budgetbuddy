import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMonetization } from './MonetizationContext';

const { width } = Dimensions.get('window');

/**
 * PaywallModal Component
 * Displays monetization options when user runs out of export credits
 */
const PaywallModal = () => {
  const {
    showPaywall,
    closePaywall,
    mockPurchaseSubscription,
    mockShowRewardedAd,
    exportCredits,
  } = useMonetization();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  /**
   * Handle subscription purchase
   */
  const handlePurchase = async () => {
    setIsProcessing(true);
    setProcessingMessage('Processing payment...');
    
    try {
      await mockPurchaseSubscription();
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  /**
   * Handle rewarded ad viewing
   */
  const handleWatchAd = async () => {
    setIsProcessing(true);
    setProcessingMessage('Loading ad... (5 seconds)');
    
    try {
      await mockShowRewardedAd();
    } catch (error) {
      console.error('Ad error:', error);
      alert('Ad failed to load. Please try again.');
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  return (
    <Modal
      visible={showPaywall}
      transparent={true}
      animationType="fade"
      onRequestClose={closePaywall}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closePaywall}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="close" size={22} color="#666" />
          </TouchableOpacity>

          {/* Header Icon */}
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons name="lock-open-outline" size={48} color="#4CAF50" />
          </View>

          {/* Header Text */}
          <View style={styles.header}>
            <Text style={styles.title}>Unlock Unlimited Exports</Text>
            <Text style={styles.subtitle}>
              You've reached your free export limit
            </Text>
          </View>

          {/* Credits Display */}
          <View style={styles.creditsBox}>
            <MaterialCommunityIcons name="ticket-outline" size={20} color="#999" />
            <Text style={styles.creditsText}>
              Free Credits: <Text style={styles.creditsNumber}>{exportCredits}</Text>
            </Text>
          </View>

          {/* Processing State */}
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.processingText}>{processingMessage}</Text>
            </View>
          ) : (
            <>
              {/* Action Buttons */}
              <View style={styles.buttonsContainer}>
                {/* Primary Button - Subscription */}
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handlePurchase}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <MaterialCommunityIcons name="crown-outline" size={22} color="#FFFFFF" />
                    <View style={styles.buttonTextContainer}>
                      <Text style={styles.primaryButtonText}>Go Premium</Text>
                      <Text style={styles.priceText}>$1.99/month</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Secondary Button - Watch Ad */}
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleWatchAd}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <MaterialCommunityIcons name="play-circle-outline" size={22} color="#2196F3" />
                    <View style={styles.buttonTextContainer}>
                      <Text style={styles.secondaryButtonText}>Watch Video</Text>
                      <Text style={styles.adInfoText}>Earn 1 credit • 5 seconds</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Benefits List */}
              <View style={styles.benefitsContainer}>
                <View style={styles.benefitRow}>
                  <MaterialCommunityIcons name="infinity" size={16} color="#4CAF50" />
                  <Text style={styles.benefitItem}>Unlimited exports</Text>
                </View>
                <View style={styles.benefitRow}>
                  <MaterialCommunityIcons name="advertisements-off" size={16} color="#4CAF50" />
                  <Text style={styles.benefitItem}>No ads</Text>
                </View>
                <View style={styles.benefitRow}>
                  <MaterialCommunityIcons name="flash" size={16} color="#4CAF50" />
                  <Text style={styles.benefitItem}>Priority processing</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: width * 0.88,
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  creditsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 28,
    gap: 8,
  },
  creditsText: {
    fontSize: 15,
    color: '#555555',
    fontWeight: '500',
  },
  creditsNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  processingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
  },
  buttonsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.9,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  adInfoText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  benefitsContainer: {
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitItem: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },
});

export default PaywallModal;
