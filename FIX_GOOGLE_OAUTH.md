# Fix: Google OAuth redirect_uri_mismatch Error

## 🚨 The Problem

You're seeing this error:
```
Error 400: redirect_uri_mismatch
Access blocked: This app's request is invalid
```

This happens because your Google OAuth client doesn't have the correct redirect URI configured for port **3001**.

## ✅ Solution: Update Google Cloud Console

### Step 1: Go to Google Cloud Console

1. Open: https://console.cloud.google.com/
2. Make sure you're in the correct project (the one where you created your OAuth client)

### Step 2: Navigate to OAuth Credentials

1. Click on the hamburger menu (☰) in the top left
2. Go to: **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID (it should show your Client ID: `1051792499110-a6i09clu4ves9obvei2kb9boqervec2i`)
4. **Click on it** to edit

### Step 3: Add the Redirect URI

1. Scroll down to **"Authorized redirect URIs"**
2. You'll probably see something like:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

3. **Add this new URI:**
   ```
   http://localhost:3001/api/auth/callback/google
   ```

4. Click the **"+ ADD URI"** button if needed
5. Make sure it's exactly:
   ```
   http://localhost:3001/api/auth/callback/google
   ```
   - ✅ No trailing slash
   - ✅ Lowercase `localhost`
   - ✅ Port 3001 (not 3000)
   - ✅ Exact path: `/api/auth/callback/google`

### Step 4: Save

1. Click **"SAVE"** at the bottom
2. Wait a few seconds for the changes to propagate

### Step 5: Try Again

1. Go back to your app: http://localhost:3001
2. Click "Continue with Google" again
3. It should work now! 🎉

---

## 📋 Quick Checklist

Make sure your Google Cloud Console has:

- [ ] OAuth client is in the correct project
- [ ] **Authorized redirect URIs** includes: `http://localhost:3001/api/auth/callback/google`
- [ ] Changes are saved
- [ ] You've waited a few seconds after saving

---

## 🔍 How to Verify

After adding the redirect URI, your **Authorized redirect URIs** section should look like:

```
http://localhost:3001/api/auth/callback/google
```

(You can keep the 3000 one too if you want, or remove it.)

---

## ⚠️ Common Mistakes

❌ **Wrong:** `http://localhost:3001/api/auth/callback/google/` (trailing slash)  
✅ **Correct:** `http://localhost:3001/api/auth/callback/google`

❌ **Wrong:** `http://127.0.0.1:3001/api/auth/callback/google` (127.0.0.1 instead of localhost)  
✅ **Correct:** `http://localhost:3001/api/auth/callback/google`

❌ **Wrong:** `http://localhost:3000/api/auth/callback/google` (wrong port)  
✅ **Correct:** `http://localhost:3001/api/auth/callback/google`

---

## 🎯 Visual Guide

In Google Cloud Console, the **Authorized redirect URIs** section should look like this:

```
┌─────────────────────────────────────────────────────┐
│ Authorized redirect URIs                            │
├─────────────────────────────────────────────────────┤
│ http://localhost:3001/api/auth/callback/google      │
│                                                      │
│ [ + ADD URI ]                                        │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 After Fixing

1. ✅ Save the changes in Google Cloud Console
2. ✅ Wait 10-30 seconds for changes to take effect
3. ✅ Go back to http://localhost:3001
4. ✅ Click "Continue with Google"
5. ✅ It should redirect to Google sign-in successfully!

---

## Still Not Working?

If it still doesn't work after adding the redirect URI:

1. **Double-check the URI** - Copy it exactly: `http://localhost:3001/api/auth/callback/google`
2. **Wait longer** - Sometimes Google takes 1-2 minutes to update
3. **Clear browser cache** - Try incognito/private window
4. **Verify the OAuth client ID** - Make sure you're editing the correct client (check the Client ID matches)
5. **Check your `.env.local`** - Make sure `GOOGLE_CLIENT_ID` matches the one in Google Cloud Console

---

You're all set! Once you add that redirect URI, Google sign-in will work! 🎉


