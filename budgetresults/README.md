# Budget Results Visualization

## Overview
This feature provides beautiful Sankey diagram visualizations for all budget planners in the BudgetBuddy app, inspired by the popular financial flow diagrams from r/MiddleClassFinance on Reddit.

## Files Created

### `/budgetresults/BudgetResultsScreen.js`
The main results screen that displays:
- **Sankey Diagram**: Visual flow chart showing how income flows through expenses and savings
- **Budget Insights**: Intelligent analysis of budget health with actionable recommendations
- **Statistics Grid**: Key metrics including income, expenses, savings rate, and remaining balance
- **Planner-Specific Information**: Customized displays for each planner type

### `/budgetresults/SankeyDiagram.js`
Custom SVG-based Sankey diagram component featuring:
- Dynamic flow paths using Bezier curves
- Color-coded expense categories
- Proportional width representation based on amounts
- Three-column layout (Income → Budget → Expenses/Savings)
- Interactive legend

## Features

### Visual Elements
1. **Sankey Flow Diagram**
   - Left column: Income source
   - Middle column: Budget allocation point
   - Right column: Individual expense categories and savings
   - Curved flow paths showing money distribution

2. **Budget Health Indicators**
   - Green status for healthy budgets (≥10% savings, positive cash flow)
   - Yellow/Orange warnings for budgets needing adjustment
   - Contextual tips and recommendations

3. **Statistics Dashboard**
   - Income total
   - Total expenses with percentage
   - Savings amount with percentage
   - Remaining/available funds

### Planner Integration

#### Monthly Planner
- Shows monthly income flow
- Breaks down all expense categories
- Displays savings goals
- Calculates remaining budget

#### Goal Planner
- Progress bar showing current vs target amount
- Monthly savings requirement
- Timeline feasibility check
- Achievement probability

#### Vacation Planner
- Destination and trip details
- Cost breakdown by category
- Emergency fund visualization
- Monthly savings goal

## Color Palette
The visualization uses a soft, pastel color scheme inspired by the attached examples:
- **Income**: Pink (#E8A5C2)
- **Budget**: Light Blue (#A5D8E8)
- **Expenses**: Beige/Tan (#D4C4A0)
- **Savings**: Green (#90C695)
- **Category-specific colors** for different expense types

## How It Works

### Data Flow
1. User completes questions in any planner
2. Planner calculates budget data
3. Data is transformed into standardized format:
   ```javascript
   {
     income: number,
     expenses: { [category]: amount },
     savings: number,
     remaining: number,
     // Optional planner-specific info
   }
   ```
4. BudgetResultsScreen receives data and displays visualization

### Integration
Each planner screen imports and uses the results screen:
```javascript
import BudgetResultsScreen from '../../budgetresults/BudgetResultsScreen';

// When showing summary
return (
  <BudgetResultsScreen
    budgetData={budgetData}
    plannerType="monthly" // or "goal" or "vacation"
    onBack={onBack}
  />
);
```

## Dependencies
- **react-native-svg**: For rendering the Sankey diagram
  - Installed via: `npm install react-native-svg`
  - Provides SVG primitives: Path, Rect, Text, G

## Design Inspiration
The visualizations are based on popular Sankey diagrams from the r/MiddleClassFinance community, which show:
- Income flowing to different categories
- Proportional representation of expenses
- Clear visual hierarchy
- Easy-to-understand financial flow

## Future Enhancements
Potential improvements:
1. Interactive diagram (tap categories for details)
2. Comparison mode (this month vs last month)
3. Export as image feature
4. Animation transitions
5. Additional chart types (pie, bar)
6. Budget optimization suggestions
7. Spending trends over time

## Usage Example
1. Open any planner (Monthly, Goal, or Vacation)
2. Answer all questions
3. View the beautiful Sankey diagram visualization
4. Review budget insights and statistics
5. Tap "Done" to return to menu

## Technical Notes
- SVG diagrams are responsive and scale to screen width
- Bezier curves create smooth flow paths
- Node heights are proportional to monetary values
- Minimum heights ensure small categories are visible
- Colors use transparency for flow overlap effects
