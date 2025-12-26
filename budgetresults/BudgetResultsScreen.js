import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  TextInput,
  Animated,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SankeyDiagram from './SankeyDiagram';
import CircleDiagrams from './CircleDiagrams';
import { useMonetization } from '../monetization/MonetizationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORAGE_KEY = '@budgetbuddy_saved_budgets';

export default function BudgetResultsScreen({ budgetData, plannerType, currency = '$', onBack }) {
  const diagramRef = useRef(null);
  const exportRef = useRef(null); // Separate ref for export
  const [isExporting, setIsExporting] = useState(false);
  const [showCircleDiagrams, setShowCircleDiagrams] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Monetization hook
  const { handleExport, exportCredits, isPremium } = useMonetization();

  // Handle smooth chart transition with sliding
  const handleChartToggle = (showDonut) => {
    // Determine slide direction
    // If going to donut (true), slide from right to left (positive to 0)
    // If going to flow (false), slide from left to right (negative to 0)
    const fromValue = showDonut ? SCREEN_WIDTH : -SCREEN_WIDTH;
    
    // First slide out current chart
    Animated.timing(slideAnim, {
      toValue: showDonut ? -SCREEN_WIDTH : SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Switch the chart
      setShowCircleDiagrams(showDonut);
      
      // Reset position to opposite side
      slideAnim.setValue(fromValue);
      
      // Slide in new chart
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const renderTitle = () => {
    const titles = {
      monthly: 'Monthly Budget Flow',
      goal: 'Goal Savings Plan',
      vacation: 'Vacation Budget Plan',
    };
    return titles[plannerType] || 'Budget Analysis';
  };

  const getTitleIcon = () => {
    const icons = {
      monthly: 'calendar-month',
      goal: 'target',
      vacation: 'airplane',
    };
    return icons[plannerType] || 'chart-box';
  };

  const renderPlannerSpecificInfo = () => {
    if (plannerType === 'goal' && budgetData?.goalInfo) {
      const { name, emoji, target, current, months, isAchievable, recommendedMonths } = budgetData.goalInfo;
      const progress = target > 0 ? (current / target) * 100 : 0;
      
      return (
        <View style={styles.plannerInfoCard}>
          <MaterialCommunityIcons name={emoji || 'target'} size={48} color="#4a69bd" style={styles.plannerInfoIcon} />
          <Text style={styles.plannerInfoTitle}>{name || 'My Goal'}</Text>
          <View style={styles.goalProgressBar}>
            <View style={[styles.goalProgressFill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>
          <View style={styles.goalProgressTextContainer}>
            <View style={styles.amountWithCurrency}>
              <Text style={styles.currencySymbolSubtle}>{currency}</Text>
              <Text style={styles.goalProgressText}>
                {(current || 0).toLocaleString()}
              </Text>
            </View>
            <Text style={styles.goalProgressText}> of </Text>
            <View style={styles.amountWithCurrency}>
              <Text style={styles.currencySymbolSubtle}>{currency}</Text>
              <Text style={styles.goalProgressText}>
                {(target || 0).toLocaleString()}
              </Text>
            </View>
            <Text style={styles.goalProgressText}> ({progress.toFixed(1)}%)</Text>
          </View>
          <View style={styles.plannerInfoDetailRow}>
            <MaterialCommunityIcons 
              name={isAchievable ? 'check-circle' : 'alert-circle'} 
              size={18} 
              color={isAchievable ? '#2ecc71' : '#f39c12'} 
            />
            <Text style={styles.plannerInfoDetail}>
              {isAchievable 
                ? `Achievable in ${months} months!` 
                : `Consider ${recommendedMonths} months instead`}
            </Text>
          </View>
        </View>
      );
    }
    
    if (plannerType === 'vacation' && budgetData?.vacationInfo) {
      const { destination, duration, travelers, months, monthlySavings } = budgetData.vacationInfo;
      
      return (
        <View style={styles.plannerInfoCard}>
          <MaterialCommunityIcons name="airplane" size={48} color="#4a69bd" style={styles.plannerInfoIcon} />
          <Text style={styles.plannerInfoTitle}>{destination || 'Your Trip'}</Text>
          <Text style={styles.plannerInfoDetail}>
            {duration || 0} days • {travelers || 1} traveler{travelers > 1 ? 's' : ''}
          </Text>
          <View style={styles.savingsGoalRow}>
            <MaterialCommunityIcons name="piggy-bank" size={20} color="#2ecc71" />
            <Text style={styles.savingsGoalText}>Save </Text>
            <View style={styles.amountWithCurrency}>
              <Text style={styles.currencySymbolSubtle}>{currency}</Text>
              <Text style={styles.savingsGoalText}>
                {(monthlySavings || 0).toLocaleString()}
              </Text>
            </View>
            <Text style={styles.savingsGoalText}>/month for {months || 0} months</Text>
          </View>
        </View>
      );
    }
    
    return null;
  };

  const renderInsights = () => {
    const { income = 0, expenses = {}, savings = 0, remaining = 0 } = budgetData || {};
    const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (val || 0), 0);
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;
    const expenseRate = income > 0 ? ((totalExpenses / income) * 100).toFixed(1) : 0;
    const isHealthy = remaining >= 0 && savingsRate >= 10;

    return (
      <View style={styles.insightsContainer}>
        <View style={[styles.insightCard, { backgroundColor: isHealthy ? '#2ecc7120' : '#f39c1220' }]}>
          <MaterialCommunityIcons 
            name={isHealthy ? 'check-circle' : 'lightbulb-on'} 
            size={40} 
            color={isHealthy ? '#2ecc71' : '#f39c12'} 
            style={styles.insightIcon}
          />
          <View style={styles.insightContent}>
            <Text style={[styles.insightTitle, { color: isHealthy ? '#2ecc71' : '#f39c12' }]}>
              {isHealthy ? 'Healthy Budget!' : 'Budget Insights'}
            </Text>
            <Text style={styles.insightText}>
              {isHealthy
                ? `You're saving ${savingsRate}% of your income and have a positive cash flow.`
                : remaining < 0
                ? 'Your expenses exceed your income. Consider reducing non-essential spending.'
                : savingsRate < 10
                ? 'Try to increase your savings to at least 10% of your income for financial security.'
                : "Your budget looks good, but there's room for improvement."}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="cash" size={32} color="#2ecc71" style={styles.statIcon} />
            <Text style={styles.statLabel}>Income</Text>
            <View style={styles.amountWithCurrency}>
              <Text style={styles.currencySymbolSubtle}>{currency}</Text>
              <Text style={styles.statValue}>{income.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="credit-card-outline" size={32} color="#e74c3c" style={styles.statIcon} />
            <Text style={styles.statLabel}>Expenses</Text>
            <View style={styles.amountWithCurrency}>
              <Text style={styles.currencySymbolSubtle}>{currency}</Text>
              <Text style={styles.statValue}>{totalExpenses.toLocaleString()}</Text>
            </View>
            <Text style={styles.statPercent}>{expenseRate}%</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="piggy-bank" size={32} color="#4a69bd" style={styles.statIcon} />
            <Text style={styles.statLabel}>Savings</Text>
            <View style={styles.amountWithCurrency}>
              <Text style={styles.currencySymbolSubtle}>{currency}</Text>
              <Text style={styles.statValue}>{savings.toLocaleString()}</Text>
            </View>
            <Text style={styles.statPercent}>{savingsRate}%</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="wallet" size={32} color="#f39c12" style={styles.statIcon} />
            <Text style={styles.statLabel}>Remaining</Text>
            <View style={styles.amountWithCurrency}>
              <Text style={styles.currencySymbolSubtle}>{currency}</Text>
              <Text style={[styles.statValue, { color: remaining >= 0 ? '#2ecc71' : '#e74c3c' }]}>
                {remaining.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Export Image
  const handleExportImage = async () => {
    // Wrap the actual export logic in handleExport from monetization
    handleExport(async () => {
      try {
        setIsExporting(true);
        
        // Use exportRef which captures the full non-scrollable diagram
        const refToCapture = exportRef.current ? exportRef : diagramRef;
        
        const uri = await captureRef(refToCapture, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
          // Let it capture the natural size of the content
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Save your Budget Flow',
          });
        } else {
          Alert.alert('Success', 'Image saved successfully!');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to export image: ' + error.message);
      } finally {
        setIsExporting(false);
      }
    });
  };

  // Export to CSV (Excel-compatible)
  const handleExportToExcel = async () => {
    // Wrap the actual export logic in handleExport from monetization
    handleExport(async () => {
      try {
        setIsExporting(true);
      const { income = 0, expenses = {}, savings = 0, remaining = 0 } = budgetData || {};
      
      // Create beautifully formatted CSV content
      let csvLines = [];
      
      // ========== HEADER SECTION ==========
      csvLines.push(`"MONTHLY BUDGET PLAN",,,,`);
      csvLines.push(`"Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}",,,,`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== BUDGET SUMMARY SECTION ==========
      csvLines.push('"===== BUDGET OVERVIEW =====",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Category","Amount","Percentage"');
      csvLines.push(`"Total Income","${currency}${income}","100.00%"`);
      csvLines.push(',,,,');
      
      // ========== EXPENSES BREAKDOWN ==========
      csvLines.push('"===== EXPENSES BREAKDOWN =====",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Category","Amount","Percentage"');
      
      const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (val || 0), 0);
      
      Object.entries(expenses).forEach(([key, value]) => {
        const percentage = income > 0 ? ((value / income) * 100).toFixed(2) : 0;
        csvLines.push(`"${formatLabel(key)}","${currency}${value}","${percentage}%"`);
      });
      
      csvLines.push(',,,,');
      csvLines.push(`"Total Expenses","${currency}${totalExpenses}","${income > 0 ? ((totalExpenses / income) * 100).toFixed(2) : 0}%"`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== SAVINGS & REMAINING ==========
      csvLines.push('"===== SAVINGS & REMAINING =====",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Category","Amount","Percentage"');
      csvLines.push(`"Savings","${currency}${savings}","${income > 0 ? ((savings / income) * 100).toFixed(2) : 0}%"`);
      csvLines.push(`"Remaining","${currency}${remaining}","${income > 0 ? ((remaining / income) * 100).toFixed(2) : 0}%"`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== CHART DATA SECTION ==========
      csvLines.push('"===== CHART-READY DATA =====",,,,');
      csvLines.push('"Use this data to create charts:",,,,');
      csvLines.push(',,,,');
      
      // Financial Breakdown for Pie Chart
      csvLines.push('"EXPENSES DISTRIBUTION (Pie Chart Data)",,,,');
      csvLines.push('"Category","Amount",,,"Percentage"');
      Object.entries(expenses).forEach(([key, value]) => {
        const percentage = income > 0 ? ((value / income) * 100).toFixed(2) : 0;
        csvLines.push(`"${formatLabel(key)}",${value},,,${percentage}`);
      });
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // Budget Summary for Bar Chart
      csvLines.push('"BUDGET SUMMARY (Bar Chart Data)",,,,');
      csvLines.push('"Metric","Amount"');
      csvLines.push(`"Income",${income}`);
      csvLines.push(`"Total Expenses",${totalExpenses}`);
      csvLines.push(`"Savings",${savings}`);
      csvLines.push(`"Remaining",${remaining}`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== INSIGHTS ==========
      const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;
      const expenseRate = income > 0 ? ((totalExpenses / income) * 100).toFixed(1) : 0;
      const isHealthy = remaining >= 0 && savingsRate >= 10;
      
      csvLines.push('"===== BUDGET INSIGHTS =====",,,,');
      csvLines.push(',,,,');
      
      if (isHealthy) {
        csvLines.push(`"CHECK","Healthy Budget! You're saving ${savingsRate}% of your income.",,`);
        csvLines.push(`"TIP","Keep up the great work with your savings habits!",,`);
      } else if (remaining < 0) {
        csvLines.push(`"ALERT","Your expenses exceed your income by ${currency}${Math.abs(remaining)}.",,`);
        csvLines.push(`"TIP","Consider reducing non-essential spending to balance your budget.",,`);
      } else if (savingsRate < 10) {
        csvLines.push(`"TIP","Try to increase your savings to at least 10% of your income.",,`);
        csvLines.push(`"TIP","Current savings rate: ${savingsRate}%",,`);
      }
      
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== FOOTER ==========
      csvLines.push('"=============================",,,,');
      csvLines.push(`"Created with BudgetBuddy","","","Export Date: ${new Date().toLocaleDateString()}",`);
      
      const csvContent = csvLines.join('\n');

      const fileName = `MonthlyBudget_${new Date().toISOString().split('T')[0]}_${Date.now()}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Write file
      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      // Verify file was created
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('File was not created successfully');
      }

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Budget Data',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Export Successful', `File saved as: ${fileName}`);
      }
    } catch (error) {
      console.error('Error exporting:', error);
      Alert.alert(
        'Export Error', 
        `Failed to export budget data.\n\nError: ${error.message || 'Unknown error'}\n\nPlease try again.`
      );
    } finally {
      setIsExporting(false);
    }
    }); // Close handleExport callback
  };

  // Save Budget
  const handleSaveBudget = async () => {
    Alert.prompt(
      'Save Budget',
      'Enter a name for this budget:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async (budgetName) => {
            if (!budgetName || budgetName.trim() === '') {
              Alert.alert('Error', 'Please enter a valid name');
              return;
            }

            try {
              setIsSaving(true);
              
              // Create budget object
              const newBudget = {
                id: Date.now().toString(),
                name: budgetName.trim(),
                plannerType,
                budgetData,
                currency,
                savedAt: Date.now(),
              };

              // Load existing budgets
              const existingBudgetsJson = await AsyncStorage.getItem(STORAGE_KEY);
              const existingBudgets = existingBudgetsJson ? JSON.parse(existingBudgetsJson) : [];

              // Add new budget to the beginning of the array
              const updatedBudgets = [newBudget, ...existingBudgets];

              // Save to storage
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBudgets));

              Alert.alert('Success', 'Budget saved successfully!');
            } catch (error) {
              console.error('Error saving budget:', error);
              Alert.alert('Error', 'Failed to save budget: ' + error.message);
            } finally {
              setIsSaving(false);
            }
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const formatLabel = (key) => {
    const labels = {
      housing: 'Housing',
      utilities: 'Utilities',
      groceries: 'Groceries',
      transportation: 'Transportation',
      subscriptions: 'Subscriptions',
      entertainment: 'Entertainment',
      dining: 'Dining Out',
      flights: 'Flights',
      accommodation: 'Accommodation',
      activities: 'Activities',
      shopping: 'Shopping',
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{renderTitle()}</Text>
        
        {/* Monetization Status Badge */}
        <View style={styles.statusBadge}>
          {isPremium ? (
            <View style={styles.premiumBadge}>
              <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          ) : (
            <View style={styles.creditsBadge}>
              <MaterialCommunityIcons name="ticket" size={14} color="#4CAF50" />
              <Text style={styles.creditsText}>{exportCredits}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          {showCircleDiagrams ? 'Your Financial Donut Visualization' : 'Your Financial Flow Visualization'}
        </Text>

        {/* Planner-specific info */}
        {renderPlannerSpecificInfo()}

        {/* Chart Type Toggle */}
        <View style={styles.chartToggleContainer}>
          <View style={styles.toggleTabsContainer}>
            <TouchableOpacity 
              style={[styles.toggleTab, !showCircleDiagrams && styles.toggleTabActive]}
              onPress={() => handleChartToggle(false)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="chart-sankey" 
                size={20} 
                color={!showCircleDiagrams ? '#fff' : '#888'} 
              />
              <Text style={[styles.toggleTabText, !showCircleDiagrams && styles.toggleTabTextActive]}>
                Flow
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toggleTab, showCircleDiagrams && styles.toggleTabActive]}
              onPress={() => handleChartToggle(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="chart-donut" 
                size={20} 
                color={showCircleDiagrams ? '#fff' : '#888'} 
              />
              <Text style={[styles.toggleTabText, showCircleDiagrams && styles.toggleTabTextActive]}>
                Donut
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Diagram Container */}
        <Animated.View 
          style={[
            styles.diagramContainer, 
            { 
              transform: [{ translateX: slideAnim }]
            }
          ]} 
          ref={diagramRef} 
          collapsable={false}
        >
          {showCircleDiagrams ? (
            <CircleDiagrams budgetData={budgetData} currency={currency} />
          ) : (
            <SankeyDiagram budgetData={budgetData} currency={currency} />
          )}
          
          <Text style={styles.scrollHint}>
            {showCircleDiagrams 
              ? '� View your income vs expenses distribution at a glance'
              : '👈 Swipe left/right to explore the full diagram'}
          </Text>
        </Animated.View>

        {/* Export Buttons */}
        <Animated.View 
          style={[
            styles.exportContainer,
            { 
              transform: [{ translateX: slideAnim }]
            }
          ]}
        >
          <View style={styles.exportTitleRow}>
            <MaterialCommunityIcons name="export" size={20} color="#fff" />
            <Text style={styles.exportTitle}> Export Options</Text>
          </View>
          <View style={styles.exportButtonsRow}>
            <TouchableOpacity 
              style={[styles.exportButton, styles.imageButton]}
              onPress={handleExportImage}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="image" size={32} color="#fff" style={styles.exportButtonIcon} />
                  <Text style={styles.exportButtonText} numberOfLines={1}>Export Image</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.exportButton, styles.excelButton]}
              onPress={handleExportToExcel}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="file-excel" size={32} color="#fff" style={styles.exportButtonIcon} />
                  <Text style={styles.exportButtonText} numberOfLines={1}>Export to Spreadsheet</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Save Budget Button */}
        <TouchableOpacity 
          style={styles.saveBudgetButton}
          onPress={handleSaveBudget}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="bookmark-plus" size={24} color="#fff" />
              <Text style={styles.saveBudgetButtonText}> Save This Budget</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Insights and Stats */}
        {renderInsights()}

        {/* Legend - Dynamic based on diagram type */}
        <View style={styles.legendContainer}>
          <View style={styles.legendTitleRow}>
            <MaterialCommunityIcons name="information" size={20} color="#fff" />
            <Text style={styles.legendTitle}> How to read this diagram</Text>
          </View>
          {showCircleDiagrams ? (
            <>
              <Text style={styles.legendText}>
                The donut charts above provide a visual breakdown of your income sources and spending distribution.
                Each segment's size represents its proportion of the total.
              </Text>
              <Text style={styles.legendText}>
                • Top chart: Shows where your income comes from{'\n'}
                • Bottom chart: Shows where your money goes{'\n'}
                • Percentages: Show each item's share of your total income{'\n'}
                • Colors: Help distinguish between different categories
              </Text>
              <Text style={styles.legendText}>
                💡 Tip: Compare the two charts to see if your spending aligns with your income distribution.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.legendText}>
                The flow chart above shows how your income sources combine and distribute across different categories.
                The width of each flow represents the proportion of money flowing through that path.
              </Text>
              <Text style={styles.legendText}>
                • Left side: Your income sources{'\n'}
                • Middle: Combined total income{'\n'}
                • Right side: Destinations (expenses, savings, remaining)
              </Text>
              <Text style={styles.legendText}>
                💡 Tip: Wider flows indicate larger amounts of money moving through that category.
              </Text>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={onBack}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#fff" />
          <Text style={styles.doneButtonText}> Done</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Hidden export view - captures full diagram without scroll constraints */}
      <View 
        style={styles.exportView} 
        ref={exportRef} 
        collapsable={false}
      >
        <View style={styles.exportHeader}>
          <Text style={styles.exportHeaderTitle}>{renderTitle()}</Text>
          <Text style={styles.exportHeaderSubtitle}>
            {showCircleDiagrams ? 'Budget Donut Visualization' : 'Budget Flow Visualization'}
          </Text>
        </View>
        <View style={styles.exportDiagramWrapper}>
          {showCircleDiagrams ? (
            <CircleDiagrams budgetData={budgetData} currency={currency} />
          ) : (
            <SankeyDiagram budgetData={budgetData} currency={currency} />
          )}
        </View>
        <View style={styles.exportFooter}>
          <Text style={styles.exportFooterText}>
            Created with BudgetBuddy • {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 42, 62, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 42, 62, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  creditsText: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
  },
  chartToggleContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 5,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#232340',
    borderRadius: 12,
    padding: 4,
  },
  toggleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  toggleTabActive: {
    backgroundColor: '#4a69bd',
  },
  toggleTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  toggleTabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  diagramContainer: {
    backgroundColor: '#232340',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 20,
    minHeight: 300,
    overflow: 'hidden',
  },
  toggleButton: {
    backgroundColor: '#4a69bd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scrollHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  scrollHint: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  insightsContainer: {
    marginBottom: 20,
  },
  insightCard: {
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  insightIcon: {
    marginRight: 15,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '47%',
    backgroundColor: '#232340',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
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
    marginBottom: 3,
  },
  statPercent: {
    fontSize: 12,
    color: '#4a69bd',
  },
  legendContainer: {
    backgroundColor: '#2d2d44',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  legendTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  legendText: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 20,
    marginBottom: 8,
  },
  doneButton: {
    backgroundColor: '#4a69bd',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  plannerInfoCard: {
    backgroundColor: '#2d2d44',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  plannerInfoIcon: {
    marginBottom: 10,
  },
  plannerInfoDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savingsGoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  plannerInfoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  plannerInfoDetail: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
    textAlign: 'center',
  },
  goalProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#1a1a2e',
    borderRadius: 4,
    marginVertical: 10,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#4a69bd',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 13,
    color: '#4a69bd',
    marginBottom: 10,
  },
  savingsGoalText: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: '600',
  },
  exportContainer: {
    backgroundColor: '#2d2d44',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  exportTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  exportButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  exportButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  imageButton: {
    backgroundColor: '#9b59b6',
  },
  excelButton: {
    backgroundColor: '#27ae60',
  },
  exportButtonIcon: {
    marginBottom: 5,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveBudgetButton: {
    backgroundColor: '#f39c12',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveBudgetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Export view styles - hidden view for capturing full diagram
  exportView: {
    position: 'absolute',
    left: -10000, // Hide off-screen
    top: 0,
    backgroundColor: '#1a1a2e',
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: SCREEN_WIDTH * 1.6, // Wide enough for full Sankey diagram
  },
  exportHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#4a69bd',
  },
  exportHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  exportHeaderSubtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  exportDiagramWrapper: {
    backgroundColor: '#232340',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  exportFooter: {
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  exportFooterText: {
    fontSize: 14,
    color: '#888',
  },
  amountWithCurrency: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  currencySymbolSubtle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    opacity: 0.7,
  },
  goalProgressTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
