# Quick Fix: Add Environment Variables to Vercel

## Problem
Vercel deployment is failing because environment variables are missing.

## Solution: Add Environment Variables via Vercel Dashboard

### Step 1: Go to Vercel Project Settings
1. Visit: https://vercel.com/kartiks-projects-a82acb9c/growth-buddy/settings/environment-variables
2. Or navigate: Your Project → Settings → Environment Variables

### Step 2: Add Each Variable

Add these environment variables one by one:

#### 1. MONGODB_URI
- **Key:** `MONGODB_URI`
- **Value:** `mongodb+srv://kartikms5477_db_user:6RNsCS9jv4cqFbY8@cluster0.dwqk5yk.mongodb.net/?appName=Cluster0`
- **Environment:** Select all (Production, Preview, Development)

#### 2. NEXTAUTH_URL
- **Key:** `NEXTAUTH_URL`
- **Value:** `https://growth-buddy-XXXXX.vercel.app` (replace with your actual Vercel URL)
- **Environment:** Production only
- **Note:** For preview deployments, use: `https://your-preview-url.vercel.app`
- **Tip:** You can set it to `https://your-project.vercel.app` or use Vercel's automatic URL

#### 3. NEXTAUTH_SECRET
- **Key:** `NEXTAUTH_SECRET`
- **Value:** `rgFbFN4ienxs9+4hqILlFBW6iDp2zSRER6jbr1DaTSc=`
- **Environment:** Select all (Production, Preview, Development)

#### 4. GOOGLE_CLIENT_ID
- **Key:** `GOOGLE_CLIENT_ID`
- **Value:** `1051792499110-a6i09clu4ves9obvei2kb9boqervec2i.apps.googleusercontent.com`
- **Environment:** Select all (Production, Preview, Development)

#### 5. GOOGLE_CLIENT_SECRET
- **Key:** `GOOGLE_CLIENT_SECRET`
- **Value:** `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`
- **Environment:** Select all (Production, Preview, Development)

### Step 3: Redeploy
After adding all variables:
1. Go to the Deployments tab
2. Click the three dots (⋯) on the latest deployment
3. Click "Redeploy"
4. Or push a new commit to trigger automatic deployment

---

## Alternative: Use Vercel CLI (Faster)

Run these commands in your terminal:

```bash
cd "/Users/kartikkumar/Documents/Growth Buddy"

# Add MongoDB URI
vercel env add MONGODB_URI production preview development
# Paste: mongodb+srv://kartikms5477_db_user:6RNsCS9jv4cqFbY8@cluster0.dwqk5yk.mongodb.net/?appName=Cluster0

# Add NextAuth URL (use your actual Vercel URL)
vercel env add NEXTAUTH_URL production
# Paste: https://your-project.vercel.app

# Add NextAuth Secret
vercel env add NEXTAUTH_SECRET production preview development
# Paste: rgFbFN4ienxs9+4hqILlFBW6iDp2zSRER6jbr1DaTSc=

# Add Google Client ID
vercel env add GOOGLE_CLIENT_ID production preview development
# Paste: 1051792499110-a6i09clu4ves9obvei2kb9boqervec2i.apps.googleusercontent.com

# Add Google Client Secret
vercel env add GOOGLE_CLIENT_SECRET production preview development
# Paste: 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
```

Then redeploy:
```bash
vercel --prod
```

---

## Important Notes

### NEXTAUTH_URL for Vercel
- **Production:** Use your production URL: `https://growth-buddy.vercel.app` (or your custom domain)
- **For automatic URL:** You can use `https://your-project.vercel.app` format
- **After first deploy:** Update NEXTAUTH_URL to match your actual deployment URL

### Updating Google OAuth Redirect URI
After deployment, update your Google OAuth redirect URI:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client
3. Add authorized redirect URI: `https://your-vercel-url.vercel.app/api/auth/callback/google`
4. Save

---

## Quick Checklist

- [ ] Add MONGODB_URI
- [ ] Add NEXTAUTH_URL (use your Vercel URL)
- [ ] Add NEXTAUTH_SECRET
- [ ] Add GOOGLE_CLIENT_ID
- [ ] Add GOOGLE_CLIENT_SECRET
- [ ] Redeploy
- [ ] Update Google OAuth redirect URI

After adding all variables and redeploying, your app should work! 🎉

