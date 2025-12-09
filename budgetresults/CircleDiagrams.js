import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Svg, { Circle, G, Text as SvgText, Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Beautiful modern color palette
const INCOME_COLORS = [
  '#6c5ce7', // Purple
  '#a29bfe', // Light Purple
  '#00cec9', // Teal
  '#81ecec', // Light Teal
  '#0984e3', // Blue
];

const EXPENSE_COLORS = [
  '#ff7675', // Soft Red
  '#fd79a8', // Pink
  '#fdcb6e', // Yellow
  '#e17055', // Orange
  '#74b9ff', // Light Blue
  '#a29bfe', // Light Purple
  '#ffeaa7', // Light Yellow
  '#fab1a0', // Peach
  '#55efc4', // Mint
  '#dfe6e9', // Light Gray
];

const SPECIAL_COLORS = {
  savings: '#00b894',
  remaining: '#00cec9',
  overbudget: '#d63031',
};

export default function CircleDiagrams({ budgetData, currency = '$' }) {
  if (!budgetData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No budget data available</Text>
      </View>
    );
  }

  const { income = 0, incomes = [], expenses = {}, savings = 0, remaining = 0 } = budgetData;

  const incomeSourcesArray = incomes && incomes.length > 0 
    ? incomes.filter(item => item.value > 0)
    : [{ name: 'Income', value: income }];

  const totalIncome = incomeSourcesArray.reduce((sum, item) => sum + item.value, 0);

  if (totalIncome <= 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Enter your income to see the distribution</Text>
      </View>
    );
  }

  const expenseEntries = Object.entries(expenses || {})
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);

  const totalExpenses = expenseEntries.reduce((sum, [_, value]) => sum + value, 0);
  const isOverBudget = totalExpenses + savings > totalIncome;
  const overBudgetAmount = isOverBudget ? totalExpenses + savings - totalIncome : 0;

  const expenseItems = [
    ...expenseEntries.map(([key, value], index) => ({
      name: formatLabel(key),
      value,
      color: EXPENSE_COLORS[index % EXPENSE_COLORS.length],
      type: 'expense'
    })),
  ];

  if (savings > 0) {
    expenseItems.push({
      name: 'Savings',
      value: savings,
      color: SPECIAL_COLORS.savings,
      type: 'savings'
    });
  }

  if (isOverBudget) {
    expenseItems.push({
      name: 'Over Budget',
      value: overBudgetAmount,
      color: SPECIAL_COLORS.overbudget,
      type: 'overbudget'
    });
  } else if (remaining > 0) {
    expenseItems.push({
      name: 'Remaining',
      value: remaining,
      color: SPECIAL_COLORS.remaining,
      type: 'remaining'
    });
  }

  const incomeItems = incomeSourcesArray.map((item, index) => ({
    ...item,
    color: INCOME_COLORS[index % INCOME_COLORS.length],
  }));

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Income Donut Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <MaterialCommunityIcons name="cash-multiple" size={36} color="#6c5ce7" />
          <View style={styles.chartHeaderText}>
            <Text style={styles.chartTitle}>Income Sources</Text>
            <Text style={styles.chartSubtitle}>{currency}{totalIncome.toLocaleString()} total</Text>
          </View>
        </View>
        
        <View style={styles.chartContainer}>
          <DonutChart 
            data={incomeItems}
            total={totalIncome}
            currency={currency}
            centerLabel="Income"
          />
        </View>
        
        <View style={styles.legendContainer}>
          {incomeItems.map((item, index) => (
            <LegendItem 
              key={index}
              item={item}
              total={totalIncome}
              currency={currency}
            />
          ))}
        </View>
      </View>

      {/* Expenses Donut Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <MaterialCommunityIcons name="chart-pie" size={36} color="#ff7675" />
          <View style={styles.chartHeaderText}>
            <Text style={styles.chartTitle}>Spending Breakdown</Text>
            <Text style={styles.chartSubtitle}>{currency}{(totalExpenses + savings).toLocaleString()} allocated</Text>
          </View>
        </View>
        
        <View style={styles.chartContainer}>
          <DonutChart 
            data={expenseItems}
            total={totalIncome}
            currency={currency}
            centerLabel="Spent"
          />
        </View>
        
        <View style={styles.legendContainer}>
          {expenseItems.map((item, index) => (
            <LegendItem 
              key={index}
              item={item}
              total={totalIncome}
              currency={currency}
              isSpecial={item.type === 'savings' || item.type === 'remaining' || item.type === 'overbudget'}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function DonutChart({ data, total, currency, centerLabel }) {
  const size = Math.min(SCREEN_WIDTH - 100, 280);
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <View style={styles.donutWrapper}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2d2d44"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Data segments */}
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = circumference;
          const strokeDashoffset = circumference - (percentage / 100) * circumference;
          const rotation = (accumulatedPercentage / 100) * 360 - 90;
          
          accumulatedPercentage += percentage;

          return (
            <Circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              stroke={item.color}
              strokeWidth={strokeWidth - 4}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(${rotation} ${center} ${center})`}
            />
          );
        })}
        
        {/* Inner circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2 - 5}
          fill="#1e1e36"
        />
        
        {/* Center text */}
        <SvgText
          x={center}
          y={center - 15}
          fill="#888"
          fontSize="13"
          fontWeight="500"
          textAnchor="middle"
        >
          {centerLabel}
        </SvgText>
        <SvgText
          x={center}
          y={center + 12}
          fill="#fff"
          fontSize="20"
          fontWeight="bold"
          textAnchor="middle"
        >
          {formatAmount(total, currency)}
        </SvgText>
      </Svg>
    </View>
  );
}

function LegendItem({ item, total, currency, isSpecial }) {
  const percentage = ((item.value / total) * 100).toFixed(1);
  
  const getItemIcon = () => {
    if (item.type === 'savings') return 'piggy-bank';
    if (item.type === 'remaining') return 'check-circle';
    if (item.type === 'overbudget') return 'alert-circle';
    return null;
  };
  
  return (
    <View style={styles.legendItem}>
      <View style={styles.legendLeft}>
        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
        <Text style={[styles.legendName, isSpecial && styles.legendNameSpecial]} numberOfLines={1}>
          {item.name}
        </Text>
        {getItemIcon() && (
          <MaterialCommunityIcons 
            name={getItemIcon()} 
            size={16} 
            color={item.color} 
            style={styles.legendIcon}
          />
        )}
      </View>
      <View style={styles.legendRight}>
        <Text style={styles.legendAmount}>{currency}{item.value.toLocaleString()}</Text>
        <View style={[styles.percentBadge, { backgroundColor: item.color + '25' }]}>
          <Text style={[styles.percentText, { color: item.color }]}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );
}

function formatLabel(key) {
  const labels = {
    housing: 'Housing',
    utilities: 'Utilities',
    groceries: 'Groceries',
    transportation: 'Transport',
    subscriptions: 'Subscriptions',
    entertainment: 'Entertainment',
    dining: 'Dining Out',
    flights: 'Flights',
    accommodation: 'Hotel',
    activities: 'Activities',
    shopping: 'Shopping',
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

function formatAmount(amount, currency) {
  if (amount >= 1000000) {
    return currency + (amount / 1000000).toFixed(1) + 'M';
  } else if (amount >= 1000) {
    return currency + (amount / 1000).toFixed(1) + 'k';
  }
  return currency + amount.toLocaleString();
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  noDataText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
  },
  chartSection: {
    backgroundColor: '#1e1e36',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 5,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  chartHeaderText: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  donutWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  legendContainer: {
    borderTopWidth: 1,
    borderTopColor: '#2d2d4450',
    paddingTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d4430',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  legendName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  legendNameSpecial: {
    fontWeight: '700',
  },
  legendIcon: {
    marginLeft: 4,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendAmount: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginRight: 10,
    minWidth: 70,
    textAlign: 'right',
  },
  percentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    minWidth: 58,
    alignItems: 'center',
  },
  percentText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
