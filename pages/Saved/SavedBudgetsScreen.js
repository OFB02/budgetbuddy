import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STORAGE_KEY = '@budgetbuddy_saved_budgets';

export default function SavedBudgetsScreen({ onBack, onViewBudget }) {
  const [savedBudgets, setSavedBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedBudgets();
  }, []);

  const loadSavedBudgets = async () => {
    try {
      const budgetsJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (budgetsJson) {
        const budgets = JSON.parse(budgetsJson);
        setSavedBudgets(budgets);
      }
    } catch (error) {
      console.error('Error loading saved budgets:', error);
      Alert.alert('Error', 'Failed to load saved budgets');
    } finally {
      setLoading(false);
    }
  };

  const deleteBudget = async (id) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this saved budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedBudgets = savedBudgets.filter(budget => budget.id !== id);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBudgets));
              setSavedBudgets(updatedBudgets);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete budget');
            }
          },
        },
      ]
    );
  };

  const getPlannerIcon = (type) => {
    const icons = {
      monthly: 'calendar-month',
      goal: 'target',
      vacation: 'airplane',
    };
    return icons[type] || 'chart-box';
  };

  const getPlannerColor = (type) => {
    const colors = {
      monthly: '#4a69bd',
      goal: '#e74c3c',
      vacation: '#2ecc71',
    };
    return colors[type] || '#4a69bd';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderBudgetCard = (budget) => {
    const { id, name, plannerType, budgetData, currency, savedAt, goalType } = budget;
    const color = getPlannerColor(plannerType);
    const icon = getPlannerIcon(plannerType);

    // Handle different planner types
    let stats = [];
    if (plannerType === 'goal') {
      const { 
        income = 0, 
        savings = 0, 
        targetAmount = 0,
        currentSavings = 0,
        amountNeeded = 0,
        targetMonths = 0
      } = budgetData || {};
      
      stats = [
        {
          icon: 'bullseye-arrow',
          label: 'Target',
          value: `${currency}${targetAmount.toLocaleString()}`,
          color: '#e74c3c'
        },
        {
          icon: 'wallet',
          label: 'Saved',
          value: `${currency}${currentSavings.toLocaleString()}`,
          color: '#10b981'
        },
        {
          icon: 'calendar-clock',
          label: 'Timeline',
          value: `${targetMonths} months`,
          color: '#3b82f6'
        }
      ];
    } else if (plannerType === 'vacation') {
      const { 
        grandTotal = 0, 
        currentSaved = 0,
        duration = 0,
        travelers = 1,
        monthsToSave = 0
      } = budgetData || {};
      
      stats = [
        {
          icon: 'currency-usd',
          label: 'Total Budget',
          value: `${currency}${grandTotal.toLocaleString()}`,
          color: '#2ecc71'
        },
        {
          icon: 'calendar',
          label: 'Duration',
          value: `${duration} days`,
          color: '#3b82f6'
        },
        {
          icon: 'account-group',
          label: 'Travelers',
          value: `${travelers} ${travelers === 1 ? 'person' : 'people'}`,
          color: '#f59e0b'
        }
      ];
    } else {
      const { income = 0, savings = 0, remaining = 0 } = budgetData || {};
      stats = [
        {
          icon: 'cash',
          label: 'Income',
          value: `${currency}${income.toLocaleString()}`,
          color: '#2ecc71'
        },
        {
          icon: 'piggy-bank',
          label: 'Savings',
          value: `${currency}${savings.toLocaleString()}`,
          color: '#4a69bd'
        },
        {
          icon: 'wallet',
          label: 'Remaining',
          value: `${currency}${remaining.toLocaleString()}`,
          color: remaining >= 0 ? '#2ecc71' : '#e74c3c'
        }
      ];
    }

    return (
      <View key={id} style={[styles.budgetCard, { borderLeftColor: color }]}>
        <TouchableOpacity
          style={styles.budgetCardContent}
          onPress={() => onViewBudget && onViewBudget(budget)}
          activeOpacity={0.8}
        >
          <View style={styles.budgetHeader}>
            <View style={styles.budgetTitleRow}>
              <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <MaterialCommunityIcons name={icon} size={24} color={color} />
              </View>
              <View style={styles.budgetTitleContainer}>
                <Text style={styles.budgetName}>{name}</Text>
                <Text style={styles.budgetDate}>{formatDate(savedAt)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.budgetStatsRow}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.budgetStat}>
                <MaterialCommunityIcons name={stat.icon} size={18} color={stat.color} />
                <Text style={styles.budgetStatLabel}>{stat.label}</Text>
                <Text style={[styles.budgetStatValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.viewDetailsRow}>
            <Text style={styles.viewDetailsText}>Tap to view details</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#888" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteBudget(id)}
        >
          <MaterialCommunityIcons name="delete-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Budgets</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="bookmark-multiple" size={48} color="#4a69bd" />
          <Text style={styles.title}>Your Saved Budgets</Text>
          <Text style={styles.subtitle}>
            {savedBudgets.length > 0 
              ? `You have ${savedBudgets.length} saved budget${savedBudgets.length !== 1 ? 's' : ''}`
              : 'No saved budgets yet'}
          </Text>
        </View>

        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        ) : savedBudgets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="inbox" size={80} color="#444" />
            <Text style={styles.emptyTitle}>No Saved Budgets</Text>
            <Text style={styles.emptyText}>
              Create a budget and save it to see it here!
            </Text>
          </View>
        ) : (
          <View style={styles.budgetsContainer}>
            {savedBudgets.map(budget => renderBudgetCard(budget))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  budgetsContainer: {
    gap: 15,
  },
  budgetCard: {
    backgroundColor: '#232340',
    borderRadius: 16,
    borderLeftWidth: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  budgetCardContent: {
    padding: 20,
  },
  budgetHeader: {
    marginBottom: 15,
  },
  budgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetTitleContainer: {
    flex: 1,
  },
  budgetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  budgetDate: {
    fontSize: 12,
    color: '#888',
  },
  budgetStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetStat: {
    alignItems: 'center',
    flex: 1,
  },
  budgetStatLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    marginBottom: 2,
  },
  budgetStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2d2d44',
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#888',
    marginRight: 4,
  },
  deleteButton: {
    backgroundColor: '#2d2d44',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
