# Quick Start: Launch BudgetBuddy to App Store

## ✅ Setup Complete
- [x] EAS CLI installed
- [x] eas.json created
- [x] Comprehensive launch guide created

## 🚀 Next Steps (Do These Now)

### 1. Update Your App Configuration (5 minutes)
Edit `app.config.js` and replace these placeholders:

```javascript
// Line 11: Update bundle identifier
bundleIdentifier: 'com.yourname.budgetbuddy', // ← CHANGE THIS

// Lines 26-28: Update AdMob App IDs
androidAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // ← YOUR ADMOB ANDROID ID
iosAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // ← YOUR ADMOB IOS ID

// Lines 35-36: Update RevenueCat API Keys
iosApiKey: process.env.REVENUECAT_IOS_KEY || 'YOUR_IOS_API_KEY_HERE', // ← YOUR REVENUECAT IOS KEY
androidApiKey: process.env.REVENUECAT_ANDROID_KEY || 'YOUR_ANDROID_API_KEY_HERE', // ← YOUR REVENUECAT ANDROID KEY

// Lines 39-47: Update AdMob Ad Unit IDs
appId: process.env.ADMOB_IOS_APP_ID || 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
rewardedAdUnitId: process.env.ADMOB_IOS_REWARDED_ID || 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
appId: process.env.ADMOB_ANDROID_APP_ID || 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
rewardedAdUnitId: process.env.ADMOB_ANDROID_REWARDED_ID || 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
```

### 2. Update EAS Configuration (2 minutes)
Edit `eas.json` and replace:

```json
"appleId": "your-apple-id@example.com", // ← YOUR APPLE ID EMAIL
"ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID", // ← FROM APP STORE CONNECT
"appleTeamId": "YOUR_TEAM_ID" // ← FROM APPLE DEVELOPER PORTAL
```

### 3. Prerequisites Checklist
- [ ] Apple Developer Program membership ($99/year) - https://developer.apple.com/programs/
- [ ] Created app in App Store Connect - https://appstoreconnect.apple.com/
- [ ] Registered Bundle ID in Apple Developer Portal
- [ ] App icon ready (1024x1024px)
- [ ] Screenshots ready for iPhone (see sizes in APPSTORE_LAUNCH_GUIDE.md)
- [ ] Privacy Policy URL available
- [ ] Support URL available

### 4. Build & Submit Commands

Once everything above is done, run these commands:

```bash
# 1. Login to Expo (if not already logged in)
eas login

# 2. Build for iOS App Store
eas build --platform ios --profile production

# 3. After build completes, submit to App Store
eas submit --platform ios

# 4. Alternative: Build and submit in one command
eas build --platform ios --profile production --auto-submit
```

## 📋 What Happens During Build

1. **Build Process** (~15-20 minutes)
   - Your code is uploaded to Expo servers
   - App is compiled with production settings
   - IPA file is generated
   - You'll get a download link

2. **Submit Process** (~5 minutes)
   - IPA is uploaded to App Store Connect
   - New version is created
   - Build becomes available for review submission

3. **Review Process** (1-3 days)
   - Apple reviews your app
   - You'll receive status updates via email
   - Check status in App Store Connect

## ⚠️ Important Notes

### Bundle Identifier Must Match
Your bundle ID must be the same in:
- `app.config.js` → `ios.bundleIdentifier`
- Apple Developer Portal → App IDs
- App Store Connect → App Record

### Recommended Bundle ID Format
Use reverse domain notation:
- Good: `com.yourcompany.budgetbuddy`
- Good: `com.github.yourname.budgetbuddy`
- Avoid: `com.yourname.budgetbuddy` (unless you own yourname.com)

### Testing Before Submission
```bash
# Test your app locally first
npm start
# Then press 'i' for iOS simulator

# Or build a preview version
eas build --platform ios --profile preview
```

## 📖 Full Documentation

For detailed step-by-step instructions, see:
- **APPSTORE_LAUNCH_GUIDE.md** - Complete guide with all steps
- **eas.json** - Build configuration
- **app.config.js** - App configuration

## 🆘 Need Help?

### Common Issues:

**"Bundle identifier already taken"**
→ Choose a unique bundle ID in app.config.js

**"No Apple Developer account"**
→ Sign up at https://developer.apple.com/programs/

**"Build failed"**
→ Check build logs at https://expo.dev
→ Run `npm install` and try again

**"Missing credentials"**
→ Run `eas credentials` to set up certificates

## 📞 Support Resources

- Expo Documentation: https://docs.expo.dev/submit/ios/
- App Store Connect: https://appstoreconnect.apple.com/
- RevenueCat Docs: https://docs.revenuecat.com/
- AdMob Help: https://support.google.com/admob

---

**Ready to launch?** Follow the steps above and read APPSTORE_LAUNCH_GUIDE.md for detailed instructions!
