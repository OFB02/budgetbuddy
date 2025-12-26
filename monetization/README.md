# BudgetBuddy Monetization System

## Overview
This module implements a **Freemium with Ad Friction** monetization model for BudgetBuddy.

## Business Model

### User Flow
1. **New Users**: Start with 3 free export credits
2. **Export Action**: Each export consumes 1 credit
3. **Out of Credits**: User sees paywall with two options:
   - Subscribe for $1.99/month (unlimited exports)
   - Watch a 5-second video ad (earn 1 credit)
4. **Premium Users**: Unlimited exports, no ads

## Components

### MonetizationContext.js
Context provider that manages:
- Export credits (persisted in AsyncStorage)
- Premium status (persisted in AsyncStorage)
- Export flow logic
- Mock purchase and ad functions

### PaywallModal.js
Modal UI component that displays when user has 0 credits:
- Subscription purchase button
- Watch ad button
- Benefits display
- Processing states

## Installation

### 1. Add to Your App Root (App.js)

```javascript
import { MonetizationProvider } from './monetization/MonetizationContext';
import PaywallModal from './monetization/PaywallModal';

export default function App() {
  return (
    <MonetizationProvider>
      {/* Your existing app components */}
      <NavigationContainer>
        <Stack.Navigator>
          {/* Your screens */}
        </Stack.Navigator>
      </NavigationContainer>
      
      {/* Add PaywallModal at root level */}
      <PaywallModal />
    </MonetizationProvider>
  );
}
```

### 2. Use in Export Screens

```javascript
import { useMonetization } from '../monetization/MonetizationContext';

function BudgetResultsScreen() {
  const { handleExport, exportCredits, isPremium } = useMonetization();

  const performExport = async () => {
    // Your actual export logic here
    console.log('Exporting budget data...');
    // Example: save to file, share, etc.
  };

  const onExportButtonPress = () => {
    handleExport(performExport);
  };

  return (
    <View>
      <Text>Credits: {exportCredits}</Text>
      <Text>Status: {isPremium ? 'Premium' : 'Free'}</Text>
      <Button title="Export Budget" onPress={onExportButtonPress} />
    </View>
  );
}
```

## API Reference

### useMonetization Hook

```javascript
const {
  // State
  exportCredits,      // number - Current available credits
  isPremium,          // boolean - Premium subscription status
  isLoading,          // boolean - Loading state during initialization
  showPaywall,        // boolean - Paywall visibility state
  
  // Actions
  handleExport,       // (callback) => Promise<boolean> - Main export handler
  mockPurchaseSubscription, // () => Promise - Simulates subscription purchase
  mockShowRewardedAd, // () => Promise - Simulates ad viewing
  closePaywall,       // () => void - Close paywall without action
  addCredits,         // (amount) => Promise - Add credits manually
  resetToFreeTier,    // () => Promise - Reset to free tier (testing)
} = useMonetization();
```

### handleExport(callback)

Main export flow handler. Returns `true` if export is allowed, `false` if paywall shown.

**Logic:**
1. If `isPremium === true` → Execute callback, return true
2. If `exportCredits > 0` → Decrement credits, execute callback, return true
3. If `exportCredits === 0` → Show paywall, return false

**Example:**
```javascript
const myExportFunction = () => {
  console.log('Performing export...');
  // Your export logic
};

// Call handleExport with your function
await handleExport(myExportFunction);
```

## Mock Functions

### mockPurchaseSubscription()
Simulates a 2-second payment processing delay, then:
- Sets `isPremium = true`
- Saves to AsyncStorage
- Closes paywall
- Executes pending export callback

### mockShowRewardedAd()
Simulates a 5-second video ad, then:
- Adds 1 credit
- Saves to AsyncStorage
- Closes paywall
- Automatically executes pending export callback

## Storage Keys

- `@budgetbuddy_export_credits` - Number of available export credits
- `@budgetbuddy_is_premium` - Boolean premium status

## Testing Helpers

### Reset to Free Tier
```javascript
const { resetToFreeTier } = useMonetization();

// Reset user to free tier with 3 credits
await resetToFreeTier();
```

### Add Credits Manually
```javascript
const { addCredits } = useMonetization();

// Add 5 credits (for promotions, testing, etc.)
await addCredits(5);
```

## Future Integration

### RevenueCat Integration
Replace mock functions with real RevenueCat calls:

```javascript
import Purchases from 'react-native-purchases';

const realPurchaseSubscription = async () => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(monthlyPackage);
    if (customerInfo.entitlements.active['premium']) {
      await savePremiumStatus(true);
      return true;
    }
  } catch (error) {
    console.error('Purchase error:', error);
    throw error;
  }
};
```

### AdMob Integration
Replace mock ad function with Google AdMob rewarded ads:

```javascript
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

const realShowRewardedAd = async () => {
  const adUnitId = 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy';
  const rewarded = RewardedAd.createForAdRequest(adUnitId);
  
  return new Promise((resolve, reject) => {
    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
      await addCredits(1);
      resolve(true);
    });
    
    rewarded.load();
    rewarded.show();
  });
};
```

## Design Considerations

- **User-Friendly**: Clear communication about credits and options
- **Non-Invasive**: Paywall only appears when necessary
- **Flexible**: Easy to switch between mock and real implementations
- **Persistent**: Credits and premium status survive app restarts
- **Graceful**: Handles errors without breaking user experience

## License
Part of BudgetBuddy app © 2025
