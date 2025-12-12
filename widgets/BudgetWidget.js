import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Rect, G, Text as SvgText } from 'react-native-svg';

const WIDGET_DATA_KEY = '@budgetbuddy_widget_data';

// Sankey diagram colors
const PALETTE = [
  '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', 
  '#1abc9c', '#34495e', '#95a5a6', '#d35400', '#c0392b', '#16a085',
];

const COLORS = {
  income: '#6c5ce7',
  savings: '#00b894',
  remaining: '#00cec9',
};

// Compact Sankey diagram for widget
const CompactSankeyDiagram = ({ budgetData, currency = '$' }) => {
  const { income = 0, expenses = {}, savings = 0, remaining = 0 } = budgetData || {};
  
  const width = 340;
  const height = 220;
  const nodeWidth = 60;
  const nodePadding = 8;
  
  // Prepare data
  const expenseEntries = Object.entries(expenses || {})
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Limit to top 5 expenses for widget
  
  const destinations = [];
  expenseEntries.forEach(([key, value], index) => {
    destinations.push({
      name: formatLabel(key),
      value,
      color: PALETTE[index % PALETTE.length],
    });
  });
  
  if (savings > 0) {
    destinations.push({ name: 'Savings', value: savings, color: COLORS.savings });
  }
  
  if (remaining > 0) {
    destinations.push({ name: 'Left', value: remaining, color: COLORS.remaining });
  }
  
  const totalDestinations = destinations.reduce((sum, d) => sum + d.value, 0);
  const scale = totalDestinations > 0 ? (height - nodePadding * (destinations.length - 1)) / totalDestinations : 1;
  
  // Calculate node positions
  let destY = 0;
  const destNodes = destinations.map(dest => {
    const nodeHeight = dest.value * scale;
    const node = {
      ...dest,
      x: width - nodeWidth,
      y: destY,
      height: nodeHeight,
    };
    destY += nodeHeight + nodePadding;
    return node;
  });
  
  const sourceNode = {
    x: 0,
    y: height / 2 - (income * scale) / 2,
    height: income * scale,
    color: COLORS.income,
  };
  
  // Create flow paths
  const createFlowPath = (source, dest, destHeight) => {
    const x0 = source.x + nodeWidth;
    const x1 = dest.x;
    const y0 = source.y + source.height / 2;
    const y1 = dest.y + destHeight / 2;
    const xi = (x0 + x1) / 2;
    
    return `M${x0},${y0} C${xi},${y0} ${xi},${y1} ${x1},${y1}`;
  };
  
  return (
    <Svg width={width} height={height} style={styles.sankeyContainer}>
      {/* Source node */}
      <Rect
        x={sourceNode.x}
        y={sourceNode.y}
        width={nodeWidth}
        height={sourceNode.height}
        fill={sourceNode.color}
        rx={4}
      />
      <SvgText
        x={sourceNode.x + nodeWidth / 2}
        y={sourceNode.y + sourceNode.height / 2}
        fill="#fff"
        fontSize="11"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Income
      </SvgText>
      
      {/* Flows and destination nodes */}
      {destNodes.map((dest, index) => {
        const flowHeight = dest.height;
        return (
          <G key={index}>
            {/* Flow path */}
            <Path
              d={createFlowPath(sourceNode, dest, flowHeight)}
              stroke={dest.color}
              strokeWidth={flowHeight}
              fill="none"
              opacity={0.4}
            />
            
            {/* Destination node */}
            <Rect
              x={dest.x}
              y={dest.y}
              width={nodeWidth}
              height={dest.height}
              fill={dest.color}
              rx={4}
            />
            
            {/* Label */}
            <SvgText
              x={dest.x + nodeWidth / 2}
              y={dest.y + dest.height / 2}
              fill="#fff"
              fontSize="9"
              fontWeight="600"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {dest.name.length > 8 ? dest.name.substring(0, 7) + '.' : dest.name}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
};

const formatLabel = (key) => {
  const labels = {
    housing: 'Housing',
    utilities: 'Utilities',
    groceries: 'Groceries',
    transportation: 'Transport',
    subscriptions: 'Subs',
    entertainment: 'Fun',
    dining: 'Dining',
    flights: 'Flights',
    accommodation: 'Hotel',
    activities: 'Activities',
    shopping: 'Shopping',
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

// Widget component that can be captured as an image
export const BudgetWidgetView = ({ budgetData, currency = '$', size = 'medium' }) => {
  const { name, plannerType, budgetData: data } = budgetData || {};
  const { income = 0, savings = 0, remaining = 0, expenses = {} } = data || {};
  
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (val || 0), 0);
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(0) : 0;
  
  const getPlannerIcon = (type) => {
    const icons = {
      monthly: 'calendar-month',
      goal: 'target',
      vacation: 'airplane',
    };
    return icons[type] || 'chart-box';
  };

  const getPlannerColor = (type) => {
    const colors = {
      monthly: '#4a69bd',
      goal: '#e74c3c',
      vacation: '#2ecc71',
    };
    return colors[type] || '#4a69bd';
  };

  const color = getPlannerColor(plannerType);
  const icon = getPlannerIcon(plannerType);

  // Different sizes for widgets
  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';

  return (
    <View style={[
      styles.widgetContainer,
      isSmall && styles.widgetSmall,
      isMedium && styles.widgetMedium,
      isLarge && styles.widgetLarge,
      { borderLeftColor: color }
    ]}>
      {/* Header */}
      <View style={styles.widgetHeader}>
        <MaterialCommunityIcons name={icon} size={isSmall ? 20 : 24} color={color} />
        <Text style={[styles.widgetTitle, isSmall && styles.widgetTitleSmall]} numberOfLines={1}>
          {name || 'Budget'}
        </Text>
      </View>

      {/* Stats or Diagram */}
      {isLarge ? (
        // Large widget - Show Sankey diagram
        <View style={styles.diagramSection}>
          <CompactSankeyDiagram budgetData={data} currency={currency} />
          <Text style={styles.diagramHint}>Budget Flow Visualization</Text>
        </View>
      ) : isSmall ? (
        // Small widget - minimal info
        <View style={styles.statsCompact}>
          <View style={styles.statRowCompact}>
            <Text style={styles.statLabelCompact}>Income</Text>
            <Text style={styles.statValueCompact}>{currency} {income.toLocaleString()}</Text>
          </View>
          <View style={styles.statRowCompact}>
            <Text style={styles.statLabelCompact}>Savings</Text>
            <Text style={[styles.statValueCompact, { color: '#2ecc71' }]}>
              {currency} {savings.toLocaleString()}
            </Text>
          </View>
        </View>
      ) : (
        // Medium widget - full info
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="cash" size={16} color="#2ecc71" />
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statValue}>{currency} {income.toLocaleString()}</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="credit-card-outline" size={16} color="#e74c3c" />
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.statValue}>{currency} {totalExpenses.toLocaleString()}</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="piggy-bank" size={16} color="#4a69bd" />
            <Text style={styles.statLabel}>Savings</Text>
            <Text style={styles.statValue}>{currency} {savings.toLocaleString()}</Text>
            <Text style={styles.statPercent}>{savingsRate}%</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="wallet" size={16} color="#f39c12" />
            <Text style={styles.statLabel}>Left</Text>
            <Text style={[styles.statValue, { color: remaining >= 0 ? '#2ecc71' : '#e74c3c' }]}>
              {currency} {remaining.toLocaleString()}
            </Text>
          </View>
        </View>
      )}

      {/* Progress bar (medium only) */}
      {isMedium && (
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(savingsRate, 100)}%`,
                  backgroundColor: savingsRate >= 20 ? '#2ecc71' : savingsRate >= 10 ? '#f39c12' : '#e74c3c'
                }
              ]} 
            />
          </View>
          <Text style={styles.progressLabel}>Savings Rate: {savingsRate}%</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.widgetFooter}>
        <Text style={styles.footerText}>Budget Buddy</Text>
        <MaterialCommunityIcons name="chart-line" size={12} color="#666" />
      </View>
    </View>
  );
};

// Widget export/create functionality
export const createWidgetImage = async (budgetData, size = 'medium') => {
  return new Promise((resolve, reject) => {
    try {
      // This would be handled by the component that renders BudgetWidgetView
      resolve({ success: true, size });
    } catch (error) {
      reject(error);
    }
  });
};

// Save widget data for native widget (iOS/Android)
export const saveWidgetData = async (budgetData) => {
  try {
    const widgetData = {
      budgetId: budgetData.id,
      name: budgetData.name,
      plannerType: budgetData.plannerType,
      currency: budgetData.currency,
      income: budgetData.budgetData.income,
      savings: budgetData.budgetData.savings,
      remaining: budgetData.budgetData.remaining,
      expenses: budgetData.budgetData.expenses,
      lastUpdated: Date.now(),
    };

    await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(widgetData));
    return { success: true };
  } catch (error) {
    console.error('Error saving widget data:', error);
    return { success: false, error };
  }
};

// Get widget data
export const getWidgetData = async () => {
  try {
    const data = await AsyncStorage.getItem(WIDGET_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting widget data:', error);
    return null;
  }
};

const styles = StyleSheet.create({
  widgetContainer: {
    backgroundColor: '#232340',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  widgetSmall: {
    width: 169,
    height: 169,
    padding: 12,
  },
  widgetMedium: {
    width: 360,
    height: 169,
  },
  widgetLarge: {
    width: 360,
    height: 420,
    padding: 12,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  widgetTitleSmall: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 12,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  statPercent: {
    fontSize: 10,
    color: '#4a69bd',
  },
  statsCompact: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  statRowCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabelCompact: {
    fontSize: 11,
    color: '#888',
  },
  statValueCompact: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressSection: {
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#1a1a2e',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
  diagramSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sankeyContainer: {
    marginVertical: 8,
  },
  diagramHint: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  widgetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2d2d44',
    gap: 4,
  },
  footerText: {
    fontSize: 10,
    color: '#666',
  },
});

export default BudgetWidgetView;
