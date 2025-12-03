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
} from 'react-native';
import BudgetResultsScreen from '../../budgetresults/BudgetResultsScreen';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (inputValue.trim()) {
      let value = inputValue;
      if (currentQuestion.type === 'currency' || currentQuestion.type === 'number') {
        value = parseFloat(inputValue.replace(/[^0-9.]/g, '')) || 0;
      }
      setAnswers({ ...answers, [currentQuestion.id]: value });

      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
        setInputValue('');
      } else {
        setShowSummary(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setInputValue(answers[questions[currentStep - 1].id]?.toString() || '');
    } else if (onBack) {
      onBack();
    }
  };

  const calculateBudget = () => {
    const duration = answers.duration || 1;
    const travelers = answers.travelers || 1;
    const months = answers.monthsToSave || 1;

    const flights = answers.flights || 0;
    const accommodation = answers.accommodation || 0;
    const foodTotal = (answers.dailyFood || 0) * duration * travelers;
    const activities = answers.activities || 0;
    const transportation = answers.transportation || 0;
    const shopping = answers.shopping || 0;

    const totalBudget = flights + accommodation + foodTotal + activities + transportation + shopping;
    const emergencyFund = totalBudget * 0.1; // 10% emergency buffer
    const grandTotal = totalBudget + emergencyFund;
    const monthlySavings = grandTotal / months;

    return {
      destination: answers.destination,
      duration,
      travelers,
      flights,
      accommodation,
      foodTotal,
      activities,
      transportation,
      shopping,
      totalBudget,
      emergencyFund,
      grandTotal,
      monthlySavings,
      months,
    };
  };

  if (showSummary) {
    const budget = calculateBudget();
    
    // Transform vacation budget to budget data format
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
      remaining: 0,
      vacationInfo: {
        destination: budget.destination,
        duration: budget.duration,
        travelers: budget.travelers,
        months: budget.months,
        monthlySavings: budget.monthlySavings,
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backArrow}>
            <Text style={styles.backArrowText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>✈️ Vacation Planner</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {questions.length}
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionEmoji}>{currentQuestion.emoji}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          <Text style={styles.hintText}>{currentQuestion.hint}</Text>

          <View style={styles.inputContainer}>
            {currentQuestion.type === 'currency' && (
              <Text style={styles.currencySymbol}>$</Text>
            )}
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={currentQuestion.placeholder}
              placeholderTextColor="#666"
              keyboardType={currentQuestion.type === 'text' ? 'default' : 'numeric'}
              autoFocus
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, !inputValue.trim() && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!inputValue.trim()}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === questions.length - 1 ? 'Calculate Budget' : 'Next'}
            </Text>
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
  progressContainer: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#2d2d44',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
    borderRadius: 3,
  },
  progressText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  questionEmoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    borderRadius: 15,
    paddingHorizontal: 20,
  },
  currencySymbol: {
    fontSize: 24,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    fontSize: 24,
    color: '#fff',
    padding: 20,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  nextButton: {
    backgroundColor: '#2ecc71',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#2d2d44',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Summary styles
  summaryContainer: {
    padding: 20,
  },
  summaryEmoji: {
    fontSize: 60,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  destinationText: {
    fontSize: 20,
    color: '#2ecc71',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 5,
  },
  tripDetails: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 25,
  },
  summaryCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  expenseLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  expenseValue: {
    fontSize: 14,
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#3d3d54',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  savingsCard: {
    backgroundColor: '#2ecc7120',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  savingsEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  savingsTitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  savingsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  savingsSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  tipCard: {
    backgroundColor: '#f39c1220',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#f39c12',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: '600',
  },
});
