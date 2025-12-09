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
      {currentScreen === 'viewBudget' && selectedBudget && (
        <BudgetResultsScreen
          budgetData={selectedBudget.budgetData}
          plannerType={selectedBudget.plannerType}
          currency={selectedBudget.currency}
          onBack={handleBackToSaved}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
