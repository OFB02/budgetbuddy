import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import WelcomeScreen from './pages/welcome/WelcomeScreen';
import BudgetSelectionScreen from './pages/budgetselection/BudgetSelectionScreen';
import MonthlyPlannerScreen from './pages/monthlyplanner/MonthlyPlannerScreen';
import VacationPlannerScreen from './pages/planforavacation/VacationPlannerScreen';
import GoalPlannerScreen from './pages/planforagoal/GoalPlannerScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const handleWelcomeFinish = () => {
    setCurrentScreen('selection');
  };

  const handleSelectOption = (option) => {
    setCurrentScreen(option);
  };

  const handleBackToSelection = () => {
    setCurrentScreen('selection');
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
