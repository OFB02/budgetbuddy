/**
 * EXAMPLE: How to integrate monetization into BudgetBuddy
 * 
 * This file shows complete integration examples for the monetization system.
 * Copy the relevant code snippets into your actual files.
 */

// ============================================================================
// STEP 1: Wrap your app with MonetizationProvider in App.js
// ============================================================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MonetizationProvider } from './monetization/MonetizationContext';
import PaywallModal from './monetization/PaywallModal';

// Your existing screens
import WelcomeScreen from './pages/welcome/WelcomeScreen';
import BudgetResultsScreen from './budgetresults/BudgetResultsScreen';
// ... other imports

const Stack = createStackNavigator();

export default function App() {
  return (
    <MonetizationProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="BudgetResults" component={BudgetResultsScreen} />
          {/* Add your other screens */}
        </Stack.Navigator>
      </NavigationContainer>
      
      {/* PaywallModal must be at root level, outside navigator */}
      <PaywallModal />
    </MonetizationProvider>
  );
}

// ============================================================================
// STEP 2: Use in BudgetResultsScreen.js (or any export screen)
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { useMonetization } from '../monetization/MonetizationContext';

function BudgetResultsScreenExample() {
  const { 
    handleExport, 
    exportCredits, 
    isPremium,
    isLoading 
  } = useMonetization();

  /**
   * Your actual export logic - this gets called when export is allowed
   */
  const performActualExport = async () => {
    try {
      console.log('Starting export...');
      
      // Example: Share budget data
      const budgetData = {
        income: 5000,
        expenses: 3500,
        savings: 1500,
      };
      
      const message = `My Budget:\nIncome: $${budgetData.income}\nExpenses: $${budgetData.expenses}\nSavings: $${budgetData.savings}`;
      
      await Share.share({
        message: message,
        title: 'My Budget Plan',
      });
      
      console.log('Export completed successfully!');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  /**
   * Handle export button press
   */
  const onExportPress = () => {
    // handleExport will check credits/premium status and either:
    // 1. Allow export immediately (premium or has credits)
    // 2. Show paywall (no credits)
    handleExport(performActualExport);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Results</Text>
      
      {/* Status Display */}
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Account Status:</Text>
        <Text style={styles.statusValue}>
          {isPremium ? '✨ Premium' : '🆓 Free'}
        </Text>
        
        {!isPremium && (
          <>
            <Text style={styles.statusLabel}>Export Credits:</Text>
            <Text style={styles.creditsValue}>{exportCredits}</Text>
          </>
        )}
      </View>

      {/* Export Button */}
      <TouchableOpacity 
        style={styles.exportButton}
        onPress={onExportPress}
        activeOpacity={0.8}
      >
        <Text style={styles.exportButtonText}>
          📊 Export Budget
        </Text>
        {!isPremium && exportCredits > 0 && (
          <Text style={styles.exportButtonSubtext}>
            ({exportCredits} credit{exportCredits !== 1 ? 's' : ''} remaining)
          </Text>
        )}
      </TouchableOpacity>

      {/* Info Text */}
      {!isPremium && exportCredits === 0 && (
        <Text style={styles.infoText}>
          No credits available. Tap Export to see your options!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A1A1A',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  creditsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  exportButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exportButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
  infoText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 14,
    marginTop: 16,
  },
});

// ============================================================================
// STEP 3: Advanced Usage - Multiple Export Types
// ============================================================================

function AdvancedExportExample() {
  const { handleExport } = useMonetization();

  const exportAsPDF = async () => {
    console.log('Exporting as PDF...');
    // Your PDF export logic
  };

  const exportAsCSV = async () => {
    console.log('Exporting as CSV...');
    // Your CSV export logic
  };

  const exportAsImage = async () => {
    console.log('Exporting as Image...');
    // Your image export logic
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleExport(exportAsPDF)}>
        <Text>Export as PDF</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handleExport(exportAsCSV)}>
        <Text>Export as CSV</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handleExport(exportAsImage)}>
        <Text>Export as Image</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================================
// STEP 4: Testing Helpers - Add to Settings Screen
// ============================================================================

function SettingsScreenExample() {
  const { 
    exportCredits, 
    isPremium, 
    addCredits, 
    resetToFreeTier 
  } = useMonetization();

  return (
    <View style={styles.container}>
      <Text>Current Status:</Text>
      <Text>Premium: {isPremium ? 'Yes' : 'No'}</Text>
      <Text>Credits: {exportCredits}</Text>
      
      {/* Testing Buttons - Remove in production */}
      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => addCredits(5)}
      >
        <Text>Add 5 Credits (Testing)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.testButton}
        onPress={resetToFreeTier}
      >
        <Text>Reset to Free Tier (Testing)</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================================
// STEP 5: Simple Inline Example (Minimal Code)
// ============================================================================

function MinimalExample() {
  const { handleExport } = useMonetization();

  return (
    <TouchableOpacity 
      onPress={() => handleExport(() => {
        console.log('Exporting!');
        // Your export code here
      })}
    >
      <Text>Export</Text>
    </TouchableOpacity>
  );
}

export {
  BudgetResultsScreenExample,
  AdvancedExportExample,
  SettingsScreenExample,
  MinimalExample,
};
