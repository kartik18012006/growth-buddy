# 🚨 Quick Fix: Server Error on Vercel

## The Problem

You're seeing a "Server error" at `/api/auth/error`. This is caused by **missing or incorrect environment variables** in Vercel.

## ✅ Quick Fix (5 Minutes)

### Step 1: Go to Vercel Environment Variables

1. Open: **https://vercel.com/dashboard**
2. Select your **Growth Buddy** project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add/Verify These 5 Variables

Make sure ALL of these are set (for **Production**, **Preview**, AND **Development**):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NEXTAUTH_URL=https://growth-buddy-iota.vercel.app
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
```

### Step 3: Get Missing Values

#### 1. NEXTAUTH_SECRET
If missing, generate one:
```bash
openssl rand -base64 32
```
Copy the output and paste it as `NEXTAUTH_SECRET`.

#### 2. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Click your OAuth 2.0 Client ID
3. Copy:
   - **Client ID** (must include `.apps.googleusercontent.com`)
   - **Client secret** (starts with `GOCSPX-`)

#### 3. MONGODB_URI
1. Go to MongoDB Atlas → Clusters → Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

#### 4. NEXTAUTH_URL
Set it to your exact Vercel URL:
```
https://growth-buddy-iota.vercel.app
```

### Step 4: Critical Checks

- ✅ **Client ID** must include `.apps.googleusercontent.com` (full string)
- ✅ **No spaces** around the `=` sign
- ✅ **No quotes** around values
- ✅ Set for **all environments** (Production, Preview, Development)

### Step 5: Redeploy

1. Go to **Deployments** tab
2. Click **3 dots (⋯)** on latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes

### Step 6: Test

1. Open: `https://growth-buddy-iota.vercel.app`
2. Try signing in with Google
3. Should work now! ✅

---

## 🐛 Still Not Working?

### Check Vercel Logs

1. Go to **Deployments** → Latest deployment
2. Click **"Functions"** tab
3. Check for errors in logs

Common errors:
- `NEXTAUTH_SECRET is missing` → Add it
- `invalid_client` → Client ID/Secret mismatch
- `MongoDB connection failed` → Check MONGODB_URI

### Verify Environment Variables

Run this locally to verify format:
```bash
# Should output the value (for local testing only)
echo $GOOGLE_CLIENT_ID
echo $NEXTAUTH_SECRET
```

---

## ✅ Success Checklist

Before saying it's fixed, verify:
- [ ] All 5 environment variables are set in Vercel
- [ ] Variables are set for Production, Preview, AND Development
- [ ] Client ID includes `.apps.googleusercontent.com`
- [ ] NEXTAUTH_URL matches your Vercel URL exactly
- [ ] You redeployed after adding/updating variables
- [ ] No errors in Vercel function logs

---

**This should fix the server error!** 🚀

