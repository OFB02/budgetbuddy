# Budget Flow Sankey Diagram - New Features

## Overview
Your BudgetBuddy app now includes an enhanced Sankey diagram visualization similar to the Reddit MiddleClassFinance examples, with powerful export and sharing capabilities!

## ✨ New Features

### 1. **Enhanced Sankey Diagram** 📊
- **Visual Flow Chart**: Beautiful flowing diagram showing how your income flows to different expense categories
- **Color-Coded Categories**: Each category has its own distinct color for easy identification
- **Proportional Sizing**: Flow width represents the percentage of income allocated
- **Interactive Legend**: Detailed breakdown of all categories below the diagram
- **Mobile Optimized**: Horizontally scrollable to fit perfectly on phone screens

### 2. **Export as PDF/Image** 📄
- **One-Tap Save**: Save your budget diagram as a high-quality PNG image
- **Share-Ready**: Perfect for financial planning discussions or personal records
- **Auto-Named Files**: Files are automatically named with the current date (e.g., `BudgetFlow_2025-12-03.png`)

### 3. **Export to Excel** 📊
- **CSV Format**: Export your budget data in Excel-compatible CSV format
- **Complete Data**: Includes all categories with amounts and percentages
- **Easy Analysis**: Open in Excel, Google Sheets, or Numbers for further analysis
- **Organized Structure**: Data is clearly organized with categories and totals

### 4. **Share Functionality** 🔗
- **Native Sharing**: Use your phone's native share menu
- **Multiple Options**: Share via email, messages, social media, cloud storage, etc.
- **Quick & Easy**: One tap to share your budget visualization with family, financial advisor, or friends

## 🎨 Color Palette
The diagram uses a carefully selected color palette inspired by the Reddit examples:
- **Income**: Pink (#E091B8)
- **Savings**: Green (#7BC47F)
- **Housing**: Dusty Rose (#C4A5A5)
- **Utilities**: Sky Blue (#87CEEB)
- **Groceries**: Tan (#DEB887)
- **Transportation**: Mint (#98D8AA)
- **Entertainment**: Light Pink (#F0B6D4)
- **And more...**

## 📱 How to Use

### Viewing the Diagram
1. Complete your budget in any planner (Monthly, Goal, or Vacation)
2. Navigate to the Budget Results screen
3. Scroll through the diagram horizontally if needed
4. View the detailed breakdown in the legend below

### Exporting as PDF/Image
1. Tap the **"📄 Save as PDF"** button
2. Choose where to save (Photos, Files, etc.)
3. The diagram will be saved as a high-quality image
4. Use it for presentations, records, or printing

### Exporting to Excel
1. Tap the **"📊 Export Excel"** button
2. Choose where to save the CSV file
3. Open in Excel, Google Sheets, or Numbers
4. Analyze, create charts, or compare budgets

### Sharing
1. Tap the **"🔗 Share"** button
2. Select how you want to share (Messages, Email, etc.)
3. Add recipients and send
4. Perfect for discussing budgets with family or advisors

## 📋 Export File Formats

### Image Export (.png)
- **Resolution**: High quality (1x screen resolution)
- **Format**: PNG with transparency support
- **Size**: Optimized for viewing and printing
- **Includes**: Complete diagram with all labels and legend

### Excel Export (.csv)
```csv
Category,Amount,Percentage
Income,5000,100%

EXPENSES:
Housing,1500,30.00%
Groceries,600,12.00%
Transportation,400,8.00%
...

Savings,500,10.00%
Remaining,200,4.00%
```

## 🔧 Technical Details

### Packages Used
- **react-native-svg**: For rendering the Sankey diagram
- **react-native-view-shot**: For capturing the diagram as an image
- **expo-sharing**: For native sharing functionality
- **expo-file-system**: For file management

### Diagram Components
- **SVG Paths**: Bezier curves for smooth flow visualization
- **Dynamic Sizing**: Automatically adjusts to different budget amounts
- **Responsive Layout**: Adapts to various screen sizes
- **Performance Optimized**: Smooth scrolling and rendering

## 💡 Tips for Best Results

1. **Viewing**: Rotate your phone to landscape for a wider view of larger budgets
2. **Sharing**: Use PNG format for presentations, CSV for detailed analysis
3. **Organization**: Save monthly budgets with consistent naming for easy tracking
4. **Printing**: Export as PDF for the best quality when printing
5. **Comparison**: Export multiple months to Excel to compare spending trends

## 🎯 Use Cases

### Personal Use
- Track monthly spending patterns
- Visualize where your money goes
- Set and monitor savings goals
- Plan for major purchases

### Family Planning
- Share budget with spouse/partner
- Discuss spending priorities
- Plan family vacations
- Save for children's education

### Financial Advising
- Present budget to financial advisor
- Get professional feedback
- Document spending habits
- Track progress over time

### Social Sharing
- Share success stories on Reddit (r/personalfinance, r/MiddleClassFinance)
- Get community feedback
- Compare with similar income brackets
- Inspire others with your financial discipline

## 🚀 Future Enhancements

Potential features for future updates:
- Multi-month comparison view
- Animated transitions between budget states
- Dark/Light theme options
- Custom color schemes
- PDF annotations
- Budget vs Actual comparison diagrams
- Historical trend analysis

---

## Support
If you encounter any issues or have suggestions for improvements, please reach out!

**Enjoy your enhanced budget visualization! 💰📊✨**
