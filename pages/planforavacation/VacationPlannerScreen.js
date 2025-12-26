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
import DateTimePicker from '@react-native-community/datetimepicker';
import VacationResultsScreen from '../../budgetresults/VacationResultsScreen';

const vacationCategories = [
  {
    id: 'beach',
    icon: 'beach',
    label: 'Beach Paradise',
    color: '#06b6d4',
    gradient: ['#06b6d4', '#0891b2'],
  },
  {
    id: 'city',
    icon: 'city',
    label: 'City Explorer',
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#7c3aed'],
  },
  {
    id: 'adventure',
    icon: 'terrain',
    label: 'Adventure',
    color: '#f59e0b',
    gradient: ['#f59e0b', '#d97706'],
  },
  {
    id: 'cruise',
    icon: 'ferry',
    label: 'Cruise',
    color: '#3b82f6',
    gradient: ['#3b82f6', '#2563eb'],
  },
  {
    id: 'ski',
    icon: 'ski',
    label: 'Ski Trip',
    color: '#10b981',
    gradient: ['#10b981', '#059669'],
  },
  {
    id: 'cultural',
    icon: 'bank',
    label: 'Cultural Tour',
    color: '#ec4899',
    gradient: ['#ec4899', '#db2777'],
  },
  {
    id: 'safari',
    icon: 'elephant',
    label: 'Safari',
    color: '#f97316',
    gradient: ['#f97316', '#ea580c'],
  },
  {
    id: 'relaxation',
    icon: 'spa',
    label: 'Spa & Relax',
    color: '#a855f7',
    gradient: ['#a855f7', '#9333ea'],
  },
  {
    id: 'other',
    icon: 'compass-rose',
    label: 'Other',
    color: '#14b8a6',
    gradient: ['#14b8a6', '#0d9488'],
  },
];

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

const budgetCategories = [
  { id: 'flights', icon: 'airplane', label: 'Flights', color: '#3b82f6', isTotal: true, allowToggle: false },
  { id: 'accommodation', icon: 'bed', label: 'Accommodation', color: '#ec4899', isTotal: true, allowToggle: true },
  { id: 'dailyFood', icon: 'food', label: 'Food', color: '#f59e0b', perDay: true, allowToggle: true },
  { id: 'activities', icon: 'ticket', label: 'Activities & Tours', color: '#8b5cf6', isTotal: true, allowToggle: true },
  { id: 'transportation', icon: 'car', label: 'Local Transport', color: '#10b981', isTotal: true, allowToggle: true },
  { id: 'shopping', icon: 'shopping', label: 'Shopping', color: '#06b6d4', isTotal: true, allowToggle: true },
];

const questions = [
  {
    id: 'destination',
    emoji: '🌍',
    question: 'Where do you want to go?',
    placeholder: 'Enter destination',
    type: 'text',
    hint: 'Your dream vacation destination',
  },
  {
    id: 'duration',
    emoji: '📆',
    question: 'How many days is your trip?',
    placeholder: 'Number of days',
    type: 'number',
    hint: 'Total duration of your vacation',
  },
  {
    id: 'travelers',
    emoji: '👥',
    question: 'How many people are traveling?',
    placeholder: 'Number of travelers',
    type: 'number',
    hint: 'Including yourself',
  },
  {
    id: 'flights',
    emoji: '✈️',
    question: 'Estimated flight costs?',
    placeholder: 'Flight budget',
    type: 'currency',
    hint: 'Round-trip flights for all travelers',
  },
  {
    id: 'accommodation',
    emoji: '🏨',
    question: 'How much for accommodation?',
    placeholder: 'Hotel/Airbnb budget',
    type: 'currency',
    hint: 'Total lodging cost for entire stay',
  },
  {
    id: 'dailyFood',
    emoji: '🍽️',
    question: 'Daily food budget per person?',
    placeholder: 'Food per day',
    type: 'currency',
    hint: 'Meals and snacks per person per day',
  },
  {
    id: 'activities',
    emoji: '🎢',
    question: 'Budget for activities & tours?',
    placeholder: 'Activities budget',
    type: 'currency',
    hint: 'Tours, attractions, entertainment',
  },
  {
    id: 'transportation',
    emoji: '🚕',
    question: 'Local transportation budget?',
    placeholder: 'Local transport',
    type: 'currency',
    hint: 'Taxis, rental car, public transit',
  },
  {
    id: 'shopping',
    emoji: '🛍️',
    question: 'Shopping & souvenirs budget?',
    placeholder: 'Shopping budget',
    type: 'currency',
    hint: 'Gifts, souvenirs, personal shopping',
  },
  {
    id: 'monthsToSave',
    emoji: '⏰',
    question: 'How many months until your trip?',
    placeholder: 'Months to save',
    type: 'number',
    hint: 'Time you have to save up',
  },
];

export default function VacationPlannerScreen({ onBack }) {
  const [step, setStep] = useState('category'); // 'category', 'details', 'budget', 'timeline', 'summary'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currency, setCurrency] = useState('$');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  
  // Basic Details
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [travelers, setTravelers] = useState('');
  
  // Budget Items - storing both total and per person values
  const [budgetItems, setBudgetItems] = useState({
    flights: { total: '', perPerson: '' },
    accommodation: { total: '', perPerson: '' },
    dailyFood: { total: '', perPerson: '' },
    activities: { total: '', perPerson: '' },
    transportation: { total: '', perPerson: '' },
    shopping: { total: '', perPerson: '' },
  });
  
  // Track which categories are enabled
  const [enabledCategories, setEnabledCategories] = useState(
    budgetCategories.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  );
  
  // Track whether each category is daily or total - default to daily for all
  const [categoryTimePeriod, setCategoryTimePeriod] = useState(
    budgetCategories.reduce((acc, cat) => ({ 
      ...acc, 
      [cat.id]: 'daily' // Start with daily as default for all categories
    }), {})
  );
  
  // Custom categories added by user
  const [customCategories, setCustomCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Timeline
  const [monthsToSave, setMonthsToSave] = useState('');
  const [daysToSave, setDaysToSave] = useState('');
  const [currentSavings, setCurrentSavings] = useState({ total: '', perPerson: '' });
  const [tripDate, setTripDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  // Helper Functions
  const handleBackNavigation = () => {
    const stepOrder = ['category', 'details', 'budget', 'timeline'];
    const currentIndex = stepOrder.indexOf(step);
    
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    } else if (onBack) {
      onBack();
    }
  };

  const handleNextStep = () => {
    const stepOrder = ['category', 'details', 'budget', 'timeline', 'summary'];
    const currentIndex = stepOrder.indexOf(step);
    
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    }
  };

  const canProceedFromDetails = () => {
    return destination.trim() && duration && travelers && 
           parseFloat(duration) > 0 && parseFloat(travelers) > 0;
  };

  const canProceedFromBudget = () => {
    return Object.values(budgetItems).some(item => 
      parseFloat(item.total) > 0 || parseFloat(item.perPerson) > 0
    );
  };

  // Toggle category enabled/disabled
  const toggleCategory = (categoryId) => {
    setEnabledCategories({
      ...enabledCategories,
      [categoryId]: !enabledCategories[categoryId],
    });
    
    // Clear budget for disabled category
    if (enabledCategories[categoryId]) {
      setBudgetItems({
        ...budgetItems,
        [categoryId]: { total: '', perPerson: '' },
      });
    }
  };

  // Remove custom category
  const removeCustomCategory = (categoryId) => {
    setCustomCategories(customCategories.filter(cat => cat.id !== categoryId));
    const newBudgetItems = { ...budgetItems };
    delete newBudgetItems[categoryId];
    setBudgetItems(newBudgetItems);
    const newEnabledCategories = { ...enabledCategories };
    delete newEnabledCategories[categoryId];
    setEnabledCategories(newEnabledCategories);
  };

  // Add custom category
  const addCustomCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const categoryId = `custom_${Date.now()}`;
    const customColors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#3b82f6'];
    const customIcons = ['wallet', 'gift', 'card', 'cash', 'bank', 'ticket-percent'];
    
    const newCategory = {
      id: categoryId,
      icon: customIcons[customCategories.length % customIcons.length],
      label: newCategoryName.trim(),
      color: customColors[customCategories.length % customColors.length],
      isTotal: true,
      isCustom: true,
      allowToggle: true,
    };
    
    setCustomCategories([...customCategories, newCategory]);
    setBudgetItems({
      ...budgetItems,
      [categoryId]: { total: '', perPerson: '' },
    });
    setEnabledCategories({
      ...enabledCategories,
      [categoryId]: true,
    });
    setCategoryTimePeriod({
      ...categoryTimePeriod,
      [categoryId]: 'total',
    });
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  // Get all categories (built-in + custom)
  const getAllCategories = () => {
    return [...budgetCategories, ...customCategories];
  };

  // Toggle time period (daily vs total)
  const toggleTimePeriod = (categoryId) => {
    const currentPeriod = categoryTimePeriod[categoryId];
    const newPeriod = currentPeriod === 'daily' ? 'total' : 'daily';
    
    setCategoryTimePeriod({
      ...categoryTimePeriod,
      [categoryId]: newPeriod,
    });
    
    // Clear the budget values when switching
    setBudgetItems({
      ...budgetItems,
      [categoryId]: { total: '', perPerson: '' },
    });
  };

  // Handle budget input changes with automatic calculation
  const handleBudgetChange = (categoryId, field, value, category) => {
    const numValue = parseFloat(value) || 0;
    const trav = parseFloat(travelers) || 1;
    const dur = parseFloat(duration) || 1;
    const isDaily = categoryTimePeriod[categoryId] === 'daily';

    let newTotal = '';
    let newPerPerson = '';

    if (field === 'total') {
      newTotal = value;
      if (numValue > 0) {
        // Calculate per person based on total
        if (isDaily) {
          // For daily expenses, divide by travelers and days
          newPerPerson = (numValue / (trav * dur)).toFixed(2);
        } else {
          // For one-time expenses, divide by travelers only
          newPerPerson = (numValue / trav).toFixed(2);
        }
      }
    } else if (field === 'perPerson') {
      newPerPerson = value;
      if (numValue > 0) {
        // Calculate total based on per person
        if (isDaily) {
          // For daily expenses, multiply by travelers and days
          newTotal = (numValue * trav * dur).toFixed(2);
        } else {
          // For one-time expenses, multiply by travelers only
          newTotal = (numValue * trav).toFixed(2);
        }
      }
    }

    setBudgetItems({
      ...budgetItems,
      [categoryId]: {
        total: newTotal,
        perPerson: newPerPerson,
      },
    });
  };

  const canProceedFromTimeline = () => {
    return (monthsToSave && parseFloat(monthsToSave) > 0) || (daysToSave && parseFloat(daysToSave) > 0);
  };

  // Calculate time difference from date
  const calculateTimeFromDate = (selectedDate) => {
    const today = new Date();
    const tripDateTime = new Date(selectedDate);
    
    // Reset time to midnight for accurate day calculation
    today.setHours(0, 0, 0, 0);
    tripDateTime.setHours(0, 0, 0, 0);
    
    const diffTime = tripDateTime - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = (diffDays / 30).toFixed(1);
    
    return { days: Math.max(0, diffDays), months: Math.max(0, parseFloat(diffMonths)) };
  };

  // Handle date selection from calendar
  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate && event.type !== 'dismissed') {
      setTripDate(selectedDate);
      const { days, months } = calculateTimeFromDate(selectedDate);
      setDaysToSave(days.toString());
      setMonthsToSave(months.toString());
    }
  };

  // Handle timeline input changes
  const handleTimelineChange = (field, value) => {
    const numValue = parseFloat(value) || 0;

    // Clear trip date when manually editing
    setTripDate(null);

    if (field === 'months') {
      setMonthsToSave(value);
      if (numValue > 0) {
        // Convert months to days (approximate: 1 month = 30 days)
        setDaysToSave((numValue * 30).toFixed(0));
      } else {
        setDaysToSave('');
      }
    } else if (field === 'days') {
      setDaysToSave(value);
      if (numValue > 0) {
        // Convert days to months (approximate: 30 days = 1 month)
        setMonthsToSave((numValue / 30).toFixed(1));
      } else {
        setMonthsToSave('');
      }
    }
  };

  // Handle current savings changes
  const handleCurrentSavingsChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    const trav = parseFloat(travelers) || 1;

    let newTotal = '';
    let newPerPerson = '';

    if (field === 'total') {
      newTotal = value;
      if (numValue > 0) {
        newPerPerson = (numValue / trav).toFixed(2);
      }
    } else if (field === 'perPerson') {
      newPerPerson = value;
      if (numValue > 0) {
        newTotal = (numValue * trav).toFixed(2);
      }
    }

    setCurrentSavings({
      total: newTotal,
      perPerson: newPerPerson,
    });
  };

  const getStepInfo = () => {
    const steps = {
      category: { number: 1, total: 4, title: 'Vacation Type', icon: 'beach' },
      details: { number: 2, total: 4, title: 'Trip Details', icon: 'information' },
      budget: { number: 3, total: 4, title: 'Budget Planning', icon: 'cash-multiple' },
      timeline: { number: 4, total: 4, title: 'Savings Timeline', icon: 'calendar-clock' },
    };
    return steps[step] || steps.category;
  };

  const calculateBudget = () => {
    const dur = parseFloat(duration) || 1;
    const trav = parseFloat(travelers) || 1;
    // Use months if available, otherwise convert days to months
    const months = parseFloat(monthsToSave) || (parseFloat(daysToSave) / 30) || 1;

    // Calculate total from all enabled categories
    let totalBudget = 0;
    const categoryBreakdown = {};
    
    const allCategories = getAllCategories();
    allCategories.forEach(category => {
      if (enabledCategories[category.id] && budgetItems[category.id]) {
        const categoryTotal = parseFloat(budgetItems[category.id].total) || 0;
        categoryBreakdown[category.id] = {
          label: category.label,
          amount: categoryTotal,
          color: category.color,
        };
        totalBudget += categoryTotal;
      }
    });

    // Get specific categories for compatibility
    const flights = parseFloat(budgetItems.flights?.total) || 0;
    const accommodation = parseFloat(budgetItems.accommodation?.total) || 0;
    const foodTotal = parseFloat(budgetItems.dailyFood?.total) || 0;
    const activities = parseFloat(budgetItems.activities?.total) || 0;
    const transportation = parseFloat(budgetItems.transportation?.total) || 0;
    const shopping = parseFloat(budgetItems.shopping?.total) || 0;

    const emergencyFund = totalBudget * 0.15; // 15% emergency buffer for vacations
    const grandTotal = totalBudget + emergencyFund;
    const currentSaved = parseFloat(currentSavings.total) || 0;
    const amountNeeded = Math.max(0, grandTotal - currentSaved);
    const monthlySavings = amountNeeded / months;

    return {
      destination,
      duration: dur,
      travelers: trav,
      flights,
      accommodation,
      foodTotal,
      activities,
      transportation,
      shopping,
      categoryBreakdown,
      totalBudget,
      emergencyFund,
      grandTotal,
      currentSaved,
      amountNeeded,
      monthlySavings,
      months,
      category: selectedCategory,
    };
  };

  // Filter currencies
  const filteredCurrencies = currencies.filter(curr => {
    if (!currencySearch) return true;
    const search = currencySearch.toLowerCase();
    return (
      curr.code.toLowerCase().includes(search) ||
      curr.symbol.includes(search) ||
      curr.countries.some(country => country.toLowerCase().includes(search))
    );
  });

  // Show summary/results
  if (step === 'summary') {
    const budget = calculateBudget();
    
    const vacationData = {
      destination: budget.destination,
      vacationType: budget.category?.label,
      vacationIcon: budget.category?.icon,
      vacationColor: budget.category?.color,
      duration: budget.duration,
      travelers: budget.travelers,
      flights: budget.flights,
      accommodation: budget.accommodation,
      foodTotal: budget.foodTotal,
      dailyFoodPerPerson: budgetItems.dailyFood.perPerson ? parseFloat(budgetItems.dailyFood.perPerson) : null,
      activities: budget.activities,
      transportation: budget.transportation,
      shopping: budget.shopping,
      totalBudget: budget.totalBudget,
      emergencyFund: budget.emergencyFund,
      grandTotal: budget.grandTotal,
      currentSaved: budget.currentSaved,
      amountNeeded: budget.amountNeeded,
      monthlySavings: budget.monthlySavings,
      monthsToSave: budget.months,
    };

    return (
      <VacationResultsScreen
        vacationData={vacationData}
        currency={currency}
        onBack={onBack}
      />
    );
  }

  const stepInfo = getStepInfo();
  const progress = (stepInfo.number / stepInfo.total) * 100;

  // Category Selection Screen
  if (step === 'category') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vacation Planner</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.categoryContainer}>
            <View style={styles.titleIconContainer}>
              <MaterialCommunityIcons name="map-marker-path" size={40} color="#06b6d4" />
            </View>
            <Text style={styles.categoryTitle}>Plan Your Perfect Vacation</Text>
            <Text style={styles.categorySubtitle}>Choose your vacation style to get started</Text>

            <View style={styles.categoryGrid}>
              {vacationCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => {
                    setSelectedCategory(category);
                    setStep('details');
                  }}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}20`, borderColor: `${category.color}40` }]}>
                    <MaterialCommunityIcons name={category.icon} size={32} color={category.color} />
                  </View>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Render Header for all input steps
  const renderStepHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackNavigation} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={[styles.iconCircle, { backgroundColor: `${selectedCategory?.color}20`, borderColor: `${selectedCategory?.color}40` }]}>
            <MaterialCommunityIcons name={selectedCategory?.icon} size={20} color={selectedCategory?.color} />
          </View>
          <Text style={styles.headerTitle}>{selectedCategory?.label}</Text>
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
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: selectedCategory?.color }]} />
        </View>
        <View style={styles.progressInfo}>
          <MaterialCommunityIcons name={stepInfo.icon} size={16} color={selectedCategory?.color} />
          <Text style={styles.progressText}>
            {stepInfo.title} ({stepInfo.number}/{stepInfo.total})
          </Text>
        </View>
      </View>
    </>
  );

  // Currency Modal
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
          setCurrencySearch('');
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
                  </Text>
                </View>
                <Text style={styles.currencySymbolDisplay}>{curr.symbol}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity 
            style={styles.closeModalButton}
            onPress={() => {
              setShowCurrencyPicker(false);
              setCurrencySearch('');
            }}
          >
            <Text style={styles.closeModalText}>Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  // Details Step
  if (step === 'details') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {renderStepHeader()}
          {renderCurrencyModal()}

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="map-marker" size={24} color={selectedCategory?.color} />
                <Text style={styles.sectionTitle}>Trip Details</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Destination</Text>
                <TextInput
                  style={styles.fullWidthInput}
                  placeholder="Where are you going?"
                  placeholderTextColor="#64748b"
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>

              <View style={styles.twoColumnRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Duration</Text>
                  <View style={styles.inputWithIcon}>
                    <MaterialCommunityIcons name="calendar" size={20} color={selectedCategory?.color} />
                    <TextInput
                      style={styles.iconInput}
                      placeholder="Days"
                      placeholderTextColor="#64748b"
                      value={duration}
                      onChangeText={setDuration}
                      keyboardType="numeric"
                    />
                    <Text style={styles.unitLabel}>days</Text>
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Travelers</Text>
                  <View style={styles.inputWithIcon}>
                    <MaterialCommunityIcons name="account-group" size={20} color={selectedCategory?.color} />
                    <TextInput
                      style={styles.iconInput}
                      placeholder="People"
                      placeholderTextColor="#64748b"
                      value={travelers}
                      onChangeText={setTravelers}
                      keyboardType="numeric"
                    />
                    <Text style={styles.unitLabel}>people</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.hintText}>
                💡 Pro tip: The more details you provide, the more accurate your budget plan will be!
              </Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: selectedCategory?.color }, !canProceedFromDetails() && styles.nextButtonDisabled]}
              onPress={handleNextStep}
              disabled={!canProceedFromDetails()}
            >
              <Text style={styles.nextButtonText}>Continue to Budget</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Budget Step
  if (step === 'budget') {
    const allCategories = getAllCategories();
    
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {renderStepHeader()}
          {renderCurrencyModal()}

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="wallet" size={24} color={selectedCategory?.color} />
                <Text style={styles.sectionTitle}>Budget Breakdown</Text>
              </View>

              <Text style={styles.sectionSubtitle}>
                Estimate your costs for each category. Use the calendar icon to toggle between daily and total costs. Tap the eye icon to hide categories you don't need.
              </Text>

              {allCategories.map((category) => {
                const isEnabled = enabledCategories[category.id];
                const isDaily = categoryTimePeriod[category.id] === 'daily';
                
                return (
                  <View key={category.id} style={[
                    styles.budgetItemCardExpanded,
                    !isEnabled && styles.budgetItemDisabled
                  ]}>
                    <View style={styles.budgetItemHeaderRow}>
                      <View style={[styles.budgetItemIcon, { backgroundColor: `${category.color}20` }]}>
                        <MaterialCommunityIcons name={category.icon} size={24} color={category.color} />
                      </View>
                      <View style={styles.budgetItemInfo}>
                        <Text style={styles.budgetItemLabel}>{category.label}</Text>
                        <Text style={styles.budgetItemHint}>
                          {isDaily ? 'Per day' : 'Total cost'}
                        </Text>
                      </View>
                      <View style={styles.budgetItemActions}>
                        {category.allowToggle && isEnabled && (
                          <TouchableOpacity
                            onPress={() => toggleTimePeriod(category.id)}
                            style={styles.toggleButton}
                          >
                            <MaterialCommunityIcons 
                              name={isDaily ? "calendar-today" : "calendar-range"} 
                              size={20} 
                              color={selectedCategory?.color} 
                            />
                          </TouchableOpacity>
                        )}
                        {category.isCustom ? (
                          <TouchableOpacity
                            onPress={() => removeCustomCategory(category.id)}
                            style={styles.removeButton}
                          >
                            <MaterialCommunityIcons name="delete" size={20} color="#ef4444" />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => toggleCategory(category.id)}
                            style={styles.toggleButton}
                          >
                            <MaterialCommunityIcons 
                              name={isEnabled ? "eye" : "eye-off"} 
                              size={20} 
                              color={isEnabled ? selectedCategory?.color : "#64748b"} 
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    
                    {isEnabled && (
                      <View style={styles.dualInputRow}>
                        <View style={styles.dualInputContainer}>
                          <Text style={styles.dualInputLabel}>
                            {isDaily ? 'Per Person/Day' : 'Per Person'}
                          </Text>
                          <View style={styles.budgetInputContainer}>
                            <Text style={styles.currencySymbol}>{currency}</Text>
                            <TextInput
                              style={styles.budgetInput}
                              placeholder="0"
                              placeholderTextColor="#64748b"
                              value={budgetItems[category.id]?.perPerson || ''}
                              onChangeText={(value) => handleBudgetChange(category.id, 'perPerson', value, category)}
                              keyboardType="numeric"
                            />
                          </View>
                        </View>

                        <View style={styles.dualInputSeparator}>
                          <MaterialCommunityIcons name="swap-horizontal" size={20} color="#64748b" />
                        </View>

                        <View style={styles.dualInputContainer}>
                          <Text style={styles.dualInputLabel}>
                            {isDaily ? 'Total/Day' : 'Total'}
                          </Text>
                          <View style={styles.budgetInputContainer}>
                            <Text style={styles.currencySymbol}>{currency}</Text>
                            <TextInput
                              style={styles.budgetInput}
                              placeholder="0"
                              placeholderTextColor="#64748b"
                              value={budgetItems[category.id]?.total || ''}
                              onChangeText={(value) => handleBudgetChange(category.id, 'total', value, category)}
                              keyboardType="numeric"
                            />
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}

              {/* Add Custom Category Button */}
              {!showAddCategory ? (
                <TouchableOpacity
                  style={styles.addCategoryButton}
                  onPress={() => setShowAddCategory(true)}
                >
                  <MaterialCommunityIcons name="plus-circle" size={24} color={selectedCategory?.color} />
                  <Text style={[styles.addCategoryText, { color: selectedCategory?.color }]}>
                    Add Custom Category
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.addCategoryCard}>
                  <Text style={styles.addCategoryCardTitle}>New Category</Text>
                  <View style={styles.addCategoryInputRow}>
                    <TextInput
                      style={styles.addCategoryInput}
                      placeholder="Category name (e.g., Parking, Visa fees)"
                      placeholderTextColor="#64748b"
                      value={newCategoryName}
                      onChangeText={setNewCategoryName}
                      autoFocus
                    />
                  </View>
                  <View style={styles.addCategoryButtons}>
                    <TouchableOpacity
                      style={styles.cancelCategoryButton}
                      onPress={() => {
                        setShowAddCategory(false);
                        setNewCategoryName('');
                      }}
                    >
                      <Text style={styles.cancelCategoryText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.saveCategoryButton, { backgroundColor: selectedCategory?.color }]}
                      onPress={addCustomCategory}
                      disabled={!newCategoryName.trim()}
                    >
                      <MaterialCommunityIcons name="check" size={20} color="#fff" />
                      <Text style={styles.saveCategoryText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="lightbulb" size={20} color="#f59e0b" />
                <Text style={styles.infoCardText}>
                  Don't worry if you're not sure about exact amounts. You can always adjust later!
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: selectedCategory?.color }, !canProceedFromBudget() && styles.nextButtonDisabled]}
              onPress={handleNextStep}
              disabled={!canProceedFromBudget()}
            >
              <Text style={styles.nextButtonText}>Continue to Timeline</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
          {renderCurrencyModal()}

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="calendar-clock" size={24} color={selectedCategory?.color} />
                <Text style={styles.sectionTitle}>Savings Timeline</Text>
              </View>

              <Text style={styles.sectionSubtitle}>
                When's the big trip? Let's create your savings plan
              </Text>

              <View style={styles.timelineInputCard}>
                <Text style={styles.cardTitle}>Select Trip Date</Text>
                <Text style={styles.cardSubtitle}>
                  Pick your departure date from the calendar
                </Text>
                
                <TouchableOpacity
                  style={[styles.datePickerButton, { borderColor: selectedCategory?.color }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialCommunityIcons name="calendar-month" size={24} color={selectedCategory?.color} />
                  <View style={styles.datePickerButtonContent}>
                    <Text style={styles.datePickerLabel}>Trip Date</Text>
                    <Text style={styles.datePickerValue}>
                      {tripDate 
                        ? tripDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })
                        : 'Select a date'}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#94a3b8" />
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={tripDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    textColor="#f1f5f9"
                    themeVariant="dark"
                  />
                )}

                {Platform.OS === 'ios' && showDatePicker && (
                  <View style={styles.datePickerActions}>
                    <TouchableOpacity
                      style={styles.datePickerCancelButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.datePickerCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.datePickerConfirmButton, { backgroundColor: selectedCategory?.color }]}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.datePickerConfirmText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.timelineInputCard}>
                <Text style={styles.cardTitle}>Manual Time Entry</Text>
                <Text style={styles.cardSubtitle}>
                  Enter time until trip manually
                </Text>
                
                <View style={styles.dualInputRow}>
                  <View style={styles.dualInputContainer}>
                    <Text style={styles.dualInputLabel}>Months</Text>
                    <View style={styles.inputWithIcon}>
                      <MaterialCommunityIcons name="calendar-range" size={20} color={selectedCategory?.color} />
                      <TextInput
                        style={styles.iconInput}
                        placeholder="0"
                        placeholderTextColor="#64748b"
                        value={monthsToSave}
                        onChangeText={(value) => handleTimelineChange('months', value)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.dualInputSeparator}>
                    <MaterialCommunityIcons name="swap-horizontal" size={20} color="#64748b" />
                  </View>

                  <View style={styles.dualInputContainer}>
                    <Text style={styles.dualInputLabel}>Days</Text>
                    <View style={styles.inputWithIcon}>
                      <MaterialCommunityIcons name="calendar" size={20} color={selectedCategory?.color} />
                      <TextInput
                        style={styles.iconInput}
                        placeholder="0"
                        placeholderTextColor="#64748b"
                        value={daysToSave}
                        onChangeText={(value) => handleTimelineChange('days', value)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.timelineInputCard}>
                <Text style={styles.cardTitle}>Current Savings (Optional)</Text>
                <Text style={styles.cardSubtitle}>
                  Money you've already saved for this trip
                </Text>
                
                <View style={styles.dualInputRow}>
                  <View style={styles.dualInputContainer}>
                    <Text style={styles.dualInputLabel}>Per Person</Text>
                    <View style={styles.inputWithIcon}>
                      <Text style={styles.currencySymbol}>{currency}</Text>
                      <TextInput
                        style={styles.iconInput}
                        placeholder="0"
                        placeholderTextColor="#64748b"
                        value={currentSavings.perPerson}
                        onChangeText={(value) => handleCurrentSavingsChange('perPerson', value)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.dualInputSeparator}>
                    <MaterialCommunityIcons name="swap-horizontal" size={20} color="#64748b" />
                  </View>

                  <View style={styles.dualInputContainer}>
                    <Text style={styles.dualInputLabel}>Total</Text>
                    <View style={styles.inputWithIcon}>
                      <Text style={styles.currencySymbol}>{currency}</Text>
                      <TextInput
                        style={styles.iconInput}
                        placeholder="0"
                        placeholderTextColor="#64748b"
                        value={currentSavings.total}
                        onChangeText={(value) => handleCurrentSavingsChange('total', value)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.timelineVisualization}>
                <MaterialCommunityIcons name="beach" size={48} color={selectedCategory?.color} />
                {tripDate ? (
                  <>
                    <Text style={styles.timelineText}>
                      Departing on {tripDate.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </Text>
                    <Text style={styles.timelineSubText}>
                      {monthsToSave && parseFloat(monthsToSave) > 0
                        ? `${Math.round(parseFloat(monthsToSave))} months (${Math.round(parseFloat(daysToSave))} days) until your ${selectedCategory?.label.toLowerCase()}!`
                        : 'Your trip is today or in the past!'}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.timelineText}>
                    {monthsToSave || daysToSave 
                      ? `${monthsToSave ? Math.round(parseFloat(monthsToSave)) + ' months' : ''} ${monthsToSave && daysToSave ? '(' + Math.round(parseFloat(daysToSave)) + ' days)' : daysToSave ? Math.round(parseFloat(daysToSave)) + ' days' : ''} until your ${selectedCategory?.label.toLowerCase()}!` 
                      : 'Set your timeline above'}
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: selectedCategory?.color }, !canProceedFromTimeline() && styles.nextButtonDisabled]}
              onPress={() => setStep('summary')}
              disabled={!canProceedFromTimeline()}
            >
              <Text style={styles.nextButtonText}>Calculate My Plan</Text>
              <MaterialCommunityIcons name="chart-line" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
  scrollView: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.3,
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
  
  // Category Selection
  categoryContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  titleIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  categorySubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
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
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#f1f5f9',
    fontWeight: '600',
    textAlign: 'center',
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
    maxHeight: '70%',
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
    maxHeight: 350,
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
    color: '#06b6d4',
    fontWeight: '700',
    marginLeft: 12,
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

  // Sections
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#94a3b8',
    marginBottom: 24,
    lineHeight: 22,
  },

  // Input Groups
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fullWidthInput: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
    fontWeight: '500',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  iconInput: {
    flex: 1,
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  unitLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Budget Items
  budgetItemCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetItemCardExpanded: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  budgetItemDisabled: {
    opacity: 0.5,
  },
  budgetItemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  budgetItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  budgetItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetItemInfo: {
    flex: 1,
  },
  budgetItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  budgetItemHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  budgetItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#334155',
    gap: 10,
  },
  addCategoryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  addCategoryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addCategoryCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  addCategoryInputRow: {
    marginBottom: 16,
  },
  addCategoryInput: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  addCategoryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelCategoryButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cancelCategoryText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
  },
  saveCategoryButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  saveCategoryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  dualInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dualInputContainer: {
    flex: 1,
  },
  dualInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dualInputSeparator: {
    paddingTop: 20,
    paddingHorizontal: 4,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
    flex: 1,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#06b6d4',
    fontWeight: '700',
    marginRight: 6,
  },
  budgetInput: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '600',
    flex: 1,
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    color: '#f59e0b',
    lineHeight: 18,
  },

  // Timeline
  timelineVisualization: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timelineText: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
  timelineInputCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 16,
  },

  // Date Picker
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    gap: 12,
  },
  datePickerButtonContent: {
    flex: 1,
  },
  datePickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  datePickerValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  datePickerCancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  datePickerCancelText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
  },
  datePickerConfirmButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  datePickerConfirmText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginHorizontal: 16,
    letterSpacing: 1,
  },
  timelineSubText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },

  // Buttons
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  nextButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
