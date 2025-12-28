# Publish Google OAuth App for Public Access

## Overview

To make your Growth Buddy app accessible to everyone (not just test users), you need to publish your OAuth consent screen. However, since you're using **Google Calendar scopes**, Google requires app verification.

---

## Option 1: Publish WITH Calendar Scopes (Requires Verification) ⚠️

This allows full functionality but requires Google's verification process.

### Step 1: Prepare Required Information

You'll need:

1. **Privacy Policy URL** - A publicly accessible page explaining your privacy practices
2. **Terms of Service URL** - A publicly accessible terms of service page
3. **App Domain Verification** - Verify you own the domain where your app is hosted
4. **App Review** - Google will review your app (can take 4-6 weeks)

### Step 2: Update OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click **"EDIT APP"** (top right)
3. Fill in all required fields:
   - **App name:** Growth Buddy
   - **User support email:** Your email
   - **Developer contact information:** Your email
   - **App domain:** Your domain (e.g., `growth-buddy.vercel.app`)
   - **Application home page:** Your app URL
   - **Privacy policy link:** URL to your privacy policy
   - **Terms of service link:** URL to your terms of service
   - **Authorized domains:** Add your domain (e.g., `vercel.app` or your custom domain)

4. Under **"Scopes"**, verify these are listed:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`

5. Scroll to **"Test users"** section and click **"PUBLISH APP"**

### Step 3: Submit for Verification

1. After publishing, you'll see a **"Submit for verification"** button
2. Click it and fill out the verification form
3. Google will review your app (this can take 4-6 weeks)
4. You may need to provide additional information about why you need Calendar access

---

## Option 2: Remove Calendar Scopes (Publish Immediately) ⚡

If you want immediate public access without verification, you can remove Calendar scopes temporarily.

### Step 1: Remove Calendar Scopes from NextAuth

Update `lib/auth.ts`:

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: "openid email profile", // Removed Calendar scopes
    },
  },
}),
```

**Note:** This will disable Calendar sync functionality. Users won't be able to sync tasks to Google Calendar.

### Step 2: Update OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click **"EDIT APP"**
3. Fill in required fields (you still need Privacy Policy and Terms)
4. Remove Calendar scopes if they appear
5. Click **"PUBLISH APP"**
6. The app will be immediately available to everyone

### Step 3: Re-add Calendar Scopes Later (Optional)

Once your app is verified, you can add Calendar scopes back and submit for verification.

---

## Recommended Approach: Hybrid Solution 🎯

1. **Start without Calendar scopes** - Publish immediately with basic email/profile access
2. **Add Calendar scopes later** - Submit for verification once your app is live
3. **Gradual rollout** - Keep Calendar features as "coming soon" until verified

---

## Quick Start: Publish Without Calendar Scopes

If you want to publish NOW:

1. Update `lib/auth.ts` to remove Calendar scopes (see Option 2 above)
2. Go to: https://console.cloud.google.com/apis/credentials/consent
3. Click **"EDIT APP"**
4. Fill in:
   - App name: Growth Buddy
   - User support email: kartikms5477@gmail.com
   - Developer contact: kartikms5477@gmail.com
   - Privacy policy: (create a simple page on your site)
   - Terms of service: (create a simple page on your site)
5. Click **"PUBLISH APP"** at the bottom
6. Confirm publishing
7. Restart your dev server and test!

---

## Important Notes

### Privacy Policy & Terms of Service

You need these URLs even for basic publishing. You can:
- Create simple pages on your Vercel deployment
- Use services like https://www.privacypolicygenerator.info/
- Host them on GitHub Pages or similar

### Domain Requirements

- **For localhost:** Not allowed for published apps
- **For Vercel:** Use your Vercel deployment URL (e.g., `your-app.vercel.app`)
- **For custom domain:** Must be verified in Google Search Console

### Verification Timeline

- **Basic scopes (email, profile):** Immediate after publishing
- **Sensitive scopes (Calendar):** 4-6 weeks verification process

---

## Next Steps

1. Decide which approach you want (with or without Calendar)
2. Create Privacy Policy and Terms of Service pages
3. Follow the steps above to publish
4. Test with a different Google account to verify it works

Need help creating the Privacy Policy or Terms pages? I can help with that too!

