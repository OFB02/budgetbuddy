# App Store Launch Guide for BudgetBuddy

## Prerequisites Checklist

### 1. Apple Developer Account
- [ ] Enrolled in Apple Developer Program ($99/year)
- [ ] Account is active and in good standing
- [ ] Visit: https://developer.apple.com/programs/

### 2. App Store Connect Setup
- [ ] Access to App Store Connect (https://appstoreconnect.apple.com/)
- [ ] Created new app listing in App Store Connect
- [ ] Bundle ID registered: `com.yourname.budgetbuddy` (or your chosen ID)

### 3. Required App Assets
- [ ] App Icon (1024x1024px, no transparency, no rounded corners)
- [ ] Screenshots for required device sizes:
  - iPhone 6.7" (1290x2796px) - iPhone 14 Pro Max, 15 Pro Max
  - iPhone 6.5" (1242x2688px) - iPhone 11 Pro Max, XS Max
  - iPhone 5.5" (1242x2208px) - Optional but recommended
- [ ] App Preview videos (optional but recommended)

### 4. App Information
- [ ] App name (30 characters max)
- [ ] Subtitle (30 characters max)
- [ ] App description (4000 characters max)
- [ ] Keywords (100 characters max, comma-separated)
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Privacy Policy URL (REQUIRED)
- [ ] Age rating information

### 5. Technical Requirements
- [ ] Unique Bundle Identifier
- [ ] App version (currently 1.0.0)
- [ ] Build number
- [ ] App complies with Apple's App Store Review Guidelines

---

## Step-by-Step Launch Process

### Phase 1: Configuration (30 minutes)

#### 1.1 Update app.config.js
Update your bundle identifier and app IDs:
```bash
# Edit app.config.js and replace:
# - com.yourname.budgetbuddy with your actual bundle ID
# - XXXXXXXXXXXXXXXX with your actual AdMob IDs
# - YOUR_IOS_API_KEY_HERE with your RevenueCat iOS API key
```

#### 1.2 Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

#### 1.3 Configure EAS Build
```bash
eas build:configure
```

### Phase 2: Create App in App Store Connect (1 hour)

#### 2.1 Register Bundle ID
1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click the + button
3. Select "App IDs"
4. Select "App"
5. Enter:
   - Description: BudgetBuddy
   - Bundle ID: com.yourname.budgetbuddy (use your actual domain)
6. Enable capabilities as needed:
   - In-App Purchase (for RevenueCat)
   - Push Notifications (if planning to add)
7. Click Continue and Register

#### 2.2 Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com/apps
2. Click the + button and select "New App"
3. Fill in:
   - Platform: iOS
   - Name: BudgetBuddy
   - Primary Language: English (or your choice)
   - Bundle ID: Select the one you just registered
   - SKU: budgetbuddy (or any unique identifier)
   - User Access: Full Access
4. Click Create

#### 2.3 Complete App Information
1. In the App Information section:
   - Add Privacy Policy URL
   - Set Category (Finance)
   - Add Support URL
   - Set Content Rights
2. In the Pricing and Availability section:
   - Set price (Free)
   - Choose countries/regions
3. In Age Rating section:
   - Complete the questionnaire

### Phase 3: Build the App (30 minutes)

#### 3.1 Create Production Build
```bash
# Build for iOS App Store
eas build --platform ios --profile production
```

This will:
- Upload your code to Expo's build servers
- Build your app with production credentials
- Generate an IPA file
- Provide you with a download link

#### 3.2 Wait for Build to Complete
- Monitor the build progress in terminal or at https://expo.dev/accounts/[your-account]/projects/budgetbuddy/builds
- Build typically takes 10-20 minutes
- You'll receive an email when complete

### Phase 4: Submit to App Store (30 minutes)

#### 4.1 Automatic Submission (Recommended)
```bash
# Submit directly to App Store Connect
eas submit --platform ios
```

EAS will automatically:
- Download your build
- Upload to App Store Connect
- Create a new version

#### 4.2 Manual Submission (Alternative)
1. Download the IPA file from EAS
2. Use Transporter app (Mac App Store) or Application Loader
3. Sign in with your Apple ID
4. Upload the IPA file

#### 4.3 Complete Version Information in App Store Connect
1. Go to your app in App Store Connect
2. Click on the version number (1.0)
3. Add:
   - Screenshots (required for at least one device size)
   - App description
   - Keywords
   - Support URL
   - Marketing URL (optional)
   - Promotional text (optional)
4. Select the build you just uploaded
5. Fill in "What's New in This Version"
6. Complete Export Compliance questions
7. Complete Advertising Identifier questions

### Phase 5: Submit for Review (5 minutes)

#### 5.1 Review Your Submission
- Double-check all information
- Preview how your app will appear in the App Store
- Ensure all required fields are complete

#### 5.2 Submit
1. Click "Submit for Review"
2. Review the summary
3. Confirm submission

### Phase 6: Review Process (1-7 days)

#### 6.1 App Review
- Typical review time: 24-48 hours
- You'll receive email updates
- Check status in App Store Connect

#### 6.2 Common Rejection Reasons
- Missing privacy policy
- In-app purchases not properly configured
- Crashes or bugs
- Missing required features
- Misleading screenshots or description
- Export compliance issues

#### 6.3 If Rejected
1. Read the rejection message carefully
2. Address all issues mentioned
3. Reply to reviewer or submit a new version
4. Resubmit for review

### Phase 7: Launch (Immediate or Scheduled)

#### 7.1 Automatic Release
- App goes live immediately after approval (if configured)

#### 7.2 Manual Release
- Hold the app after approval
- Release it when you're ready
- Go to App Store Connect → Your App → Release Version

---

## Important Configuration Notes

### Bundle Identifier
Your bundle identifier MUST be unique and match across:
- app.config.js: `ios.bundleIdentifier`
- Apple Developer Portal: App ID
- App Store Connect: Bundle ID

### In-App Purchases (RevenueCat)
1. Create products in App Store Connect
2. Configure them in RevenueCat dashboard
3. Test with sandbox accounts before going live

### AdMob Integration
1. Get your app approved first
2. Replace test IDs with production IDs
3. Enable "Personalized ads" in AdMob console

### Privacy Requirements
Apple requires privacy information for:
- Data collection (AdMob, analytics)
- RevenueCat (purchase history)
- AsyncStorage (user preferences)

Update your privacy policy accordingly.

---

## Quick Command Reference

```bash
# Login to Expo
eas login

# Configure EAS (first time only)
eas build:configure

# Build for iOS App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios

# Check build status
eas build:list

# View project details
eas project:info

# Update credentials
eas credentials
```

---

## Post-Launch Checklist

- [ ] Monitor crash reports in App Store Connect
- [ ] Respond to user reviews
- [ ] Monitor app analytics
- [ ] Plan for updates
- [ ] Set up TestFlight for beta testing future versions
- [ ] Consider App Store Optimization (ASO)

---

## Resources

- **Expo Documentation**: https://docs.expo.dev/submit/ios/
- **App Store Connect**: https://appstoreconnect.apple.com/
- **Apple Developer**: https://developer.apple.com/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **RevenueCat Documentation**: https://docs.revenuecat.com/
- **AdMob Documentation**: https://admob.google.com/intl/en/home/get-started/

---

## Estimated Timeline

- Configuration: 30 minutes
- App Store Connect setup: 1 hour
- Build time: 20 minutes
- Submission: 30 minutes
- Review: 1-3 days
- **Total**: ~2-4 days from start to App Store

---

## Need Help?

Common issues and solutions:

### "Bundle identifier already exists"
- Choose a different bundle ID
- Use reverse domain notation: com.yourcompany.budgetbuddy

### "Build failed"
- Check build logs in EAS dashboard
- Ensure all dependencies are compatible
- Try running `npm install` and rebuilding

### "No distribution certificate found"
- Run `eas credentials` to manage certificates
- EAS can automatically create them

### "Missing compliance"
- Answer export compliance questions in App Store Connect
- Most apps don't use encryption beyond HTTPS

For more help, check the Expo forums or Stack Overflow.
