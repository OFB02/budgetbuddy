# Goal Planner Screen - Quick Reference Guide

## 🎯 Overview
The Goal Planner helps users create detailed financial plans for achieving their savings goals through a comprehensive 5-step process.

## 📱 Screen Flow

### Step 0: Goal Type Selection
**Purpose**: Choose the type of financial goal  
**Options**:
- 🚗 Buy a Car (Blue)
- 🏠 Down Payment (Green)
- 🎓 Education (Orange)
- 💒 Wedding (Pink)
- 🛡️ Emergency Fund (Red)
- 🏖️ Retirement (Purple)
- 💼 Start a Business (Cyan)
- ✨ Other Goal (Gray)

**Actions**:
- Select a goal type → Proceeds to Step 1
- Tap currency button (top-right) → Opens currency picker

---

### Step 1: Basic Information (1/5)
**Purpose**: Collect essential goal details  
**Fields**:
1. **Goal Name** (Required)
   - Text input
   - Example: "Dream Vacation to Japan"
   
2. **Target Amount** (Required)
   - Currency input
   - How much money needed total
   
3. **Current Savings** (Optional)
   - Currency input
   - Amount already saved
   - Defaults to 0 if empty

**Validation**: Name + Target amount must be filled  
**Next**: "Continue to Income" →

---

### Step 2: Income Sources (2/5)
**Purpose**: Detail all monthly income streams  

**Predefined Options** (10):
- Salary
- Freelance
- Business Income
- Investments
- Rental Income
- Side Hustle
- Pension
- Dividends
- Bonus
- Other Income

**Features**:
- ➕ Add button → Shows/hides options panel
- Select predefined → Adds to list (stays open)
- "Custom" → Adds blank entry (closes panel)
- Each entry has:
  - Name field (editable)
  - Amount field (currency)
  - Remove button (×) if more than 1 entry

**Smart Features**:
- Checkmarks show added items
- Green highlight for added options
- Duplicate numbering: "Salary #2", "Salary #3"
- At least 1 entry required with name + amount

**Validation**: Minimum 1 income with name & amount  
**Next**: "Continue to Expenses" →

---

### Step 3: Monthly Expenses (3/5)
**Purpose**: Categorize all monthly spending  

**Predefined Options** (19):
- Housing
- Groceries
- Transportation
- Utilities
- Insurance
- Healthcare
- Entertainment
- Dining Out
- Shopping
- Education
- Subscriptions
- Debt Payments
- Phone & Internet
- Pet Care
- Personal Care
- Travel
- Gifts
- Gym & Fitness
- Other Expenses

**Features**: Same as Income Sources step
- ➕ Add button
- Predefined options with checkmarks
- Custom option
- Name + Amount for each
- Remove button (×)
- Duplicate detection

**Validation**: Minimum 1 expense with name & amount  
**Next**: "Continue to Savings" →

---

### Step 4: Savings Strategy (4/5)
**Purpose**: Choose how much to save monthly  

**Strategy Cards** (4 options):
1. **Aggressive** 📈
   - 30% of income
   - For serious savers
   
2. **Moderate** ➖
   - 20% of income
   - Balanced approach (recommended)
   
3. **Conservative** 📉
   - 10% of income
   - Cautious saving
   
4. **Custom** ✏️
   - User-defined percentage
   - Shows percentage input field

**Additional Fields**:
- **Additional Monthly Savings** (Optional)
  - Extra amount beyond percentage
  - Currency input
  - Example: Extra $200/month from bonuses

**Visual Feedback**:
- Selected card highlighted in purple
- Percentage displayed prominently
- Custom input appears when selected

**Validation**: Strategy must be selected (custom needs %)  
**Next**: "Continue to Timeline" →

---

### Step 5: Timeline & Advanced Options (5/5)
**Purpose**: Set deadline and advanced features  

#### **Timeline Section**

**Toggle**: "I have a target deadline"
- **ON** (Default):
  - Shows: "Target months" input field
  - User sets desired timeframe
  - Example: 12 months
  
- **OFF**:
  - Hides input
  - System calculates optimal timeline
  - Based on savings capacity

#### **Advanced Options Section**

**Toggle**: "Include inflation adjustment"
- **OFF** (Default):
  - Uses current target amount
  
- **ON**:
  - Shows: "Annual inflation rate" field
  - Default: 3%
  - Adjusts target for future value
  - Formula: `target × (1 + rate/100)^(months/12)`
  - Example: $25,000 → $25,750 in 12 months at 3%

**Validation**: 
- If deadline ON → months required
- If inflation ON → rate required (defaults to 3)

**Next**: "Create Goal Plan" ✓ → Results Screen

---

## 🧮 Calculations

### Totals Computed
```
Total Monthly Income = Sum of all income sources
Total Monthly Expenses = Sum of all expense categories
Available to Save = Income - Expenses
```

### Savings Calculation
```
Base Savings = Income × (Strategy % / 100)
Total Monthly Savings = Base Savings + Additional Savings
```

### Inflation Adjustment (if enabled)
```
Months in Years = Target Months / 12
Inflation Factor = (1 + Inflation Rate / 100) ^ Months in Years
Adjusted Target = Original Target × Inflation Factor
```

### Timeline Calculation
```
Amount Needed = Target - Current Savings

If user set deadline:
  Required Monthly = Amount Needed / Target Months
  
If no deadline:
  Calculated Months = Amount Needed / Total Monthly Savings

Optimal Months = Amount Needed / Available to Save
```

### Achievability Check
```
Is Achievable = Required Monthly Savings ≤ Available to Save
```

---

## 🎨 Visual Elements

### Icons Used
- **MaterialCommunityIcons** (all icons)
- Goal types: car, home, school, ring, shield-check, beach, briefcase, star
- Income: cash-plus
- Expenses: credit-card-minus-outline
- Savings: piggy-bank
- Timeline: calendar-clock
- Strategy: strategy, trending-up, trending-down, minus, pencil
- UI: arrow-left, arrow-right, check, plus, close, text, target, wallet, etc.

### Color Scheme
- **Background**: Dark slate (#0f172a)
- **Cards**: Lighter slate (#1e293b)
- **Primary**: Red (#e74c3c) - main CTA
- **Income**: Green (#10b981)
- **Expenses**: Orange (#f59e0b)
- **Savings**: Purple (#8b5cf6)
- **Info**: Blue (#3b82f6)
- **Danger**: Red (#ef4444)
- **Text**: Light slate (#f1f5f9)
- **Muted**: Gray-blue (#94a3b8)

### UI Components
- **Progress Bar**: 8px height, red fill
- **Icon Circles**: 36px, color-coded backgrounds
- **Input Fields**: Dark background, rounded corners
- **Cards**: Bordered, shadowed, rounded
- **Toggle Switches**: Modern iOS-style
- **Buttons**: Large, rounded, colored shadows

---

## ✅ Validation Rules

### Step 1 - Basic Info
- ✓ Goal name not empty
- ✓ Target amount > 0

### Step 2 - Income
- ✓ At least 1 income entry
- ✓ Entry has name AND amount > 0

### Step 3 - Expenses
- ✓ At least 1 expense entry
- ✓ Entry has name AND amount > 0

### Step 4 - Savings
- ✓ Strategy selected
- ✓ If custom: percentage > 0

### Step 5 - Timeline
- ✓ If deadline: months > 0
- ✓ (Inflation optional, defaults work)

---

## 🔄 Navigation

### Back Button Behavior
- **Type Screen**: Goes to Welcome/Previous
- **Step 1-5**: Goes to previous step
- **Summary**: Goes back to app

### Step Order (Forward)
```
Type → Basic → Income → Expenses → Savings → Timeline → Summary
```

### Continue Buttons
- Disabled (gray) when validation fails
- Enabled (red) when ready to proceed
- Text changes based on next step
- Last step: "Create Goal Plan"

---

## 💡 Pro Tips

### For Best Results
1. **Be Detailed**: Add all income sources separately
2. **Be Realistic**: Include all expense categories
3. **Start Conservative**: Use 10-20% savings strategy
4. **Consider Inflation**: Enable for goals >1 year
5. **Set Deadlines**: Helps with motivation
6. **Add Extras**: Use additional savings field for bonuses

### Common Patterns
- **Multiple Jobs**: Add each as separate income
- **Side Income**: Add as "Side Hustle" or "Freelance"
- **Variable Expenses**: Use average monthly amount
- **Debt Payments**: Add as separate expense category
- **Emergency Fund**: Goal type + 3-6 months expenses

---

## 🆘 Troubleshooting

### "Can't proceed to next step"
- Check validation requirements above
- Ensure all required fields filled
- Verify amounts are > 0

### "Duplicate entries appearing"
- This is intentional
- System adds #2, #3, etc.
- Prevents confusion with multiple same-named items

### "Toggle not working"
- Tap on the entire row, not just the switch
- Visual feedback shows active state

### "Currency not changing"
- Set currency on Type Selection screen
- Applies to entire session
- Can use custom currency if needed

---

## 📊 Data Passed to Results Screen

```javascript
{
  goalName: string,
  goalType: object,        // Selected goal with icon & color
  target: number,          // Possibly inflation-adjusted
  originalTarget: number,  // Before inflation
  current: number,
  amountNeeded: number,
  monthlyIncome: number,   // Total from all sources
  monthlyExpenses: number, // Total from all categories
  targetMonths: number,    // User's or calculated
  calculatedMonths: number,
  monthlySavingsNeeded: number,
  plannedMonthlySavings: number,
  availableToSave: number,
  percentageOfIncome: number,
  isAchievable: boolean,
  recommendedMonths: number,
  hasDeadline: boolean,
  savingsStrategy: object,
  inflationAdjusted: boolean,
  inflationRate: number
}
```

---

## 📝 Summary

**Goal Planner provides**:
- Professional vector-icon interface
- 5-step comprehensive planning process
- Detailed income/expense tracking
- 4 savings strategy options + custom
- Inflation adjustment capability
- Flexible timeline setting
- Smart validation at each step
- Visual progress tracking
- Dynamic list management
- Accurate calculations for goal achievement

**Best for**: Users who want detailed, accurate financial goal planning with professional guidance and flexibility.
