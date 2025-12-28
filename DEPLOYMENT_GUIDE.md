# 🚀 Growth Buddy - Vercel Deployment Guide

Complete step-by-step guide to deploy Growth Buddy to Vercel.

---

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ GitHub account
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ MongoDB Atlas account (or MongoDB database)
- ✅ Google Cloud Console account (for OAuth)

---

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create OAuth Credentials

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Select your project (or create a new one)
3. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
4. If prompted, configure the OAuth consent screen first:
   - User Type: **External** (for public access)
   - App name: **Growth Buddy**
   - User support email: Your email
   - Developer contact: Your email
   - Click **"SAVE AND CONTINUE"**
   - Scopes: Add `openid`, `email`, `profile`
   - Click **"SAVE AND CONTINUE"**
   - Test users: Add your email (or skip for public app)
   - Click **"SAVE AND CONTINUE"**
   - Click **"BACK TO DASHBOARD"**
5. Application type: **"Web application"**
6. Name: **"Growth Buddy Web Client"**
7. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - `https://your-app-name.vercel.app/api/auth/callback/google` (update after deployment)
8. Click **"CREATE"**
9. **COPY** the Client ID and Client Secret

---

## 🌐 Step 2: Deploy to Vercel

### 2.1 Connect GitHub Repository

1. Go to: **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: **growth-buddy**
4. Click **"Import"**

### 2.2 Configure Project Settings

**Framework Preset:** Next.js (should auto-detect)
**Root Directory:** `./` (leave as is)
**Build Command:** `npm run build` (default)
**Output Directory:** `.next` (default)
**Install Command:** `npm install` (default)

Click **"Deploy"** (we'll add environment variables after first deployment)

---

## 🔐 Step 3: Add Environment Variables

After the first deployment (even if it fails), go to **Settings** → **Environment Variables** and add:

### Required Variables:

```env
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### How to get each value:

1. **MONGODB_URI**
   - Go to MongoDB Atlas → Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database password

2. **NEXTAUTH_URL**
   - After first deployment, copy your Vercel URL
   - Example: `https://growth-buddy.vercel.app`

3. **NEXTAUTH_SECRET**
   - Generate using: `openssl rand -base64 32`
   - Or use any random 32+ character string

4. **GOOGLE_CLIENT_ID**
   - From Google Cloud Console (Step 1)
   - **IMPORTANT:** Must include `.apps.googleusercontent.com` suffix

5. **GOOGLE_CLIENT_SECRET**
   - From Google Cloud Console (Step 1)
   - Starts with `GOCSPX-`

### ⚠️ Critical Notes:

- ✅ Set environment variables for **Production**, **Preview**, AND **Development**
- ✅ Client ID must include the full `.apps.googleusercontent.com` suffix
- ✅ No spaces around the `=` sign in values
- ✅ No quotes around values (unless the value contains spaces)

---

## 🔄 Step 4: Update Google Cloud Redirect URI

1. Go back to: **https://console.cloud.google.com/apis/credentials**
2. Click your OAuth Client ID
3. Under **"Authorized redirect URIs"**, add:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
   (Replace `your-app-name` with your actual Vercel app name)
4. Click **"SAVE"**

---

## 🚀 Step 5: Redeploy

1. Go to Vercel dashboard → Your project → **Deployments**
2. Click the **3 dots (⋯)** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (2-3 minutes)

---

## ✅ Step 6: Test Your Deployment

1. Open your Vercel URL: `https://your-app-name.vercel.app`
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. You should be redirected to the dashboard

---

## 🐛 Troubleshooting

### Error: "invalid_client"

**Problem:** Client ID doesn't match Google Cloud Console

**Fix:**
1. Verify `GOOGLE_CLIENT_ID` in Vercel matches Google Cloud Console EXACTLY
2. Make sure it includes `.apps.googleusercontent.com` suffix
3. Verify redirect URI in Google Cloud Console matches your Vercel URL
4. Redeploy after making changes

### Error: "NEXTAUTH_URL mismatch"

**Problem:** `NEXTAUTH_URL` doesn't match your actual deployment URL

**Fix:**
1. Update `NEXTAUTH_URL` in Vercel to your exact deployment URL
2. Update redirect URI in Google Cloud Console
3. Redeploy

### Error: "MongoDB connection failed"

**Problem:** MongoDB URI is incorrect or database isn't accessible

**Fix:**
1. Verify MongoDB URI is correct
2. Check MongoDB Atlas network access (allow all IPs or add Vercel IPs)
3. Verify database user has correct permissions

### Build Errors

**Problem:** TypeScript or build errors

**Fix:**
1. Run `npm run build` locally to check for errors
2. Fix any TypeScript errors
3. Commit and push changes
4. Vercel will automatically redeploy

---

## 🔒 Step 7: Make OAuth App Public (Optional)

If you want anyone to sign in (not just test users):

1. Go to: **https://console.cloud.google.com/apis/credentials/consent**
2. Click **"PUBLISH APP"**
3. Complete all required fields:
   - Privacy Policy URL: `https://your-app-name.vercel.app/privacy`
   - Terms of Service URL: `https://your-app-name.vercel.app/terms`
4. Click **"PUBLISH"**
5. Wait for review (usually instant for basic scopes)

---

## 📝 Environment Variables Summary

**Local Development (.env.local):**
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

**Vercel Production:**
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

**Key Difference:** `NEXTAUTH_URL` changes from `localhost` to your Vercel URL.

---

## 🎉 Success!

Your Growth Buddy app should now be live on Vercel! 

For updates:
1. Push changes to GitHub
2. Vercel automatically redeploys
3. Test your changes

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.

