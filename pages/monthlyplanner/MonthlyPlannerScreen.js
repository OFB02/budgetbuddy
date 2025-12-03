import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import BudgetResultsScreen from '../../budgetresults/BudgetResultsScreen';

export default function MonthlyPlannerScreen({ onBack }) {
  const [incomes, setIncomes] = useState([
    { id: 1, name: 'Salary', amount: '' }
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Housing', amount: '' },
    { id: 2, name: 'Groceries', amount: '' },
    { id: 3, name: 'Transportation', amount: '' },
  ]);
  const [savings, setSavings] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [nextIncomeId, setNextIncomeId] = useState(2);
  const [nextExpenseId, setNextExpenseId] = useState(4);

  const addIncome = () => {
    setIncomes([...incomes, { id: nextIncomeId, name: '', amount: '' }]);
    setNextIncomeId(nextIncomeId + 1);
  };

  const removeIncome = (id) => {
    if (incomes.length > 1) {
      setIncomes(incomes.filter(item => item.id !== id));
    } else {
      Alert.alert('Cannot Remove', 'You must have at least one income source');
    }
  };

  const updateIncome = (id, field, value) => {
    setIncomes(incomes.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addExpense = () => {
    setExpenses([...expenses, { id: nextExpenseId, name: '', amount: '' }]);
    setNextExpenseId(nextExpenseId + 1);
  };

  const removeExpense = (id) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(item => item.id !== id));
    } else {
      Alert.alert('Cannot Remove', 'You must have at least one expense');
    }
  };

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateBudget = () => {
    const totalIncome = incomes.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);

    // Prepare income sources for the diagram
    const incomeSources = incomes
      .filter(item => item.name.trim() && parseFloat(item.amount) > 0)
      .map(item => ({
        name: item.name,
        value: parseFloat(item.amount) || 0
      }));

    const expensesObj = {};
    expenses.forEach(item => {
      if (item.name.trim()) {
        expensesObj[item.name] = parseFloat(item.amount) || 0;
      }
    });

    const totalExpenses = Object.values(expensesObj).reduce((sum, val) => sum + val, 0);
    const plannedSavings = parseFloat(savings) || 0;
    const remaining = totalIncome - totalExpenses - plannedSavings;

    return { 
      income: totalIncome,
      incomes: incomeSources, // Pass the income sources array
      expenses: expensesObj, 
      totalExpenses, 
      savings: plannedSavings, 
      remaining 
    };
  };

  const handleCalculate = () => {
    // Validate that at least one income has both name and amount
    const validIncomes = incomes.filter(item => item.name.trim() && item.amount);
    if (validIncomes.length === 0) {
      Alert.alert('Missing Information', 'Please add at least one income source with an amount');
      return;
    }

    // Validate that at least one expense has both name and amount
    const validExpenses = expenses.filter(item => item.name.trim() && item.amount);
    if (validExpenses.length === 0) {
      Alert.alert('Missing Information', 'Please add at least one expense with an amount');
      return;
    }

    setShowSummary(true);
  };

  if (showSummary) {
    const budget = calculateBudget();
    
    return (
      <BudgetResultsScreen
        budgetData={budget}
        plannerType="monthly"
        onBack={onBack}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backArrow}>
            <Text style={styles.backArrowText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📅 Monthly Planner</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Income Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💰 Income Sources</Text>
              <TouchableOpacity onPress={addIncome} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {incomes.map((income, index) => (
              <View key={income.id} style={styles.itemRow}>
                <TextInput
                  style={styles.nameInput}
                  value={income.name}
                  onChangeText={(text) => updateIncome(income.id, 'name', text)}
                  placeholder="Income name"
                  placeholderTextColor="#666"
                />
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={income.amount}
                    onChangeText={(text) => updateIncome(income.id, 'amount', text)}
                    placeholder="0"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>
                {incomes.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeIncome(income.id)} 
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Expenses Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💸 Expenses</Text>
              <TouchableOpacity onPress={addExpense} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {expenses.map((expense, index) => (
              <View key={expense.id} style={styles.itemRow}>
                <TextInput
                  style={styles.nameInput}
                  value={expense.name}
                  onChangeText={(text) => updateExpense(expense.id, 'name', text)}
                  placeholder="Expense name"
                  placeholderTextColor="#666"
                />
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={expense.amount}
                    onChangeText={(text) => updateExpense(expense.id, 'amount', text)}
                    placeholder="0"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>
                {expenses.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeExpense(expense.id)} 
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Savings Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏦 Savings Goal</Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.savingsLabel}>Monthly Savings</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={savings}
                  onChangeText={setSavings}
                  placeholder="0"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculate}
          >
            <Text style={styles.calculateButtonText}>Calculate Budget</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backArrow: {
    padding: 10,
  },
  backArrowText: {
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
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#4a69bd',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#4a69bd',
    fontWeight: 'bold',
    marginRight: 5,
  },
  amountInput: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 8,
    minWidth: 80,
  },
  removeButton: {
    padding: 8,
    marginLeft: 5,
  },
  removeButtonText: {
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  savingsLabel: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  spacer: {
    height: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: '#1a1a2e',
  },
  calculateButton: {
    backgroundColor: '#4a69bd',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
