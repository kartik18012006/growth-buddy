# ⚡ Quick Fix: Google OAuth Error

## The Problem
```
Error 400: redirect_uri_mismatch
```

## The Solution (2 Minutes)

1. **Go to:** https://console.cloud.google.com/apis/credentials

2. **Click on your OAuth 2.0 Client ID**

3. **Scroll to "Authorized redirect URIs"**

4. **Add this URI:**
   ```
   http://localhost:3001/api/auth/callback/google
   ```

5. **Click SAVE**

6. **Wait 30 seconds**

7. **Try signing in again at:** http://localhost:3001

---

## That's It! 🎉

The redirect URI must match exactly:
- ✅ `http://localhost:3001/api/auth/callback/google`
- ❌ NOT `http://localhost:3000/api/auth/callback/google`
- ❌ NOT `http://localhost:3001/api/auth/callback/google/` (no trailing slash)

---

See `FIX_GOOGLE_OAUTH.md` for detailed instructions if needed.


