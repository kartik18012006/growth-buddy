# 🔧 EXACT FIX: Copy-Paste Values for Vercel

## The Errors (from your logs):
1. ❌ `Please define the MONGODB_URI environment variable`
2. ❌ `[next-auth][error][NO_SECRET]`

## ⚡ Fix Now (5 Steps)

### Step 1: Open Vercel Environment Variables
👉 **https://vercel.com/dashboard** → Click **"growth-buddy"** → **Settings** → **Environment Variables**

### Step 2: Add Variable 1 - MONGODB_URI

1. Click **"Add New"**
2. **Key:** `MONGODB_URI`
3. **Value:** 
```
mongodb+srv://kartikms5477_db_user:6RNsCS9jv4cqFbY8@cluster0.dwqk5yk.mongodb.net/?appName=Cluster0
```
4. ✅ Check: **Production**, **Preview**, **Development**
5. Click **"Save"**

### Step 3: Add Variable 2 - NEXTAUTH_URL

1. Click **"Add New"**
2. **Key:** `NEXTAUTH_URL`
3. **Value:** 
```
https://growth-buddy-iota.vercel.app
```
4. ✅ Check: **Production**, **Preview**, **Development**
5. Click **"Save"**

### Step 4: Add Variable 3 - NEXTAUTH_SECRET

1. Click **"Add New"**
2. **Key:** `NEXTAUTH_SECRET`
3. **Value:** 
```
rgFbFN4ienxs9+4hqILlFBW6iDp2zSRER6jbr1DaTSc=
```
4. ✅ Check: **Production**, **Preview**, **Development**
5. Click **"Save"**

### Step 5: Add Variable 4 - GOOGLE_CLIENT_ID

1. Click **"Add New"**
2. **Key:** `GOOGLE_CLIENT_ID`
3. **Value:** 
```
1051792499110-a6i09clu4ves9obvei2kb9boqervec2i.apps.googleusercontent.com
```
4. ✅ Check: **Production**, **Preview**, **Development**
5. Click **"Save"**

### Step 6: Add Variable 5 - GOOGLE_CLIENT_SECRET

1. Click **"Add New"**
2. **Key:** `GOOGLE_CLIENT_SECRET`
3. **Value:** 
```
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
```
4. ✅ Check: **Production**, **Preview**, **Development**
5. Click **"Save"**

---

## ✅ Final Step: Redeploy

1. Go to **Deployments** tab
2. Click **3 dots (⋯)** on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes

## 🎯 Test

Visit: **https://growth-buddy-iota.vercel.app**

Should work now! ✅

---

## ⚠️ Important Notes

- ✅ **ALL 5 variables** must be added
- ✅ Each variable must be checked for **ALL 3 environments** (Production, Preview, Development)
- ✅ **No spaces** around the `=` sign in the values
- ✅ **No quotes** around the values
- ✅ Copy the values **exactly** as shown above

---

**After adding all 5 variables and redeploying, the errors will be fixed!** 🚀

