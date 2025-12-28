# 🔧 Fix: OAuth invalid_client Error

## Problem
You're seeing: **Error 401: invalid_client** - "The OAuth client was not found"

This happens because the redirect URI doesn't match between:
1. Your Vercel deployment URL
2. Google Cloud Console authorized redirect URIs
3. NEXTAUTH_URL environment variable

---

## ✅ Quick Fix (2 Steps)

### Step 1: Update NEXTAUTH_URL in Vercel

Your deployment URL is: `https://growth-buddy-32qcir9mk-kartiks-projects-a82acb9c.vercel.app`

**Option A: Via Vercel Dashboard (Easiest)**
1. Go to: https://vercel.com/kartiks-projects-a82acb9c/growth-buddy/settings/environment-variables
2. Find `NEXTAUTH_URL`
3. Click the edit icon
4. Change value to: `https://growth-buddy-32qcir9mk-kartiks-projects-a82acb9c.vercel.app`
5. Save
6. Redeploy (or it will auto-redeploy on next push)

**Option B: Via CLI**
```bash
cd "/Users/kartikkumar/Documents/Growth Buddy"
echo "https://growth-buddy-32qcir9mk-kartiks-projects-a82acb9c.vercel.app" | vercel env rm NEXTAUTH_URL production
echo "https://growth-buddy-32qcir9mk-kartiks-projects-a82acb9c.vercel.app" | vercel env add NEXTAUTH_URL production
```

### Step 2: Add Redirect URI in Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID (the one with your GOOGLE_CLIENT_ID)
3. Scroll down to **"Authorized redirect URIs"**
4. Click **"+ ADD URI"**
5. Add this exact URL:
   ```
   https://growth-buddy-32qcir9mk-kartiks-projects-a82acb9c.vercel.app/api/auth/callback/google
   ```
6. Click **"SAVE"**

### Step 3: Redeploy (if needed)

If you updated NEXTAUTH_URL via dashboard:
- Go to Deployments tab
- Click "Redeploy" on the latest deployment

Or push a new commit to trigger auto-deploy.

---

## 🎯 Better Solution: Use Production Domain

If you want a cleaner URL, you can:

1. **Set up a custom domain** in Vercel (optional)
2. **Or use the main production URL** if you have one

Then update both:
- NEXTAUTH_URL in Vercel
- Authorized redirect URI in Google Cloud Console

---

## ✅ Quick Checklist

- [ ] Update NEXTAUTH_URL in Vercel to your actual deployment URL
- [ ] Add redirect URI in Google Cloud Console: `https://your-vercel-url.vercel.app/api/auth/callback/google`
- [ ] Redeploy if needed
- [ ] Test sign-in again

That's it! 🎉

