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

const goalTypes = [
  { id: 'car', emoji: '🚗', label: 'Buy a Car' },
  { id: 'house', emoji: '🏠', label: 'Down Payment' },
  { id: 'education', emoji: '🎓', label: 'Education' },
  { id: 'wedding', emoji: '💒', label: 'Wedding' },
  { id: 'emergency', emoji: '🛡️', label: 'Emergency Fund' },
  { id: 'retirement', emoji: '🏖️', label: 'Retirement' },
  { id: 'business', emoji: '💼', label: 'Start a Business' },
  { id: 'other', emoji: '✨', label: 'Other Goal' },
];

const questions = [
  {
    id: 'goalName',
    emoji: '📝',
    question: 'What is your goal called?',
    placeholder: 'Name your goal',
    type: 'text',
    hint: 'Give your goal a memorable name',
  },
  {
    id: 'targetAmount',
    emoji: '🎯',
    question: 'How much do you need?',
    placeholder: 'Target amount',
    type: 'currency',
    hint: 'Total amount you want to save',
  },
  {
    id: 'currentSavings',
    emoji: '💰',
    question: 'How much have you already saved?',
    placeholder: 'Current savings',
    type: 'currency',
    hint: 'Enter 0 if starting fresh',
  },
  {
    id: 'monthlyIncome',
    emoji: '💵',
    question: 'What is your monthly income?',
    placeholder: 'Monthly income',
    type: 'currency',
    hint: 'Your total monthly income',
  },
  {
    id: 'monthlyExpenses',
    emoji: '📤',
    question: 'What are your monthly expenses?',
    placeholder: 'Monthly expenses',
    type: 'currency',
    hint: 'Average monthly spending',
  },
  {
    id: 'targetDate',
    emoji: '📅',
    question: 'In how many months do you want to achieve this?',
    placeholder: 'Number of months',
    type: 'number',
    hint: 'Your target timeline',
  },
];

export default function GoalPlannerScreen({ onBack }) {
  const [step, setStep] = useState('type'); // 'type', 'questions', 'summary'
  const [selectedGoalType, setSelectedGoalType] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState('');

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelectGoalType = (goalType) => {
    setSelectedGoalType(goalType);
    setStep('questions');
  };

  const handleNext = () => {
    if (inputValue.trim()) {
      let value = inputValue;
      if (question.type === 'currency' || question.type === 'number') {
        value = parseFloat(inputValue.replace(/[^0-9.]/g, '')) || 0;
      }
      setAnswers({ ...answers, [question.id]: value });

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setInputValue('');
      } else {
        setStep('summary');
      }
    }
  };

  const handleBack = () => {
    if (step === 'summary') {
      setStep('questions');
      setCurrentQuestion(questions.length - 1);
      setInputValue(answers[questions[questions.length - 1].id]?.toString() || '');
    } else if (step === 'questions' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setInputValue(answers[questions[currentQuestion - 1].id]?.toString() || '');
    } else if (step === 'questions' && currentQuestion === 0) {
      setStep('type');
      setSelectedGoalType(null);
    } else if (onBack) {
      onBack();
    }
  };

  const calculatePlan = () => {
    const target = answers.targetAmount || 0;
    const current = answers.currentSavings || 0;
    const income = answers.monthlyIncome || 0;
    const expenses = answers.monthlyExpenses || 0;
    const months = answers.targetDate || 1;

    const amountNeeded = target - current;
    const monthlySavingsNeeded = amountNeeded / months;
    const availableToSave = income - expenses;
    const percentageOfIncome = (monthlySavingsNeeded / income) * 100;
    const isAchievable = monthlySavingsNeeded <= availableToSave;
    const recommendedMonths = availableToSave > 0 ? Math.ceil(amountNeeded / availableToSave) : 0;

    return {
      goalName: answers.goalName,
      target,
      current,
      amountNeeded,
      months,
      monthlySavingsNeeded,
      availableToSave,
      percentageOfIncome,
      isAchievable,
      recommendedMonths,
    };
  };

  // Goal Type Selection Screen
  if (step === 'type') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backArrow}>
            <Text style={styles.backArrowText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🎯 Goal Planner</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.typeContainer}>
          <Text style={styles.typeTitle}>What are you saving for?</Text>
          <Text style={styles.typeSubtitle}>Select your goal type</Text>

          <View style={styles.goalGrid}>
            {goalTypes.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalTypeCard}
                onPress={() => handleSelectGoalType(goal)}
                activeOpacity={0.7}
              >
                <Text style={styles.goalTypeEmoji}>{goal.emoji}</Text>
                <Text style={styles.goalTypeLabel}>{goal.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Summary Screen
  if (step === 'summary') {
    const plan = calculatePlan();
    
    // Transform plan data to budget data format
    const budgetData = {
      income: plan.availableToSave + plan.monthlySavingsNeeded,
      expenses: {
        expenses: answers.monthlyExpenses || 0,
      },
      savings: plan.monthlySavingsNeeded,
      remaining: plan.availableToSave - plan.monthlySavingsNeeded,
      goalInfo: {
        name: plan.goalName,
        emoji: selectedGoalType?.emoji,
        target: plan.target,
        current: plan.current,
        months: plan.months,
        isAchievable: plan.isAchievable,
        recommendedMonths: plan.recommendedMonths,
      },
    };

    return (
      <BudgetResultsScreen
        budgetData={budgetData}
        plannerType="goal"
        onBack={onBack}
      />
    );
  }

  // Questions Screen
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
          <Text style={styles.headerTitle}>
            {selectedGoalType?.emoji} {selectedGoalType?.label}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionEmoji}>{question.emoji}</Text>
          <Text style={styles.questionText}>{question.question}</Text>
          <Text style={styles.hintText}>{question.hint}</Text>

          <View style={styles.inputContainer}>
            {question.type === 'currency' && (
              <Text style={styles.currencySymbol}>$</Text>
            )}
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={question.placeholder}
              placeholderTextColor="#666"
              keyboardType={question.type === 'text' ? 'default' : 'numeric'}
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
              {currentQuestion === questions.length - 1 ? 'Create Plan' : 'Next'}
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
  // Goal Type Selection
  typeContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  typeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  typeSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalTypeCard: {
    width: '48%',
    backgroundColor: '#2d2d44',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  goalTypeEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  goalTypeLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Progress
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
    backgroundColor: '#e74c3c',
    borderRadius: 3,
  },
  progressText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  // Questions
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
    color: '#e74c3c',
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
    backgroundColor: '#e74c3c',
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
  // Summary
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
  goalTypeText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 25,
  },
  progressCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  progressVisual: {
    marginBottom: 15,
  },
  progressBarLarge: {
    height: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 6,
  },
  progressPercentage: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
    paddingVertical: 10,
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
    color: '#aaa',
  },
  divider: {
    height: 1,
    backgroundColor: '#3d3d54',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusCard: {
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  statusEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 18,
  },
  suggestionCard: {
    backgroundColor: '#f39c1220',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  suggestionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: '#f39c12',
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  tipItem: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
    lineHeight: 20,
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
});
