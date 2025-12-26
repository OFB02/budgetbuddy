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
import ScreenTransition from './components/ScreenTransition';

// Monetization System
import { MonetizationProvider } from './monetization/MonetizationContext';
import PaywallModal from './monetization/PaywallModal';

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
    <MonetizationProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        {/* Welcome Screen - No transition */}
        {currentScreen === 'welcome' && (
          <WelcomeScreen onFinish={handleWelcomeFinish} />
        )}
        
        {/* Budget Selection Screen - Base screen */}
        {currentScreen === 'selection' && (
          <BudgetSelectionScreen onSelectOption={handleSelectOption} />
        )}
        
        {/* Planner Screens - With slide transition */}
        <ScreenTransition isVisible={currentScreen === 'monthly'} direction="left">
          <MonthlyPlannerScreen onBack={handleBackToSelection} />
        </ScreenTransition>
        
        <ScreenTransition isVisible={currentScreen === 'vacation'} direction="left">
          <VacationPlannerScreen onBack={handleBackToSelection} />
        </ScreenTransition>
        
        <ScreenTransition isVisible={currentScreen === 'goal'} direction="left">
          <GoalPlannerScreen onBack={handleBackToSelection} />
        </ScreenTransition>
        
        <ScreenTransition isVisible={currentScreen === 'saved'} direction="left">
          <SavedBudgetsScreen 
            onBack={handleBackToSelection}
            onViewBudget={handleViewSavedBudget}
          />
        </ScreenTransition>
        
        {/* Saved Budget View - With transition */}
        {currentScreen === 'viewBudget' && selectedBudget && (
          <ScreenTransition isVisible={true} direction="left">
            {renderSavedBudgetScreen()}
          </ScreenTransition>
        )}
      </View>
      
      {/* Paywall Modal - Shows when user has no export credits */}
      <PaywallModal />
    </MonetizationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
