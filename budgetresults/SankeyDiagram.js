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

export default function SankeyDiagram({ budgetData, currency = '$' }) {
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

  // Calculate if over budget
  const totalExpenses = expenseEntries.reduce((sum, [_, value]) => sum + value, 0) + savings;
  const isOverBudget = totalExpenses > totalIncome;
  const overBudgetAmount = isOverBudget ? totalExpenses - totalIncome : 0;

  // Handle remaining or over-budget
  if (isOverBudget) {
    dataItems.push({
      name: 'Over Budget ⚠️',
      value: overBudgetAmount,
      color: '#e74c3c', // Red color for over budget
      type: 'overbudget'
    });
  } else if (remaining > 0) {
    dataItems.push({
      name: 'Remaining ✓',
      value: remaining,
      color: COLORS.remaining,
      type: 'remaining'
    });
  }

  // Sort all items by value, but keep Remaining/Over Budget at the bottom
  const regularItems = dataItems.filter(item => item.type !== 'remaining' && item.type !== 'overbudget');
  const bottomItem = dataItems.find(item => item.type === 'remaining' || item.type === 'overbudget');
  
  regularItems.sort((a, b) => b.value - a.value);
  
  // Reconstruct array with remaining/overbudget at bottom
  const sortedItems = bottomItem ? [...regularItems, bottomItem] : regularItems;
  dataItems.length = 0;
  dataItems.push(...sortedItems);

  // 2. Layout Calculations - COMPACT VERSION
  const nodeWidth = 16; // Slimmer nodes
  const minNodeSpacing = 42; // Increased spacing for wrapped text
  const minNodeHeight = 6;
  
  // Calculate heights
  const numLeftNodes = incomeSourcesArray.length;
  const numRightNodes = dataItems.length;
  
  // Compact height calculation
  const minHeightForLabels = Math.max(numLeftNodes, numRightNodes) * minNodeSpacing;
  const canvasHeight = Math.max(280, minHeightForLabels + 60);
  
  // Calculate dynamic left margin based on longest income source label
  const maxLabelLength = Math.max(
    ...incomeSourcesArray.map(item => {
      const label = item.name || 'Income';
      const wrapped = wrapText(label, 12);
      return Math.max(...wrapped.map(line => line.length));
    })
  );
  // Approximate 6 pixels per character + 30px padding for amount
  const dynamicLeftMargin = Math.max(75, maxLabelLength * 6 + 40);
  
  // Drawing area - compact positioning
  const leftX = dynamicLeftMargin;
  const middleX = canvasWidth / 2 - nodeWidth / 2;
  const rightX = canvasWidth - 160;
  const startY = 50; // Increased from 30 to 50 to make room for Total label and amount
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

  // Over Budget Extension Node (if applicable)
  const overBudgetExtension = isOverBudget ? {
    x: middleX,
    y: middleNode.y + middleNode.height,
    width: nodeWidth,
    height: Math.max(overBudgetAmount * scale, minNodeHeight),
    color: '#e74c3c', // Red color for over budget
    value: overBudgetAmount
  } : null;

  // Destination Nodes - Right side (exclude overbudget from right side)
  const destNodes = [];
  let currentRightY = startY;
  
  dataItems.forEach(item => {
    // Skip over budget item as it will be shown as extension in the middle
    if (item.type === 'overbudget') return;
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
    
    // Determine if flow comes from middle node or over budget extension
    const sourceIsOverBudget = isOverBudget && currentMiddleDistY >= middleNode.height;
    const sourceNode = sourceIsOverBudget ? overBudgetExtension : middleNode;
    
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
      value: dest.value,
      fromOverBudget: sourceIsOverBudget
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
                <Stop offset="0" stopColor={ribbon.fromOverBudget ? '#e74c3c' : middleNode.color} stopOpacity="0.65" />
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
          {sourceNodes.map((node, i) => {
            const wrappedLabel = wrapText(node.label, 12);
            const labelHeight = wrappedLabel.length * 12; // 12px per line
            const labelStartY = node.y + node.height / 2 - (labelHeight / 2) + 6;
            
            return (
              <G key={`source-${i}`}>
                <Rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  fill={node.color}
                  rx={3}
                />
                {wrappedLabel.map((line, lineIndex) => (
                  <SvgText
                    key={`label-${i}-${lineIndex}`}
                    x={node.x - 8}
                    y={labelStartY + (lineIndex * 12)}
                    fill="#fff"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="end"
                    alignmentBaseline="middle"
                  >
                    {line}
                  </SvgText>
                ))}
                <SvgText
                  x={node.x - 8}
                  y={node.y + node.height / 2 + (labelHeight / 2) + 8}
                  fill={node.color}
                  fontSize="10"
                  fontWeight="500"
                  textAnchor="end"
                  alignmentBaseline="middle"
                >
                  {`${currency} ${node.value.toLocaleString()}`}
                </SvgText>
              </G>
            );
          })}

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
            y={middleNode.y - 20}
            fill="#fff"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            Total
          </SvgText>
          <SvgText
            x={middleNode.x + middleNode.width / 2}
            y={middleNode.y - 6}
            fill={middleNode.color}
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            {`${currency} ${totalIncome.toLocaleString()}`}
          </SvgText>

          {/* Over Budget Extension Bar (if applicable) */}
          {overBudgetExtension && (
            <>
              <Rect
                x={overBudgetExtension.x}
                y={overBudgetExtension.y}
                width={overBudgetExtension.width}
                height={overBudgetExtension.height}
                fill={overBudgetExtension.color}
                rx={3}
                opacity={1}
              />
              {/* Add subtle glow for over budget bar */}
              <Rect
                x={overBudgetExtension.x - 2}
                y={overBudgetExtension.y - 2}
                width={overBudgetExtension.width + 4}
                height={overBudgetExtension.height + 4}
                fill="none"
                stroke={overBudgetExtension.color}
                strokeWidth="1.5"
                rx={4}
                opacity="0.6"
              />
              <SvgText
                x={overBudgetExtension.x + overBudgetExtension.width / 2}
                y={overBudgetExtension.y + overBudgetExtension.height + 16}
                fill={overBudgetExtension.color}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                Over Budget
              </SvgText>
              <SvgText
                x={overBudgetExtension.x + overBudgetExtension.width / 2}
                y={overBudgetExtension.y + overBudgetExtension.height + 30}
                fill={overBudgetExtension.color}
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
              >
                {`${currency} ${overBudgetAmount.toLocaleString()}`}
              </SvgText>
            </>
          )}

          {/* Destination Nodes (Right) */}
          {destNodes.map((node, i) => {
            const isSpecialNode = node.type === 'remaining' || node.type === 'overbudget';
            const nodeColor = isSpecialNode ? node.color : node.color;
            const wrappedLabel = wrapText(node.name, 14);
            const labelHeight = wrappedLabel.length * 12; // 12px per line
            const labelStartY = node.y + node.height / 2 - (labelHeight / 2) + 6;
            
            return (
              <G key={`dest-${i}`}>
                <Rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  fill={nodeColor}
                  rx={3}
                  opacity={isSpecialNode ? 1 : 0.9}
                />
                {/* Add subtle glow for special nodes */}
                {isSpecialNode && (
                  <Rect
                    x={node.x - 2}
                    y={node.y - 2}
                    width={node.width + 4}
                    height={node.height + 4}
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="1.5"
                    rx={4}
                    opacity="0.6"
                  />
                )}
                {wrappedLabel.map((line, lineIndex) => (
                  <SvgText
                    key={`label-${i}-${lineIndex}`}
                    x={node.x + node.width + 8}
                    y={labelStartY + (lineIndex * 12)}
                    fill={isSpecialNode ? nodeColor : "#fff"}
                    fontSize={isSpecialNode ? "12" : "11"}
                    fontWeight={isSpecialNode ? "bold" : "600"}
                    alignmentBaseline="middle"
                  >
                    {line}
                  </SvgText>
                ))}
                <SvgText
                  x={node.x + node.width + 8}
                  y={node.y + node.height / 2 + (labelHeight / 2) + 8}
                  fill={node.color}
                  fontSize="10"
                  fontWeight="500"
                  alignmentBaseline="middle"
                >
                  {`${currency} ${node.value.toLocaleString()} (${((node.value / totalIncome) * 100).toFixed(0)}%)`}
                </SvgText>
              </G>
            );
          })}
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

// Helper to wrap text if it's too long
function wrapText(text, maxLength = 12) {
  if (text.length <= maxLength) return [text];
  
  // Try to split at spaces
  const words = text.split(' ');
  if (words.length === 1) {
    // Single long word, truncate with ellipsis
    return [text.substring(0, maxLength - 1) + '...'];
  }
  
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + ' ' + word).trim().length <= maxLength) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) lines.push(currentLine);
  
  // Limit to 2 lines max
  return lines.slice(0, 2);
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
