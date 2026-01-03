import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Animated, TouchableOpacity } from 'react-native';
import Svg, { Path, Rect, G, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  // Canvas dimensions - more compact for better visibility
  const canvasWidth = SCREEN_WIDTH * 1.8;
  
  // Container dimensions (the visible box)
  const CONTAINER_HEIGHT = 400;
  const CONTAINER_WIDTH = SCREEN_WIDTH;
  
  // Initial zoom level - start zoomed out to see full diagram
  const INITIAL_ZOOM = 0.56;
  
  // The middle node is at canvasWidth / 2 in SVG coordinates
  // With React Native, scale transforms from the CENTER of the view
  // So after scaling, the center of the diagramWrapper stays at the same position
  // 
  // The diagramWrapper will be sized to canvasWidth x finalHeight
  // Its center will be at (canvasWidth/2, finalHeight/2) relative to its own position
  // 
  // To have the middle node (at canvasWidth/2 in SVG) appear at container center (CONTAINER_WIDTH/2):
  // The wrapper's left edge needs to be at: CONTAINER_WIDTH/2 - canvasWidth/2
  // This places the center of the canvas at the center of the container
  //
  // For vertical: Position the "Total" label at a FIXED distance from the top
  // The Total label is at startY - 20 (which is 50 - 20 = 30) in SVG coordinates
  // We want this to appear at a fixed position (e.g., 60px from top of container)
  // After scaling: (30 * INITIAL_ZOOM) would be the label's position relative to wrapper's top
  // To place it at 60px from container top, wrapper's top should be at: 60 - (30 * INITIAL_ZOOM)
  
  const INITIAL_OFFSET_X = (CONTAINER_WIDTH - canvasWidth) / 2 - 20; // Shift left a bit more
  
  // Fixed vertical positioning - Total label right underneath the top border
  // The scale transform is applied from the CENTER of the view
  // Since height varies, we need to compensate for this
  // 
  // The Total label is at Y=30 in SVG coordinates (startY=50 - 20px for label)
  // After scaling from center, we need to calculate the final position
  // 
  // For a view with height H, scaled by S from center:
  // - A point at Y=0 moves to: H/2 - (H/2 * S) = H/2 * (1 - S)
  // - A point at Y=y moves to: H/2 * (1-S) + y*S
  // 
  // We want the Total label (at Y=30) to appear at ~20px from container top
  // So: top_offset + H/2 * (1-S) + 30*S = 20
  // => top_offset = 20 - H/2 * (1-S) - 30*S
  // But H (finalHeight) is calculated later, so we use a fixed approach instead
  
  // Use a FIXED large height for calculations to avoid dependency on actual content
  const FIXED_REFERENCE_HEIGHT = 600; // Fixed reference height
  const totalLabelYInSvg = 30;
  const desiredTopPosition = 20; // 20px from top
  
  // Calculate offset to place total label at desired position
  // Compensating for scale-from-center behavior
  const centerOffset = (FIXED_REFERENCE_HEIGHT / 2) * (1 - INITIAL_ZOOM);
  const INITIAL_OFFSET_Y = desiredTopPosition - centerOffset - (totalLabelYInSvg * INITIAL_ZOOM);
  
  // Animation values using standard Animated API
  const scale = useRef(new Animated.Value(INITIAL_ZOOM)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  
  // References for tracking gesture state
  const baseScale = useRef(1);
  const lastScale = useRef(INITIAL_ZOOM);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);
  
  // State for showing/hiding zoom controls
  const [showZoomControls, setShowZoomControls] = React.useState(false);
  
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;  // Reduceret fra 8 til 3 - maksimalt 3x zoom ind
  
  // State for tracking if zoom buttons should be disabled
  const [isAtMinZoom, setIsAtMinZoom] = React.useState(false);
  const [isAtMaxZoom, setIsAtMaxZoom] = React.useState(false);
  
  // Update button states based on current zoom
  const updateZoomButtonStates = (currentZoom) => {
    setIsAtMinZoom(currentZoom <= MIN_SCALE);
    setIsAtMaxZoom(currentZoom >= MAX_SCALE);
  };
  
  // Initial check
  React.useEffect(() => {
    updateZoomButtonStates(INITIAL_ZOOM);
  }, []);

  // Progressive zoom functions - zoomer mere og mere for hvert klik
  const zoomIn = () => {
    const currentScale = lastScale.current;
    
    // Don't zoom if already at max
    if (currentScale >= MAX_SCALE) return;
    
    let zoomFactor;
    
    // Progressivt zoom baseret på nuværende zoom niveau
    if (currentScale < 0.5) {
      zoomFactor = 1.5; // Lille zoom når meget udzoomet
    } else if (currentScale < 1.5) {
      zoomFactor = 1.4; // Mellem zoom ved normal visning
    } else if (currentScale < 3) {
      zoomFactor = 1.3; // Større zoom når mere indzoomet
    } else {
      zoomFactor = 1.25; // Endnu større zoom ved høj zoom
    }
    
    const newScale = Math.min(currentScale * zoomFactor, MAX_SCALE);
    lastScale.current = newScale;
    
    // Update button states
    updateZoomButtonStates(newScale);
    
    // Smooth spring animation
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
      friction: 8,
      tension: 50,
      velocity: 2,
    }).start();
    
    baseScale.current = 1;
  };

  const zoomOut = () => {
    const currentScale = lastScale.current;
    
    // Don't zoom if already at min
    if (currentScale <= MIN_SCALE) return;
    
    let zoomFactor;
    
    // Progressivt zoom baseret på nuværende zoom niveau
    if (currentScale > 3) {
      zoomFactor = 1.25; // Lille zoom når meget indzoomet
    } else if (currentScale > 1.5) {
      zoomFactor = 1.3; // Mellem zoom ved høj zoom
    } else if (currentScale > 0.5) {
      zoomFactor = 1.4; // Større zoom ved normal visning
    } else {
      zoomFactor = 1.5; // Endnu større zoom når meget udzoomet
    }
    
    const newScale = Math.max(currentScale / zoomFactor, MIN_SCALE);
    lastScale.current = newScale;
    
    // Update button states
    updateZoomButtonStates(newScale);
    
    // Smooth spring animation
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
      friction: 8,
      tension: 50,
      velocity: 2,
    }).start();
    
    baseScale.current = 1;
  };

  const resetZoom = () => {
    lastScale.current = INITIAL_ZOOM;
    lastTranslateX.current = 0;
    lastTranslateY.current = 0;
    
    // Update button states
    updateZoomButtonStates(INITIAL_ZOOM);
    
    Animated.parallel([
      Animated.spring(scale, {
        toValue: INITIAL_ZOOM,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      }),
    ]).start(() => {
      translateX.setOffset(0);
      translateY.setOffset(0);
      translateX.setValue(0);
      translateY.setValue(0);
      baseScale.current = 1;
    });
  };

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
      name: 'Over\nBudget ⚠️',
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
  
  // Drawing area - SYMMETRICAL positioning around center
  // The middle node is at the center of the canvas
  const middleX = canvasWidth / 2 - nodeWidth / 2;
  
  // Calculate the distance from center to edges - make it symmetrical
  // Use a fixed distance from center for both sides to ensure symmetry
  const distanceFromCenter = (canvasWidth / 2) - 160; // Distance from center to side nodes
  
  // Left side slightly longer (+15) to account for label space on right side
  const leftX = middleX - distanceFromCenter + nodeWidth / 2 - 15;
  const rightX = middleX + distanceFromCenter + nodeWidth / 2;
  
  const startY = 50; // Increased from 30 to 50 to make room for Total label and amount
  const drawingHeight = canvasHeight - 60;

  // Scale factor for converting values to heights
  const valueScale = drawingHeight / totalIncome;

  // Source Nodes (Income Sources) - Left side
  const sourceNodes = [];
  let currentLeftY = startY;
  
  incomeSourcesArray.forEach((item, index) => {
    const rawHeight = item.value * valueScale;
    const height = Math.max(minNodeHeight, rawHeight);
    
    sourceNodes.push({
      x: leftX,
      y: currentLeftY,
      width: nodeWidth,
      height,
      color: index === 2 ? '#00d2ff' : PALETTE[(index + 5) % PALETTE.length],
      value: item.value,
      label: item.name || 'Income'
    });
    
    currentLeftY += Math.max(height + 8, minNodeSpacing);
  });

  // Middle Node (Total Income)
  const totalMiddleHeight = totalIncome * valueScale;
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
    height: Math.max(overBudgetAmount * valueScale, minNodeHeight),
    color: '#e74c3c', // Red color for over budget
    value: overBudgetAmount
  } : null;

  // Destination Nodes - Right side (exclude overbudget from right side)
  const destNodes = [];
  let currentRightY = startY;
  
  dataItems.forEach(item => {
    // Skip over budget item as it will be shown as extension in the middle
    if (item.type === 'overbudget') return;
    const rawHeight = item.value * valueScale;
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
    const flowHeight = Math.max(3, source.value * valueScale);
    
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
    const flowHeight = Math.max(3, dest.value * valueScale);
    
    // Determine if flow comes from middle node or over budget extension
    // Calculate what percentage of this flow comes from the over budget zone
    const flowStartsAtY = currentMiddleDistY;
    const flowEndsAtY = currentMiddleDistY + flowHeight;
    const middleNodeEndsAtY = middleNode.y + middleNode.height;
    
    let overBudgetPercentage = 0;
    if (isOverBudget && flowEndsAtY > middleNodeEndsAtY) {
      // Calculate how much of the flow is in the over budget zone
      const overlapStart = Math.max(flowStartsAtY, middleNodeEndsAtY);
      const overlapEnd = flowEndsAtY;
      const overlapHeight = overlapEnd - overlapStart;
      overBudgetPercentage = (overlapHeight / flowHeight) * 100;
    }
    
    // Apply red gradient only if 40% or more comes from over budget
    const sourceIsOverBudget = overBudgetPercentage >= 40;
    
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

  // Pan gesture handler with zoom-adjusted sensitivity
  const onPanGestureEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // Scale the translation inversely with zoom level for consistent sensitivity
      // When zoomed in (scale > 1), reduce sensitivity by dividing by scale
      // When zoomed out (scale < 1), increase sensitivity by dividing by scale
      const adjustedTranslationX = event.nativeEvent.translationX / lastScale.current;
      const adjustedTranslationY = event.nativeEvent.translationY / lastScale.current;
      
      translateX.setValue(adjustedTranslationX);
      translateY.setValue(adjustedTranslationY);
    }
  };

  const onPanHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // Update last positions with zoom-adjusted values
      const adjustedTranslationX = event.nativeEvent.translationX / lastScale.current;
      const adjustedTranslationY = event.nativeEvent.translationY / lastScale.current;
      
      lastTranslateX.current += adjustedTranslationX;
      lastTranslateY.current += adjustedTranslationY;
      
      // Set offset for smooth continuation
      translateX.setOffset(lastTranslateX.current);
      translateY.setOffset(lastTranslateY.current);
      translateX.setValue(0);
      translateY.setValue(0);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onPanHandlerStateChange}
        minPointers={1}
        maxPointers={1}
        avgTouches
      >
        <Animated.View style={styles.gestureContainer}>
          <Animated.View
            style={[
              styles.diagramWrapper,
              {
                // Use FIXED height for consistent transform origin regardless of content size
                width: canvasWidth,
                height: FIXED_REFERENCE_HEIGHT,
                // Position the wrapper so the Total label is at top
                left: INITIAL_OFFSET_X,
                top: INITIAL_OFFSET_Y,
                transform: [
                  { scale: scale },
                  { translateX: translateX },
                  { translateY: translateY },
                ],
              },
            ]}
          >
            <View style={styles.svgPositioner}>
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
                  fill={i === 2 ? '#00d2ff' : node.color}
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
                Over
              </SvgText>
              <SvgText
                x={overBudgetExtension.x + overBudgetExtension.width / 2}
                y={overBudgetExtension.y + overBudgetExtension.height + 28}
                fill={overBudgetExtension.color}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                Budget
              </SvgText>
              <SvgText
                x={overBudgetExtension.x + overBudgetExtension.width / 2}
                y={overBudgetExtension.y + overBudgetExtension.height + 42}
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
              </View>
            </Animated.View>
          
          {/* Zoom Toggle Marker - Lower Left Corner */}
          <TouchableOpacity 
            style={styles.zoomToggle}
            onPress={() => setShowZoomControls(!showZoomControls)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name={showZoomControls ? "close" : "magnify"} 
              size={16} 
              color="#fff" 
            />
          </TouchableOpacity>
          
          {/* Zoom Controls - Show only when toggled */}
          {showZoomControls && (
            <View style={styles.zoomControls}>
              <TouchableOpacity 
                style={[styles.zoomButton, isAtMaxZoom && styles.zoomButtonDisabled]}
                onPress={zoomIn}
                activeOpacity={0.7}
                disabled={isAtMaxZoom}
              >
                <MaterialCommunityIcons 
                  name="plus" 
                  size={18} 
                  color={isAtMaxZoom ? '#666' : '#fff'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.zoomButton, isAtMinZoom && styles.zoomButtonDisabled]}
                onPress={zoomOut}
                activeOpacity={0.7}
                disabled={isAtMinZoom}
              >
                <MaterialCommunityIcons 
                  name="minus" 
                  size={18}
                  color={isAtMinZoom ? '#666' : '#fff'} 
                />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
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
    height: 400, // Fast højde - ikke afhængig af diagram størrelse
    width: '100%',
  },
  gestureContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
  },
  diagramWrapper: {
    // Animated transform applied
  },
  svgPositioner: {
    // Positioning handled by initial translateX/translateY values
  },
  zoomToggle: {
    position: 'absolute',
    bottom: 15,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 105, 189, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 55, // Positioned above the toggle button
    right: 10,
    flexDirection: 'column',
    gap: 6,
    backgroundColor: 'rgba(35, 35, 64, 0.6)',
    borderRadius: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  zoomButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 105, 189, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonDisabled: {
    backgroundColor: 'rgba(74, 105, 189, 0.25)',
    opacity: 0.4,
  },
  noDataText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  }
});
