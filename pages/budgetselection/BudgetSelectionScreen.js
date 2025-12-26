import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IntroPaywallModal from '../../monetization/IntroPaywallModal';
import { useMonetization } from '../../monetization/MonetizationContext';

const INTRO_SHOWN_KEY = '@budgetbuddy_intro_shown';

const BudgetOption = ({ iconName, title, description, onPress, color }) => (
  <TouchableOpacity
    style={[styles.optionCard, { borderLeftColor: color }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.optionIcon, { backgroundColor: color + '20' }]}>
      <MaterialCommunityIcons name={iconName} size={28} color={color} />
    </View>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionDescription}>{description}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
  </TouchableOpacity>
);

export default function BudgetSelectionScreen({ onSelectOption }) {
  const [showIntroPaywall, setShowIntroPaywall] = useState(false);
  const { isPremium, resetToFreeTier } = useMonetization();

  // Check if we should show the intro paywall
  useEffect(() => {
    checkAndShowIntro();
  }, []);

  const checkAndShowIntro = async () => {
    try {
      console.log('Checking intro paywall status...');
      
      // Don't show if already premium
      if (isPremium) {
        console.log('User is premium, skipping intro');
        return;
      }

      // Show intro every time for non-premium users
      console.log('Showing intro paywall in 800ms...');
      setTimeout(() => {
        console.log('Displaying intro paywall now!');
        setShowIntroPaywall(true);
      }, 800);
    } catch (error) {
      console.error('Error checking intro status:', error);
    }
  };

  const handleCloseIntro = async () => {
    try {
      // Mark intro as shown
      await AsyncStorage.setItem(INTRO_SHOWN_KEY, 'true');
      setShowIntroPaywall(false);
    } catch (error) {
      console.error('Error saving intro status:', error);
      setShowIntroPaywall(false);
    }
  };

  const handleOptionPress = (option) => {
    if (onSelectOption) {
      onSelectOption(option);
    }
  };

  // Dev function to reset premium status
  const handleResetPremium = async () => {
    try {
      await resetToFreeTier();
      console.log('Premium status reset to free tier!');
      alert('Premium status removed. Restart the app to see changes.');
    } catch (error) {
      console.error('Error resetting premium:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Premium Badge - Top Right */}
      {isPremium && (
        <View style={styles.premiumBadgeContainer}>
          <MaterialCommunityIcons name="crown" size={14} color="#FFD700" />
          <Text style={styles.premiumBadgeText}>Premium</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <MaterialCommunityIcons name="wallet" size={40} color="#4a69bd" />
        </View>
        <Text style={styles.title}>Budget Buddy</Text>
        <Text style={styles.subtitle}>What would you like to plan today?</Text>
      </View>

      <View style={styles.optionsContainer}>
        <BudgetOption
          iconName="calendar-month"
          title="Monthly Planner"
          description="Track your monthly income and expenses"
          color="#4a69bd"
          onPress={() => handleOptionPress('monthly')}
        />

        <BudgetOption
          iconName="airplane"
          title="Plan for a Vacation"
          description="Save up for your dream getaway"
          color="#2ecc71"
          onPress={() => handleOptionPress('vacation')}
        />

        <BudgetOption
          iconName="target"
          title="Plan for a Goal"
          description="Set and achieve your financial goals"
          color="#e74c3c"
          onPress={() => handleOptionPress('goal')}
        />

        <BudgetOption
          iconName="bookmark-multiple"
          title="Saved Budgets"
          description="View and manage your saved budgets"
          color="#f39c12"
          onPress={() => handleOptionPress('saved')}
        />
      </View>

      <View style={styles.footer}>
        <MaterialCommunityIcons name="information" size={16} color="#666" />
        <Text style={styles.footerText}> Select an option to get started</Text>
      </View>

      {/* Dev: Reset Premium Button */}
      {isPremium && (
        <TouchableOpacity 
          style={styles.devResetButton}
          onPress={handleResetPremium}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="crown-off" size={16} color="#FF5252" />
          <Text style={styles.devResetText}>Reset Premium (Dev)</Text>
        </TouchableOpacity>
      )}

      {/* Intro Paywall Modal */}
      <IntroPaywallModal 
        visible={showIntroPaywall}
        onClose={handleCloseIntro}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#232340',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4a69bd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  premiumBadgeContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(35, 35, 64, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
  },
  premiumBadgeText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#888',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  devResetButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232340',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  devResetText: {
    color: '#FF5252',
    fontSize: 11,
    fontWeight: '600',
  },
});
