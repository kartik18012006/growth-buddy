# ⚡ Quick Fix: invalid_client Error

## The Problem
**Error 401: invalid_client - "The OAuth client was not found"**

This means the redirect URI in Google Cloud Console doesn't match your app's URL.

---

## ✅ Fix in 2 Minutes

### Step 1: Find Your Deployment URL

**Go to Vercel Dashboard:**
1. Visit: https://vercel.com/kartiks-projects-a82acb9c/growth-buddy
2. Look at the latest deployment
3. Copy the URL (e.g., `https://growth-buddy-XXXXX.vercel.app`)

### Step 2: Add Redirect URI to Google Cloud Console

1. **Go to:** https://console.cloud.google.com/apis/credentials

2. **Click** on your OAuth 2.0 Client ID

3. **Scroll to** "Authorized redirect URIs"

4. **Click** "+ ADD URI"

5. **Paste this** (replace with YOUR actual URL):
   ```
   https://YOUR-URL-HERE.vercel.app/api/auth/callback/google
   ```

   **Example:**
   If your URL is: `https://growth-buddy-abc123.vercel.app`
   Then add: `https://growth-buddy-abc123.vercel.app/api/auth/callback/google`

6. **Click "SAVE"**

7. **Wait 30 seconds**

8. **Try signing in again!** ✅

---

## 📝 What to Add

**Format:**
```
https://[YOUR-DEPLOYMENT-URL]/api/auth/callback/google
```

**Make sure:**
- ✅ Starts with `https://`
- ✅ Has `/api/auth/callback/google` at the end
- ✅ NO trailing slash
- ✅ Exact URL from Vercel

---

## 🎯 Still Not Working?

1. Make sure you're using the **exact URL** from Vercel (not a custom domain)
2. Make sure there's **no trailing slash** (`/` at the end)
3. **Wait 30-60 seconds** after saving
4. Try in **incognito/private window**

That's it! 🎉

