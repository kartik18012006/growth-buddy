# Update .env.local for Port 3001

## Important: Update Your `.env.local` File

Since we changed the dev server to use port **3001**, you need to update your `.env.local` file.

## Step-by-Step Instructions

### 1. Open `.env.local` in VS Code

1. In VS Code, look at the file explorer (left sidebar)
2. Find `.env.local` in the project root
3. Click on it to open

**Note:** If you don't see `.env.local`, it might be hidden. Try:
- Right-click in the file explorer → "Reveal in Finder/Explorer"
- Or use `Cmd+Shift+P` → type "File: Reveal Active File in Side Bar"

### 2. Update NEXTAUTH_URL

**Find this line:**
```env
NEXTAUTH_URL=http://localhost:3000
```

**Change it to:**
```env
NEXTAUTH_URL=http://localhost:3001
```

### 3. Your Complete `.env.local` File Should Look Like This:

```env
# Database Connection (MongoDB Atlas)
MONGODB_URI=mongodb+srv://kartikms5477_db_user:6RNsCS9jv4cqFbY8@cluster0.dwqk5yk.mongodb.net/?appName=Cluster0

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=rgFbFN4ienxs9+4hqILlFBW6iDp2zSRER6jbr1DaTSc=

# Google OAuth Credentials
GOOGLE_CLIENT_ID=1051792499110-a6i09clu4ves9obvei2kb9boqervec2i.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### 4. Save the File

- Press `Cmd+S` (Mac) or `Ctrl+S` (Windows/Linux)
- Make sure the file is saved (no dot on the file tab)

### 5. Restart Your Development Server

**IMPORTANT:** You must restart the server after changing `.env.local`:

1. **Stop the current server:**
   - Go to your terminal where `npm run dev` is running
   - Press `Ctrl+C` to stop it

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Go to: **http://localhost:3001** (NOT 3000!)

---

## Also Update Google OAuth Redirect URI

Since you're now using port 3001, you should also update your Google OAuth settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, make sure you have:
   - `http://localhost:3001/api/auth/callback/google`
   - (You can keep the 3000 one too, or remove it)

---

## Quick Checklist ✅

- [ ] `.env.local` file updated: `NEXTAUTH_URL=http://localhost:3001`
- [ ] File saved (`Cmd+S` or `Ctrl+S`)
- [ ] Development server restarted (`Ctrl+C` then `npm run dev`)
- [ ] Browser opened to `http://localhost:3001`
- [ ] Google OAuth redirect URI updated (optional but recommended)

---

## If It Still Doesn't Work

1. **Double-check the port:**
   - Make sure the terminal shows: `Ready on http://localhost:3001`
   - If it shows 3000, you didn't restart properly

2. **Check for errors in the terminal:**
   - Look for any red error messages
   - Share them if you see any

3. **Clear browser cache:**
   - Try opening in an incognito/private window
   - Or hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

4. **Verify .env.local format:**
   - No quotes around values
   - No spaces around `=`
   - Exact spelling of variable names

---

You're all set! 🚀


