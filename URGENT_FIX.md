# 🚨 URGENT FIX: Server Error on Vercel

## The Problem
Server error at `/api/auth/error` = **Missing environment variables in Vercel**

## ⚡ Fix in 2 Minutes

### Step 1: Open Vercel Dashboard
👉 **https://vercel.com/dashboard** → Click your project → **Settings** → **Environment Variables**

### Step 2: Add These 5 Variables (Copy-Paste Format)

**For EACH variable:**
1. Click **"Add New"**
2. Paste the variable name
3. Paste the value
4. ✅ Check ALL boxes: **Production**, **Preview**, **Development**
5. Click **"Save"**

#### Variable 1: MONGODB_URI
```
MONGODB_URI
```
Value: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
*(Get from MongoDB Atlas → Connect → Connection string)*

#### Variable 2: NEXTAUTH_URL
```
NEXTAUTH_URL
```
Value: `https://growth-buddy-iota.vercel.app`
*(Your exact Vercel URL - check the address bar)*

#### Variable 3: NEXTAUTH_SECRET
```
NEXTAUTH_SECRET
```
Value: `vXuv3oz9LtpvHrnYjvOzXMRscx7hGqgg4MEdJ8X7i24=`
*(I generated this for you - use this exact value)*

#### Variable 4: GOOGLE_CLIENT_ID
```
GOOGLE_CLIENT_ID
```
Value: `1051792499110-a6i09clu4ves9obvei2kb9boqervec2i.apps.googleusercontent.com`
*(Must include `.apps.googleusercontent.com` - get from Google Cloud Console)*

#### Variable 5: GOOGLE_CLIENT_SECRET
```
GOOGLE_CLIENT_SECRET
```
Value: `GOCSPX-your-secret-here`
*(Get from Google Cloud Console → Credentials → OAuth Client)*

### Step 3: Get Google Credentials (1 minute)

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Click your **OAuth 2.0 Client ID** (the one that shows `1051792499110-...`)
3. Copy:
   - **Client ID** (full string ending in `.apps.googleusercontent.com`)
   - **Client secret** (starts with `GOCSPX-`)
4. Paste into Vercel

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **3 dots (⋯)** on the latest deployment
3. Click **"Redeploy"**
4. Wait 2 minutes

### Step 5: Test

Visit: **https://growth-buddy-iota.vercel.app**

✅ **Should work now!**

---

## ✅ Quick Checklist

Before redeploying, verify:
- [ ] All 5 variables added
- [ ] Each variable checked for **Production**, **Preview**, AND **Development**
- [ ] GOOGLE_CLIENT_ID has `.apps.googleusercontent.com` suffix
- [ ] No spaces around `=` sign
- [ ] No quotes around values

---

**Do this now and the error will be fixed!** 🚀

