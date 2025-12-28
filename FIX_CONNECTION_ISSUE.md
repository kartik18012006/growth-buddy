# Fix: Connection Refused Error

## 🚨 Problem

You're seeing `ERR_CONNECTION_REFUSED` on `localhost:3001`.

This means the development server is not running or the port is blocked.

## ✅ Solution

### Option 1: Start the Development Server

**In your terminal, run:**

```bash
cd "/Users/kartikkumar/Documents/Growth Buddy"
npm run dev
```

**Wait for this message:**
```
✓ Ready on http://localhost:3002
```

**Then open:** `http://localhost:3002`

### Option 2: If Port is Already in Use

If you get an error about port being in use, try:

1. **Kill the process using the port:**
   ```bash
   lsof -ti:3002 | xargs kill -9
   ```

2. **Or use a different port:**
   ```bash
   npm run dev:3000  # Uses port 3000
   ```

### Option 3: Check if Server is Running

Look at your terminal - you should see:
- `npm run dev` command running
- Output showing "Ready on http://localhost:XXXX"
- No error messages

If the terminal shows errors, share them and I can help fix them.

---

## 🔧 Quick Steps

1. **Open terminal** (or VS Code integrated terminal)
2. **Navigate to project:**
   ```bash
   cd "/Users/kartikkumar/Documents/Growth Buddy"
   ```
3. **Start the server:**
   ```bash
   npm run dev
   ```
4. **Wait for:** `✓ Ready on http://localhost:3002`
5. **Open browser:** `http://localhost:3002`

---

## ⚠️ Important Notes

- The server must be running in the terminal for the website to work
- Don't close the terminal while using the website
- If you see errors in terminal, the server didn't start properly
- Port 3002 is now the default (changed from 3001 to avoid conflicts)

---

## 🎯 After Starting Server

Once you see `Ready on http://localhost:3002`, you should be able to:
- Open the website in your browser
- See the Growth Buddy landing page
- Sign in with Google

---

**Just run `npm run dev` in your terminal and the website will work!** 🚀


