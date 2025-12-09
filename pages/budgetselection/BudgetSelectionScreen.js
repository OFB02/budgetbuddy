import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const BudgetOption = ({ emoji, title, description, onPress, color }) => (
  <TouchableOpacity
    style={[styles.optionCard, { borderLeftColor: color }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.optionIcon}>
      <Text style={styles.optionEmoji}>{emoji}</Text>
    </View>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionDescription}>{description}</Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

export default function BudgetSelectionScreen({ onSelectOption }) {
  const handleOptionPress = (option) => {
    if (onSelectOption) {
      onSelectOption(option);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>💰</Text>
        <Text style={styles.title}>Budget Buddy</Text>
        <Text style={styles.subtitle}>What would you like to plan today?</Text>
      </View>

      <View style={styles.optionsContainer}>
        <BudgetOption
          emoji="📅"
          title="Monthly Planner"
          description="Track your monthly income and expenses"
          color="#4a69bd"
          onPress={() => handleOptionPress('monthly')}
        />

        <BudgetOption
          emoji="✈️"
          title="Plan for a Vacation"
          description="Save up for your dream getaway"
          color="#2ecc71"
          onPress={() => handleOptionPress('vacation')}
        />

        <BudgetOption
          emoji="🎯"
          title="Plan for a Goal"
          description="Set and achieve your financial goals"
          color="#e74c3c"
          onPress={() => handleOptionPress('goal')}
        />

        <BudgetOption
          emoji="💾"
          title="Saved Budgets"
          description="View and manage your saved budgets"
          color="#f39c12"
          onPress={() => handleOptionPress('saved')}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Select an option to get started</Text>
      </View>
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
  },
  headerEmoji: {
    fontSize: 50,
    marginBottom: 10,
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
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionEmoji: {
    fontSize: 24,
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
  arrow: {
    fontSize: 28,
    color: '#444',
    fontWeight: '300',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#555',
    fontSize: 14,
  },
});
