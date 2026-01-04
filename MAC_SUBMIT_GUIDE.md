# BudgetBuddy - Mac Submission Guide

## Prerequisites

Before submitting, you need:

1. **Apple Developer Account** (enrolled in Apple Developer Program - $99/year)
2. **App created in App Store Connect** at https://appstoreconnect.apple.com
3. **Your Apple credentials:**
   - Apple ID (email)
   - App Store Connect App ID (numeric ID)
   - Apple Team ID

---

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/OFB02/budgetbuddy.git
cd budgetbuddy

# Install dependencies
npm install

# Install EAS CLI globally if not already installed
npm install -g eas-cli
```

---

## Step 2: Login to EAS

```bash
npx eas login
```

Login with your Expo account credentials (oskarfb).

---

## Step 3: Update eas.json with Your Apple Credentials

Edit `eas.json` and replace the placeholder values in the `submit.production.ios` section:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "YOUR_APPLE_ID_EMAIL",
      "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
      "appleTeamId": "YOUR_TEAM_ID"
    }
  }
}
```

### How to find these values:

1. **appleId**: Your Apple ID email address

2. **ascAppId**: 
   - Go to https://appstoreconnect.apple.com
   - Select your app (or create one first)
   - Look at the URL: `https://appstoreconnect.apple.com/apps/XXXXXXXXXX/...`
   - The number (XXXXXXXXXX) is your App Store Connect App ID

3. **appleTeamId**:
   - Go to https://developer.apple.com/account
   - Look for "Membership Details"
   - Your Team ID is listed there (10 characters like "ABC123DEF4")

---

## Step 4: Build for iOS Production

```bash
npx eas build --platform ios --profile production
```

This will:
- Build your app on EAS servers
- Handle code signing automatically
- Take approximately 15-30 minutes

Wait for the build to complete. You'll see a URL to track progress.

---

## Step 5: Submit to App Store

Once the build is complete:

```bash
npx eas submit --platform ios --latest
```

Or submit a specific build:

```bash
npx eas submit --platform ios --id BUILD_ID
```

You'll be prompted for your Apple App-Specific Password:
1. Go to https://appleid.apple.com
2. Sign in → Security → App-Specific Passwords
3. Generate a new password for "EAS Submit"

---

## Step 6: Complete App Store Connect Setup

After submission, go to https://appstoreconnect.apple.com:

1. **App Information**: Fill in category, content rating
2. **Pricing and Availability**: Set your price (Free or Paid)
3. **App Privacy**: Complete the privacy questionnaire
4. **Screenshots**: Upload required screenshots for all device sizes
5. **Description**: Add app description, keywords, support URL
6. **Review Information**: Add contact info and notes for reviewers

---

## Step 7: Submit for Review

Once everything is complete in App Store Connect:
1. Click "Add for Review"
2. Answer any final questions
3. Submit for Apple review

Review typically takes 24-48 hours.

---

## Troubleshooting

### Build fails
```bash
# Check build logs
npx eas build:list
```

### Submit fails with authentication
- Make sure you're using an App-Specific Password, not your regular Apple password
- Verify your Apple Team ID is correct

### Need to update and resubmit
```bash
# Increment version in app.json/app.config.js, then:
npx eas build --platform ios --profile production
npx eas submit --platform ios --latest
```

---

## Quick Command Reference

```bash
# Check EAS login status
npx eas whoami

# List recent builds
npx eas build:list --platform ios

# Build for production
npx eas build --platform ios --profile production

# Submit latest build
npx eas submit --platform ios --latest

# Check submission status
npx eas submit:list
```

---

## Important Notes

- ⚠️ The app currently uses **test AdMob IDs**. Before going live, replace with real IDs in `app.config.js`
- ⚠️ RevenueCat Android key is placeholder (`YOUR_ANDROID_API_KEY_HERE`)
- ✅ iOS RevenueCat key is configured
- ✅ EAS project ID is set: `9b4ee123-4065-4a88-bde8-04951a2fbc32`

Good luck with your submission! 🚀
