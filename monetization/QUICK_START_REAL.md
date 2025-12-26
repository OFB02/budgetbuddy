# 🚀 Quick Start Guide - Real Monetization

## Current Status
✅ Dependencies installed
✅ Code files created
⏳ Configuration needed
⏳ Store accounts setup needed

---

## 📝 What You Need to Do

### Step 1: Replace API Keys (REQUIRED)

#### 1.1 Update `app.config.js`
Open `/monetization/app.config.js` and replace:

```javascript
// Line 22-23: Replace with your bundle/package IDs
bundleIdentifier: 'com.yourname.budgetbuddy', // e.g., com.john.budgetbuddy
package: 'com.yourname.budgetbuddy', // Same as above

// Lines 36-37: Replace with your AdMob App IDs (get from AdMob console)
androidAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
iosAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',

// Lines 43-44: Replace with your RevenueCat API keys (get from RevenueCat dashboard)
iosApiKey: 'YOUR_IOS_API_KEY_HERE',
androidApiKey: 'YOUR_ANDROID_API_KEY_HERE',

// Lines 49-52: Replace with your AdMob Ad Unit IDs
rewardedAdUnitId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
```

#### 1.2 Update `MonetizationContextReal.js`
Open `/monetization/MonetizationContextReal.js`:

```javascript
// Lines 16-17: Replace with your RevenueCat API keys
const REVENUECAT_CONFIG = {
  ios: 'YOUR_IOS_API_KEY_HERE',
  android: 'YOUR_ANDROID_API_KEY_HERE',
};
```

#### 1.3 Update `AdMobService.js`
Open `/monetization/AdMobService.js`:

```javascript
// Lines 16-17: Replace with your AdMob Ad Unit IDs
const AD_UNIT_IDS = {
  ios: {
    production: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  },
  android: {
    production: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  },
};
```

---

### Step 2: Switch to Real Implementation

#### 2.1 Update `App.js`
Replace the import for MonetizationContext:

```javascript
// BEFORE:
import { MonetizationProvider } from './monetization/MonetizationContext';
import PaywallModal from './monetization/PaywallModal';

// AFTER:
import { MonetizationProvider } from './monetization/MonetizationContextReal';
import PaywallModal from './monetization/PaywallModalReal';
```

#### 2.2 Replace `app.json` with `app.config.js`
Since you now have `app.config.js`, you can either:
- **Option A:** Delete `app.json` and use `app.config.js` only
- **Option B:** Keep both, but `app.config.js` will take precedence

---

### Step 3: Create Store Accounts

#### 3.1 Apple Developer Account (for iOS)
1. Go to https://developer.apple.com/programs/
2. Enroll ($99/year)
3. Wait for approval (1-2 days)

#### 3.2 Google Play Developer Account (for Android)
1. Go to https://play.google.com/console/
2. Create account ($25 one-time)
3. Instant access

#### 3.3 RevenueCat Account (Free)
1. Go to https://www.revenuecat.com/
2. Sign up (free tier available)
3. Create new project: "BudgetBuddy"
4. Copy API keys from Project Settings

#### 3.4 Google AdMob Account (Free)
1. Go to https://admob.google.com/
2. Sign in with Google account
3. Create app: "BudgetBuddy"
4. Create Rewarded Ad Unit
5. Copy App ID and Ad Unit ID

---

### Step 4: Configure Products

#### 4.1 App Store Connect (iOS)
1. Create app in App Store Connect
2. Create In-App Purchase → Auto-Renewable Subscription
3. Product ID: `budgetbuddy_premium_monthly`
4. Price: $1.99
5. Copy Shared Secret
6. Add to RevenueCat (Project Settings → iOS)

#### 4.2 Google Play Console (Android)
1. Create app in Google Play Console
2. Create Subscription Product
3. Product ID: `budgetbuddy_premium_monthly`
4. Price: $1.99
5. Download Service Account JSON
6. Upload to RevenueCat (Project Settings → Android)

#### 4.3 RevenueCat Product Setup
1. In RevenueCat → Products
2. Create Entitlement: `premium`
3. Attach iOS product: `budgetbuddy_premium_monthly`
4. Attach Android product: `budgetbuddy_premium_monthly`

---

### Step 5: Testing

#### 5.1 Test with Development Build
```bash
# Build development client
npx expo run:ios
# or
npx expo run:android
```

**Note:** In-app purchases and ads don't work in Expo Go. You need a development build.

#### 5.2 Test Subscription
1. Set up sandbox tester account (iOS) or test account (Android)
2. Try purchasing subscription
3. Verify premium status activates
4. Test restore purchases

#### 5.3 Test Rewarded Ads
1. During development, test ads will show automatically
2. Watch full ad
3. Verify credit is awarded
4. Check that export works after ad

---

## 🎯 Testing Checklist

- [ ] RevenueCat API keys added
- [ ] AdMob App IDs added
- [ ] AdMob Ad Unit IDs added
- [ ] Bundle/Package IDs updated
- [ ] App.js imports updated to use *Real files
- [ ] Development build created (`expo run:ios` or `expo run:android`)
- [ ] Subscription purchase tested
- [ ] Restore purchases tested
- [ ] Rewarded ad tested
- [ ] Credit awarded after ad
- [ ] Export works with premium status
- [ ] Export works with earned credits

---

## 🔄 Switching Between Mock and Real

### To Use Real Monetization:
```javascript
// App.js
import { MonetizationProvider } from './monetization/MonetizationContextReal';
import PaywallModal from './monetization/PaywallModalReal';
```

### To Use Mock Monetization (Testing):
```javascript
// App.js
import { MonetizationProvider } from './monetization/MonetizationContext';
import PaywallModal from './monetization/PaywallModal';
```

---

## 🆘 Common Issues

### "Could not connect to RevenueCat"
**Solution:** 
- Verify API keys are correct
- Check bundle ID matches exactly
- Ensure internet connection
- Wait 10-15 minutes after setting up products

### "No ads available"
**Solution:**
- Use test ad unit IDs during development
- Wait a few hours after creating ad unit in AdMob
- Check AdMob account is activated
- Verify app is registered in AdMob

### "Purchase not working"
**Solution:**
- Must use real device (not simulator for iOS)
- Must use development build (not Expo Go)
- Check sandbox account is set up (iOS)
- Verify subscription is active in store console

### "Module not found: react-native-purchases"
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo prebuild --clean
```

---

## 📚 Next Steps

1. **Complete Store Setup** (see `REAL_MONETIZATION_SETUP.md` for detailed instructions)
2. **Add API Keys** (update the 3 files mentioned in Step 1)
3. **Switch to Real Implementation** (update App.js imports)
4. **Build Development Client** (`npx expo run:ios` or `npx expo run:android`)
5. **Test Everything** (use testing checklist above)
6. **Submit for Review** (both stores require review for in-app purchases)

---

## 📖 Full Documentation

- **Setup Guide:** `/monetization/REAL_MONETIZATION_SETUP.md`
- **Original Docs:** `/monetization/README.md`
- **Testing Guide:** `/monetization/TESTING_GUIDE.md`

---

## ⚡ Quick Commands

```bash
# Install dependencies (already done)
npx expo install react-native-purchases react-native-google-mobile-ads

# Create development build (iOS)
npx expo run:ios

# Create development build (Android)
npx expo run:android

# Start metro bundler
npm start

# Clear cache
npm start -- --clear
```

---

## 💡 Pro Tips

1. **Start with iOS** - Apple's review process is more strict, so start there
2. **Use Test IDs** - Keep test ad unit IDs during development
3. **Test on Real Device** - Simulators don't support in-app purchases
4. **Set Up Restore** - Required by Apple for subscriptions
5. **Privacy Policy** - Required by both stores for subscriptions/ads
6. **Screenshots** - Prepare screenshots showing the purchase flow

---

## ✅ When You're Ready for Production

1. Replace all test ad unit IDs with production IDs
2. Test with real money (purchase with real account)
3. Submit app for review in App Store Connect
4. Submit app for review in Google Play Console
5. Wait for approval (24-48 hours for iOS, few hours for Android)
6. Launch! 🚀

---

**Need help?** Check the troubleshooting section or the full setup guide in `REAL_MONETIZATION_SETUP.md`
