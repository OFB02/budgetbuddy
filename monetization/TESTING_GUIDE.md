# 🧪 Testing Guide - Monetization Features

## How to Test in Expo Go

### Step 1: Start the Development Server

```bash
cd /Users/oskarforumbuhrmann/Desktop/APPS/budgetbuddy
npm start
```

### Step 2: Open in Expo Go
1. Scan the QR code with your phone camera (iOS) or Expo Go app (Android)
2. The app will load in Expo Go

### Step 3: Navigate to Export Features
1. Start the app (Welcome screen)
2. Select "Monthly Budget" or any budget type
3. Fill in some sample data (e.g., Income: $5000, Rent: $1500, etc.)
4. Tap "Calculate" or navigate to Results screen

### Step 4: Test Export Flow

#### ✅ Test Case 1: First Export (Should Work - Uses 1 of 3 Credits)
1. Look at the top-right corner - you should see "🎟️ 3" badge
2. Tap "Export Image" or "Export Excel"
3. Export should work immediately
4. Badge should now show "🎟️ 2"

#### ✅ Test Case 2: Second Export (Should Work - Uses 1 Credit)
1. Badge shows "🎟️ 2"
2. Tap export again
3. Export should work
4. Badge shows "🎟️ 1"

#### ✅ Test Case 3: Third Export (Should Work - Uses Last Credit)
1. Badge shows "🎟️ 1"
2. Tap export
3. Export should work
4. Badge shows "🎟️ 0"

#### ✅ Test Case 4: Fourth Export (Should Show Paywall)
1. Badge shows "🎟️ 0"
2. Tap export
3. **Paywall should appear** with two options:
   - "Unlock Unlimited Exports - $1.99/month" (green button)
   - "Watch Video to Export" (blue button)

#### ✅ Test Case 5: Watch Ad Flow
1. With paywall open, tap "Watch Video to Export"
2. You'll see "Loading ad... (5 seconds)" with a spinner
3. Wait 5 seconds (simulated ad)
4. Paywall closes automatically
5. Export executes automatically
6. Badge shows "🎟️ 1" (you earned 1 credit)

#### ✅ Test Case 6: Premium Purchase Flow
1. Trigger paywall again (use your 1 credit, then try to export)
2. Tap "Unlock Unlimited Exports - $1.99/month"
3. You'll see "Processing payment..." for 2 seconds
4. Paywall closes
5. Badge changes to "⭐ Premium"
6. Try to export - it should work immediately without consuming credits
7. Badge stays as "⭐ Premium"

## What to Look For

### Visual Indicators
- **Top-right badge**: Shows either credits (🎟️ number) or Premium (⭐)
- **Paywall modal**: Should appear centered with dark overlay
- **Loading states**: Spinner and messages during processing

### Expected Behavior
- **Premium users**: Never see paywall, unlimited exports
- **Free users**: Each export costs 1 credit
- **Out of credits**: Paywall appears
- **After ad**: Get 1 credit + auto-export
- **After purchase**: Become Premium

### Persistence Test
1. Use some credits
2. Close the app completely (swipe away from recent apps)
3. Reopen the app
4. Navigate back to results screen
5. **Credits should persist** (not reset to 3)

## Testing Reset Functions

To test the full flow multiple times, you can add temporary reset buttons:

### Quick Reset (Add to any screen)
```javascript
import { useMonetization } from '../monetization/MonetizationContext';

function TestControls() {
  const { resetToFreeTier, addCredits } = useMonetization();
  
  return (
    <View>
      <Button title="Reset to Free (3 credits)" onPress={resetToFreeTier} />
      <Button title="Add 5 Credits" onPress={() => addCredits(5)} />
    </View>
  );
}
```

## Common Issues & Solutions

### Issue: "Module not found"
**Solution**: Restart Expo server
```bash
# Stop the server (Ctrl+C)
# Clear cache and restart
npm start --clear
```

### Issue: Credits not persisting
**Solution**: Check AsyncStorage permissions (should work by default in Expo)

### Issue: Paywall not showing
**Solution**: Make sure you've used all 3 credits and PaywallModal is rendered in App.js

### Issue: Export not working after ad
**Solution**: Check console logs - the callback should execute automatically

## Device-Specific Testing

### iOS
- Shake device to open Expo menu
- Enable "Performance Monitor" to watch state updates

### Android
- Shake device or press hardware menu button
- Check Logcat for console.log messages

## Console Logs to Watch

Open Expo DevTools (shows in terminal after `npm start`):

```
Premium user - allowing export
User has 2 credits - allowing export
No credits available - showing paywall
Processing subscription purchase...
Subscription activated! User is now Premium.
Loading rewarded ad...
Ad completed! Granting 1 export credit.
```

## Success Criteria

✅ Credits decrease from 3 → 2 → 1 → 0
✅ Paywall appears when credits = 0
✅ Watch ad grants 1 credit and exports
✅ Premium purchase removes credit system
✅ Credits persist after app restart
✅ Premium status persists after app restart

## Next Steps After Testing

Once mock testing is complete, you can integrate:
1. **RevenueCat** for real subscription management
2. **Google AdMob** for real rewarded video ads
3. **Analytics** to track conversion rates
4. **A/B testing** for paywall variations

---

## Quick Reference

| Action | Credits | Premium | Result |
|--------|---------|---------|--------|
| First install | 3 | false | Can export 3 times |
| Export | -1 | - | Uses 1 credit |
| Watch ad | +1 | - | Earns 1 credit + auto-export |
| Subscribe | 0 | true | Unlimited exports forever |
| Export (Premium) | - | true | No credits used |

Happy Testing! 🎉
