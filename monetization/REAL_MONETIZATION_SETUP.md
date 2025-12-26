# 💰 Real Monetization Setup Guide

## Overview
This guide will help you set up **real in-app purchases** and **rewarded video ads** for BudgetBuddy.

---

## 📋 Prerequisites Checklist

Before we begin, you'll need:

- [ ] Apple Developer Account ($99/year) - For iOS
- [ ] Google Play Developer Account ($25 one-time) - For Android
- [ ] RevenueCat Account (Free tier available)
- [ ] Google AdMob Account (Free)

---

## 🎯 What We're Setting Up

### Subscription Product
- **Name:** BudgetBuddy Premium
- **Price:** $1.99/month
- **Product ID:** `budgetbuddy_premium_monthly`
- **Benefits:**
  - Unlimited exports
  - No ads
  - Priority support

### Rewarded Video Ads
- **Provider:** Google AdMob
- **Reward:** 1 export credit per ad viewed
- **Ad Duration:** ~30 seconds

---

## 🔧 Step-by-Step Setup

### PART 1: RevenueCat Setup (Subscriptions)

#### 1. Create RevenueCat Account
1. Go to https://www.revenuecat.com/
2. Sign up for free account
3. Click "Create a new app"
4. Enter app name: **BudgetBuddy**
5. Select platforms: iOS and/or Android
6. Save your **Public API Key** (you'll need this later)

#### 2. Set Up Apple App Store Connect (iOS)
1. Log in to https://appstoreconnect.apple.com/
2. Go to **My Apps** → Click **+** → **New App**
3. Fill in details:
   - **Platform:** iOS
   - **Name:** BudgetBuddy
   - **Primary Language:** English
   - **Bundle ID:** `com.yourname.budgetbuddy` (must match Expo app)
   - **SKU:** `budgetbuddy-ios`
4. Go to **Features** → **In-App Purchases**
5. Click **+** to create subscription:
   - **Type:** Auto-Renewable Subscription
   - **Reference Name:** BudgetBuddy Premium Monthly
   - **Product ID:** `budgetbuddy_premium_monthly`
   - **Subscription Group:** Create new "Premium Membership"
   - **Subscription Duration:** 1 month
   - **Price:** $1.99 (or equivalent in your currency)
   - **Review Info:** Screenshots and description
6. Save and submit for review (takes 24-48 hours)
7. Copy the **Shared Secret** from App Store Connect → My Apps → BudgetBuddy → General → App Information
8. In RevenueCat:
   - Go to **Project Settings** → **iOS**
   - Paste your **Bundle ID**
   - Paste your **Shared Secret**

#### 3. Set Up Google Play Console (Android)
1. Log in to https://play.google.com/console/
2. Click **Create app**
3. Fill in details:
   - **App name:** BudgetBuddy
   - **Default language:** English
   - **App category:** Finance
   - **Package name:** `com.yourname.budgetbuddy`
4. Go to **Monetization setup** → **In-app products** → **Subscriptions**
5. Click **Create subscription**:
   - **Product ID:** `budgetbuddy_premium_monthly`
   - **Name:** BudgetBuddy Premium
   - **Description:** Unlimited exports, no ads
   - **Billing period:** 1 month
   - **Default price:** $1.99
6. Activate the subscription
7. Go to **Setup** → **API access** → **Create service account**
8. Download the JSON key file
9. In RevenueCat:
   - Go to **Project Settings** → **Android**
   - Paste your **Package name**
   - Upload the **Service Account JSON** file

#### 4. Configure Products in RevenueCat
1. In RevenueCat dashboard → **Products**
2. Click **+ New** to create entitlement:
   - **Identifier:** `premium`
   - **Display name:** Premium Access
3. Click on the `premium` entitlement
4. Click **Attach Product**:
   - **iOS:** Select `budgetbuddy_premium_monthly` (from App Store)
   - **Android:** Select `budgetbuddy_premium_monthly` (from Play Store)

---

### PART 2: Google AdMob Setup (Rewarded Ads)

#### 1. Create AdMob Account
1. Go to https://admob.google.com/
2. Sign in with Google account
3. Click **Get Started**
4. Accept terms and conditions

#### 2. Create App in AdMob
1. Click **Apps** → **Add App**
2. Choose **Yes, it's listed on Google Play** (or App Store)
   - Or select **No** if not published yet
3. Enter app details:
   - **App name:** BudgetBuddy
   - **Platform:** iOS and/or Android
4. Save App ID (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)

#### 3. Create Rewarded Ad Unit
1. Go to **Ad units** → **Add ad unit**
2. Select **Rewarded**
3. Fill in:
   - **Ad unit name:** Export Credit Reward
4. Click **Create ad unit**
5. **SAVE THESE IDs** (you'll need them):
   - **iOS Rewarded Ad Unit ID:** `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`
   - **Android Rewarded Ad Unit ID:** `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`

#### 4. Set Up Test Devices (Important!)
1. In AdMob → **Settings** → **Test devices**
2. Add your test device ID
3. During development, use **test ad unit IDs**:
   - **iOS Rewarded Test:** `ca-app-pub-3940256099942544/1712485313`
   - **Android Rewarded Test:** `ca-app-pub-3940256099942544/5224354917`

---

### PART 3: Environment Configuration

Create a `.env` file in your project root:

```env
# RevenueCat
REVENUECAT_API_KEY_IOS=your_ios_api_key_here
REVENUECAT_API_KEY_ANDROID=your_android_api_key_here

# AdMob
ADMOB_APP_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
ADMOB_APP_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
ADMOB_REWARDED_AD_UNIT_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
ADMOB_REWARDED_AD_UNIT_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

# Use test IDs during development
USE_TEST_ADS=true
```

**⚠️ IMPORTANT:** Add `.env` to your `.gitignore` file!

---

## 📦 Dependencies to Install

Run these commands in your project directory:

```bash
# RevenueCat SDK
npx expo install react-native-purchases

# AdMob for Expo
npx expo install expo-ads-admob

# Environment variables (optional but recommended)
npm install react-native-dotenv
```

---

## 🔄 Implementation Changes

The implementation is being created in the next steps. You'll need to:

1. ✅ Update `MonetizationContext.js` to use RevenueCat
2. ✅ Create `AdMobService.js` for rewarded ads
3. ✅ Update `app.json` with AdMob configuration
4. ✅ Update `PaywallModal.js` to trigger real purchases
5. ✅ Add error handling and receipt validation

---

## 🧪 Testing Checklist

### Before Publishing
- [ ] Test subscription purchase with sandbox account
- [ ] Test subscription cancellation
- [ ] Test rewarded ad flow with test ad units
- [ ] Verify credits are awarded after ad completion
- [ ] Test offline behavior
- [ ] Test restore purchases functionality
- [ ] Check that premium status persists after app restart

### Before Going Live
- [ ] Replace test ad unit IDs with real ones
- [ ] Set `USE_TEST_ADS=false` in production
- [ ] Test with real money (small amount)
- [ ] Submit subscription for review in App Store Connect
- [ ] Activate subscription in Google Play Console

---

## 📝 Important Notes

### RevenueCat
- Free tier: Up to $2,500 in tracked revenue/month
- Handles receipt validation automatically
- Provides analytics dashboard
- Supports trial periods and promotional offers

### AdMob
- Completely free to use
- Revenue share: Google keeps ~30%
- Minimum payout: $100
- Payment via bank transfer or check

### App Store Review
- In-app purchases require screenshots showing the purchase flow
- Must include restore purchases button
- Subscription terms must be clearly displayed
- Typically takes 24-48 hours for approval

### Google Play Review
- Generally faster than Apple (few hours)
- Must include privacy policy URL
- Must comply with subscription policies

---

## 🆘 Troubleshooting

### "Could not connect to RevenueCat"
- Check API keys are correct
- Verify bundle ID matches exactly
- Ensure device has internet connection

### "No ads available"
- Use test ad unit IDs during development
- Check AdMob account is active
- Wait a few hours after creating ad unit

### "Receipt validation failed"
- Check Shared Secret is correct (iOS)
- Verify service account JSON is uploaded (Android)
- Ensure subscription is active in respective stores

---

## 🚀 Next Steps

Once you complete the setup above, I'll help you:
1. Implement the RevenueCat integration
2. Set up AdMob rewarded ads
3. Test everything in Expo Go
4. Build and deploy to production

**Which step would you like to start with?**
