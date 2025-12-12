# Budget Buddy 💰

A comprehensive React Native budget planning app with support for monthly budgets, savings goals, and vacation planning.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the app
npm start
```

## 📱 Features

- **Three Planning Modes**: Monthly budgets, savings goals, and vacation planning
- **Multi-Currency Support**: 52 currencies with real-time conversion
- **Visual Analytics**: Sankey diagrams, circle charts, and projection graphs
- **Save & Manage**: Store unlimited budgets and access them anytime
- **Export Options**: Share as images or export to Excel

For detailed feature documentation, see [FEATURES.md](FEATURES.md)

## 📂 Project Structure

```
budgetbuddy/
├── pages/
│   ├── budgetselection/    # Main menu
│   ├── monthlyplanner/     # Monthly budget planner
│   ├── planforagoal/       # Savings goal planner
│   ├── planforavacation/   # Vacation budget planner
│   ├── Saved/              # Saved budgets screen
│   └── welcome/            # Welcome screen
├── budgetresults/          # Results screens with visualizations
├── widgets/                # Widget components
└── assets/                 # Images and icons
```

## 🛠️ Tech Stack

- **React Native** with Expo
- **AsyncStorage** for local data persistence
- **react-native-svg** for charts and diagrams
- **expo-file-system** & **expo-sharing** for exports
- **Material Community Icons**

## 📄 Documentation

- [FEATURES.md](FEATURES.md) - Complete feature list
- [budgetresults/README.md](budgetresults/README.md) - Visualization documentation

## 📦 Dependencies

See [package.json](package.json) for full dependency list.

## 📝 License

Private project
