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
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SankeyDiagram from './SankeyDiagram';
import CircleDiagrams from './CircleDiagrams';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BudgetResultsScreen({ budgetData, plannerType, currency = '$', onBack }) {
  const diagramRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showCircleDiagrams, setShowCircleDiagrams] = useState(false);

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
          <Text style={styles.goalProgressText}>
            {currency}{(current || 0).toLocaleString()} of {currency}{(target || 0).toLocaleString()} ({progress.toFixed(1)}%)
          </Text>
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
            <Text style={styles.savingsGoalText}>
              Save {currency}{(monthlySavings || 0).toLocaleString()}/month for {months || 0} months
            </Text>
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
            <Text style={styles.statValue}>{currency}{income.toLocaleString()}</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="credit-card-outline" size={32} color="#e74c3c" style={styles.statIcon} />
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.statValue}>{currency}{totalExpenses.toLocaleString()}</Text>
            <Text style={styles.statPercent}>{expenseRate}%</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="piggy-bank" size={32} color="#4a69bd" style={styles.statIcon} />
            <Text style={styles.statLabel}>Savings</Text>
            <Text style={styles.statValue}>{currency}{savings.toLocaleString()}</Text>
            <Text style={styles.statPercent}>{savingsRate}%</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="wallet" size={32} color="#f39c12" style={styles.statIcon} />
            <Text style={styles.statLabel}>Remaining</Text>
            <Text style={[styles.statValue, { color: remaining >= 0 ? '#2ecc71' : '#e74c3c' }]}>
              {currency}{remaining.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Export Image
  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      const uri = await captureRef(diagramRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      
      const fileName = `BudgetFlow_${new Date().toISOString().split('T')[0]}.png`;
      const newPath = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath, {
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
  };

  // Export to CSV (Excel-compatible)
  const handleExportToExcel = async () => {
    try {
      setIsExporting(true);
      const { income = 0, expenses = {}, savings = 0, remaining = 0 } = budgetData || {};
      
      // Create CSV content
      let csvContent = 'Category,Amount,Percentage\n';
      csvContent += `Income,${income},100%\n\n`;
      csvContent += 'EXPENSES:\n';
      
      Object.entries(expenses).forEach(([key, value]) => {
        const percentage = income > 0 ? ((value / income) * 100).toFixed(2) : 0;
        csvContent += `${formatLabel(key)},${value},${percentage}%\n`;
      });
      
      csvContent += `\nSavings,${savings},${income > 0 ? ((savings / income) * 100).toFixed(2) : 0}%\n`;
      csvContent += `Remaining,${remaining},${income > 0 ? ((remaining / income) * 100).toFixed(2) : 0}%\n`;
      
      const fileName = `BudgetData_${new Date().toISOString().split('T')[0]}.csv`;
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Budget Data',
        });
      } else {
        Alert.alert('Success', 'CSV file created successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export to Excel: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Create Poster
  const handleCreatePoster = async () => {
    try {
      setIsExporting(true);
      const uri = await captureRef(diagramRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Create Budget Poster',
        });
      } else {
        Alert.alert('Success', 'Poster created successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create poster: ' + error.message);
    } finally {
      setIsExporting(false);
    }
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
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Your Financial Flow Visualization</Text>

        {/* Planner-specific info */}
        {renderPlannerSpecificInfo()}

        {/* Chart Type Toggle */}
        <View style={styles.chartToggleContainer}>
          <View style={styles.toggleTabsContainer}>
            <TouchableOpacity 
              style={[styles.toggleTab, !showCircleDiagrams && styles.toggleTabActive]}
              onPress={() => setShowCircleDiagrams(false)}
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
              onPress={() => setShowCircleDiagrams(true)}
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
        <View style={styles.diagramContainer} ref={diagramRef} collapsable={false}>
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
        </View>

        {/* Export Buttons */}
        <View style={styles.exportContainer}>
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
                  <Text style={styles.exportButtonText} numberOfLines={1}>Export Excel</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.exportButton, styles.posterButton]}
              onPress={handleCreatePoster}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="image-frame" size={32} color="#fff" style={styles.exportButtonIcon} />
                  <Text style={styles.exportButtonText} numberOfLines={1}>Create Poster</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

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
  posterButton: {
    backgroundColor: '#e74c3c',
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
});
