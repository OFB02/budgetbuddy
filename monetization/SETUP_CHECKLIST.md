# ✅ Monetization Setup Checklist

Use this checklist to track your progress setting up real monetization for BudgetBuddy.

---

## 📦 Phase 1: Installation & Files
- [x] Install `react-native-purchases` (RevenueCat SDK)
- [x] Install `react-native-google-mobile-ads` (AdMob SDK)
- [x] Create `MonetizationContextReal.js`
- [x] Create `PaywallModalReal.js`
- [x] Create `AdMobService.js`
- [x] Create `app.config.js`
- [x] Create documentation files

---

## 🏪 Phase 2: Store Accounts Setup
- [ ] **Apple Developer Account** ($99/year)
  - [ ] Create account at https://developer.apple.com/programs/
  - [ ] Wait for approval (1-2 days)
  - [ ] Save: Apple Team ID: ________________

- [ ] **Google Play Developer Account** ($25 one-time)
  - [ ] Create account at https://play.google.com/console/
  - [ ] Complete registration
  - [ ] Save: Developer ID: ________________

- [ ] **RevenueCat Account** (Free)
  - [ ] Sign up at https://www.revenuecat.com/
  - [ ] Create project: "BudgetBuddy"
  - [ ] Save iOS API Key: ________________
  - [ ] Save Android API Key: ________________

- [ ] **Google AdMob Account** (Free)
  - [ ] Sign up at https://admob.google.com/
  - [ ] Create app: "BudgetBuddy"
  - [ ] Save iOS App ID: ________________
  - [ ] Save Android App ID: ________________

---

## 📱 Phase 3: iOS App Store Connect
- [ ] Create app in App Store Connect
  - [ ] App Name: BudgetBuddy
  - [ ] Bundle ID: com.yourname.budgetbuddy
  - [ ] SKU: budgetbuddy-ios

- [ ] Create Subscription Product
  - [ ] Type: Auto-Renewable Subscription
  - [ ] Product ID: `budgetbuddy_premium_monthly`
  - [ ] Price: $1.99
  - [ ] Duration: 1 month
  - [ ] Submit for review

- [ ] Copy Shared Secret
  - [ ] Go to App Information → Shared Secret
  - [ ] Save: ________________

- [ ] Connect to RevenueCat
  - [ ] Go to RevenueCat → Project Settings → iOS
  - [ ] Paste Bundle ID
  - [ ] Paste Shared Secret
  - [ ] Save

---

## 🤖 Phase 4: Google Play Console
- [ ] Create app in Google Play Console
  - [ ] App Name: BudgetBuddy
  - [ ] Package Name: com.yourname.budgetbuddy
  - [ ] Category: Finance

- [ ] Create Subscription Product
  - [ ] Product ID: `budgetbuddy_premium_monthly`
  - [ ] Price: $1.99
  - [ ] Billing Period: 1 month
  - [ ] Activate subscription

- [ ] Set up API Access
  - [ ] Go to Setup → API access
  - [ ] Create service account
  - [ ] Download JSON key
  - [ ] Save file as: `google-services.json`

- [ ] Connect to RevenueCat
  - [ ] Go to RevenueCat → Project Settings → Android
  - [ ] Paste Package Name
  - [ ] Upload Service Account JSON
  - [ ] Save

---

## 🎥 Phase 5: AdMob Setup
- [ ] **iOS Ad Unit**
  - [ ] Create Rewarded Ad Unit in AdMob
  - [ ] Name: "Export Credit Reward iOS"
  - [ ] Save Ad Unit ID: ________________

- [ ] **Android Ad Unit**
  - [ ] Create Rewarded Ad Unit in AdMob
  - [ ] Name: "Export Credit Reward Android"
  - [ ] Save Ad Unit ID: ________________

- [ ] **Test Devices**
  - [ ] Add test device IDs in AdMob
  - [ ] iOS Device ID: ________________
  - [ ] Android Device ID: ________________

---

## 🔧 Phase 6: Code Configuration
- [ ] **Update `app.config.js`**
  - [ ] Line 22: iOS bundleIdentifier
  - [ ] Line 28: Android package
  - [ ] Line 36: androidAppId (AdMob)
  - [ ] Line 38: iosAppId (AdMob)
  - [ ] Line 43: iosApiKey (RevenueCat)
  - [ ] Line 44: androidApiKey (RevenueCat)
  - [ ] Line 49: iOS rewardedAdUnitId
  - [ ] Line 52: Android rewardedAdUnitId

- [ ] **Update `MonetizationContextReal.js`**
  - [ ] Line 16: iOS RevenueCat API key
  - [ ] Line 17: Android RevenueCat API key

- [ ] **Update `AdMobService.js`**
  - [ ] Line 16: iOS production ad unit ID
  - [ ] Line 19: Android production ad unit ID

- [ ] **Update `App.js`**
  - [ ] Change import to `MonetizationContextReal`
  - [ ] Change import to `PaywallModalReal`

---

## 🎯 Phase 7: RevenueCat Product Configuration
- [ ] Go to RevenueCat → Products
- [ ] Create Entitlement
  - [ ] Identifier: `premium`
  - [ ] Display Name: "Premium Access"

- [ ] Attach iOS Product
  - [ ] Select entitlement: `premium`
  - [ ] Click "Attach Product"
  - [ ] Select: `budgetbuddy_premium_monthly` (iOS)

- [ ] Attach Android Product
  - [ ] Select entitlement: `premium`
  - [ ] Click "Attach Product"
  - [ ] Select: `budgetbuddy_premium_monthly` (Android)

---

## 🧪 Phase 8: Build & Test
- [ ] **Create Development Build**
  - [ ] iOS: Run `npx expo run:ios`
  - [ ] Android: Run `npx expo run:android`

- [ ] **Test Subscription (iOS)**
  - [ ] Create sandbox tester account in App Store Connect
  - [ ] Sign out of App Store on test device
  - [ ] Sign in with sandbox account when prompted
  - [ ] Attempt purchase in app
  - [ ] Verify premium status activates

- [ ] **Test Subscription (Android)**
  - [ ] Add test account in Google Play Console
  - [ ] Install app on test device
  - [ ] Attempt purchase in app
  - [ ] Verify premium status activates

- [ ] **Test Rewarded Ads**
  - [ ] Deplete all export credits (set to 0)
  - [ ] Tap export button
  - [ ] Select "Watch Ad"
  - [ ] Watch full ad
  - [ ] Verify 1 credit is awarded
  - [ ] Verify export proceeds automatically

- [ ] **Test Restore Purchases**
  - [ ] Delete and reinstall app
  - [ ] Tap "Restore Purchases"
  - [ ] Verify premium status returns

- [ ] **Test Persistence**
  - [ ] Close app completely
  - [ ] Reopen app
  - [ ] Verify credits persist
  - [ ] Verify premium status persists

---

## 📸 Phase 9: Store Assets (Required)
- [ ] **Screenshots**
  - [ ] iPhone: 6.7" display (1290×2796)
  - [ ] iPad: 12.9" display (2048×2732)
  - [ ] Android: Phone (1080×1920 min)
  - [ ] Android: Tablet (1536×2048 min)

- [ ] **App Icon**
  - [ ] iOS: 1024×1024 PNG (no alpha)
  - [ ] Android: 512×512 PNG

- [ ] **Feature Graphic (Android)**
  - [ ] 1024×500 PNG/JPEG

- [ ] **Privacy Policy**
  - [ ] Create privacy policy
  - [ ] Host online (required URL)
  - [ ] Save URL: ________________

- [ ] **Purchase Flow Screenshots**
  - [ ] Screenshot showing paywall
  - [ ] Screenshot showing subscription details
  - [ ] Screenshot showing premium features
  - [ ] Screenshot showing restore purchases

---

## 🚀 Phase 10: Submit for Review
- [ ] **iOS App Store**
  - [ ] Upload build to App Store Connect
  - [ ] Fill in app information
  - [ ] Add screenshots
  - [ ] Add description
  - [ ] Set pricing ($1.99/month)
  - [ ] Submit in-app purchase for review
  - [ ] Submit app for review
  - [ ] Wait for approval (24-48 hours)

- [ ] **Google Play Store**
  - [ ] Upload AAB to Play Console
  - [ ] Fill in app information
  - [ ] Add screenshots
  - [ ] Add description
  - [ ] Set up pricing ($1.99/month)
  - [ ] Complete content rating questionnaire
  - [ ] Submit for review
  - [ ] Wait for approval (few hours)

---

## ✨ Phase 11: Go Live!
- [ ] **Pre-Launch Checks**
  - [ ] Verify all test ads replaced with production IDs
  - [ ] Test with real money (small purchase)
  - [ ] Check analytics are tracking
  - [ ] Verify privacy policy is accessible

- [ ] **Launch**
  - [ ] App approved in App Store ✅
  - [ ] App approved in Play Store ✅
  - [ ] Subscriptions active ✅
  - [ ] Ads serving ✅
  - [ ] Monitor for issues

- [ ] **Post-Launch**
  - [ ] Set up Google Analytics (optional)
  - [ ] Monitor RevenueCat dashboard
  - [ ] Monitor AdMob earnings
  - [ ] Respond to user reviews
  - [ ] Track conversion rates

---

## 📊 Key Metrics to Track
- [ ] Total downloads
- [ ] Free-to-Premium conversion rate (target: 2-5%)
- [ ] Ad view rate (% of users who watch ads)
- [ ] Subscription retention rate
- [ ] Average revenue per user (ARPU)
- [ ] Churn rate

---

## 🆘 Troubleshooting
If you encounter issues, check:
- [ ] `QUICK_START_REAL.md` - Quick reference
- [ ] `REAL_MONETIZATION_SETUP.md` - Detailed setup guide
- [ ] RevenueCat Dashboard - Customer info & logs
- [ ] AdMob Dashboard - Ad serving status
- [ ] Xcode Console - iOS error logs
- [ ] Android Studio Logcat - Android error logs

---

## 📝 Notes & Important Info

**Bundle/Package ID Used:** ________________

**Product ID:** budgetbuddy_premium_monthly

**Entitlement ID:** premium

**Subscription Price:** $1.99/month

**Initial Free Credits:** 3

**Credits per Ad:** 1

---

## ⏰ Timeline Estimate

| Phase | Time Required | Status |
|-------|---------------|--------|
| Phase 1: Installation | ✅ Complete | Done |
| Phase 2: Accounts | 1-3 days | ⏳ Pending |
| Phase 3: iOS Setup | 2-4 hours | ⏳ Pending |
| Phase 4: Android Setup | 2-4 hours | ⏳ Pending |
| Phase 5: AdMob Setup | 30 minutes | ⏳ Pending |
| Phase 6: Configuration | 15 minutes | ⏳ Pending |
| Phase 7: RevenueCat | 15 minutes | ⏳ Pending |
| Phase 8: Testing | 2-3 hours | ⏳ Pending |
| Phase 9: Assets | 2-4 hours | ⏳ Pending |
| Phase 10: Submission | 24-48 hours | ⏳ Pending |
| **Total** | **3-5 days** | |

---

**Last Updated:** December 25, 2025
**Version:** 1.0
