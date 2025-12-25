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
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import BudgetResultsScreen from '../../budgetresults/BudgetResultsScreen';

export default function MonthlyPlannerScreen({ onBack }) {
  const [currency, setCurrency] = useState('$');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showIncomeOptions, setShowIncomeOptions] = useState(false);
  const [showExpenseOptions, setShowExpenseOptions] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [customCurrency, setCustomCurrency] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
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

  // Comprehensive list of currencies with countries
  const currencies = [
    { symbol: '$', code: 'USD', countries: ['United States', 'USA', 'America'], flag: '🇺🇸' },
    { symbol: '€', code: 'EUR', countries: ['Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Austria', 'Portugal', 'Greece', 'Ireland', 'Finland', 'Luxembourg', 'Slovenia', 'Cyprus', 'Malta', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Croatia'], flag: '🇪🇺' },
    { symbol: '£', code: 'GBP', countries: ['United Kingdom', 'UK', 'Britain', 'England', 'Scotland', 'Wales', 'Northern Ireland'], flag: '🇬🇧' },
    { symbol: '¥', code: 'JPY', countries: ['Japan'], flag: '🇯🇵' },
    { symbol: '¥', code: 'CNY', countries: ['China', 'PRC'], flag: '🇨🇳' },
    { symbol: '₹', code: 'INR', countries: ['India'], flag: '🇮🇳' },
    { symbol: 'C$', code: 'CAD', countries: ['Canada'], flag: '🇨🇦' },
    { symbol: 'A$', code: 'AUD', countries: ['Australia'], flag: '🇦🇺' },
    { symbol: 'CHF', code: 'CHF', countries: ['Switzerland', 'Liechtenstein'], flag: '🇨🇭' },
    { symbol: 'SEK', code: 'SEK', countries: ['Sweden'], flag: '🇸🇪' },
    { symbol: 'NOK', code: 'NOK', countries: ['Norway'], flag: '🇳🇴' },
    { symbol: 'DKK', code: 'DKK', countries: ['Denmark', 'Greenland', 'Faroe Islands'], flag: '🇩🇰' },
    { symbol: 'R$', code: 'BRL', countries: ['Brazil', 'Brasil'], flag: '🇧🇷' },
    { symbol: '₽', code: 'RUB', countries: ['Russia', 'Russian Federation'], flag: '🇷🇺' },
    { symbol: 'R', code: 'ZAR', countries: ['South Africa'], flag: '🇿🇦' },
    { symbol: '₩', code: 'KRW', countries: ['South Korea', 'Korea'], flag: '🇰🇷' },
    { symbol: '₺', code: 'TRY', countries: ['Turkey', 'Türkiye'], flag: '🇹🇷' },
    { symbol: 'Mex$', code: 'MXN', countries: ['Mexico'], flag: '🇲🇽' },
    { symbol: 'Rp', code: 'IDR', countries: ['Indonesia'], flag: '🇮🇩' },
    { symbol: '₱', code: 'PHP', countries: ['Philippines'], flag: '🇵🇭' },
    { symbol: '฿', code: 'THB', countries: ['Thailand'], flag: '🇹🇭' },
    { symbol: 'RM', code: 'MYR', countries: ['Malaysia'], flag: '🇲🇾' },
    { symbol: 'S$', code: 'SGD', countries: ['Singapore'], flag: '🇸�' },
    { symbol: 'HK$', code: 'HKD', countries: ['Hong Kong'], flag: '🇭🇰' },
    { symbol: 'NT$', code: 'TWD', countries: ['Taiwan'], flag: '🇹🇼' },
    { symbol: 'NZ$', code: 'NZD', countries: ['New Zealand'], flag: '🇳🇿' },
    { symbol: '₪', code: 'ILS', countries: ['Israel'], flag: '🇮🇱' },
    { symbol: 'zł', code: 'PLN', countries: ['Poland'], flag: '🇵🇱' },
    { symbol: 'Kč', code: 'CZK', countries: ['Czech Republic', 'Czechia'], flag: '🇨�' },
    { symbol: 'Ft', code: 'HUF', countries: ['Hungary'], flag: '🇭🇺' },
    { symbol: 'lei', code: 'RON', countries: ['Romania'], flag: '🇷🇴' },
    { symbol: 'лв', code: 'BGN', countries: ['Bulgaria'], flag: '🇧🇬' },
    { symbol: 'د.إ', code: 'AED', countries: ['United Arab Emirates', 'UAE', 'Dubai', 'Abu Dhabi'], flag: '🇦�' },
    { symbol: 'SR', code: 'SAR', countries: ['Saudi Arabia'], flag: '🇸🇦' },
    { symbol: 'EGP', code: 'EGP', countries: ['Egypt'], flag: '🇪🇬' },
    { symbol: 'Ar$', code: 'ARS', countries: ['Argentina'], flag: '🇦🇷' },
    { symbol: 'CLP$', code: 'CLP', countries: ['Chile'], flag: '🇨🇱' },
    { symbol: 'COL$', code: 'COP', countries: ['Colombia'], flag: '🇨🇴' },
    { symbol: 'S/', code: 'PEN', countries: ['Peru'], flag: '🇵🇪' },
    { symbol: '₦', code: 'NGN', countries: ['Nigeria'], flag: '🇳🇬' },
    { symbol: 'KSh', code: 'KES', countries: ['Kenya'], flag: '🇰🇪' },
    { symbol: '₵', code: 'GHS', countries: ['Ghana'], flag: '🇬🇭' },
    { symbol: 'Rs', code: 'PKR', countries: ['Pakistan'], flag: '🇵🇰' },
    { symbol: '৳', code: 'BDT', countries: ['Bangladesh'], flag: '🇧🇩' },
    { symbol: '₫', code: 'VND', countries: ['Vietnam'], flag: '🇻🇳' },
    { symbol: 'Bs.', code: 'VES', countries: ['Venezuela'], flag: '🇻🇪' },
    { symbol: 'Kz', code: 'AOA', countries: ['Angola'], flag: '🇦�' },
    { symbol: 'Dh', code: 'MAD', countries: ['Morocco'], flag: '🇲🇦' },
    { symbol: 'DT', code: 'TND', countries: ['Tunisia'], flag: '🇹🇳' },
    { symbol: '₴', code: 'UAH', countries: ['Ukraine'], flag: '🇺🇦' },
  ];

  // Filter currencies based on search
  const filteredCurrencies = currencies.filter(curr => {
    const searchLower = currencySearch.toLowerCase();
    return (
      curr.code.toLowerCase().includes(searchLower) ||
      curr.countries.some(country => country.toLowerCase().includes(searchLower)) ||
      curr.symbol.includes(currencySearch)
    );
  });

  const handleCustomCurrency = () => {
    if (customCurrency.trim()) {
      setCurrency(customCurrency.trim());
      setShowCurrencyPicker(false);
      setCustomCurrency('');
      setShowCustomInput(false);
      setCurrencySearch('');
    }
  };

  // Helper function to check if an income option has been added
  const isIncomeAdded = (optionName) => {
    return incomes.some(item => {
      const baseName = item.name.split(' #')[0];
      return baseName === optionName;
    });
  };

  // Helper function to check if an expense option has been added
  const isExpenseAdded = (optionName) => {
    return expenses.some(item => {
      const baseName = item.name.split(' #')[0];
      return baseName === optionName;
    });
  };

  const incomeOptions = [
    'Salary',
    'Freelance',
    'Business Income',
    'Investments',
    'Rental Income',
    'Side Hustle',
    'Pension',
    'Dividends',
    'Bonus',
    'Other Income',
  ];

  const expenseOptions = [
    'Housing',
    'Groceries',
    'Transportation',
    'Utilities',
    'Insurance',
    'Healthcare',
    'Entertainment',
    'Dining Out',
    'Shopping',
    'Education',
    'Subscriptions',
    'Debt Payments',
    'Phone & Internet',
    'Pet Care',
    'Personal Care',
    'Travel',
    'Gifts',
    'Gym & Fitness',
    'Other Expenses',
  ];

  const addIncome = (name = '', closeMenu = true) => {
    // If a name is provided, check if it already exists and add numbering
    let finalName = name;
    if (name) {
      const existingCount = incomes.filter(item => {
        // Check if the name matches exactly or has a # suffix (e.g., "Salary #2")
        const baseName = item.name.split(' #')[0];
        const searchBaseName = name.split(' #')[0];
        return baseName === searchBaseName;
      }).length;
      
      if (existingCount > 0) {
        finalName = `${name} #${existingCount + 1}`;
      }
    }
    
    setIncomes([...incomes, { id: nextIncomeId, name: finalName, amount: '' }]);
    setNextIncomeId(nextIncomeId + 1);
    if (closeMenu) {
      setShowIncomeOptions(false);
    }
  };

  const addPredefinedIncome = (name) => {
    // Don't close the menu when adding predefined options
    addIncome(name, false);
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

  const addExpense = (name = '', closeMenu = true) => {
    // If a name is provided, check if it already exists and add numbering
    let finalName = name;
    if (name) {
      const existingCount = expenses.filter(item => {
        // Check if the name matches exactly or has a # suffix (e.g., "Housing #2")
        const baseName = item.name.split(' #')[0];
        const searchBaseName = name.split(' #')[0];
        return baseName === searchBaseName;
      }).length;
      
      if (existingCount > 0) {
        finalName = `${name} #${existingCount + 1}`;
      }
    }
    
    setExpenses([...expenses, { id: nextExpenseId, name: finalName, amount: '' }]);
    setNextExpenseId(nextExpenseId + 1);
    if (closeMenu) {
      setShowExpenseOptions(false);
    }
  };

  const addPredefinedExpense = (name) => {
    // Don't close the menu when adding predefined options
    addExpense(name, false);
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
        currency={currency}
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
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#e2e8f0" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="calendar-outline" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.headerTitle}>Monthly Planner</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setShowCurrencyPicker(!showCurrencyPicker)} 
            style={styles.currencyButton}
          >
            <Text style={styles.currencyButtonText}>{currency}</Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Currency Picker Modal */}
        {showCurrencyPicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              
              {/* Search Input */}
              <TextInput
                style={styles.searchInput}
                value={currencySearch}
                onChangeText={setCurrencySearch}
                placeholder="Search by country or currency code..."
                placeholderTextColor="#666"
              />

              <ScrollView style={styles.currencyList}>
                {filteredCurrencies.map((curr, index) => (
                  <TouchableOpacity
                    key={`${curr.code}-${index}`}
                    style={styles.currencyOption}
                    onPress={() => {
                      setCurrency(curr.symbol);
                      setShowCurrencyPicker(false);
                      setCurrencySearch('');
                      setShowCustomInput(false);
                    }}
                  >
                    <Text style={styles.currencyFlag}>{curr.flag}</Text>
                    <View style={styles.currencyInfo}>
                      <Text style={styles.currencyCode}>{curr.code}</Text>
                      <Text style={styles.currencyCountries}>
                        {curr.countries.slice(0, 2).join(', ')}
                        {curr.countries.length > 2 ? '...' : ''}
                      </Text>
                    </View>
                    <Text style={styles.currencySymbolDisplay}>{curr.symbol}</Text>
                  </TouchableOpacity>
                ))}
                
                {filteredCurrencies.length === 0 && (
                  <Text style={styles.noResultsText}>
                    No currencies found. Try a custom currency below.
                  </Text>
                )}
              </ScrollView>

              {/* Custom Currency Input */}
              {!showCustomInput ? (
                <TouchableOpacity
                  style={styles.customCurrencyButton}
                  onPress={() => setShowCustomInput(true)}
                >
                  <MaterialCommunityIcons name="pencil" size={18} color="#fff" style={styles.customCurrencyIcon} />
                  <Text style={styles.customCurrencyButtonText}>
                    Enter Custom Currency
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.customInputContainer}>
                  <TextInput
                    style={styles.customInput}
                    value={customCurrency}
                    onChangeText={setCustomCurrency}
                    placeholder="Enter your currency symbol (e.g., $, €, ₹)"
                    placeholderTextColor="#666"
                    autoFocus
                  />
                  <TouchableOpacity
                    style={styles.confirmCustomButton}
                    onPress={handleCustomCurrency}
                  >
                    <MaterialCommunityIcons name="check" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelCustomButton}
                    onPress={() => {
                      setShowCustomInput(false);
                      setCustomCurrency('');
                    }}
                  >
                    <MaterialCommunityIcons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => {
                  setShowCurrencyPicker(false);
                  setCurrencySearch('');
                  setShowCustomInput(false);
                  setCustomCurrency('');
                }}
              >
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Income Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.iconCircle, styles.incomeIconCircle]}>
                  <MaterialCommunityIcons name="cash-plus" size={20} color="#10b981" />
                </View>
                <Text style={styles.sectionTitle}>Income Sources</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowIncomeOptions(!showIncomeOptions)} 
                style={styles.addButton}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Predefined Income Options */}
            {showIncomeOptions && (
              <View style={styles.optionsContainer}>
                <View style={styles.optionsHeader}>
                  <Text style={styles.optionsTitle}>Choose from common options:</Text>
                  <TouchableOpacity 
                    onPress={() => setShowIncomeOptions(false)}
                    style={styles.closeOptionsButton}
                  >
                    <MaterialCommunityIcons name="close" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <View style={styles.optionsList}>
                  {incomeOptions.map((option) => {
                    const isAdded = isIncomeAdded(option);
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          isAdded && styles.optionButtonAdded
                        ]}
                        onPress={() => addPredefinedIncome(option)}
                      >
                        {isAdded && <MaterialCommunityIcons name="check-circle" size={16} color="#fff" style={styles.checkIcon} />}
                        <Text style={[
                          styles.optionButtonText,
                          isAdded && styles.optionButtonTextAdded
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    style={[styles.optionButton, styles.customOptionButton]}
                    onPress={() => addIncome()}
                  >
                    <MaterialCommunityIcons name="pencil-outline" size={16} color="#fff" />
                    <Text style={styles.optionButtonText}>Custom</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {incomes.map((income, index) => (
              <View key={income.id} style={styles.itemRow}>
                <View style={styles.inputLabelContainer}>
                  <MaterialCommunityIcons name="file-document-outline" size={18} color="#64748b" />
                  <TextInput
                    style={styles.nameInput}
                    value={income.name}
                    onChangeText={(text) => updateIncome(income.id, 'name', text)}
                    placeholder="Income name"
                    placeholderTextColor="#475569"
                  />
                </View>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>{currency}</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={income.amount}
                    onChangeText={(text) => updateIncome(income.id, 'amount', text)}
                    placeholder="0"
                    placeholderTextColor="#475569"
                    keyboardType="numeric"
                  />
                </View>
                {incomes.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeIncome(income.id)} 
                    style={styles.removeButton}
                  >
                    <MaterialCommunityIcons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Expenses Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.iconCircle, styles.expenseIconCircle]}>
                  <MaterialCommunityIcons name="credit-card-minus-outline" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.sectionTitle}>Expenses</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowExpenseOptions(!showExpenseOptions)} 
                style={styles.addButton}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Predefined Expense Options */}
            {showExpenseOptions && (
              <View style={styles.optionsContainer}>
                <View style={styles.optionsHeader}>
                  <Text style={styles.optionsTitle}>Choose from common options:</Text>
                  <TouchableOpacity 
                    onPress={() => setShowExpenseOptions(false)}
                    style={styles.closeOptionsButton}
                  >
                    <MaterialCommunityIcons name="close" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <View style={styles.optionsList}>
                  {expenseOptions.map((option) => {
                    const isAdded = isExpenseAdded(option);
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionButton,
                          isAdded && styles.optionButtonAdded
                        ]}
                        onPress={() => addPredefinedExpense(option)}
                      >
                        {isAdded && <MaterialCommunityIcons name="check-circle" size={16} color="#fff" style={styles.checkIcon} />}
                        <Text style={[
                          styles.optionButtonText,
                          isAdded && styles.optionButtonTextAdded
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    style={[styles.optionButton, styles.customOptionButton]}
                    onPress={() => addExpense()}
                  >
                    <MaterialCommunityIcons name="pencil-outline" size={16} color="#fff" />
                    <Text style={styles.optionButtonText}>Custom</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {expenses.map((expense, index) => (
              <View key={expense.id} style={styles.itemRow}>
                <View style={styles.inputLabelContainer}>
                  <MaterialCommunityIcons name="file-document-outline" size={18} color="#64748b" />
                  <TextInput
                    style={styles.nameInput}
                    value={expense.name}
                    onChangeText={(text) => updateExpense(expense.id, 'name', text)}
                    placeholder="Expense name"
                    placeholderTextColor="#475569"
                  />
                </View>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>{currency}</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={expense.amount}
                    onChangeText={(text) => updateExpense(expense.id, 'amount', text)}
                    placeholder="0"
                    placeholderTextColor="#475569"
                    keyboardType="numeric"
                  />
                </View>
                {expenses.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeExpense(expense.id)} 
                    style={styles.removeButton}
                  >
                    <MaterialCommunityIcons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Savings Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.iconCircle, styles.savingsIconCircle]}>
                  <MaterialCommunityIcons name="piggy-bank-outline" size={20} color="#8b5cf6" />
                </View>
                <Text style={styles.sectionTitle}>Savings Goal</Text>
              </View>
            </View>

            <View style={styles.itemRow}>
              <View style={styles.inputLabelContainer}>
                <MaterialCommunityIcons name="wallet-outline" size={18} color="#64748b" />
                <Text style={styles.savingsLabel}>Monthly Savings</Text>
              </View>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>{currency}</Text>
                <TextInput
                  style={styles.amountInput}
                  value={savings}
                  onChangeText={setSavings}
                  placeholder="0"
                  placeholderTextColor="#475569"
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
            <MaterialCommunityIcons name="calculator" size={22} color="#fff" />
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
    backgroundColor: '#0f172a',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  backButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  incomeIconCircle: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  expenseIconCircle: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  savingsIconCircle: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.3,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 70,
    justifyContent: 'space-between',
  },
  currencyButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  searchInput: {
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#334155',
  },
  currencyList: {
    maxHeight: 380,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currencyFlag: {
    fontSize: 28,
    marginRight: 14,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 17,
    color: '#f1f5f9',
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  currencyCountries: {
    fontSize: 13,
    color: '#94a3b8',
  },
  currencySymbolDisplay: {
    fontSize: 20,
    color: '#3b82f6',
    fontWeight: '700',
    marginLeft: 12,
  },
  noResultsText: {
    color: '#94a3b8',
    textAlign: 'center',
    padding: 24,
    fontSize: 15,
    fontStyle: 'italic',
  },
  customCurrencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  customCurrencyIcon: {
    marginRight: 4,
  },
  customCurrencyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  customInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    color: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  confirmCustomButton: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 12,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelCustomButton: {
    backgroundColor: '#ef4444',
    padding: 14,
    borderRadius: 12,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  closeModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    width: 36,
    height: 36,
    borderRadius: 18,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  optionsContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  optionsTitle: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeOptionsButton: {
    padding: 6,
    marginLeft: 12,
    borderRadius: 8,
    backgroundColor: '#0f172a',
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 5,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  optionButtonAdded: {
    backgroundColor: '#10b981',
    borderWidth: 1.5,
    borderColor: '#22c55e',
    shadowColor: '#10b981',
  },
  customOptionButton: {
    backgroundColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
  },
  checkIcon: {
    marginRight: 2,
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  optionButtonTextAdded: {
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 10,
  },
  nameInput: {
    flex: 1,
    fontSize: 15,
    color: '#f1f5f9',
    paddingVertical: 4,
    fontWeight: '500',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 100,
  },
  currencySymbol: {
    fontSize: 15,
    color: '#3b82f6',
    fontWeight: '700',
    marginRight: 6,
  },
  amountInput: {
    fontSize: 15,
    color: '#f1f5f9',
    fontWeight: '600',
    minWidth: 60,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  savingsLabel: {
    flex: 1,
    fontSize: 15,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  spacer: {
    height: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  calculateButton: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#60a5fa',
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
