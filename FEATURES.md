# Budget Buddy - Features Documentation

## 📱 Core Features

### 1. Budget Planning
- **Monthly Budget Planner**: Plan and track monthly income and expenses
- **Goal Planner**: Create savings goals and financial plans
- **Vacation Planner**: Budget for vacations with currency support (52 currencies)

### 2. Saved Budgets
- Save any budget (Monthly, Goal, or Vacation) with custom names
- View all saved budgets in a card layout
- Color-coded by budget type
- Delete functionality with confirmation
- Tap to view full details

### 3. Budget Visualization
- **Sankey Flow Diagrams**: Visual representation of money flow
- **Circle Diagrams**: Category breakdowns
- **Savings Projection Graphs**: Track goal progress over time

### 4. Export Capabilities
- **Export to Excel**: Chart-ready data for Google Sheets and Excel
- **Export as Image**: Share budget visualizations as PNG images
- **Export as Poster**: Create shareable budget posters

## 🎯 Goal Planner Features
- 5-step comprehensive planning process
- Goal type selection (Emergency Fund, Down Payment, Car, Travel, etc.)
- Detailed expense tracking
- Currency support (52 currencies)
- Monthly savings calculations
- Visual progress tracking

## ✈️ Vacation Planner Features
- Multi-step vacation planning experience
- Destination selection
- Currency conversion (52 currencies)
- Expense categorization (Flights, Accommodation, Food, etc.)
- Budget calculations with exchange rates
- Visual vacation budget breakdown

## 💾 Data Persistence
- Local storage using AsyncStorage
- Save and retrieve budgets
- Budget metadata (name, type, save date)
- Complete budget data preservation

## 🎨 UI/UX Features
- Material Community Icons throughout
- Color-coded budget types
- Professional card layouts
- Responsive design
- Smooth navigation
- Loading states and confirmations

## 📊 Visualization Details

### Sankey Diagrams
- Shows income flow to expenses and savings
- Color-coded flows
- Interactive visual representation

### Circle Diagrams
- Category expense breakdowns
- Percentage calculations
- Color-coded segments

### Charts & Graphs
- Savings projection timelines
- Monthly progress tracking
- Export-ready data formats

## 🔧 Technical Stack
- React Native + Expo
- AsyncStorage for data persistence
- react-native-svg for visualizations
- expo-file-system for exports
- expo-sharing for social sharing

## 📱 Screen Flow
1. **Welcome Screen** → Choose your journey
2. **Budget Selection** → Monthly, Goal, or Vacation planner
3. **Planner Screens** → Input your data through guided steps
4. **Results Screen** → View visualizations and insights
5. **Saved Budgets** → Access and manage saved budgets
