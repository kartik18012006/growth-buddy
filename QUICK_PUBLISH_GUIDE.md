# Quick Guide: Publish Your App for Public Access

## What We Did

✅ **Removed Calendar scopes** from authentication (temporarily)
- This allows immediate publishing without Google verification
- Calendar sync features will be disabled until we add scopes back

## Next Steps in Google Cloud Console

### Step 1: Go to OAuth Consent Screen
1. Visit: https://console.cloud.google.com/apis/credentials/consent
2. Click **"EDIT APP"** (top right)

### Step 2: Fill Required Fields
1. **App name:** Growth Buddy
2. **User support email:** kartikms5477@gmail.com
3. **Developer contact information:** kartikms5477@gmail.com
4. **App domain:** (leave empty for now, or use your Vercel URL)
5. **Application home page:** https://your-vercel-url.vercel.app (or leave empty)
6. **Privacy policy link:** 
   - Create a simple privacy policy page
   - Or use: https://www.privacypolicygenerator.info/
   - Example: `https://your-site.vercel.app/privacy`
7. **Terms of service link:**
   - Create a simple terms page
   - Example: `https://your-site.vercel.app/terms`

### Step 3: Verify Scopes
Make sure only these scopes are listed:
- ✅ `openid`
- ✅ `email`
- ✅ `profile`
- ❌ Remove any Calendar scopes if they appear

### Step 4: Publish!
1. Scroll to the bottom
2. Click **"PUBLISH APP"**
3. Click **"CONFIRM"** in the dialog
4. Your app is now public! 🎉

### Step 5: Test
1. Sign out of your Google account (or use incognito)
2. Go to your app
3. Try signing in with any Google account
4. It should work!

---

## Adding Calendar Features Later

Once your app is live and you want Calendar sync:

1. Add Calendar scopes back to `lib/auth.ts`
2. Update OAuth consent screen to include Calendar scopes
3. Submit for Google verification (takes 4-6 weeks)
4. After approval, Calendar features will work for all users

---

## Quick Privacy Policy & Terms

You can create simple pages:

**Privacy Policy:** https://your-app.vercel.app/privacy
```markdown
# Privacy Policy

Growth Buddy respects your privacy. We only collect:
- Your email address (for authentication)
- Your name (to personalize your experience)
- Task, habit, and sleep data (stored securely)

We do not share your data with third parties.
```

**Terms of Service:** https://your-app.vercel.app/terms
```markdown
# Terms of Service

By using Growth Buddy, you agree to use it responsibly.
We are not responsible for any data loss.
```

---

## Current Status

✅ Authentication scopes: `openid email profile` (public-ready)
❌ Calendar scopes: Removed (requires verification)
✅ Ready to publish: Yes!

Go publish now! 🚀

