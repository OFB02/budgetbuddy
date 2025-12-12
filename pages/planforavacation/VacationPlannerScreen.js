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
import BudgetResultsScreen from '../../budgetresults/BudgetResultsScreen';

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
  { id: 'flights', icon: 'airplane', label: 'Flights', color: '#3b82f6' },
  { id: 'accommodation', icon: 'bed', label: 'Accommodation', color: '#ec4899' },
  { id: 'dailyFood', icon: 'food', label: 'Food per Day', color: '#f59e0b', perPerson: true, perDay: true },
  { id: 'activities', icon: 'ticket', label: 'Activities & Tours', color: '#8b5cf6' },
  { id: 'transportation', icon: 'car', label: 'Local Transport', color: '#10b981' },
  { id: 'shopping', icon: 'shopping', label: 'Shopping', color: '#06b6d4' },
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
  
  // Budget Items
  const [budgetItems, setBudgetItems] = useState({
    flights: '',
    accommodation: '',
    dailyFood: '',
    activities: '',
    transportation: '',
    shopping: '',
  });
  
  // Timeline
  const [monthsToSave, setMonthsToSave] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');

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
    return Object.values(budgetItems).some(val => parseFloat(val) > 0);
  };

  const canProceedFromTimeline = () => {
    return monthsToSave && parseFloat(monthsToSave) > 0;
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
    const months = parseFloat(monthsToSave) || 1;

    const flights = parseFloat(budgetItems.flights) || 0;
    const accommodation = parseFloat(budgetItems.accommodation) || 0;
    const foodTotal = (parseFloat(budgetItems.dailyFood) || 0) * dur * trav;
    const activities = parseFloat(budgetItems.activities) || 0;
    const transportation = parseFloat(budgetItems.transportation) || 0;
    const shopping = parseFloat(budgetItems.shopping) || 0;

    const totalBudget = flights + accommodation + foodTotal + activities + transportation + shopping;
    const emergencyFund = totalBudget * 0.15; // 15% emergency buffer for vacations
    const grandTotal = totalBudget + emergencyFund;
    const currentSaved = parseFloat(currentSavings) || 0;
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
    
    const budgetData = {
      income: budget.grandTotal,
      expenses: {
        flights: budget.flights,
        accommodation: budget.accommodation,
        dining: budget.foodTotal,
        activities: budget.activities,
        transportation: budget.transportation,
        shopping: budget.shopping,
      },
      savings: budget.emergencyFund,
      remaining: budget.currentSaved,
      vacationInfo: {
        destination: budget.destination,
        duration: budget.duration,
        travelers: budget.travelers,
        months: budget.months,
        monthlySavings: budget.monthlySavings,
        category: budget.category,
      },
    };

    return (
      <BudgetResultsScreen
        budgetData={budgetData}
        plannerType="vacation"
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
            <Text style={styles.categoryTitle}>✈️ Plan Your Dream Trip</Text>
            <Text style={styles.categorySubtitle}>Choose your vacation style</Text>

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
                Estimate your costs for each category
              </Text>

              {budgetCategories.map((category) => (
                <View key={category.id} style={styles.budgetItemCard}>
                  <View style={styles.budgetItemHeader}>
                    <View style={[styles.budgetItemIcon, { backgroundColor: `${category.color}20` }]}>
                      <MaterialCommunityIcons name={category.icon} size={24} color={category.color} />
                    </View>
                    <View style={styles.budgetItemInfo}>
                      <Text style={styles.budgetItemLabel}>{category.label}</Text>
                      {category.perPerson && category.perDay && (
                        <Text style={styles.budgetItemHint}>Per person, per day</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.budgetInputContainer}>
                    <Text style={styles.currencySymbol}>{currency}</Text>
                    <TextInput
                      style={styles.budgetInput}
                      placeholder="0"
                      placeholderTextColor="#64748b"
                      value={budgetItems[category.id]}
                      onChangeText={(value) => setBudgetItems({ ...budgetItems, [category.id]: value })}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              ))}

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

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Months Until Trip</Text>
                <View style={styles.inputWithIcon}>
                  <MaterialCommunityIcons name="calendar-range" size={20} color={selectedCategory?.color} />
                  <TextInput
                    style={styles.iconInput}
                    placeholder="How many months?"
                    placeholderTextColor="#64748b"
                    value={monthsToSave}
                    onChangeText={setMonthsToSave}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitLabel}>months</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Savings (Optional)</Text>
                <View style={styles.inputWithIcon}>
                  <Text style={styles.currencySymbol}>{currency}</Text>
                  <TextInput
                    style={styles.iconInput}
                    placeholder="Already saved?"
                    placeholderTextColor="#64748b"
                    value={currentSavings}
                    onChangeText={setCurrentSavings}
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.hintText}>
                  Enter any money you've already saved for this trip
                </Text>
              </View>

              <View style={styles.timelineVisualization}>
                <MaterialCommunityIcons name="beach" size={48} color={selectedCategory?.color} />
                <Text style={styles.timelineText}>
                  {monthsToSave ? `${monthsToSave} months until your ${selectedCategory?.label.toLowerCase()}!` : 'Set your timeline above'}
                </Text>
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
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 100,
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
    minWidth: 60,
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
