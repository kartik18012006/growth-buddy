# Quick Fix: Website Not Opening

## ✅ Step 1: Update `.env.local` File

Open `.env.local` and change this line:

**FROM:**
```env
NEXTAUTH_URL=http://localhost:3000
```

**TO:**
```env
NEXTAUTH_URL=http://localhost:3001
```

## ✅ Step 2: Complete `.env.local` Content

Make sure your `.env.local` file has exactly this (copy-paste this entire block):

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

**Important:**
- No quotes around values
- No spaces around `=`
- Save the file (`Cmd+S` or `Ctrl+S`)

## ✅ Step 3: Restart the Server

1. In your terminal, press `Ctrl+C` to stop the server
2. Wait until it's fully stopped
3. Run:
   ```bash
   npm run dev
   ```
4. You should see: `✓ Ready on http://localhost:3001`

## ✅ Step 4: Open the Correct URL

Open your browser and go to:
```
http://localhost:3001
```

**NOT** `http://localhost:3000` ❌

## ✅ Step 5: Update Google OAuth (Optional but Recommended)

If Google sign-in doesn't work, update your Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add:
   ```
   http://localhost:3001/api/auth/callback/google
   ```
4. Click "Save"

---

## Still Not Working?

### Check Terminal for Errors

Look at your terminal output when you run `npm run dev`. Common issues:

1. **"MongoDB connection error"**
   - Check your internet connection
   - Verify MongoDB Atlas allows connections from your IP

2. **"NEXTAUTH_SECRET is missing"**
   - Make sure `.env.local` exists and has NEXTAUTH_SECRET

3. **"Port already in use"**
   - Make sure you stopped the previous server (`Ctrl+C`)
   - Try killing the process: `lsof -ti:3001 | xargs kill -9`

4. **"Module not found"**
   - Run: `npm install`
   - Then restart: `npm run dev`

### Verify Everything

- ✅ `.env.local` is in the project root (same folder as `package.json`)
- ✅ File name is exactly `.env.local` (with the dot)
- ✅ NEXTAUTH_URL=http://localhost:3001
- ✅ Server restarted after editing `.env.local`
- ✅ Browser opened to `http://localhost:3001`

---

## Need Help?

If it's still not working, check the terminal output and look for:
- Red error messages
- What URL it says it's running on
- Any "Cannot find module" or "Error" messages

Share those errors and I can help fix them!


