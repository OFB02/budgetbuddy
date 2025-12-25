import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, G, Text as SvgText, Line, Rect } from 'react-native-svg';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORAGE_KEY = '@budgetbuddy_saved_budgets';

export default function GoalResultsScreen({ goalData, currency = '$', onBack }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const imageExportRef = useRef();

  const {
    goalName,
    goalType,
    targetAmount,
    currentSavings,
    amountNeeded,
    monthlyIncome,
    monthlyExpenses,
    targetMonths,
    monthlySavingsNeeded,
    availableToSave,
    percentageOfIncome,
    isAchievable,
    recommendedMonths,
  } = goalData;

  // Fix calculation issues
  const safeRecommendedMonths = recommendedMonths > 0 
    ? recommendedMonths 
    : availableToSave > 0 
      ? Math.ceil(amountNeeded / availableToSave)
      : Math.ceil(amountNeeded / (monthlySavingsNeeded || 1));
  
  const safeTargetMonths = targetMonths > 0 ? targetMonths : safeRecommendedMonths;

  // Calculate progress percentage
  const progressPercentage = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;
  const savingsRate = monthlyIncome > 0 ? ((monthlySavingsNeeded / monthlyIncome) * 100).toFixed(1) : 0;

  // Format currency
  const formatCurrency = (amount) => {
    const safeAmount = amount || 0;
    return `${currency}${safeAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Render savings timeline graph
  const renderSavingsGraph = () => {
    const graphWidth = SCREEN_WIDTH - 80;
    const graphHeight = 240;
    const padding = 50;
    const chartWidth = graphWidth - padding * 2;
    const chartHeight = graphHeight - padding * 2;

    // Calculate data points for the savings projection
    const months = Math.min(safeTargetMonths, 24); // Show max 24 months
    const dataPoints = [];
    
    for (let i = 0; i <= months; i++) {
      const projectedSavings = currentSavings + (monthlySavingsNeeded * i);
      dataPoints.push({
        month: i,
        amount: Math.min(projectedSavings, targetAmount),
      });
    }

    // Scale the graph
    const maxAmount = targetAmount;
    const xScale = chartWidth / months;
    const yScale = chartHeight / maxAmount;

    // Generate path
    let pathData = '';
    dataPoints.forEach((point, index) => {
      const x = padding + (point.month * xScale);
      const y = padding + chartHeight - (point.amount * yScale);
      
      if (index === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    });

    // Target line
    const targetY = padding;
    
    return (
      <View style={styles.graphSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="chart-line-variant" size={24} color="#8b5cf6" />
          <Text style={styles.sectionTitle}>Savings Projection</Text>
        </View>
        
        <View style={styles.graphCard}>
          <Svg width={graphWidth} height={graphHeight}>
            {/* Grid lines */}
            <Line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={padding + chartHeight}
              stroke="#334155"
              strokeWidth="2"
            />
            <Line
              x1={padding}
              y1={padding + chartHeight}
              x2={padding + chartWidth}
              y2={padding + chartHeight}
              stroke="#334155"
              strokeWidth="2"
            />
            
            {/* Target line */}
            <Line
              x1={padding}
              y1={targetY}
              x2={padding + chartWidth}
              y2={targetY}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* Progress line */}
            <G>
              {dataPoints.map((point, index) => {
                if (index === 0) return null;
                const prevPoint = dataPoints[index - 1];
                const x1 = padding + (prevPoint.month * xScale);
                const y1 = padding + chartHeight - (prevPoint.amount * yScale);
                const x2 = padding + (point.month * xScale);
                const y2 = padding + chartHeight - (point.amount * yScale);
                
                return (
                  <Line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#e74c3c"
                    strokeWidth="3"
                  />
                );
              })}
            </G>
            
            {/* Current progress dot */}
            <Circle
              cx={padding}
              cy={padding + chartHeight - (currentSavings * yScale)}
              r="6"
              fill="#3b82f6"
            />
            
            {/* Axis labels */}
            <SvgText
              x={padding - 5}
              y={targetY - 5}
              fill="#10b981"
              fontSize="12"
              fontWeight="bold"
              textAnchor="end"
            >
              Target
            </SvgText>
            
            {/* X-axis month labels */}
            {[0, Math.floor(months / 4), Math.floor(months / 2), Math.floor(3 * months / 4), months].map((month, idx) => {
              const x = padding + (month * xScale);
              return (
                <SvgText
                  key={idx}
                  x={x}
                  y={graphHeight - 10}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {month}
                </SvgText>
              );
            })}
            
            <SvgText
              x={padding + chartWidth / 2}
              y={graphHeight - 25}
              fill="#94a3b8"
              fontSize="12"
              textAnchor="middle"
              fontWeight="bold"
            >
              Months
            </SvgText>
          </Svg>
          
          <View style={styles.graphLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.legendText}>Current</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
              <Text style={styles.legendText}>Projection</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>Goal</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Save Budget
  const handleSaveBudget = async () => {
    setIsSaving(true);
    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      const savedBudgets = existingData ? JSON.parse(existingData) : [];
      
      const newBudget = {
        id: Date.now().toString(),
        name: goalName,
        plannerType: 'goal',
        goalType: goalType,
        currency: currency,
        budgetData: {
          income: monthlyIncome || 0,
          savings: monthlySavingsNeeded || 0,
          remaining: availableToSave || 0,
          targetAmount: targetAmount || 0,
          currentSavings: currentSavings || 0,
          amountNeeded: amountNeeded || 0,
          targetMonths: targetMonths || 0,
          expenses: monthlyExpenses || 0,
        },
        savedAt: Date.now(),
      };
      
      savedBudgets.unshift(newBudget);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedBudgets));
      
      Alert.alert('Success', 'Your goal plan has been saved!');
    } catch (error) {
      console.error('Error saving budget:', error);
      Alert.alert('Error', 'Failed to save your goal plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export to CSV with enhanced formatting
  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      // Create beautifully formatted CSV content for Google Sheets
      let csvLines = [];
      
      // ========== HEADER SECTION ==========
      csvLines.push(`"GOAL SAVINGS PLAN",,,,`);
      csvLines.push(`"${goalName}",,,,`);
      csvLines.push(`"Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}",,,,`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== GOAL SUMMARY SECTION ==========
      csvLines.push('"===== GOAL OVERVIEW =====",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Field","Value","","Status",""');
      csvLines.push(`"Goal Type","${goalType?.label || 'Custom'}","","Achievable?","${isAchievable ? 'YES' : 'NEEDS ADJUSTMENT'}"`);
      csvLines.push(`"Target Amount","${formatCurrency(targetAmount)}","","Current Progress","${progressPercentage.toFixed(1)}%"`);
      csvLines.push(`"Current Savings","${formatCurrency(currentSavings)}","","Timeline","${safeTargetMonths} months"`);
      csvLines.push(`"Amount Needed","${formatCurrency(amountNeeded)}","","Recommended","${safeRecommendedMonths} months"`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== MONTHLY FINANCES SECTION ==========
      csvLines.push('"===== MONTHLY FINANCES =====",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Category","Amount","Percentage"');
      const incomePercent = 100.0;
      const expensePercent = monthlyIncome > 0 ? ((monthlyExpenses/monthlyIncome)*100).toFixed(1) : 0;
      const availablePercent = monthlyIncome > 0 ? ((availableToSave/monthlyIncome)*100).toFixed(1) : 0;
      const requiredPercent = percentageOfIncome.toFixed(1);
      
      csvLines.push(`"Monthly Income","${formatCurrency(monthlyIncome)}","${incomePercent}%"`);
      csvLines.push(`"Monthly Expenses","${formatCurrency(monthlyExpenses)}","${expensePercent}%"`);
      csvLines.push(`"Available to Save","${formatCurrency(availableToSave)}","${availablePercent}%"`);
      csvLines.push(`"Required Savings","${formatCurrency(monthlySavingsNeeded)}","${requiredPercent}%"`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== SAVINGS PROJECTION TABLE ==========
      csvLines.push('"===== MONTHLY SAVINGS PROJECTION =====",,,,');
      csvLines.push('"(Perfect for creating charts!)",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Month","Projected Savings","Remaining","Progress %","Status"');
      
      const months = Math.min(safeTargetMonths, 24);
      for (let i = 0; i <= months; i++) {
        const projectedSavings = currentSavings + (monthlySavingsNeeded * i);
        const actualSavings = Math.min(projectedSavings, targetAmount);
        const remaining = Math.max(0, targetAmount - projectedSavings);
        const progress = (actualSavings / targetAmount) * 100;
        let status = 'Starting out';
        if (progress >= 100) status = 'Complete!';
        else if (progress >= 75) status = 'Almost there!';
        else if (progress >= 50) status = 'Halfway!';
        else if (progress >= 25) status = 'Making progress';
        
        csvLines.push(`${i},${actualSavings.toFixed(0)},${remaining.toFixed(0)},${progress.toFixed(1)},${status}`);
      }
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== CHART DATA SECTION ==========
      csvLines.push('"===== CHART-READY DATA =====",,,,');
      csvLines.push('"Use this data to create charts:",,,,');
      csvLines.push(',,,,');
      
      // Financial Breakdown for Pie Chart
      csvLines.push('"FINANCIAL BREAKDOWN (Pie Chart Data)",,,,');
      csvLines.push('"Category","Amount",,,"Color Suggestion"');
      csvLines.push(`"Monthly Income",${monthlyIncome},,,"Green"`);
      csvLines.push(`"Monthly Expenses",${monthlyExpenses},,,"Orange"`);
      csvLines.push(`"Available to Save",${availableToSave},,,"Blue"`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // Progress Data for Bar Chart
      csvLines.push('"GOAL PROGRESS (Bar Chart Data)",,,,');
      csvLines.push('"Metric","Amount",,,"Target"');
      csvLines.push(`"Current Savings",${currentSavings},,,${targetAmount}`);
      csvLines.push(`"Amount Remaining",${amountNeeded},,,0`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== TIPS & RECOMMENDATIONS ==========
      csvLines.push('"===== RECOMMENDATIONS =====",,,,');
      csvLines.push(',,,,');
      
      if (isAchievable) {
        if (availableToSave > monthlySavingsNeeded) {
          const monthsEarlier = Math.floor(amountNeeded / availableToSave);
          csvLines.push(`"CHECK","Great news! You can achieve your goal in ${safeTargetMonths} months.",,`);
          csvLines.push(`"TIP","You could reach it even faster (in ~${monthsEarlier} months) by maximizing your savings!",,`);
        } else {
          csvLines.push(`"CHECK","Perfect! You can achieve your goal in ${safeTargetMonths} months.",,`);
          csvLines.push(`"TIP","This matches your available savings capacity.",,`);
        }
      } else {
        if (availableToSave > 0) {
          const monthsNeeded = Math.ceil(amountNeeded / availableToSave);
          csvLines.push(`"ALERT","Your ${safeTargetMonths}-month timeline is ambitious.",,`);
          csvLines.push(`"TIP","We recommend a ${monthsNeeded}-month timeline based on your available savings.",,`);
          csvLines.push(`"TIP","Consider increasing income or reducing expenses to meet your original goal.",,`);
        } else {
          csvLines.push(`"ALERT","Your expenses currently exceed your income.",,`);
          csvLines.push(`"TIP","Increase income or reduce expenses to create room for savings.",,`);
        }
      }
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== QUICK TIPS ==========
      csvLines.push('"===== SAVINGS TIPS =====",,,,');
      csvLines.push('"CHECK","Automate your savings with automatic transfers on payday",,');
      csvLines.push('"CHECK","Track your progress monthly and celebrate small milestones",,');
      csvLines.push('"CHECK","Look for ways to reduce expenses and increase your savings rate",,');
      csvLines.push('"CHECK","Consider side income opportunities to accelerate your goal",,');
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== FOOTER ==========
      csvLines.push('"=============================",,,,');
      csvLines.push(`"Created with BudgetBuddy","","","Export Date: ${new Date().toLocaleDateString()}",`);
      
      const csvContent = csvLines.join('\n');

      const fileName = `GoalPlan_${goalName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.csv`;
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
          dialogTitle: 'Export Goal Plan',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Export Successful', `File saved as: ${fileName}`);
      }
    } catch (error) {
      console.error('Error exporting:', error);
      Alert.alert(
        'Export Error', 
        `Failed to export goal plan.\n\nError: ${error.message || 'Unknown error'}\n\nPlease try again.`
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Export as Image
  const handleExportAsImage = async () => {
    setIsExporting(true);
    try {
      // Small delay to ensure view is rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!imageExportRef.current) {
        throw new Error('Export view not ready');
      }

      const uri = await captureRef(imageExportRef.current, {
        format: 'png',
        quality: 1,
      });

      // Share directly from the captured URI
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Goal Plan Image',
        });
      } else {
        Alert.alert('Export Successful', `Image saved successfully!`);
      }
    } catch (error) {
      console.error('Error exporting image:', error);
      Alert.alert('Export Error', `Failed to export image: ${error.message || 'Please try again.'}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Render goal header
  const renderGoalHeader = () => {
    // Map goal type to icon
    const getGoalIcon = () => {
      if (!goalType || !goalType.icon) return 'star';
      return goalType.icon;
    };

    const getGoalColor = () => {
      if (!goalType || !goalType.color) return '#e74c3c';
      return goalType.color;
    };

    return (
      <View style={styles.goalHeader}>
        <View style={[styles.goalIconContainer, { borderColor: getGoalColor() }]}>
          <MaterialCommunityIcons 
            name={getGoalIcon()} 
            size={56} 
            color={getGoalColor()} 
          />
        </View>
        <Text style={styles.goalTitle}>{goalName}</Text>
        <Text style={[styles.goalTypeLabel, { color: getGoalColor() }]}>
          {goalType?.label || 'Custom Goal'}
        </Text>
        
        <View style={styles.targetAmountCard}>
          <Text style={styles.targetLabel}>Target Amount</Text>
          <Text style={styles.targetAmount}>{formatCurrency(targetAmount)}</Text>
        </View>
      </View>
    );
  };

  // Render progress section
  const renderProgress = () => (
    <View style={styles.progressSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="chart-line" size={24} color="#e74c3c" />
        <Text style={styles.sectionTitle}>Your Progress</Text>
      </View>
      
      <View style={styles.progressVisualCard}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${Math.min(progressPercentage, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentageText}>
            {progressPercentage.toFixed(1)}% Complete
          </Text>
        </View>

        <View style={styles.progressStatsGrid}>
          <View style={styles.progressStatBox}>
            <Text style={styles.progressStatLabel}>Saved</Text>
            <Text style={styles.progressStatValue}>{formatCurrency(currentSavings)}</Text>
          </View>
          <View style={styles.progressStatBox}>
            <Text style={styles.progressStatLabel}>Remaining</Text>
            <Text style={[styles.progressStatValue, styles.remainingText]}>
              {formatCurrency(amountNeeded)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Render savings plan
  const renderSavingsPlan = () => (
    <View style={styles.planSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="calendar-clock" size={24} color="#3b82f6" />
        <Text style={styles.sectionTitle}>Monthly Savings Plan</Text>
      </View>

      <View style={styles.planCard}>
        <View style={styles.planRow}>
          <View style={styles.planLabelContainer}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#94a3b8" />
            <Text style={styles.planLabel}>Target Timeline</Text>
          </View>
          <Text style={styles.planValue}>{safeTargetMonths} months</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.planRow}>
          <View style={styles.planLabelContainer}>
            <MaterialCommunityIcons name="piggy-bank" size={20} color="#94a3b8" />
            <Text style={styles.planLabel}>Monthly Savings Needed</Text>
          </View>
          <Text style={[styles.planValue, styles.highlightValue]}>
            {formatCurrency(monthlySavingsNeeded)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.planRow}>
          <View style={styles.planLabelContainer}>
            <MaterialCommunityIcons name="percent" size={20} color="#94a3b8" />
            <Text style={styles.planLabel}>% of Income</Text>
          </View>
          <Text style={styles.planValue}>{savingsRate}%</Text>
        </View>
      </View>
    </View>
  );

  // Render financial breakdown
  const renderFinancialBreakdown = () => (
    <View style={styles.breakdownSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="chart-donut" size={24} color="#10b981" />
        <Text style={styles.sectionTitle}>Financial Breakdown</Text>
      </View>

      <View style={styles.breakdownCard}>
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownLabelContainer}>
            <View style={[styles.colorDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.breakdownLabel}>Monthly Income</Text>
          </View>
          <Text style={styles.breakdownValue}>{formatCurrency(monthlyIncome)}</Text>
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownLabelContainer}>
            <View style={[styles.colorDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.breakdownLabel}>Monthly Expenses</Text>
          </View>
          <Text style={styles.breakdownValue}>{formatCurrency(monthlyExpenses)}</Text>
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownLabelContainer}>
            <View style={[styles.colorDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.breakdownLabel}>Available to Save</Text>
          </View>
          <Text style={styles.breakdownValue}>{formatCurrency(availableToSave)}</Text>
        </View>

        <View style={styles.totalDivider} />

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownLabelContainer}>
            <View style={[styles.colorDot, { backgroundColor: '#e74c3c' }]} />
            <Text style={[styles.breakdownLabel, styles.boldText]}>Required Savings</Text>
          </View>
          <Text style={[styles.breakdownValue, styles.boldText, styles.highlightValue]}>
            {formatCurrency(monthlySavingsNeeded)}
          </Text>
        </View>
      </View>
    </View>
  );

  // Render achievability status
  const renderAchievabilityStatus = () => {
    const statusColor = isAchievable ? '#10b981' : '#f59e0b';
    const statusIcon = isAchievable ? 'check-circle' : 'alert-circle';
    
    // Better messaging based on different scenarios
    let statusMessage = '';
    
    if (isAchievable) {
      if (availableToSave > monthlySavingsNeeded) {
        const monthsEarlier = Math.floor((amountNeeded / availableToSave));
        statusMessage = `Great news! You can achieve your goal in ${safeTargetMonths} months by saving ${formatCurrency(monthlySavingsNeeded)} per month. You could even reach it faster (in ~${monthsEarlier} months) by maximizing your ${formatCurrency(availableToSave)}/month available savings!`;
      } else {
        statusMessage = `Perfect! You can achieve your goal in ${safeTargetMonths} months by saving ${formatCurrency(monthlySavingsNeeded)} per month. This matches your available savings capacity.`;
      }
    } else {
      if (availableToSave > 0) {
        const monthsNeeded = Math.ceil(amountNeeded / availableToSave);
        const extraMonths = monthsNeeded - safeTargetMonths;
        statusMessage = `Your ${safeTargetMonths}-month timeline is ambitious. Based on your available savings of ${formatCurrency(availableToSave)}/month, we recommend a ${monthsNeeded}-month timeline instead (${extraMonths} months longer). Consider increasing income or reducing expenses to meet your original goal.`;
      } else {
        statusMessage = `Your expenses currently exceed your income. To achieve this goal, you'll need to either increase your income or reduce your expenses to create room for savings. Start by reviewing your budget and identifying areas where you can cut back.`;
      }
    }
    
    return (
      <View style={[styles.statusCard, { backgroundColor: `${statusColor}15` }]}>
        <MaterialCommunityIcons name={statusIcon} size={32} color={statusColor} />
        <View style={styles.statusContent}>
          <Text style={[styles.statusTitle, { color: statusColor }]}>
            {isAchievable ? 'Goal Achievable!' : 'Needs Adjustment'}
          </Text>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      </View>
    );
  };

  // Render tips
  const renderTips = () => {
    const tips = [
      'Automate your savings by setting up automatic transfers on payday',
      'Track your progress monthly and celebrate small milestones',
      'Look for ways to reduce expenses and increase your savings rate',
      'Consider side income opportunities to accelerate your goal',
    ];

    return (
      <View style={styles.tipsSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="lightbulb-on" size={24} color="#f59e0b" />
          <Text style={styles.sectionTitle}>Tips to Reach Your Goal</Text>
        </View>

        <View style={styles.tipsCard}>
          {tips.map((tip, index) => (
            <View 
              key={index} 
              style={[styles.tipItem, index === tips.length - 1 && styles.tipItemLast]}
            >
              <MaterialCommunityIcons name="checkbox-marked-circle" size={20} color="#10b981" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Render export buttons
  const renderExportOptions = () => (
    <View style={styles.exportSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="download" size={24} color="#8b5cf6" />
        <Text style={styles.sectionTitle}>Export Your Plan</Text>
      </View>

      <View style={styles.exportButtonsContainer}>
        <TouchableOpacity 
          style={styles.exportImageButton}
          onPress={handleExportAsImage}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="image" size={28} color="#fff" />
              <Text style={styles.exportButtonText}>Export as Image</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.exportButton}
          onPress={handleExportToExcel}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="file-delimited" size={28} color="#fff" />
              <Text style={styles.exportButtonText}>Export as Spreadsheet</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render professional image for export
  const renderImageExportView = () => {
    const getGoalIcon = () => {
      if (!goalType || !goalType.icon) return 'star';
      return goalType.icon;
    };

    const getGoalColor = () => {
      if (!goalType || !goalType.color) return '#e74c3c';
      return goalType.color;
    };

    return (
      <View style={styles.imageExportContainer}>
        <View ref={imageExportRef} collapsable={false} style={styles.imageExportCard}>
          {/* Header */}
          <View style={styles.imageHeader}>
            <View style={styles.imageHeaderTop}>
              <View style={styles.imageBrandContainer}>
                <MaterialCommunityIcons name="piggy-bank" size={32} color="#e74c3c" />
                <Text style={styles.imageBrandText}>BudgetBuddy</Text>
              </View>
              <Text style={styles.imageDate}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            
            <View style={styles.imageGoalHeader}>
              <MaterialCommunityIcons name={getGoalIcon()} size={48} color={getGoalColor()} />
              <View style={styles.imageGoalInfo}>
                <Text style={styles.imageGoalName}>{goalName}</Text>
                <Text style={[styles.imageGoalType, { color: getGoalColor() }]}>
                  {goalType?.label || 'Custom Goal'}
                </Text>
              </View>
            </View>
          </View>

          {/* Main Stats Grid */}
          <View style={styles.imageStatsGrid}>
            <View style={styles.imageStatCard}>
              <Text style={styles.imageStatLabel}>Target Amount</Text>
              <Text style={styles.imageStatValue}>{formatCurrency(targetAmount)}</Text>
            </View>
            <View style={styles.imageStatCard}>
              <Text style={styles.imageStatLabel}>Current Progress</Text>
              <Text style={[styles.imageStatValue, { color: '#3b82f6' }]}>
                {progressPercentage.toFixed(0)}%
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.imageProgressSection}>
            <View style={styles.imageProgressBar}>
              <View style={[styles.imageProgressFill, { width: `${Math.min(progressPercentage, 100)}%` }]} />
            </View>
            <View style={styles.imageProgressLabels}>
              <View>
                <Text style={styles.imageProgressLabel}>Saved</Text>
                <Text style={styles.imageProgressAmount}>{formatCurrency(currentSavings)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.imageProgressLabel}>Remaining</Text>
                <Text style={[styles.imageProgressAmount, { color: '#f59e0b' }]}>
                  {formatCurrency(amountNeeded)}
                </Text>
              </View>
            </View>
          </View>

          {/* Savings Plan */}
          <View style={styles.imagePlanSection}>
            <Text style={styles.imageSectionTitle}>Monthly Savings Plan</Text>
            <View style={styles.imagePlanGrid}>
              <View style={styles.imagePlanItem}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#94a3b8" />
                <Text style={styles.imagePlanLabel}>Timeline</Text>
                <Text style={styles.imagePlanValue}>{safeTargetMonths} months</Text>
              </View>
              <View style={styles.imagePlanItem}>
                <MaterialCommunityIcons name="piggy-bank" size={20} color="#94a3b8" />
                <Text style={styles.imagePlanLabel}>Monthly Savings</Text>
                <Text style={[styles.imagePlanValue, { color: '#e74c3c' }]}>
                  {formatCurrency(monthlySavingsNeeded)}
                </Text>
              </View>
              <View style={styles.imagePlanItem}>
                <MaterialCommunityIcons name="percent" size={20} color="#94a3b8" />
                <Text style={styles.imagePlanLabel}>% of Income</Text>
                <Text style={styles.imagePlanValue}>{savingsRate}%</Text>
              </View>
            </View>
          </View>

          {/* Financial Summary */}
          <View style={styles.imageFinancialSection}>
            <Text style={styles.imageSectionTitle}>Financial Breakdown</Text>
            <View style={styles.imageFinancialGrid}>
              <View style={styles.imageFinancialRow}>
                <View style={[styles.imageColorDot, { backgroundColor: '#10b981' }]} />
                <Text style={styles.imageFinancialLabel}>Income</Text>
                <Text style={styles.imageFinancialValue}>{formatCurrency(monthlyIncome)}</Text>
              </View>
              <View style={styles.imageFinancialRow}>
                <View style={[styles.imageColorDot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.imageFinancialLabel}>Expenses</Text>
                <Text style={styles.imageFinancialValue}>{formatCurrency(monthlyExpenses)}</Text>
              </View>
              <View style={styles.imageFinancialRow}>
                <View style={[styles.imageColorDot, { backgroundColor: '#3b82f6' }]} />
                <Text style={styles.imageFinancialLabel}>Available</Text>
                <Text style={styles.imageFinancialValue}>{formatCurrency(availableToSave)}</Text>
              </View>
            </View>
          </View>

          {/* Status Badge */}
          <View style={[styles.imageStatusBadge, { 
            backgroundColor: isAchievable ? '#10b98115' : '#f59e0b15',
            borderColor: isAchievable ? '#10b981' : '#f59e0b'
          }]}>
            <MaterialCommunityIcons 
              name={isAchievable ? 'check-circle' : 'alert-circle'} 
              size={24} 
              color={isAchievable ? '#10b981' : '#f59e0b'} 
            />
            <Text style={[styles.imageStatusText, { 
              color: isAchievable ? '#10b981' : '#f59e0b' 
            }]}>
              {isAchievable ? 'Goal Achievable!' : 'Needs Adjustment'}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.imageFooter}>
            <Text style={styles.imageFooterText}>Created with BudgetBuddy</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goal Plan</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderGoalHeader()}
        {renderProgress()}
        {renderSavingsGraph()}
        {renderSavingsPlan()}
        {renderFinancialBreakdown()}
        {renderAchievabilityStatus()}
        {renderTips()}
        {renderExportOptions()}

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
              <Text style={styles.saveBudgetButtonText}>Save This Goal Plan</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton} onPress={onBack}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#fff" />
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Hidden view for image export */}
      {renderImageExportView()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
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
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  // Goal Header
  goalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  goalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
  },
  goalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
    paddingHorizontal: 16,
  },
  goalTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
  },
  targetAmountCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  targetAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
    letterSpacing: 0.5,
  },
  // Progress Section
  progressSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.3,
  },
  progressVisualCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressBarContainer: {
    marginBottom: 24,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 6,
  },
  progressPercentageText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  progressStatsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  progressStatBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  remainingText: {
    color: '#f59e0b',
  },
  // Plan Section
  planSection: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planLabel: {
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  planValue: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  highlightValue: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 18,
  },
  // Breakdown Section
  breakdownSection: {
    marginBottom: 24,
  },
  breakdownCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  breakdownLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownLabel: {
    fontSize: 15,
    color: '#cbd5e1',
  },
  breakdownValue: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalDivider: {
    height: 2,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  // Status Card
  statusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  // Tips Section
  tipsSection: {
    marginBottom: 24,
  },
  tipsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  tipItemLast: {
    marginBottom: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  // Export Section
  exportSection: {
    marginBottom: 24,
  },
  exportButtonsContainer: {
    gap: 12,
  },
  exportButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Save & Done Buttons
  saveBudgetButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBudgetButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  doneButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  // Graph Section
  graphSection: {
    marginBottom: 24,
  },
  graphCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  graphLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  // Image Export Styles
  imageExportContainer: {
    position: 'absolute',
    left: -10000, // Position off-screen
    top: 0,
  },
  imageExportCard: {
    width: 800,
    backgroundColor: '#0f172a',
    padding: 40,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#334155',
  },
  imageHeader: {
    marginBottom: 32,
  },
  imageHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  imageBrandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageBrandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  imageDate: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  imageGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  imageGoalInfo: {
    flex: 1,
  },
  imageGoalName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  imageGoalType: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageStatsGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 32,
  },
  imageStatCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  imageStatLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  imageStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  imageProgressSection: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 32,
  },
  imageProgressBar: {
    height: 16,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imageProgressFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 8,
  },
  imageProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageProgressLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  imageProgressAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  imagePlanSection: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  imageSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 20,
  },
  imagePlanGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  imagePlanItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  imagePlanLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  imagePlanValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  imageFinancialSection: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  imageFinancialGrid: {
    gap: 16,
  },
  imageFinancialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  imageFinancialLabel: {
    flex: 1,
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  imageFinancialValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  imageStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 24,
  },
  imageStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageFooter: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  imageFooterText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  exportImageButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
