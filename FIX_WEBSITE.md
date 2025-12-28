# Fix: Website Not Opening - Complete Solution

## 🔧 What You Need to Do

### 1. Update `.env.local` File

**Open `.env.local` in VS Code** and update `NEXTAUTH_URL` from port 3000 to 3001.

**Change this line:**
```env
NEXTAUTH_URL=http://localhost:3000
```

**To this:**
```env
NEXTAUTH_URL=http://localhost:3001
```

### 2. Complete `.env.local` Content

Your complete `.env.local` file should contain:

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

**Important Formatting:**
- ❌ NO quotes around values
- ❌ NO spaces around `=`
- ✅ One variable per line
- ✅ Save the file (`Cmd+S` or `Ctrl+S`)

### 3. Restart Development Server

**CRITICAL:** You MUST restart the server after changing `.env.local`:

1. **Stop the server:**
   - Find the terminal where `npm run dev` is running
   - Press `Ctrl+C`
   - Wait until it stops completely

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Check the output:**
   - You should see: `✓ Ready on http://localhost:3001`
   - If you see port 3000, the restart didn't work properly

### 4. Open the Correct URL

Open your browser and navigate to:
```
http://localhost:3001
```

**Important:** Use port **3001**, NOT 3000!

---

## 🚨 Common Issues and Solutions

### Issue 1: Server Still Shows Port 3000

**Problem:** Terminal shows `Ready on http://localhost:3000` instead of 3001

**Solution:**
1. Make sure you stopped the server completely (`Ctrl+C`)
2. Check your `package.json` - it should have: `"dev": "next dev -p 3001"`
3. If not, the port change didn't save - check the file again

### Issue 2: "Page Not Found" or Blank Page

**Possible Causes:**
- Wrong URL (using 3000 instead of 3001)
- Server not running
- Browser cache

**Solution:**
1. Verify server is running: Check terminal for `Ready on http://localhost:3001`
2. Use the correct URL: `http://localhost:3001`
3. Try incognito/private window
4. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### Issue 3: MongoDB Connection Error

**Problem:** Terminal shows MongoDB connection errors

**Solution:**
1. Check your internet connection
2. Verify MongoDB Atlas allows your IP address:
   - Go to MongoDB Atlas → Network Access
   - Add your current IP address (or use `0.0.0.0/0` for development)
3. Verify the MONGODB_URI in `.env.local` is correct

### Issue 4: Google OAuth Error

**Problem:** Google sign-in doesn't work

**Solution:**
1. Update Google Cloud Console:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click your OAuth 2.0 Client ID
   - Under "Authorized redirect URIs", add:
     ```
     http://localhost:3001/api/auth/callback/google
     ```
   - Click "Save"

### Issue 5: Environment Variables Not Loading

**Problem:** Errors about missing environment variables

**Solution:**
1. Verify `.env.local` is in the project root (same folder as `package.json`)
2. Check file name is exactly `.env.local` (with the dot!)
3. Make sure file is saved
4. Restart the server (`Ctrl+C` then `npm run dev`)

---

## ✅ Verification Checklist

Before you give up, verify:

- [ ] `.env.local` file exists in project root
- [ ] File name is exactly `.env.local` (not `.env.local.txt`)
- [ ] `NEXTAUTH_URL=http://localhost:3001` (port 3001, not 3000)
- [ ] All 5 environment variables are present
- [ ] No quotes around values
- [ ] No spaces around `=` signs
- [ ] File is saved (no dot on file tab in VS Code)
- [ ] Server was restarted after editing `.env.local`
- [ ] Terminal shows: `Ready on http://localhost:3001`
- [ ] Browser opened to `http://localhost:3001`

---

## 📋 Quick Command Reference

```bash
# Stop the server
Ctrl+C

# Start the server (on port 3001)
npm run dev

# Check if port 3001 is in use (if you get port errors)
lsof -ti:3001

# Kill process on port 3001 (if needed)
lsof -ti:3001 | xargs kill -9
```

---

## 🎯 Expected Result

After following these steps:

1. ✅ Terminal shows: `✓ Ready on http://localhost:3001`
2. ✅ Browser opens to the Growth Buddy landing page
3. ✅ "Continue with Google" button is visible
4. ✅ No errors in the terminal
5. ✅ Page loads correctly

---

## Still Not Working?

If you've followed all steps and it's still not working:

1. **Check the terminal output:**
   - Look for red error messages
   - Copy the full error message

2. **Check browser console:**
   - Press `F12` to open developer tools
   - Look at the "Console" tab for errors

3. **Verify file locations:**
   - `.env.local` should be in: `/Users/kartikkumar/Documents/Growth Buddy/.env.local`
   - `package.json` should be in: `/Users/kartikkumar/Documents/Growth Buddy/package.json`

Share any error messages you see, and I'll help you fix them!


