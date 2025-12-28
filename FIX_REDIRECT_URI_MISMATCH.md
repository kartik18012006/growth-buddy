# 🔧 Fix: redirect_uri_mismatch Error

## The Error
**Error 400: redirect_uri_mismatch**

This means the redirect URI in your Google Cloud Console doesn't match what your app is sending.

---

## ✅ Fix in 2 Steps

### Step 1: Get Your Exact Vercel URL

1. Go to your Vercel dashboard
2. Find your deployment URL (e.g., `https://growth-buddy-iota.vercel.app`)
3. **Copy the exact URL** (without trailing slash)

### Step 2: Add Redirect URI to Google Cloud Console

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Click on your **OAuth 2.0 Client ID** (the one with Client ID: `1051792499110-a6i09clu4ves9obvei2kb9boqervec2i`)
3. Under **"Authorized redirect URIs"**, click **"ADD URI"**
4. Paste this **EXACT** URL (replace with your actual Vercel URL):

```
https://growth-buddy-iota.vercel.app/api/auth/callback/google
```

**Important:**
- ✅ Must start with `https://`
- ✅ Must include `/api/auth/callback/google` at the end
- ✅ **NO trailing slash**
- ✅ **EXACT match** (case-sensitive)

5. Click **"SAVE"**

---

## ✅ Step 3: Verify NEXTAUTH_URL in Vercel

1. Go to: **https://vercel.com/dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `NEXTAUTH_URL`
3. Make sure it's set to your **exact Vercel URL** (no trailing slash):

```
https://growth-buddy-iota.vercel.app
```

4. If it's different, update it to match your actual deployment URL
5. Make sure it's set for **Production**, **Preview**, AND **Development**
6. Click **"Save"**

---

## ✅ Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **3 dots (⋯)** on latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes

---

## ✅ Step 5: Test

1. Visit your site: `https://growth-buddy-iota.vercel.app`
2. Click "Sign In with Google"
3. Should work now! ✅

---

## 🎯 Common Mistakes to Avoid

❌ **Wrong:** `https://growth-buddy-iota.vercel.app/api/auth/callback/google/` (trailing slash)  
✅ **Correct:** `https://growth-buddy-iota.vercel.app/api/auth/callback/google`

❌ **Wrong:** `http://growth-buddy-iota.vercel.app/api/auth/callback/google` (http instead of https)  
✅ **Correct:** `https://growth-buddy-iota.vercel.app/api/auth/callback/google`

❌ **Wrong:** `https://growth-buddy-iota.vercel.app/callback` (wrong path)  
✅ **Correct:** `https://growth-buddy-iota.vercel.app/api/auth/callback/google`

❌ **Wrong:** Only adding `http://localhost:3000/api/auth/callback/google`  
✅ **Correct:** Add BOTH localhost AND your Vercel URL

---

## 📋 Complete List of Redirect URIs You Should Have

In Google Cloud Console, you should have **both**:

1. `http://localhost:3000/api/auth/callback/google` (for local development)
2. `https://growth-buddy-iota.vercel.app/api/auth/callback/google` (for production - replace with your actual URL)

---

## 🔍 Still Not Working?

### Check Your Actual Deployment URL

1. Go to Vercel → Your Project → **Deployments**
2. Click on the latest deployment
3. Look at the URL in the address bar or deployment details
4. Use that **exact URL** in both:
   - Google Cloud Console redirect URI
   - Vercel `NEXTAUTH_URL` environment variable

### Wait 5 Minutes

After saving changes in Google Cloud Console, wait 5 minutes for changes to propagate.

---

**After following these steps, the error will be fixed!** 🚀

