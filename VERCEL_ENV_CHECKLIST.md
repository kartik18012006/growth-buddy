# 🚨 URGENT: Fix Vercel Server Error - Environment Variables Checklist

## ⚡ Do This NOW (Copy-Paste Ready)

### Step 1: Go to Vercel
👉 **https://vercel.com/dashboard** → Your Project → **Settings** → **Environment Variables**

### Step 2: Add These 5 Variables

Click **"Add New"** for each one and make sure to select **Production**, **Preview**, AND **Development**:

#### 1. MONGODB_URI
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```
*(Get from MongoDB Atlas → Connect → Connection string)*

#### 2. NEXTAUTH_URL
```
NEXTAUTH_URL=https://growth-buddy-iota.vercel.app
```
*(Your exact Vercel URL - check your deployment URL)*

#### 3. NEXTAUTH_SECRET
```
NEXTAUTH_SECRET=paste-generated-secret-here
```
*(Generate: Run `openssl rand -base64 32` in terminal, copy output)*

#### 4. GOOGLE_CLIENT_ID
```
GOOGLE_CLIENT_ID=1051792499110-a6i09clu4ves9obvei2kb9boqervec2i.apps.googleusercontent.com
```
*(Must include .apps.googleusercontent.com at the end - get from Google Cloud Console)*

#### 5. GOOGLE_CLIENT_SECRET
```
GOOGLE_CLIENT_SECRET=GOCSPX-paste-your-secret-here
```
*(Starts with GOCSPX- - get from Google Cloud Console)*

### Step 3: Get Google Credentials

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Click your **OAuth 2.0 Client ID**
3. Copy:
   - **Client ID** (full string with `.apps.googleusercontent.com`)
   - **Client secret** (starts with `GOCSPX-`)

### Step 4: Generate NEXTAUTH_SECRET

Open terminal and run:
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET`.

### Step 5: CRITICAL - Check These

- ✅ **All 5 variables** are added
- ✅ Each variable is set for **ALL 3 environments** (Production, Preview, Development)
- ✅ **GOOGLE_CLIENT_ID** includes `.apps.googleusercontent.com` (full string, no quotes)
- ✅ **No spaces** around the `=` sign
- ✅ **No quotes** around values

### Step 6: Redeploy

1. Go to **Deployments** tab
2. Click **3 dots (⋯)** on latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes

### Step 7: Test

Visit: **https://growth-buddy-iota.vercel.app**

Should work now! ✅

---

## 🔍 If Still Not Working

### Check Vercel Logs:

1. Go to **Deployments** → Latest deployment
2. Click **"Functions"** tab
3. Look for error messages

Common errors:
- `GOOGLE_CLIENT_ID is required` → Variable not set or wrong name
- `invalid_client` → Client ID/Secret mismatch with Google Cloud Console
- `NEXTAUTH_URL mismatch` → URL doesn't match your Vercel domain

---

## ⚠️ Most Common Mistakes

❌ **Client ID missing suffix**: `1051792499110-a6i09clu4ves9obvei2kb9boqervec2i`  
✅ **Correct**: `1051792499110-a6i09clu4ves9obvei2kb9boqervec2i.apps.googleusercontent.com`

❌ **Variable only set for Production**  
✅ **Set for ALL 3**: Production, Preview, Development

❌ **Spaces around =**: `GOOGLE_CLIENT_ID = value`  
✅ **No spaces**: `GOOGLE_CLIENT_ID=value`

---

**Do this now and the error will be fixed!** 🚀

