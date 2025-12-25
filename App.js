import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import WelcomeScreen from './pages/welcome/WelcomeScreen';
import BudgetSelectionScreen from './pages/budgetselection/BudgetSelectionScreen';
import MonthlyPlannerScreen from './pages/monthlyplanner/MonthlyPlannerScreen';
import VacationPlannerScreen from './pages/planforavacation/VacationPlannerScreen';
import GoalPlannerScreen from './pages/planforagoal/GoalPlannerScreen';
import SavedBudgetsScreen from './pages/Saved/SavedBudgetsScreen';
import BudgetResultsScreen from './budgetresults/BudgetResultsScreen';
import VacationResultsScreen from './budgetresults/VacationResultsScreen';
import GoalResultsScreen from './budgetresults/GoalResultsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleWelcomeFinish = () => {
    setCurrentScreen('selection');
  };

  const handleSelectOption = (option) => {
    if (option === 'saved') {
      setCurrentScreen('saved');
    } else {
      setCurrentScreen(option);
    }
  };

  const handleBackToSelection = () => {
    setCurrentScreen('selection');
    setSelectedBudget(null);
  };

  const handleViewSavedBudget = (budget) => {
    setSelectedBudget(budget);
    setCurrentScreen('viewBudget');
  };

  const handleBackToSaved = () => {
    setCurrentScreen('saved');
    setSelectedBudget(null);
  };

  const renderSavedBudgetScreen = () => {
    if (!selectedBudget) return null;

    const { plannerType, budgetData, currency } = selectedBudget;

    // Route to the appropriate screen based on budget type
    if (plannerType === 'vacation') {
      return (
        <VacationResultsScreen
          vacationData={budgetData}
          currency={currency || '$'}
          onBack={handleBackToSaved}
        />
      );
    } else if (plannerType === 'goal') {
      return (
        <GoalResultsScreen
          goalData={budgetData}
          currency={currency || '$'}
          onBack={handleBackToSaved}
        />
      );
    } else {
      // Default to monthly budget (plannerType === 'monthly' or undefined)
      return (
        <BudgetResultsScreen
          budgetData={budgetData}
          plannerType={plannerType || 'monthly'}
          currency={currency || '$'}
          onBack={handleBackToSaved}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {currentScreen === 'welcome' && (
        <WelcomeScreen onFinish={handleWelcomeFinish} />
      )}
      {currentScreen === 'selection' && (
        <BudgetSelectionScreen onSelectOption={handleSelectOption} />
      )}
      {currentScreen === 'monthly' && (
        <MonthlyPlannerScreen onBack={handleBackToSelection} />
      )}
      {currentScreen === 'vacation' && (
        <VacationPlannerScreen onBack={handleBackToSelection} />
      )}
      {currentScreen === 'goal' && (
        <GoalPlannerScreen onBack={handleBackToSelection} />
      )}
      {currentScreen === 'saved' && (
        <SavedBudgetsScreen 
          onBack={handleBackToSelection}
          onViewBudget={handleViewSavedBudget}
        />
      )}
      {currentScreen === 'viewBudget' && selectedBudget && renderSavedBudgetScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
