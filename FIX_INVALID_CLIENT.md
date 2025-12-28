# 🔧 Fix: invalid_client Error (OAuth client not found)

## 🚨 The Problem

You're seeing: **Error 401: invalid_client - "The OAuth client was not found"**

This happens when the redirect URI in your Google Cloud Console doesn't match what your app is sending.

---

## ✅ Quick Fix (2 Steps)

### Step 1: Get Your Current Deployment URL

1. Go to: https://vercel.com/kartiks-projects-a82acb9c/growth-buddy
2. Find your latest deployment
3. Copy the URL (it should look like: `https://growth-buddy-XXXXX.vercel.app`)

### Step 2: Add Redirect URI in Google Cloud Console

1. **Go to:** https://console.cloud.google.com/apis/credentials

2. **Click on your OAuth 2.0 Client ID** (the one with Client ID: `1051792499110-a6i09clu4ves9obvei2kb9boqervec2i`)

3. **Scroll down to "Authorized redirect URIs"**

4. **Click "+ ADD URI"**

5. **Add this exact URL** (replace XXXXX with your actual deployment hash):
   ```
   https://growth-buddy-XXXXX.vercel.app/api/auth/callback/google
   ```

   **For example, if your URL is:**
   `https://growth-buddy-qlu2m7hb5-kartiks-projects-a82acb9c.vercel.app`
   
   **Then add:**
   ```
   https://growth-buddy-qlu2m7hb5-kartiks-projects-a82acb9c.vercel.app/api/auth/callback/google
   ```

6. **Click "SAVE"**

7. **Wait 30 seconds** for changes to propagate

8. **Try signing in again!**

---

## 📋 Find Your Current Deployment URL

**Option 1: Via Vercel Dashboard**
- Go to: https://vercel.com/kartiks-projects-a82acb9c/growth-buddy
- Click on the latest deployment
- Copy the URL from the address bar

**Option 2: Via Terminal**
```bash
cd "/Users/kartikkumar/Documents/Growth Buddy"
vercel ls
```
Look for the latest deployment URL

---

## ✅ Quick Checklist

- [ ] Find your current Vercel deployment URL
- [ ] Go to Google Cloud Console → Credentials
- [ ] Click your OAuth Client ID
- [ ] Add redirect URI: `https://YOUR-URL.vercel.app/api/auth/callback/google`
- [ ] Save
- [ ] Wait 30 seconds
- [ ] Try signing in again

---

## 🎯 Common Mistakes to Avoid

❌ **Wrong:** `https://growth-buddy.vercel.app/api/auth/callback/google` (if you don't have custom domain)
✅ **Correct:** `https://growth-buddy-XXXXX.vercel.app/api/auth/callback/google` (use actual deployment URL)

❌ **Wrong:** Trailing slash: `/api/auth/callback/google/`
✅ **Correct:** No trailing slash: `/api/auth/callback/google`

❌ **Wrong:** Wrong path: `/auth/callback/google`
✅ **Correct:** Full path: `/api/auth/callback/google`

---

That's it! After adding the redirect URI, the error should be fixed! 🎉

