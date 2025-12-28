# Fix: Google OAuth Access Denied - Add Test Users

## Problem
You're seeing this error:
> **Access blocked: growth buddy has not completed the Google verification process**

This happens because your app is in "Testing" mode and your email is not added as a test user.

## Solution: Add Test Users in Google Cloud Console

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/
2. Make sure you're signed in with the same Google account that created the project
3. Select your project (or the project where your OAuth credentials were created)

### Step 2: Navigate to OAuth Consent Screen
1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
   - Or visit directly: https://console.cloud.google.com/apis/credentials/consent

### Step 3: Add Test Users
1. Scroll down to the **"Test users"** section
2. Click **"+ ADD USERS"** button
3. Enter your email address: `kartikms5477@gmail.com`
   - You can add multiple test users (one per line or separated by commas)
   - Add any other email addresses that need access to test the app
4. Click **"ADD"** to save

### Step 4: Try Signing In Again
1. Go back to your Growth Buddy app: http://localhost:3002
2. Click "Continue with Google"
3. You should now be able to sign in!

---

## Alternative: Publish Your App (Not Recommended for Development)

If you want to allow anyone with a Google account to sign in (without adding them as test users), you can publish your app, but this requires:
- App verification by Google
- Privacy policy URL
- Terms of service URL
- Verified domain (for sensitive scopes like Calendar)

**For development/testing, adding test users is the recommended approach.**

---

## Important Notes

### When You Need to Add More Test Users
- Any email address that wants to test your app must be added as a test user
- Test users can only access the app while it's in "Testing" mode
- You can add up to 100 test users

### What Happens After Adding Test Users
- They will receive an email notification
- They can then sign in to your app using their Google account
- No app verification required for test users

### Current App Status
Your app is in **"Testing"** mode, which means:
- ✅ Only test users can sign in
- ✅ No Google verification needed
- ✅ Perfect for development and testing
- ❌ Limited to 100 test users

---

## Quick Summary

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Scroll to "Test users" section
3. Click "+ ADD USERS"
4. Add: `kartikms5477@gmail.com`
5. Click "ADD"
6. Try signing in again!

That's it! Your app should work now. 🎉

