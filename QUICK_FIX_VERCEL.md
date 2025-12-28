# 🚀 QUICK FIX: Vercel Environment Variables

## ⚡ Fastest Way: Vercel Dashboard

### Step 1: Go to Environment Variables Page
**Direct Link:** https://vercel.com/kartiks-projects-a82acb9c/growth-buddy/settings/environment-variables

Or:
1. Go to: https://vercel.com/dashboard
2. Click on your "growth-buddy" project
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add These 5 Variables

Click **"Add New"** for each one:

#### Variable 1: MONGODB_URI
- **Key:** `MONGODB_URI`
- **Value:** `mongodb+srv://kartikms5477_db_user:6RNsCS9jv4cqFbY8@cluster0.dwqk5yk.mongodb.net/?appName=Cluster0`
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variable 2: NEXTAUTH_URL
- **Key:** `NEXTAUTH_URL`
- **Value:** `https://growth-buddy.vercel.app` (or your actual Vercel URL after first deploy)
- **Environments:** ✅ Production only
- **Note:** After your first successful deploy, update this to your actual URL

#### Variable 3: NEXTAUTH_SECRET
- **Key:** `NEXTAUTH_SECRET`
- **Value:** `rgFbFN4ienxs9+4hqILlFBW6iDp2zSRER6jbr1DaTSc=`
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variable 4: GOOGLE_CLIENT_ID
- **Key:** `GOOGLE_CLIENT_ID`
- **Value:** `1051792499110-a6i09clu4ves9obvei2kb9boqervec2i.apps.googleusercontent.com`
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variable 5: GOOGLE_CLIENT_SECRET
- **Key:** `GOOGLE_CLIENT_SECRET`
- **Value:** `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`
- **Environments:** ✅ Production ✅ Preview ✅ Development

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest failed deployment
3. Click **"Redeploy"**
4. ✅ Done!

---

## 📝 After First Successful Deploy

1. **Update NEXTAUTH_URL:**
   - Go back to Environment Variables
   - Edit NEXTAUTH_URL
   - Change to your actual deployment URL (e.g., `https://growth-buddy-xxxxx.vercel.app`)
   - Or keep it as `https://growth-buddy.vercel.app` if you have a custom domain

2. **Update Google OAuth Redirect URI:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Edit your OAuth 2.0 Client
   - Add: `https://your-vercel-url.vercel.app/api/auth/callback/google`
   - Save

---

## ✅ Quick Checklist

Copy-paste these values:

```
MONGODB_URI=mongodb+srv://kartikms5477_db_user:6RNsCS9jv4cqFbY8@cluster0.dwqk5yk.mongodb.net/?appName=Cluster0

NEXTAUTH_URL=https://growth-buddy.vercel.app

NEXTAUTH_SECRET=rgFbFN4ienxs9+4hqILlFBW6iDp2zSRER6jbr1DaTSc=

GOOGLE_CLIENT_ID=1051792499110-a6i09clu4ves9obvei2kb9boqervec2i.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=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
```

That's it! 🎉

