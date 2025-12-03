import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Rect, G, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// SankeyMATIC-inspired palette
const PALETTE = [
  '#2ecc71', // Emerald (Savings)
  '#3498db', // Peter River (Blue)
  '#9b59b6', // Amethyst (Purple)
  '#f1c40f', // Sun Flower (Yellow)
  '#e67e22', // Carrot (Orange)
  '#e74c3c', // Alizarin (Red)
  '#1abc9c', // Turquoise
  '#34495e', // Wet Asphalt
  '#95a5a6', // Concrete
  '#d35400', // Pumpkin
  '#c0392b', // Pomegranate
  '#16a085', // Green Sea
  '#8e44ad', // Wisteria
  '#2980b9', // Belize Hole
  '#f39c12', // Orange
];

const COLORS = {
  income: '#6c5ce7', // Purple for source
  savings: '#00b894',
  remaining: '#00cec9',
  default: '#3498db',
};

export default function SankeyDiagram({ budgetData }) {
  // Compact canvas - 1.4x screen width for comfortable scrolling
  const canvasWidth = SCREEN_WIDTH * 1.4;

  if (!budgetData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No budget data available</Text>
      </View>
    );
  }

  const { income = 0, incomes = [], expenses = {}, savings = 0, remaining = 0 } = budgetData;

  // Handle both old format (single income) and new format (multiple incomes)
  const incomeSourcesArray = incomes && incomes.length > 0 
    ? incomes.filter(item => item.value > 0)
    : [{ name: 'Income', value: income }];

  const totalIncome = incomeSourcesArray.reduce((sum, item) => sum + item.value, 0);

  if (totalIncome <= 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Enter your income to see the flow diagram</Text>
      </View>
    );
  }

  // 1. Prepare Data
  const expenseEntries = Object.entries(expenses || {})
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]); // Sort descending

  const dataItems = [
    ...expenseEntries.map(([key, value], index) => ({
      name: formatLabel(key),
      value,
      color: PALETTE[index % PALETTE.length],
      type: 'expense'
    })),
  ];

  if (savings > 0) {
    dataItems.push({
      name: 'Savings',
      value: savings,
      color: COLORS.savings,
      type: 'savings'
    });
  }

  if (remaining > 0) {
    dataItems.push({
      name: 'Remaining',
      value: remaining,
      color: COLORS.remaining,
      type: 'remaining'
    });
  }

  // Sort all items by value for the right side
  dataItems.sort((a, b) => b.value - a.value);

  // 2. Layout Calculations - COMPACT VERSION
  const nodeWidth = 16; // Slimmer nodes
  const minNodeSpacing = 36; // Compact spacing between nodes
  const minNodeHeight = 6;
  
  // Calculate heights
  const numLeftNodes = incomeSourcesArray.length;
  const numRightNodes = dataItems.length;
  
  // Compact height calculation
  const minHeightForLabels = Math.max(numLeftNodes, numRightNodes) * minNodeSpacing;
  const canvasHeight = Math.max(280, minHeightForLabels + 60);
  
  // Drawing area - compact positioning
  const leftX = 75;
  const middleX = canvasWidth / 2 - nodeWidth / 2;
  const rightX = canvasWidth - 160;
  const startY = 30;
  const drawingHeight = canvasHeight - 60;

  // Scale factor
  const scale = drawingHeight / totalIncome;

  // Source Nodes (Income Sources) - Left side
  const sourceNodes = [];
  let currentLeftY = startY;
  
  incomeSourcesArray.forEach((item, index) => {
    const rawHeight = item.value * scale;
    const height = Math.max(minNodeHeight, rawHeight);
    
    sourceNodes.push({
      x: leftX,
      y: currentLeftY,
      width: nodeWidth,
      height,
      color: PALETTE[(index + 5) % PALETTE.length],
      value: item.value,
      label: item.name || 'Income'
    });
    
    currentLeftY += Math.max(height + 8, minNodeSpacing);
  });

  // Middle Node (Total Income)
  const totalMiddleHeight = totalIncome * scale;
  const middleNode = {
    x: middleX,
    y: startY,
    width: nodeWidth,
    height: Math.max(totalMiddleHeight, minNodeHeight),
    color: COLORS.income,
    value: totalIncome,
    label: 'Total'
  };

  // Destination Nodes - Right side
  const destNodes = [];
  let currentRightY = startY;
  
  dataItems.forEach(item => {
    const rawHeight = item.value * scale;
    const height = Math.max(minNodeHeight, rawHeight);
    
    destNodes.push({
      x: rightX,
      y: currentRightY,
      width: nodeWidth,
      height,
      color: item.color,
      ...item
    });
    
    currentRightY += Math.max(height + 8, minNodeSpacing);
  });

  // Final height
  const finalHeight = Math.max(canvasHeight, Math.max(currentLeftY, currentRightY) + 30);

  // Generate Ribbons - Left side
  let currentMiddleY = startY;
  const ribbonsLeft = sourceNodes.map(source => {
    const flowHeight = Math.max(3, source.value * scale);
    
    const start = {
      x: source.x + source.width,
      y: source.y + source.height / 2 - flowHeight / 2
    };
    
    const end = {
      x: middleNode.x,
      y: currentMiddleY
    };

    currentMiddleY += flowHeight;

    return {
      d: createRibbonPath(start.x, start.y, end.x, end.y, flowHeight),
      color: source.color,
      value: source.value
    };
  });

  // Generate Ribbons - Right side
  let currentMiddleDistY = startY;
  const ribbonsRight = destNodes.map(dest => {
    const flowHeight = Math.max(3, dest.value * scale);
    
    const start = {
      x: middleNode.x + middleNode.width,
      y: currentMiddleDistY
    };
    
    const end = {
      x: dest.x,
      y: dest.y + (dest.height - flowHeight) / 2
    };

    currentMiddleDistY += flowHeight;

    return {
      d: createRibbonPath(start.x, start.y, end.x, end.y, flowHeight),
      color: dest.color,
      value: dest.value
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Svg width={canvasWidth} height={finalHeight}>
          <Defs>
            {ribbonsLeft.map((ribbon, i) => (
              <LinearGradient key={`grad-left-${i}`} id={`grad-left-${i}`} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={ribbon.color} stopOpacity="0.75" />
                <Stop offset="1" stopColor={middleNode.color} stopOpacity="0.65" />
              </LinearGradient>
            ))}
            {ribbonsRight.map((ribbon, i) => (
              <LinearGradient key={`grad-right-${i}`} id={`grad-right-${i}`} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={middleNode.color} stopOpacity="0.65" />
                <Stop offset="1" stopColor={ribbon.color} stopOpacity="0.75" />
              </LinearGradient>
            ))}
          </Defs>

          {/* Left Ribbons */}
          {ribbonsLeft.map((ribbon, i) => (
            <Path
              key={`ribbon-left-${i}`}
              d={ribbon.d}
              fill={`url(#grad-left-${i})`}
            />
          ))}

          {/* Right Ribbons */}
          {ribbonsRight.map((ribbon, i) => (
            <Path
              key={`ribbon-right-${i}`}
              d={ribbon.d}
              fill={`url(#grad-right-${i})`}
            />
          ))}

          {/* Source Nodes (Left) */}
          {sourceNodes.map((node, i) => (
            <G key={`source-${i}`}>
              <Rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                fill={node.color}
                rx={3}
              />
              <SvgText
                x={node.x - 8}
                y={node.y + node.height / 2}
                fill="#fff"
                fontSize="11"
                fontWeight="600"
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {node.label}
              </SvgText>
              <SvgText
                x={node.x - 8}
                y={node.y + node.height / 2 + 13}
                fill={node.color}
                fontSize="10"
                fontWeight="500"
                textAnchor="end"
                alignmentBaseline="middle"
              >
                ${node.value.toLocaleString()}
              </SvgText>
            </G>
          ))}

          {/* Middle Node (Total) */}
          <Rect
            x={middleNode.x}
            y={middleNode.y}
            width={middleNode.width}
            height={middleNode.height}
            fill={middleNode.color}
            rx={3}
          />
          <SvgText
            x={middleNode.x + middleNode.width / 2}
            y={middleNode.y - 12}
            fill="#fff"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            Total
          </SvgText>
          <SvgText
            x={middleNode.x + middleNode.width / 2}
            y={middleNode.y + middleNode.height + 16}
            fill={middleNode.color}
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            ${totalIncome.toLocaleString()}
          </SvgText>

          {/* Destination Nodes (Right) */}
          {destNodes.map((node, i) => (
            <G key={`dest-${i}`}>
              <Rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                fill={node.color}
                rx={3}
              />
              <SvgText
                x={node.x + node.width + 8}
                y={node.y + node.height / 2}
                fill="#fff"
                fontSize="11"
                fontWeight="600"
                alignmentBaseline="middle"
              >
                {node.name}
              </SvgText>
              <SvgText
                x={node.x + node.width + 8}
                y={node.y + node.height / 2 + 13}
                fill={node.color}
                fontSize="10"
                fontWeight="500"
                alignmentBaseline="middle"
              >
                ${node.value.toLocaleString()} ({((node.value / totalIncome) * 100).toFixed(0)}%)
              </SvgText>
            </G>
          ))}
        </Svg>
      </ScrollView>
    </View>
  );
}

// Helper to create the bezier ribbon path
function createRibbonPath(x1, y1, x2, y2, thickness) {
  const curvature = 0.5;
  const cp1x = x1 + (x2 - x1) * curvature;
  const cp2x = x2 - (x2 - x1) * curvature;

  return `
    M ${x1} ${y1}
    C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}
    L ${x2} ${y2 + thickness}
    C ${cp2x} ${y2 + thickness}, ${cp1x} ${y1 + thickness}, ${x1} ${y1 + thickness}
    Z
  `;
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
    expenses: 'Expenses',
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    minHeight: 280,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 5,
  },
  noDataText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  }
});
