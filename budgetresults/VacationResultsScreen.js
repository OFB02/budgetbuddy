import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';
import Svg, { Circle, G, Text as SvgText, Rect, Line, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORAGE_KEY = '@budgetbuddy_saved_budgets';

export default function VacationResultsScreen({ vacationData, currency = '$', onBack }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const imageExportRef = useRef();

  const {
    destination,
    vacationType,
    vacationIcon,
    vacationColor,
    duration,
    travelers,
    flights,
    accommodation,
    foodTotal,
    dailyFoodPerPerson,
    activities,
    transportation,
    shopping,
    totalBudget,
    emergencyFund,
    grandTotal,
    currentSaved,
    amountNeeded,
    monthlySavings,
    monthsToSave,
  } = vacationData;

  // Calculate progress and rates
  const progressPercentage = grandTotal > 0 ? (currentSaved / grandTotal) * 100 : 0;
  const budgetPerDay = duration > 0 ? totalBudget / duration : 0;
  const budgetPerPerson = travelers > 0 ? totalBudget / travelers : 0;
  const emergencyRate = totalBudget > 0 ? ((emergencyFund / totalBudget) * 100).toFixed(0) : 15;

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return `${currency}0`;
    return `${currency}${Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Get vacation category icon and color
  const getVacationIcon = () => vacationIcon || 'airplane';
  const getVacationColor = () => vacationColor || '#3b82f6';

  // Render Enhanced Pie Chart for Budget Breakdown
  const renderPieChart = () => {
    const categories = [
      { id: 'flights', label: 'Flights', amount: flights, icon: 'airplane', color: '#3b82f6' },
      { id: 'accommodation', label: 'Accommodation', amount: accommodation, icon: 'bed', color: '#ec4899' },
      { id: 'food', label: 'Food & Dining', amount: foodTotal, icon: 'food', color: '#f59e0b' },
      { id: 'activities', label: 'Activities', amount: activities, icon: 'ticket', color: '#8b5cf6' },
      { id: 'transportation', label: 'Transport', amount: transportation, icon: 'car', color: '#10b981' },
      { id: 'shopping', label: 'Shopping', amount: shopping, icon: 'shopping', color: '#06b6d4' },
    ].filter(cat => cat.amount > 0);

    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
    if (total === 0) return null;

    const size = 260;
    const center = size / 2;
    const radius = 100;
    const innerRadius = 60;

    let startAngle = -90;

    const polarToCartesian = (angle, r) => {
      const radian = (angle * Math.PI) / 180;
      return {
        x: center + r * Math.cos(radian),
        y: center + r * Math.sin(radian),
      };
    };

    const createArc = (startAngle, endAngle, outerR, innerR) => {
      const start = polarToCartesian(startAngle, outerR);
      const end = polarToCartesian(endAngle, outerR);
      const startInner = polarToCartesian(endAngle, innerR);
      const endInner = polarToCartesian(startAngle, innerR);
      
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;

      return [
        `M ${start.x} ${start.y}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y}`,
        `L ${startInner.x} ${startInner.y}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
        'Z',
      ].join(' ');
    };

    return (
      <View style={styles.chartSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="chart-donut-variant" size={24} color="#3b82f6" />
          <Text style={styles.sectionTitle}>Budget Distribution</Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartDescription}>
            Visual breakdown of your vacation expenses across all categories
          </Text>
          
          <View style={styles.pieChartContainer}>
            <Svg width={size} height={size}>
              {categories.map((cat, index) => {
                const percentage = (cat.amount / total) * 100;
                const sweepAngle = (percentage / 100) * 360;
                const endAngle = startAngle + sweepAngle;
                
                const pathData = createArc(startAngle, endAngle, radius, innerRadius);
                
                // Calculate label position for percentages
                const labelAngle = startAngle + sweepAngle / 2;
                const labelRadius = (radius + innerRadius) / 2;
                const labelPos = polarToCartesian(labelAngle, labelRadius);
                
                const prevStartAngle = startAngle;
                startAngle = endAngle;

                return (
                  <G key={cat.id}>
                    {/* Shadow effect */}
                    <Path
                      d={createArc(prevStartAngle, endAngle, radius + 2, innerRadius - 2)}
                      fill="#000"
                      opacity="0.15"
                    />
                    {/* Main segment */}
                    <Path
                      d={pathData}
                      fill={cat.color}
                      opacity="0.95"
                    />
                    {/* Highlight overlay */}
                    <Path
                      d={createArc(prevStartAngle, prevStartAngle + (sweepAngle * 0.4), radius, innerRadius)}
                      fill="#fff"
                      opacity="0.15"
                    />
                  </G>
                );
              })}
              {/* Center content */}
              <Circle
                cx={center}
                cy={center}
                r={innerRadius - 2}
                fill="#0f172a"
              />
              <SvgText
                x={center}
                y={center - 18}
                textAnchor="middle"
                fontSize="11"
                fill="#94a3b8"
                fontWeight="600"
                letterSpacing="1"
              >
                TOTAL
              </SvgText>
              <SvgText
                x={center}
                y={center + 5}
                textAnchor="middle"
                fontSize="22"
                fill={getVacationColor()}
                fontWeight="bold"
              >
                {formatCurrency(total)}
              </SvgText>
              <SvgText
                x={center}
                y={center + 22}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
                fontWeight="500"
              >
                BUDGET
              </SvgText>
            </Svg>
          </View>

          <View style={styles.chartLegend}>
            {categories.map((cat) => {
              const percentage = (cat.amount / total) * 100;
              return (
                <View key={cat.id} style={styles.legendItem}>
                  <View style={styles.legendIconContainer}>
                    <View style={[styles.legendColor, { backgroundColor: cat.color }]} />
                    <MaterialCommunityIcons name={cat.icon} size={18} color={cat.color} />
                  </View>
                  <Text style={styles.legendLabel}>{cat.label}</Text>
                  <View style={styles.legendValueContainer}>
                    <Text style={styles.legendValue}>
                      {formatCurrency(cat.amount)}
                    </Text>
                    <Text style={[styles.legendPercentage, { color: cat.color }]}>
                      {percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Summary stats */}
          <View style={styles.chartSummary}>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="sigma" size={20} color="#10b981" />
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatCurrency(totalBudget)}</Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="shield-alert" size={20} color="#f59e0b" />
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Emergency ({emergencyRate}%)</Text>
                <Text style={styles.summaryValue}>{formatCurrency(emergencyFund)}</Text>
              </View>
            </View>
            <View style={[styles.summaryItem, styles.summaryItemHighlight]}>
              <MaterialCommunityIcons name="cash-check" size={22} color="#3b82f6" />
              <View style={styles.summaryTextContainer}>
                <Text style={[styles.summaryLabel, styles.summaryLabelBold]}>Grand Total</Text>
                <Text style={[styles.summaryValue, styles.summaryValueLarge]}>{formatCurrency(grandTotal)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Render Enhanced Bar Chart for Per-Category Comparison
  const renderBarChart = () => {
    const categories = [
      { id: 'flights', label: 'Flights', amount: flights, color: '#3b82f6', icon: 'airplane' },
      { id: 'accommodation', label: 'Hotel', amount: accommodation, color: '#ec4899', icon: 'bed' },
      { id: 'food', label: 'Food', amount: foodTotal, color: '#f59e0b', icon: 'food' },
      { id: 'activities', label: 'Activities', amount: activities, color: '#8b5cf6', icon: 'ticket' },
      { id: 'transportation', label: 'Transport', amount: transportation, color: '#10b981', icon: 'car' },
      { id: 'shopping', label: 'Shopping', amount: shopping, color: '#06b6d4', icon: 'shopping' },
    ].filter(cat => cat.amount > 0).sort((a, b) => b.amount - a.amount);

    if (categories.length === 0) return null;

    const maxAmount = Math.max(...categories.map(cat => cat.amount));
    const chartHeight = 200;
    const barWidth = 50;
    const barSpacing = 45;
    const paddingTop = 50;
    const paddingBottom = 90;
    const paddingLeft = 20;

    // Calculate per-person amounts for each category
    const withPerPerson = categories.map(cat => ({
      ...cat,
      perPerson: cat.amount / travelers,
    }));

    const totalWidth = paddingLeft + (categories.length * (barWidth + barSpacing)) + 20;

    return (
      <View style={styles.chartSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="chart-bar" size={24} color="#10b981" />
          <Text style={styles.sectionTitle}>Category Comparison</Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartDescription}>
            Compare spending across categories - sorted from highest to lowest
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScrollView}>
            <Svg width={totalWidth} height={chartHeight + paddingTop + paddingBottom}>
              {/* Grid lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingTop + chartHeight - (chartHeight * ratio);
                return (
                  <Line
                    key={i}
                    x1={paddingLeft}
                    y1={y}
                    x2={totalWidth - 20}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    opacity="0.3"
                  />
                );
              })}

              {/* Baseline */}
              <Line
                x1={paddingLeft}
                y1={paddingTop + chartHeight}
                x2={totalWidth - 20}
                y2={paddingTop + chartHeight}
                stroke="#475569"
                strokeWidth="2"
                opacity="0.6"
              />

              {/* Bars */}
              {withPerPerson.map((cat, index) => {
                const barHeight = (cat.amount / maxAmount) * chartHeight;
                const x = paddingLeft + (index * (barWidth + barSpacing));
                const y = paddingTop + chartHeight - barHeight;
                const percentage = (cat.amount / totalBudget) * 100;

                return (
                  <G key={cat.id}>
                    {/* Bar shadow */}
                    <Rect
                      x={x + 2}
                      y={y + 2}
                      width={barWidth}
                      height={barHeight}
                      fill="#000"
                      rx="8"
                      opacity="0.2"
                    />
                    
                    {/* Main bar */}
                    <Rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={cat.color}
                      rx="8"
                      opacity="0.9"
                    />
                    
                    {/* Subtle highlight on bar */}
                    <Rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.min(barHeight * 0.3, 20)}
                      fill="#fff"
                      rx="8"
                      opacity="0.2"
                    />
                    
                    {/* Amount displayed above bar */}
                    <SvgText
                      x={x + barWidth / 2}
                      y={y - 10}
                      textAnchor="middle"
                      fontSize="13"
                      fill="#f1f5f9"
                      fontWeight="bold"
                    >
                      {formatCurrency(cat.amount)}
                    </SvgText>
                    
                    {/* Category icon */}
                    <SvgText
                      x={x + barWidth / 2}
                      y={paddingTop + chartHeight + 25}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#cbd5e1"
                      fontWeight="600"
                    >
                      {cat.label}
                    </SvgText>
                    
                    {/* Percentage below label */}
                    <SvgText
                      x={x + barWidth / 2}
                      y={paddingTop + chartHeight + 43}
                      textAnchor="middle"
                      fontSize="11"
                      fill={cat.color}
                      fontWeight="700"
                    >
                      {percentage.toFixed(0)} %
                    </SvgText>
                    
                    {/* Per person below percentage - amount */}
                    <SvgText
                      x={x + barWidth / 2}
                      y={paddingTop + chartHeight + 60}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#64748b"
                      fontWeight="500"
                    >
                      {formatCurrency(cat.perPerson)}
                    </SvgText>
                    
                    {/* Per person label */}
                    <SvgText
                      x={x + barWidth / 2}
                      y={paddingTop + chartHeight + 73}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#64748b"
                      fontWeight="500"
                    >
                      per person
                    </SvgText>
                  </G>
                );
              })}
            </Svg>
          </ScrollView>
          
          {/* Summary insights */}
          <View style={styles.chartInsights}>
            <View style={styles.insightItem}>
              <MaterialCommunityIcons name="crown" size={18} color="#fbbf24" />
              <Text style={styles.insightText}>
                <Text style={styles.insightBold}>{withPerPerson[0]?.label}</Text> is your biggest expense at {formatCurrency(withPerPerson[0]?.amount)}
              </Text>
            </View>
            {withPerPerson.length > 1 && (
              <View style={styles.insightItem}>
                <MaterialCommunityIcons name="account-group" size={18} color="#3b82f6" />
                <Text style={styles.insightText}>
                  Per person: {formatCurrency(Math.min(...withPerPerson.map(c => c.perPerson)))} - {formatCurrency(Math.max(...withPerPerson.map(c => c.perPerson)))} per category
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Render savings plan
  const handleSaveBudget = async () => {
    try {
      setIsSaving(true);
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      const budgets = existingData ? JSON.parse(existingData) : [];

      const newBudget = {
        id: Date.now().toString(),
        name: `${destination} Trip`,
        plannerType: 'vacation',
        currency,
        budgetData: vacationData,
        savedAt: Date.now(),
      };

      budgets.unshift(newBudget);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));

      Alert.alert(
        '✅ Budget Saved!',
        `Your ${destination} vacation budget has been saved successfully.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving budget:', error);
      Alert.alert('Error', 'Failed to save budget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export to CSV
  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      // Create beautifully formatted CSV content
      let csvLines = [];
      
      // ========== HEADER SECTION ==========
      csvLines.push(`"VACATION BUDGET PLAN",,,,`);
      csvLines.push(`"${destination}",,,,`);
      csvLines.push(`"Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}",,,,`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== TRIP OVERVIEW SECTION ==========
      csvLines.push('"===== TRIP DETAILS =====",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Field","Value","","Details",""');
      csvLines.push(`"Destination","${destination}","","Vacation Type","${vacationType || 'General'}"`);
      csvLines.push(`"Duration","${duration} days","","Travelers","${travelers}"`);
      csvLines.push(`"Total Budget","${formatCurrency(grandTotal)}","","Emergency Fund","${emergencyRate}%"`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== BUDGET BREAKDOWN SECTION ==========
      csvLines.push('"===== BUDGET BREAKDOWN =====",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Category","Total Amount","Per Person","Per Day","% of Total"');
      
      const categories = [
        { name: 'Flights', amount: flights },
        { name: 'Accommodation', amount: accommodation },
        { name: 'Food & Dining', amount: foodTotal },
        { name: 'Activities', amount: activities },
        { name: 'Transportation', amount: transportation },
        { name: 'Shopping', amount: shopping },
      ];
      
      categories.forEach(cat => {
        const perPerson = (cat.amount / travelers).toFixed(0);
        const perDay = (cat.amount / duration).toFixed(0);
        const percentage = totalBudget > 0 ? ((cat.amount / totalBudget) * 100).toFixed(1) : '0.0';
        csvLines.push(`"${cat.name}","${formatCurrency(cat.amount)}","${currency}${perPerson}","${currency}${perDay}","${percentage}%"`);
      });
      
      csvLines.push(',,,,');
      csvLines.push(`"Subtotal","${formatCurrency(totalBudget)}","","","100.0%"`);
      csvLines.push(`"Emergency Fund (${emergencyRate}%)","${formatCurrency(emergencyFund)}","","",""`);
      csvLines.push(`"GRAND TOTAL","${formatCurrency(grandTotal)}","","",""`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== SAVINGS PLAN SECTION ==========
      csvLines.push('"===== SAVINGS PLAN =====",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Metric","Amount","","Details",""');
      csvLines.push(`"Total Needed","${formatCurrency(grandTotal)}","","Timeline","${monthsToSave} months"`);
      csvLines.push(`"Current Savings","${formatCurrency(currentSaved)}","","Progress","${progressPercentage.toFixed(1)}%"`);
      csvLines.push(`"Amount Remaining","${formatCurrency(amountNeeded)}","","Monthly Savings","${formatCurrency(monthlySavings)}"`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== MONTHLY PROJECTION TABLE ==========
      csvLines.push('"===== MONTHLY SAVINGS PROJECTION =====",,,,');
      csvLines.push('"(Perfect for creating charts!)",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Month","Total Saved","Remaining","Progress %","Status"');
      
      for (let i = 0; i <= monthsToSave; i++) {
        const totalSaved = currentSaved + (monthlySavings * i);
        const remaining = Math.max(0, grandTotal - totalSaved);
        const progress = (totalSaved / grandTotal) * 100;
        let status = 'Starting out';
        if (progress >= 100) status = 'Ready to go!';
        else if (progress >= 75) status = 'Almost there!';
        else if (progress >= 50) status = 'Halfway!';
        else if (progress >= 25) status = 'Making progress';
        
        csvLines.push(`${i},${totalSaved.toFixed(0)},${remaining.toFixed(0)},${progress.toFixed(1)},${status}`);
      }
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== PER PERSON BREAKDOWN ==========
      csvLines.push('"===== PER PERSON BREAKDOWN =====",,,,');
      csvLines.push(',,,,');
      csvLines.push('"Metric","Amount Per Person",,,"Total for Group"');
      csvLines.push(`"Total Trip Cost","${formatCurrency(budgetPerPerson)}","","","${formatCurrency(grandTotal)}"`);
      csvLines.push(`"Daily Budget","${formatCurrency(budgetPerDay / travelers)}","","","${formatCurrency(budgetPerDay)}"`);
      if (dailyFoodPerPerson) {
        csvLines.push(`"Daily Food Budget","${formatCurrency(dailyFoodPerPerson)}","","","${formatCurrency(dailyFoodPerPerson * travelers)}"`);
      }
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== CHART DATA SECTION ==========
      csvLines.push('"===== CHART-READY DATA =====",,,,');
      csvLines.push('"Use this data to create charts:",,,,');
      csvLines.push(',,,,');
      
      // Budget Breakdown for Pie Chart
      csvLines.push('"CATEGORY BREAKDOWN (Pie Chart Data)",,,,');
      csvLines.push('"Category","Amount","Percentage"');
      categories.forEach(cat => {
        const percentage = totalBudget > 0 ? ((cat.amount / totalBudget) * 100).toFixed(1) : '0.0';
        csvLines.push(`"${cat.name}",${cat.amount.toFixed(0)},${percentage}`);
      });
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // Savings Progress for Bar Chart
      csvLines.push('"SAVINGS PROGRESS (Bar Chart Data)",,,,');
      csvLines.push('"Metric","Amount",,,"Target"');
      csvLines.push(`"Current Savings",${currentSaved.toFixed(0)},,,${grandTotal.toFixed(0)}`);
      csvLines.push(`"Amount Remaining",${amountNeeded.toFixed(0)},,,0`);
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== TRAVEL TIPS ==========
      csvLines.push('"===== TRAVEL TIPS =====",,,,');
      csvLines.push('"CHECK","Book flights and accommodation early for the best deals",,');
      csvLines.push('"CHECK","Set aside your emergency fund (${emergencyRate}%) for unexpected costs",,');
      csvLines.push('"CHECK","Research free activities and attractions at your destination",,');
      csvLines.push('"CHECK","Track daily spending to stay within budget",,');
      csvLines.push('"CHECK","Consider travel insurance for peace of mind",,');
      csvLines.push(',,,,');
      csvLines.push(',,,,');
      
      // ========== FOOTER ==========
      csvLines.push('"=============================",,,,');
      csvLines.push(`"Created with BudgetBuddy","","","Export Date: ${new Date().toLocaleDateString()}",`);
      
      const csvContent = csvLines.join('\n');

      const fileName = `VacationBudget_${destination.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.csv`;
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
          dialogTitle: 'Export Vacation Budget',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Export Successful', `File saved as: ${fileName}`);
      }
    } catch (error) {
      console.error('Error exporting:', error);
      Alert.alert(
        'Export Error', 
        `Failed to export vacation budget.\n\nError: ${error.message || 'Unknown error'}\n\nPlease try again.`
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Export as Image
  const handleExportAsImage = async () => {
    try {
      setIsExporting(true);
      const uri = await captureRef(imageExportRef, {
        format: 'png',
        quality: 1,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Vacation Budget',
        });
      } else {
        Alert.alert('Success', 'Image saved successfully!');
      }
    } catch (error) {
      console.error('Image export error:', error);
      Alert.alert('Export Failed', 'Unable to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Render vacation header
  const renderVacationHeader = () => (
    <View style={styles.vacationHeader}>
      <View style={[styles.vacationIconContainer, { borderColor: getVacationColor() }]}>
        <MaterialCommunityIcons name={getVacationIcon()} size={50} color={getVacationColor()} />
      </View>
      <Text style={styles.destinationTitle}>{destination}</Text>
      {vacationType && (
        <Text style={[styles.vacationTypeLabel, { color: getVacationColor() }]}>
          {vacationType}
        </Text>
      )}
      <View style={styles.tripDetailsRow}>
        <View style={styles.tripDetailItem}>
          <MaterialCommunityIcons name="calendar" size={18} color="#94a3b8" />
          <Text style={styles.tripDetailText}>{duration} days</Text>
        </View>
        <View style={styles.tripDetailItem}>
          <MaterialCommunityIcons name="account-group" size={18} color="#94a3b8" />
          <Text style={styles.tripDetailText}>{travelers} {travelers > 1 ? 'travelers' : 'traveler'}</Text>
        </View>
      </View>
      <View style={styles.totalBudgetCard}>
        <Text style={styles.totalLabel}>TOTAL TRIP BUDGET</Text>
        <Text style={styles.totalAmount}>{formatCurrency(grandTotal)}</Text>
        <Text style={styles.totalSubtext}>Including {emergencyRate}% emergency fund</Text>
      </View>
    </View>
  );

  // Render savings plan
  const renderSavingsPlan = () => (
    <View style={styles.planSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="calendar-clock" size={24} color="#8b5cf6" />
        <Text style={styles.sectionTitle}>Savings Plan</Text>
      </View>

      <View style={styles.planCard}>
        <View style={styles.planGrid}>
          <View style={styles.planItem}>
            <MaterialCommunityIcons name="clock-outline" size={28} color={getVacationColor()} />
            <Text style={styles.planItemLabel}>Timeline</Text>
            <Text style={styles.planItemValue}>{monthsToSave} months</Text>
          </View>
          <View style={styles.planItem}>
            <MaterialCommunityIcons name="cash-multiple" size={28} color={getVacationColor()} />
            <Text style={styles.planItemLabel}>Monthly Savings</Text>
            <Text style={[styles.planItemValue, styles.highlightValue]}>
              {formatCurrency(monthlySavings)}
            </Text>
          </View>
        </View>

        <View style={styles.savingsTimelineContainer}>
          <Text style={styles.timelineTitle}>Savings Milestone</Text>
          <View style={styles.timelineRow}>
            <View style={styles.timelinePoint}>
              <MaterialCommunityIcons name="flag" size={16} color="#94a3b8" />
              <Text style={styles.timelineLabel}>Start</Text>
              <Text style={styles.timelineAmount}>{formatCurrency(currentSaved)}</Text>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelinePoint}>
              <MaterialCommunityIcons name="flag-checkered" size={16} color={getVacationColor()} />
              <Text style={styles.timelineLabel}>Goal</Text>
              <Text style={styles.timelineAmount}>{formatCurrency(grandTotal)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Render budget breakdown
  const renderBudgetBreakdown = () => {
    const categories = [
      { id: 'flights', label: 'Flights', amount: flights, icon: 'airplane', color: '#3b82f6' },
      { id: 'accommodation', label: 'Accommodation', amount: accommodation, icon: 'bed', color: '#ec4899' },
      { id: 'food', label: 'Food & Dining', amount: foodTotal, icon: 'food', color: '#f59e0b' },
      { id: 'activities', label: 'Activities & Tours', amount: activities, icon: 'ticket', color: '#8b5cf6' },
      { id: 'transportation', label: 'Local Transport', amount: transportation, icon: 'car', color: '#10b981' },
      { id: 'shopping', label: 'Shopping', amount: shopping, icon: 'shopping', color: '#06b6d4' },
    ];

    return (
      <View style={styles.breakdownSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="calculator" size={24} color="#10b981" />
          <Text style={styles.sectionTitle}>Budget Breakdown</Text>
        </View>

        <View style={styles.breakdownCard}>
          {categories.map((cat, index) => (
            <View key={cat.id}>
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLabelContainer}>
                  <MaterialCommunityIcons name={cat.icon} size={20} color={cat.color} />
                  <Text style={styles.breakdownLabel}>{cat.label}</Text>
                </View>
                <View style={styles.breakdownAmounts}>
                  <Text style={styles.breakdownValue}>{formatCurrency(cat.amount)}</Text>
                  <Text style={styles.breakdownPercentage}>
                    {totalBudget > 0 ? ((cat.amount / totalBudget) * 100).toFixed(0) : 0}%
                  </Text>
                </View>
              </View>
              {index < categories.length - 1 && <View style={styles.divider} />}
            </View>
          ))}

          <View style={styles.totalDivider} />

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelContainer}>
              <MaterialCommunityIcons name="sigma" size={20} color="#f1f5f9" />
              <Text style={[styles.breakdownLabel, styles.boldText]}>Subtotal</Text>
            </View>
            <Text style={[styles.breakdownValue, styles.boldText]}>
              {formatCurrency(totalBudget)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelContainer}>
              <MaterialCommunityIcons name="shield-alert" size={20} color="#f59e0b" />
              <Text style={styles.breakdownLabel}>Emergency Fund ({emergencyRate}%)</Text>
            </View>
            <Text style={styles.breakdownValue}>{formatCurrency(emergencyFund)}</Text>
          </View>

          <View style={styles.totalDivider} />

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelContainer}>
              <MaterialCommunityIcons name="cash-check" size={22} color="#10b981" />
              <Text style={[styles.breakdownLabel, styles.boldText, { fontSize: 16 }]}>
                Grand Total
              </Text>
            </View>
            <Text style={[styles.breakdownValue, styles.boldText, styles.grandTotalText]}>
              {formatCurrency(grandTotal)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Render per-person breakdown
  const renderPerPersonBreakdown = () => (
    <View style={styles.perPersonSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="account-cash" size={24} color="#ec4899" />
        <Text style={styles.sectionTitle}>Per Person Breakdown</Text>
      </View>

      <View style={styles.perPersonCard}>
        <View style={styles.perPersonGrid}>
          <View style={styles.perPersonItem}>
            <MaterialCommunityIcons name="account" size={32} color="#ec4899" />
            <Text style={styles.perPersonLabel}>Total Per Person</Text>
            <Text style={styles.perPersonValue}>{formatCurrency(budgetPerPerson)}</Text>
          </View>
          <View style={styles.perPersonItem}>
            <MaterialCommunityIcons name="calendar-today" size={32} color="#3b82f6" />
            <Text style={styles.perPersonLabel}>Daily Budget</Text>
            <Text style={styles.perPersonValue}>{formatCurrency(budgetPerDay)}</Text>
          </View>
        </View>

        {dailyFoodPerPerson && (
          <View style={styles.dailyFoodHighlight}>
            <MaterialCommunityIcons name="food-fork-drink" size={20} color="#f59e0b" />
            <Text style={styles.dailyFoodText}>
              Daily food budget: {formatCurrency(dailyFoodPerPerson)} per person
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  // Render tips section
  const renderTips = () => {
    const tips = [
      {
        icon: 'lightbulb-on',
        text: 'Book flights and accommodation early to get better deals and save money.',
        color: '#f59e0b',
      },
      {
        icon: 'currency-usd',
        text: 'Consider using travel rewards credit cards to earn points on your vacation expenses.',
        color: '#10b981',
      },
      {
        icon: 'calendar-check',
        text: 'Travel during shoulder season (just before or after peak season) for lower prices.',
        color: '#3b82f6',
      },
      {
        icon: 'food',
        text: 'Mix expensive restaurants with local eateries to balance your food budget.',
        color: '#ec4899',
      },
      {
        icon: 'shield-check',
        text: 'Always keep your emergency fund separate for unexpected situations.',
        color: '#8b5cf6',
      },
    ];

    return (
      <View style={styles.tipsSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="lightbulb" size={24} color="#f59e0b" />
          <Text style={styles.sectionTitle}>Travel Tips</Text>
        </View>

        <View style={styles.tipsCard}>
          {tips.map((tip, index) => (
            <View key={index} style={[styles.tipItem, index === tips.length - 1 && styles.tipItemLast]}>
              <MaterialCommunityIcons name={tip.icon} size={22} color={tip.color} />
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Render export section
  const renderExportSection = () => (
    <View style={styles.exportSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="export" size={24} color="#06b6d4" />
        <Text style={styles.sectionTitle}>Export Options</Text>
      </View>

      <View style={styles.exportButtonsContainer}>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExportToExcel}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="file-excel" size={24} color="#fff" />
              <Text style={styles.exportButtonText}>Export to CSV</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exportImageButton}
          onPress={handleExportAsImage}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="image" size={24} color="#fff" />
              <Text style={styles.exportButtonText}>Export as Image</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vacation Budget</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderVacationHeader()}
        {renderPieChart()}
        {renderBarChart()}
        {renderSavingsPlan()}
        {renderBudgetBreakdown()}
        {renderPerPersonBreakdown()}
        {renderTips()}
        {renderExportSection()}

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
              <Text style={styles.saveBudgetButtonText}>Save This Budget</Text>
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
      <View style={styles.imageExportContainer} ref={imageExportRef} collapsable={false}>
        <View style={styles.imageExportCard}>
          {/* Header */}
          <View style={styles.imageHeader}>
            <View style={styles.imageHeaderTop}>
              <View style={styles.imageBrandContainer}>
                <MaterialCommunityIcons name="airplane" size={32} color={getVacationColor()} />
                <Text style={styles.imageBrandText}>BudgetBuddy</Text>
              </View>
              <Text style={styles.imageDate}>{new Date().toLocaleDateString()}</Text>
            </View>

            <View style={styles.imageVacationHeader}>
              <MaterialCommunityIcons name={getVacationIcon()} size={48} color={getVacationColor()} />
              <View style={styles.imageVacationInfo}>
                <Text style={styles.imageDestinationName}>{destination}</Text>
                {vacationType && (
                  <Text style={[styles.imageVacationType, { color: getVacationColor() }]}>
                    {vacationType}
                  </Text>
                )}
                <View style={styles.imageTripDetails}>
                  <Text style={styles.imageTripDetailText}>{duration} days • {travelers} travelers</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.imageStatsGrid}>
            <View style={styles.imageStatCard}>
              <Text style={styles.imageStatLabel}>Total Budget</Text>
              <Text style={[styles.imageStatValue, { color: getVacationColor() }]}>
                {formatCurrency(grandTotal)}
              </Text>
            </View>
            <View style={styles.imageStatCard}>
              <Text style={styles.imageStatLabel}>Per Person</Text>
              <Text style={styles.imageStatValue}>{formatCurrency(budgetPerPerson)}</Text>
            </View>
            <View style={styles.imageStatCard}>
              <Text style={styles.imageStatLabel}>Per Day</Text>
              <Text style={styles.imageStatValue}>{formatCurrency(budgetPerDay)}</Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.imageProgressSection}>
            <View style={styles.imageProgressBar}>
              <View
                style={[
                  styles.imageProgressFill,
                  { width: `${Math.min(progressPercentage, 100)}%`, backgroundColor: getVacationColor() }
                ]}
              />
            </View>
            <View style={styles.imageProgressLabels}>
              <View>
                <Text style={styles.imageProgressLabel}>Saved</Text>
                <Text style={styles.imageProgressAmount}>{formatCurrency(currentSaved)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.imageProgressLabel}>Needed</Text>
                <Text style={[styles.imageProgressAmount, { color: '#f59e0b' }]}>
                  {formatCurrency(amountNeeded)}
                </Text>
              </View>
            </View>
          </View>

          {/* Savings Plan */}
          <View style={styles.imagePlanSection}>
            <Text style={styles.imageSectionTitle}>Savings Plan</Text>
            <View style={styles.imagePlanGrid}>
              <View style={styles.imagePlanItem}>
                <MaterialCommunityIcons name="clock-outline" size={24} color={getVacationColor()} />
                <Text style={styles.imagePlanLabel}>Timeline</Text>
                <Text style={styles.imagePlanValue}>{monthsToSave} months</Text>
              </View>
              <View style={styles.imagePlanItem}>
                <MaterialCommunityIcons name="cash-multiple" size={24} color={getVacationColor()} />
                <Text style={styles.imagePlanLabel}>Monthly Savings</Text>
                <Text style={styles.imagePlanValue}>{formatCurrency(monthlySavings)}</Text>
              </View>
            </View>
          </View>

          {/* Budget Breakdown */}
          <View style={styles.imageBreakdownSection}>
            <Text style={styles.imageSectionTitle}>Budget Breakdown</Text>
            <View style={styles.imageBreakdownGrid}>
              <View style={styles.imageBreakdownRow}>
                <MaterialCommunityIcons name="airplane" size={18} color="#3b82f6" />
                <Text style={styles.imageBreakdownLabel}>Flights</Text>
                <Text style={styles.imageBreakdownValue}>{formatCurrency(flights)}</Text>
              </View>
              <View style={styles.imageBreakdownRow}>
                <MaterialCommunityIcons name="bed" size={18} color="#ec4899" />
                <Text style={styles.imageBreakdownLabel}>Accommodation</Text>
                <Text style={styles.imageBreakdownValue}>{formatCurrency(accommodation)}</Text>
              </View>
              <View style={styles.imageBreakdownRow}>
                <MaterialCommunityIcons name="food" size={18} color="#f59e0b" />
                <Text style={styles.imageBreakdownLabel}>Food & Dining</Text>
                <Text style={styles.imageBreakdownValue}>{formatCurrency(foodTotal)}</Text>
              </View>
              <View style={styles.imageBreakdownRow}>
                <MaterialCommunityIcons name="ticket" size={18} color="#8b5cf6" />
                <Text style={styles.imageBreakdownLabel}>Activities</Text>
                <Text style={styles.imageBreakdownValue}>{formatCurrency(activities)}</Text>
              </View>
              <View style={styles.imageBreakdownRow}>
                <MaterialCommunityIcons name="car" size={18} color="#10b981" />
                <Text style={styles.imageBreakdownLabel}>Transport</Text>
                <Text style={styles.imageBreakdownValue}>{formatCurrency(transportation)}</Text>
              </View>
              <View style={styles.imageBreakdownRow}>
                <MaterialCommunityIcons name="shopping" size={18} color="#06b6d4" />
                <Text style={styles.imageBreakdownLabel}>Shopping</Text>
                <Text style={styles.imageBreakdownValue}>{formatCurrency(shopping)}</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.imageFooter}>
            <Text style={styles.imageFooterText}>
              Created with BudgetBuddy • Your Vacation Planning Companion
            </Text>
          </View>
        </View>
      </View>
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

  // Vacation Header
  vacationHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  vacationIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
  },
  destinationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
    paddingHorizontal: 16,
  },
  vacationTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  tripDetailsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripDetailText: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  totalBudgetCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    minWidth: '85%',
  },
  totalLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3b82f6',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  totalSubtext: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },

  // Progress Section
  progressSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.3,
  },
  progressCard: {
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
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 8,
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  neededText: {
    color: '#f59e0b',
  },

  // Savings Plan Section
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
  planGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  planItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  planItemLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 10,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  planItemValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  highlightValue: {
    color: '#3b82f6',
  },
  savingsTimelineContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 16,
    textAlign: 'center',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelinePoint: {
    alignItems: 'center',
    gap: 6,
  },
  timelineLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timelineAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#334155',
    marginHorizontal: 16,
  },

  // Budget Breakdown Section
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
  },
  breakdownLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  breakdownLabel: {
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  breakdownAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownValue: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  breakdownPercentage: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  totalDivider: {
    height: 2,
    backgroundColor: '#334155',
    marginVertical: 18,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  grandTotalText: {
    color: '#10b981',
    fontSize: 18,
  },

  // Per Person Section
  perPersonSection: {
    marginBottom: 24,
  },
  perPersonCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  perPersonGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  perPersonItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  perPersonLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  perPersonValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  dailyFoodHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dailyFoodText: {
    flex: 1,
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '500',
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
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Action Buttons
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

  // Image Export Styles
  imageExportContainer: {
    position: 'absolute',
    left: -10000,
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
  imageVacationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  imageVacationInfo: {
    flex: 1,
  },
  imageDestinationName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  imageVacationType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  imageTripDetails: {
    marginTop: 4,
  },
  imageTripDetailText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1f5f9',
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
    textTransform: 'uppercase',
  },
  imagePlanValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  imageBreakdownSection: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  imageBreakdownGrid: {
    gap: 14,
  },
  imageBreakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageBreakdownLabel: {
    flex: 1,
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  imageBreakdownValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
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

  // Chart Styles
  chartSection: {
    marginBottom: 24,
  },
  chartCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chartDescription: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 20,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  chartLegend: {
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  legendIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 50,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendLabel: {
    flex: 1,
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  legendValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendValue: {
    fontSize: 15,
    color: '#f1f5f9',
    fontWeight: '700',
    minWidth: 75,
    textAlign: 'right',
  },
  legendPercentage: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'right',
  },
  chartSummary: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#334155',
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryItemHighlight: {
    borderColor: '#3b82f6',
    borderWidth: 2,
    backgroundColor: '#1e293b',
  },
  summaryTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  summaryLabelBold: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 15,
    color: '#f1f5f9',
    fontWeight: '700',
  },
  summaryValueLarge: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  chartScrollView: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  chartInsights: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 19,
  },
  insightBold: {
    fontWeight: '700',
    color: '#f1f5f9',
  },
});
