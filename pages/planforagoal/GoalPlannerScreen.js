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
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GoalResultsScreen from '../../budgetresults/GoalResultsScreen';

const goalTypes = [
  { id: 'car', icon: 'car', label: 'Buy a Car', color: '#3b82f6' },
  { id: 'house', icon: 'home', label: 'Down Payment', color: '#10b981' },
  { id: 'education', icon: 'school', label: 'Education', color: '#f59e0b' },
  { id: 'wedding', icon: 'ring', label: 'Wedding', color: '#ec4899' },
  { id: 'emergency', icon: 'shield-check', label: 'Emergency Fund', color: '#ef4444' },
  { id: 'retirement', icon: 'beach', label: 'Retirement', color: '#8b5cf6' },
  { id: 'business', icon: 'briefcase', label: 'Start a Business', color: '#06b6d4' },
  { id: 'other', icon: 'star', label: 'Other Goal', color: '#64748b' },
];

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

const savingsStrategies = [
  { id: 'aggressive', label: 'Aggressive', percentage: 30, icon: 'trending-up' },
  { id: 'moderate', label: 'Moderate', percentage: 20, icon: 'minus' },
  { id: 'conservative', label: 'Conservative', percentage: 10, icon: 'trending-down' },
  { id: 'custom', label: 'Custom', percentage: 0, icon: 'pencil' },
];

export default function GoalPlannerScreen({ onBack }) {
  const [step, setStep] = useState('type'); // 'type', 'basic', 'income', 'expenses', 'savings', 'timeline', 'summary'
  const [selectedGoalType, setSelectedGoalType] = useState(null);
  const [currency, setCurrency] = useState('$');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [customCurrency, setCustomCurrency] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Basic Info
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  
  // Income Sources
  const [incomes, setIncomes] = useState([
    { id: 1, name: 'Salary', amount: '' }
  ]);
  const [nextIncomeId, setNextIncomeId] = useState(2);
  const [showIncomeOptions, setShowIncomeOptions] = useState(false);
  
  // Expenses
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Housing', amount: '' },
    { id: 2, name: 'Groceries', amount: '' },
    { id: 3, name: 'Transportation', amount: '' },
  ]);
  const [nextExpenseId, setNextExpenseId] = useState(4);
  const [showExpenseOptions, setShowExpenseOptions] = useState(false);
  
  // Savings Strategy
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [customSavingsPercentage, setCustomSavingsPercentage] = useState('');
  const [monthlyAdditionalSavings, setMonthlyAdditionalSavings] = useState('');
  
  // Timeline
  const [targetMonths, setTargetMonths] = useState('');
  const [hasDeadline, setHasDeadline] = useState(true);
  const [includeInflation, setIncludeInflation] = useState(false);
  const [inflationRate, setInflationRate] = useState('3');

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
    { symbol: 'S$', code: 'SGD', countries: ['Singapore'], flag: '🇸🇬' },
    { symbol: 'HK$', code: 'HKD', countries: ['Hong Kong'], flag: '🇭🇰' },
    { symbol: 'NT$', code: 'TWD', countries: ['Taiwan'], flag: '🇹🇼' },
    { symbol: 'NZ$', code: 'NZD', countries: ['New Zealand'], flag: '🇳🇿' },
    { symbol: '₪', code: 'ILS', countries: ['Israel'], flag: '🇮🇱' },
    { symbol: 'zł', code: 'PLN', countries: ['Poland'], flag: '🇵🇱' },
    { symbol: 'Kč', code: 'CZK', countries: ['Czech Republic', 'Czechia'], flag: '🇨🇿' },
    { symbol: 'Ft', code: 'HUF', countries: ['Hungary'], flag: '🇭🇺' },
    { symbol: 'lei', code: 'RON', countries: ['Romania'], flag: '🇷🇴' },
    { symbol: 'лв', code: 'BGN', countries: ['Bulgaria'], flag: '🇧🇬' },
    { symbol: 'د.إ', code: 'AED', countries: ['United Arab Emirates', 'UAE', 'Dubai', 'Abu Dhabi'], flag: '🇦🇪' },
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
    { symbol: 'Kz', code: 'AOA', countries: ['Angola'], flag: '🇦🇴' },
    { symbol: 'Dh', code: 'MAD', countries: ['Morocco'], flag: '🇲🇦' },
    { symbol: 'DT', code: 'TND', countries: ['Tunisia'], flag: '🇹🇳' },
    { symbol: '₴', code: 'UAH', countries: ['Ukraine'], flag: '🇺🇦' },
  ];

  // Filter currencies based on search
  const filteredCurrencies = currencies.filter(curr => {
    if (!currencySearch) return true;
    const search = currencySearch.toLowerCase();
    return (
      curr.code.toLowerCase().includes(search) ||
      curr.symbol.includes(search) ||
      curr.countries.some(country => country.toLowerCase().includes(search))
    );
  });

  const handleCustomCurrency = () => {
    if (customCurrency.trim()) {
      setCurrency(customCurrency.trim());
      setShowCustomInput(false);
      setShowCurrencyPicker(false);
      setCustomCurrency('');
      setCurrencySearch('');
    }
  };
  
  // Helper functions for income/expense management
  const isIncomeAdded = (optionName) => {
    return incomes.some(item => {
      const baseName = item.name.split(' #')[0];
      return baseName === optionName;
    });
  };

  const isExpenseAdded = (optionName) => {
    return expenses.some(item => {
      const baseName = item.name.split(' #')[0];
      return baseName === optionName;
    });
  };

  const addIncome = (name = '', closeMenu = true) => {
    let finalName = name;
    if (name) {
      const existingCount = incomes.filter(item => 
        item.name.split(' #')[0] === name
      ).length;
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
    addIncome(name, false);
  };

  const removeIncome = (id) => {
    if (incomes.length > 1) {
      setIncomes(incomes.filter(item => item.id !== id));
    }
  };

  const updateIncome = (id, field, value) => {
    setIncomes(incomes.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addExpense = (name = '', closeMenu = true) => {
    let finalName = name;
    if (name) {
      const existingCount = expenses.filter(item => 
        item.name.split(' #')[0] === name
      ).length;
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
    addExpense(name, false);
  };

  const removeExpense = (id) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(item => item.id !== id));
    }
  };

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Navigation
  const handleSelectGoalType = (goalType) => {
    setSelectedGoalType(goalType);
    setStep('basic');
  };

  const handleBackNavigation = () => {
    const stepOrder = ['type', 'basic', 'income', 'expenses', 'savings', 'timeline', 'summary'];
    const currentIndex = stepOrder.indexOf(step);
    
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    } else if (onBack) {
      onBack();
    }
  };

  const handleNextStep = () => {
    const stepOrder = ['type', 'basic', 'income', 'expenses', 'savings', 'timeline', 'summary'];
    const currentIndex = stepOrder.indexOf(step);
    
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    }
  };

  const canProceedFromBasic = () => {
    return goalName.trim() && targetAmount && parseFloat(targetAmount) > 0;
  };

  const canProceedFromIncome = () => {
    return incomes.some(item => item.name.trim() && parseFloat(item.amount) > 0);
  };

  const canProceedFromExpenses = () => {
    return expenses.some(item => item.name.trim() && parseFloat(item.amount) > 0);
  };

  const canProceedFromSavings = () => {
    if (!selectedStrategy) return false;
    if (selectedStrategy.id === 'custom') {
      return customSavingsPercentage && parseFloat(customSavingsPercentage) > 0;
    }
    return true;
  };

  const canProceedFromTimeline = () => {
    if (!hasDeadline) return true;
    return targetMonths && parseFloat(targetMonths) > 0;
  };

  const calculatePlan = () => {
    const totalIncome = incomes.reduce((sum, item) => 
      sum + (parseFloat(item.amount) || 0), 0
    );

    const totalExpenses = expenses.reduce((sum, item) => 
      sum + (parseFloat(item.amount) || 0), 0
    );

    const target = parseFloat(targetAmount) || 0;
    const current = parseFloat(currentSavings) || 0;
    const amountNeeded = target - current;

    // Calculate savings based on strategy
    let baseSavingsAmount = 0;
    if (selectedStrategy) {
      if (selectedStrategy.id === 'custom') {
        const percentage = parseFloat(customSavingsPercentage) || 0;
        baseSavingsAmount = (totalIncome * percentage) / 100;
      } else {
        baseSavingsAmount = (totalIncome * selectedStrategy.percentage) / 100;
      }
    }

    const additionalSavings = parseFloat(monthlyAdditionalSavings) || 0;
    const totalMonthlySavings = baseSavingsAmount + additionalSavings;
    const availableToSave = totalIncome - totalExpenses;

    // Apply inflation if selected
    let adjustedTarget = target;
    if (includeInflation && targetMonths) {
      const inflation = parseFloat(inflationRate) || 0;
      const months = parseFloat(targetMonths) || 1;
      adjustedTarget = target * Math.pow(1 + (inflation / 100), months / 12);
    }

    const adjustedAmountNeeded = adjustedTarget - current;

    // Calculate timeline
    let calculatedMonths = 0;
    if (totalMonthlySavings > 0) {
      calculatedMonths = Math.ceil(adjustedAmountNeeded / totalMonthlySavings);
    }

    const userTargetMonths = hasDeadline ? (parseFloat(targetMonths) || 0) : null;
    const monthlySavingsNeeded = userTargetMonths && userTargetMonths > 0 
      ? adjustedAmountNeeded / userTargetMonths 
      : totalMonthlySavings;

    const percentageOfIncome = totalIncome > 0 
      ? (monthlySavingsNeeded / totalIncome) * 100 
      : 0;

    const isAchievable = monthlySavingsNeeded <= availableToSave;

    return {
      goalName,
      goalType: selectedGoalType,
      target: adjustedTarget,
      originalTarget: target,
      current,
      amountNeeded: adjustedAmountNeeded,
      monthlyIncome: totalIncome,
      monthlyExpenses: totalExpenses,
      targetMonths: userTargetMonths || calculatedMonths,
      calculatedMonths,
      monthlySavingsNeeded,
      plannedMonthlySavings: totalMonthlySavings,
      availableToSave,
      percentageOfIncome,
      isAchievable,
      recommendedMonths: availableToSave > 0 ? Math.ceil(adjustedAmountNeeded / availableToSave) : 0,
      hasDeadline,
      savingsStrategy: selectedStrategy,
      inflationAdjusted: includeInflation,
      inflationRate: includeInflation ? parseFloat(inflationRate) : 0,
    };
  };

  // Goal Type Selection Screen
  if (step === 'type') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#f1f5f9" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="target" size={20} color="#e74c3c" />
            </View>
            <Text style={styles.headerTitle}>Goal Planner</Text>
          </View>
          <TouchableOpacity 
            style={styles.currencyButton}
            onPress={() => setShowCurrencyPicker(true)}
          >
            <Text style={styles.currencyButtonText}>{currency}</Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color="#e2e8f0" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.typeContainer}>
            <Text style={styles.typeTitle}>What are you saving for?</Text>
            <Text style={styles.typeSubtitle}>Select your financial goal</Text>

            <View style={styles.goalGrid}>
              {goalTypes.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalTypeCard}
                  onPress={() => handleSelectGoalType(goal)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.goalIconContainer, { backgroundColor: `${goal.color}20`, borderColor: `${goal.color}40` }]}>
                    <MaterialCommunityIcons name={goal.icon} size={32} color={goal.color} />
                  </View>
                  <Text style={styles.goalTypeLabel}>{goal.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Currency Picker Modal */}
        <Modal
          visible={showCurrencyPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCurrencyPicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              setShowCurrencyPicker(false);
              setShowCustomInput(false);
              setCurrencySearch('');
              setCustomCurrency('');
            }}
          >
            <TouchableOpacity 
              style={styles.modalContent}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Select Currency</Text>
              
              <TextInput
                style={styles.searchInput}
                placeholder="Search by country or currency..."
                placeholderTextColor="#94a3b8"
                value={currencySearch}
                onChangeText={setCurrencySearch}
              />

              <ScrollView style={styles.currencyList}>
                {filteredCurrencies.map((curr, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.currencyOption}
                    onPress={() => {
                      setCurrency(curr.symbol);
                      setShowCurrencyPicker(false);
                      setCurrencySearch('');
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
                  <Text style={styles.noResultsText}>No currencies found</Text>
                )}
              </ScrollView>

              {!showCustomInput ? (
                <TouchableOpacity 
                  style={styles.customCurrencyButton}
                  onPress={() => setShowCustomInput(true)}
                >
                  <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                  <Text style={styles.customCurrencyButtonText}>Use Custom Currency</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.customInputContainer}>
                  <TextInput
                    style={styles.customInput}
                    placeholder="Enter custom currency symbol..."
                    placeholderTextColor="#94a3b8"
                    value={customCurrency}
                    onChangeText={setCustomCurrency}
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
                  setShowCustomInput(false);
                  setCurrencySearch('');
                  setCustomCurrency('');
                }}
              >
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }

  // Summary Screen
  if (step === 'summary') {
    const plan = calculatePlan();
    
    // Transform plan data to goal results format
    const goalData = {
      goalName: plan.goalName,
      goalType: selectedGoalType,
      targetAmount: plan.target,
      currentSavings: plan.current,
      amountNeeded: plan.amountNeeded,
      monthlyIncome: plan.monthlyIncome,
      monthlyExpenses: plan.monthlyExpenses,
      targetMonths: plan.targetMonths,
      monthlySavingsNeeded: plan.monthlySavingsNeeded,
      availableToSave: plan.availableToSave,
      percentageOfIncome: plan.percentageOfIncome,
      isAchievable: plan.isAchievable,
      recommendedMonths: plan.recommendedMonths,
    };

    return (
      <GoalResultsScreen
        goalData={goalData}
        currency={currency}
        onBack={onBack}
      />
    );
  }

  // Get step information for header
  const getStepInfo = () => {
    const steps = {
      basic: { title: 'Basic Information', icon: 'information', number: 1, total: 5 },
      income: { title: 'Income Sources', icon: 'cash-plus', number: 2, total: 5 },
      expenses: { title: 'Monthly Expenses', icon: 'credit-card-minus', number: 3, total: 5 },
      savings: { title: 'Savings Strategy', icon: 'piggy-bank', number: 4, total: 5 },
      timeline: { title: 'Timeline & Goals', icon: 'calendar-clock', number: 5, total: 5 },
    };
    return steps[step] || steps.basic;
  };

  const stepInfo = getStepInfo();
  const progress = (stepInfo.number / stepInfo.total) * 100;

  // Shared header for all input steps
  const renderStepHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackNavigation} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={[styles.iconCircle, { backgroundColor: `${selectedGoalType?.color}20`, borderColor: `${selectedGoalType?.color}40` }]}>
            <MaterialCommunityIcons name={selectedGoalType?.icon} size={20} color={selectedGoalType?.color} />
          </View>
          <Text style={styles.headerTitle}>{selectedGoalType?.label}</Text>
        </View>
        <TouchableOpacity 
          style={styles.currencyButton}
          onPress={() => setShowCurrencyPicker(true)}
        >
          <Text style={styles.currencyButtonText}>{currency}</Text>
          <MaterialCommunityIcons name="chevron-down" size={16} color="#e2e8f0" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.progressInfo}>
          <MaterialCommunityIcons name={stepInfo.icon} size={16} color="#e74c3c" />
          <Text style={styles.progressText}>
            {stepInfo.title} ({stepInfo.number}/{stepInfo.total})
          </Text>
        </View>
      </View>
    </>
  );

  // Currency Picker Modal (reusable across all steps)
  const renderCurrencyModal = () => (
    <Modal
      visible={showCurrencyPicker}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowCurrencyPicker(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => {
          setShowCurrencyPicker(false);
          setShowCustomInput(false);
          setCurrencySearch('');
          setCustomCurrency('');
        }}
      >
        <TouchableOpacity 
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Select Currency</Text>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search by country or currency..."
            placeholderTextColor="#94a3b8"
            value={currencySearch}
            onChangeText={setCurrencySearch}
          />

          <ScrollView style={styles.currencyList}>
            {filteredCurrencies.map((curr, index) => (
              <TouchableOpacity
                key={index}
                style={styles.currencyOption}
                onPress={() => {
                  setCurrency(curr.symbol);
                  setShowCurrencyPicker(false);
                  setCurrencySearch('');
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
              <Text style={styles.noResultsText}>No currencies found</Text>
            )}
          </ScrollView>

          {!showCustomInput ? (
            <TouchableOpacity 
              style={styles.customCurrencyButton}
              onPress={() => setShowCustomInput(true)}
            >
              <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
              <Text style={styles.customCurrencyButtonText}>Use Custom Currency</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Enter custom currency symbol..."
                placeholderTextColor="#94a3b8"
                value={customCurrency}
                onChangeText={setCustomCurrency}
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
              setShowCustomInput(false);
              setCurrencySearch('');
              setCustomCurrency('');
            }}
          >
            <Text style={styles.closeModalText}>Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  // Basic Information Step
  if (step === 'basic') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {renderStepHeader()}

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="text" size={20} color="#3b82f6" />
                <Text style={styles.sectionTitle}>Goal Name</Text>
              </View>
              <TextInput
                style={styles.fullWidthInput}
                value={goalName}
                onChangeText={setGoalName}
                placeholder="Enter a memorable name for your goal..."
                placeholderTextColor="#475569"
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="target" size={20} color="#3b82f6" />
                <Text style={styles.sectionTitle}>Target Amount</Text>
              </View>
              <View style={styles.itemRow}>
                <View style={styles.inputLabelContainer}>
                  <MaterialCommunityIcons name="bullseye-arrow" size={18} color="#64748b" />
                  <Text style={styles.inputLabel}>How much do you need?</Text>
                </View>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>{currency}</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={targetAmount}
                    onChangeText={setTargetAmount}
                    placeholder="0"
                    placeholderTextColor="#475569"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="wallet" size={20} color="#3b82f6" />
                <Text style={styles.sectionTitle}>Current Savings</Text>
              </View>
              <View style={styles.itemRow}>
                <View style={styles.inputLabelContainer}>
                  <MaterialCommunityIcons name="cash" size={18} color="#64748b" />
                  <Text style={styles.inputLabel}>Already saved</Text>
                </View>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>{currency}</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={currentSavings}
                    onChangeText={setCurrentSavings}
                    placeholder="0"
                    placeholderTextColor="#475569"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <Text style={styles.hintText}>Enter 0 if you're starting fresh</Text>
            </View>

            <View style={styles.spacer} />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.nextButton, !canProceedFromBasic() && styles.nextButtonDisabled]}
              onPress={handleNextStep}
              disabled={!canProceedFromBasic()}
            >
              <Text style={styles.nextButtonText}>Continue to Income</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {renderCurrencyModal()}
      </SafeAreaView>
    );
  }

  // Income Sources Step
  if (step === 'income') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {renderStepHeader()}

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                      <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
                      <Text style={styles.optionButtonText}>Custom</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {incomes.map((income) => (
                <View key={income.id} style={styles.itemRow}>
                  <View style={styles.inputLabelContainer}>
                    <MaterialCommunityIcons name="text" size={18} color="#64748b" />
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

            <View style={styles.spacer} />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.nextButton, !canProceedFromIncome() && styles.nextButtonDisabled]}
              onPress={handleNextStep}
              disabled={!canProceedFromIncome()}
            >
              <Text style={styles.nextButtonText}>Continue to Expenses</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {renderCurrencyModal()}
      </SafeAreaView>
    );
  }

  // Expenses Step
  if (step === 'expenses') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {renderStepHeader()}

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <View style={[styles.iconCircle, styles.expenseIconCircle]}>
                    <MaterialCommunityIcons name="credit-card-minus-outline" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.sectionTitle}>Monthly Expenses</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setShowExpenseOptions(!showExpenseOptions)} 
                  style={styles.addButton}
                >
                  <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

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
                      <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
                      <Text style={styles.optionButtonText}>Custom</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {expenses.map((expense) => (
                <View key={expense.id} style={styles.itemRow}>
                  <View style={styles.inputLabelContainer}>
                    <MaterialCommunityIcons name="text" size={18} color="#64748b" />
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

            <View style={styles.spacer} />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.nextButton, !canProceedFromExpenses() && styles.nextButtonDisabled]}
              onPress={handleNextStep}
              disabled={!canProceedFromExpenses()}
            >
              <Text style={styles.nextButtonText}>Continue to Savings</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {renderCurrencyModal()}
      </SafeAreaView>
    );
  }

  // Savings Strategy Step
  if (step === 'savings') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {renderStepHeader()}

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="strategy" size={20} color="#8b5cf6" />
                <Text style={styles.sectionTitle}>Choose Your Savings Strategy</Text>
              </View>
              <Text style={styles.hintText}>Select what percentage of your income to save</Text>

              <View style={styles.strategyGrid}>
                {savingsStrategies.map((strategy) => (
                  <TouchableOpacity
                    key={strategy.id}
                    style={[
                      styles.strategyCard,
                      selectedStrategy?.id === strategy.id && styles.strategyCardSelected
                    ]}
                    onPress={() => setSelectedStrategy(strategy)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons 
                      name={strategy.icon} 
                      size={28} 
                      color={selectedStrategy?.id === strategy.id ? '#8b5cf6' : '#64748b'} 
                    />
                    <Text style={[
                      styles.strategyLabel,
                      selectedStrategy?.id === strategy.id && styles.strategyLabelSelected
                    ]}>
                      {strategy.label}
                    </Text>
                    {strategy.percentage > 0 && (
                      <Text style={[
                        styles.strategyPercentage,
                        selectedStrategy?.id === strategy.id && styles.strategyPercentageSelected
                      ]}>
                        {strategy.percentage}%
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {selectedStrategy?.id === 'custom' && (
                <View style={styles.customPercentageContainer}>
                  <Text style={styles.customPercentageLabel}>Custom Percentage</Text>
                  <View style={styles.itemRow}>
                    <View style={styles.inputLabelContainer}>
                      <MaterialCommunityIcons name="percent" size={18} color="#64748b" />
                      <Text style={styles.inputLabel}>Percentage of income</Text>
                    </View>
                    <View style={styles.amountInputContainer}>
                      <TextInput
                        style={styles.amountInput}
                        value={customSavingsPercentage}
                        onChangeText={setCustomSavingsPercentage}
                        placeholder="0"
                        placeholderTextColor="#475569"
                        keyboardType="numeric"
                      />
                      <Text style={styles.percentSymbol}>%</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="plus-circle" size={20} color="#3b82f6" />
                <Text style={styles.sectionTitle}>Additional Monthly Savings (Optional)</Text>
              </View>
              <Text style={[styles.hintText, { marginBottom: 20 }]}>Any extra amount you can save each month</Text>

              <View style={styles.itemRow}>
                <View style={styles.inputLabelContainer}>
                  <MaterialCommunityIcons name="cash-plus" size={18} color="#64748b" />
                  <Text style={styles.inputLabel}>Extra savings</Text>
                </View>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>{currency}</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={monthlyAdditionalSavings}
                    onChangeText={setMonthlyAdditionalSavings}
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
              style={[styles.nextButton, !canProceedFromSavings() && styles.nextButtonDisabled]}
              onPress={handleNextStep}
              disabled={!canProceedFromSavings()}
            >
              <Text style={styles.nextButtonText}>Continue to Timeline</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {renderCurrencyModal()}
      </SafeAreaView>
    );
  }

  // Timeline Step
  if (step === 'timeline') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {renderStepHeader()}

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color="#e74c3c" />
                <Text style={styles.sectionTitle}>Timeline</Text>
              </View>

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setHasDeadline(!hasDeadline)}
              >
                <View style={styles.toggleLeft}>
                  <MaterialCommunityIcons 
                    name={hasDeadline ? "calendar-check" : "calendar-remove"} 
                    size={20} 
                    color="#3b82f6" 
                  />
                  <Text style={styles.toggleLabel}>I have a target deadline</Text>
                </View>
                <View style={[styles.toggleSwitch, hasDeadline && styles.toggleSwitchActive]}>
                  <View style={[styles.toggleThumb, hasDeadline && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>

              {hasDeadline && (
                <View style={styles.itemRow}>
                  <View style={styles.inputLabelContainer}>
                    <MaterialCommunityIcons name="calendar" size={18} color="#64748b" />
                    <Text style={styles.inputLabel}>Target months</Text>
                  </View>
                  <View style={styles.amountInputContainer}>
                    <TextInput
                      style={styles.amountInput}
                      value={targetMonths}
                      onChangeText={setTargetMonths}
                      placeholder="12"
                      placeholderTextColor="#475569"
                      keyboardType="numeric"
                    />
                    <Text style={styles.monthsLabel}>mo</Text>
                  </View>
                </View>
              )}

              {!hasDeadline && (
                <Text style={styles.infoText}>
                  We'll calculate the timeline based on your savings strategy
                </Text>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="chart-line" size={20} color="#f59e0b" />
                <Text style={styles.sectionTitle}>Advanced Options</Text>
              </View>

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setIncludeInflation(!includeInflation)}
              >
                <View style={styles.toggleLeft}>
                  <MaterialCommunityIcons 
                    name="trending-up" 
                    size={20} 
                    color="#f59e0b" 
                  />
                  <Text style={styles.toggleLabel}>Include inflation adjustment</Text>
                </View>
                <View style={[styles.toggleSwitch, includeInflation && styles.toggleSwitchActive]}>
                  <View style={[styles.toggleThumb, includeInflation && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>

              {includeInflation && (
                <View style={styles.itemRow}>
                  <View style={styles.inputLabelContainer}>
                    <MaterialCommunityIcons name="percent" size={18} color="#64748b" />
                    <Text style={styles.inputLabel}>Annual inflation rate</Text>
                  </View>
                  <View style={styles.amountInputContainer}>
                    <TextInput
                      style={styles.amountInput}
                      value={inflationRate}
                      onChangeText={setInflationRate}
                      placeholder="3"
                      placeholderTextColor="#475569"
                      keyboardType="numeric"
                    />
                    <Text style={styles.percentSymbol}>%</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.spacer} />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.nextButton, !canProceedFromTimeline() && styles.nextButtonDisabled]}
              onPress={() => setStep('summary')}
              disabled={!canProceedFromTimeline()}
            >
              <Text style={styles.nextButtonText}>Create Goal Plan</Text>
              <MaterialCommunityIcons name="check" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {renderCurrencyModal()}
      </SafeAreaView>
    );
  }

  // Default return (should never reach here)
  return null;
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
  placeholder: {
    width: 70,
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
  // Currency Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#e74c3c',
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
  // Goal Type Selection
  scrollView: {
    flex: 1,
  },
  typeContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  typeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  typeSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalTypeCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  goalTypeLabel: {
    fontSize: 14,
    color: '#f1f5f9',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Progress
  progressContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#0f172a',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  progressText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  // Section Styles
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
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
  // Options Container
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
  // Item Rows
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
  inputLabel: {
    flex: 1,
    fontSize: 15,
    color: '#f1f5f9',
    fontWeight: '500',
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
  percentSymbol: {
    fontSize: 15,
    color: '#3b82f6',
    fontWeight: '700',
    marginLeft: 6,
  },
  monthsLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    marginLeft: 6,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  fullWidthInput: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
    fontWeight: '500',
  },
  hintText: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  // Strategy Cards
  strategyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  strategyCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
    gap: 8,
  },
  strategyCardSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  strategyLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  strategyLabelSelected: {
    color: '#f1f5f9',
    fontWeight: '700',
  },
  strategyPercentage: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '700',
  },
  strategyPercentageSelected: {
    color: '#8b5cf6',
  },
  customPercentageContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  customPercentageLabel: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Toggle Styles
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#3b82f6',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  spacer: {
    height: 20,
  },
  // Button Container
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  nextButton: {
    backgroundColor: '#e74c3c',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#ec7063',
  },
  nextButtonDisabled: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    shadowOpacity: 0,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
