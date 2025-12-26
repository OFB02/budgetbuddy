import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMonetization } from './MonetizationContext';

const { width } = Dimensions.get('window');

/**
 * IntroPaywallModal Component
 * Shows on app start to introduce premium features
 */
const IntroPaywallModal = ({ visible, onClose }) => {
  const { mockPurchaseSubscription, isPremium } = useMonetization();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handle premium subscription
   */
  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      await mockPurchaseSubscription();
      onClose(); // Close modal after successful subscription
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Continue with free version
   */
  const handleContinueFree = () => {
    onClose();
  };

  // Don't show if already premium
  if (isPremium) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Close button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleContinueFree}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons name="close" size={22} color="#888" />
            </TouchableOpacity>

            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="crown-outline" size={56} color="#4CAF50" />
              </View>
              <Text style={styles.mainTitle}>Unlock Premium</Text>
              <Text style={styles.subtitle}>
                Export unlimited budgets and support development
              </Text>
            </View>

            {/* Premium Features - Clean Grid */}
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <View style={styles.featureIconCircle}>
                  <MaterialCommunityIcons name="infinity" size={28} color="#4CAF50" />
                </View>
                <Text style={styles.featureCardTitle}>Unlimited</Text>
                <Text style={styles.featureCardText}>Exports</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIconCircle}>
                  <MaterialCommunityIcons name="advertisements-off" size={28} color="#4CAF50" />
                </View>
                <Text style={styles.featureCardTitle}>Ad-Free</Text>
                <Text style={styles.featureCardText}>Experience</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIconCircle}>
                  <MaterialCommunityIcons name="flash" size={28} color="#4CAF50" />
                </View>
                <Text style={styles.featureCardTitle}>Priority</Text>
                <Text style={styles.featureCardText}>Processing</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIconCircle}>
                  <MaterialCommunityIcons name="heart-outline" size={28} color="#4CAF50" />
                </View>
                <Text style={styles.featureCardTitle}>Support</Text>
                <Text style={styles.featureCardText}>Development</Text>
              </View>
            </View>

            {/* Pricing */}
            <View style={styles.pricingCard}>
              <View style={styles.pricingRow}>
                <View>
                  <Text style={styles.pricingLabel}>Monthly</Text>
                  <Text style={styles.pricingAmount}>$1.99</Text>
                </View>
                <View style={styles.pricingBadge}>
                  <Text style={styles.pricingBadgeText}>Best Value</Text>
                </View>
              </View>
              <Text style={styles.pricingNote}>Cancel anytime • No commitment</Text>
            </View>

            {/* Action Buttons */}
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.processingText}>Processing...</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.premiumButton}
                  onPress={handleSubscribe}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="crown-outline" size={22} color="#FFFFFF" />
                  <Text style={styles.premiumButtonText}>Start Premium</Text>
                </TouchableOpacity>

                {/* Free Plan Section */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.freePlanCard}>
                  <View style={styles.freePlanHeader}>
                    <MaterialCommunityIcons name="gift-outline" size={20} color="#666" />
                    <Text style={styles.freePlanTitle}>Free Plan</Text>
                  </View>
                  <View style={styles.freePlanDetails}>
                    <View style={styles.freePlanRow}>
                      <MaterialCommunityIcons name="check" size={16} color="#4CAF50" />
                      <Text style={styles.freePlanText}>3 free exports</Text>
                    </View>
                    <View style={styles.freePlanRow}>
                      <MaterialCommunityIcons name="check" size={16} color="#4CAF50" />
                      <Text style={styles.freePlanText}>Watch ads for more credits</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.freeButton}
                    onPress={handleContinueFree}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.freeButtonText}>Continue with Free</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Footer */}
            <Text style={styles.footerText}>
              Terms of Service • Privacy Policy
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: width * 0.92,
    maxWidth: 440,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  scrollContent: {
    padding: 28,
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
  heroSection: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 28,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  featureIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
    textAlign: 'center',
  },
  featureCardText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
  },
  pricingCard: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pricingLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  pricingAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -1,
  },
  pricingBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pricingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  pricingNote: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'left',
    fontWeight: '400',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  processingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666666',
  },
  premiumButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '500',
  },
  freePlanCard: {
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  freePlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  freePlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  freePlanDetails: {
    marginBottom: 16,
    gap: 8,
  },
  freePlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  freePlanText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
  freeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  freeButtonText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  footerText: {
    fontSize: 11,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '400',
  },
});

export default IntroPaywallModal;
