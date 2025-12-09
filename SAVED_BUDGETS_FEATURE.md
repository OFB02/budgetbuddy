# Saved Budgets Feature

## Overview
This feature allows users to save their budget results and view them later from a dedicated "Saved Budgets" screen.

## What's New

### 1. Save Budget Button
- Located on the Budget Results screen, below the export options
- Users can tap "Save This Budget" to store their current budget
- A prompt appears asking for a budget name
- Budgets are saved locally using AsyncStorage

### 2. Saved Budgets Screen
- New screen accessible from the main Budget Selection menu
- Shows all saved budgets with:
  - Budget name and save date/time
  - Budget type (Monthly, Goal, or Vacation) with icon
  - Key stats: Income, Savings, and Remaining balance
  - Color-coded based on budget type
  
### 3. View Saved Budgets
- Tap any saved budget card to view its full details
- Shows the complete Budget Results screen with all charts and insights
- Can export saved budgets (image, Excel, poster)
- Can delete unwanted saved budgets

### 4. Navigation Flow
```
Welcome Screen
    ↓
Budget Selection
    ↓
    ├─→ Monthly Planner → Results → [Save Budget]
    ├─→ Vacation Planner → Results → [Save Budget]
    ├─→ Goal Planner → Results → [Save Budget]
    └─→ Saved Budgets → View Budget Details
```

## Technical Implementation

### Files Modified
1. **`App.js`**
   - Added SavedBudgetsScreen import and routing
   - Added state management for viewing saved budgets
   - Added navigation handlers

2. **`budgetresults/BudgetResultsScreen.js`**
   - Added "Save Budget" functionality
   - Integrated AsyncStorage for local persistence
   - Added save button in the UI

3. **`pages/budgetselection/BudgetSelectionScreen.js`**
   - Added "Saved Budgets" option to main menu

### New Files Created
1. **`pages/Saved/SavedBudgetsScreen.js`**
   - Main component for viewing saved budgets
   - Displays list of all saved budgets
   - Allows viewing and deleting budgets

### Dependencies Added
- `@react-native-async-storage/async-storage`: For local data persistence

## Data Storage
- Budgets are stored in AsyncStorage with the key: `@budgetbuddy_saved_budgets`
- Data structure:
```javascript
{
  id: string,          // Timestamp-based unique ID
  name: string,        // User-provided budget name
  plannerType: string, // 'monthly', 'goal', or 'vacation'
  budgetData: object,  // Complete budget data
  currency: string,    // Currency symbol
  savedAt: number      // Timestamp
}
```

## Features
- ✅ Save budgets with custom names
- ✅ View all saved budgets in a list
- ✅ Tap to view full budget details
- ✅ Delete unwanted budgets
- ✅ Visual indicators for budget type
- ✅ Shows key metrics at a glance
- ✅ Maintains full functionality when viewing saved budgets
- ✅ Data persists across app sessions

## User Experience
1. User creates a budget (Monthly, Goal, or Vacation)
2. Views the results with charts and insights
3. Taps "Save This Budget" button
4. Enters a memorable name (e.g., "January 2025", "Trip to Paris")
5. Budget is saved and can be accessed anytime from "Saved Budgets"
6. Can view, export, or delete saved budgets later

## Future Enhancements (Ideas)
- Edit saved budget names
- Share saved budgets with others
- Compare multiple saved budgets
- Budget categories/tags
- Search and filter saved budgets
- Export all budgets at once
- Budget statistics and trends over time
