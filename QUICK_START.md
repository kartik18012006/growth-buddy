# ⚡ Quick Start - Fix Connection Issue

## The Problem

You're seeing `ERR_CONNECTION_REFUSED` because **the server is not running**.

## The Solution (30 seconds)

1. **Open Terminal** (in VS Code: Terminal → New Terminal)

2. **Run this command:**
   ```bash
   npm run dev
   ```

3. **Wait for this message:**
   ```
   ✓ Ready on http://localhost:3002
   ```

4. **Open your browser to:**
   ```
   http://localhost:3002
   ```

**That's it!** The website should now work.

---

## 📝 Full Steps

```bash
# 1. Navigate to project (if not already there)
cd "/Users/kartikkumar/Documents/Growth Buddy"

# 2. Update .env.local to use port 3002 (if needed)
node update-port.js

# 3. Start the development server
npm run dev

# 4. Open browser to http://localhost:3002
```

---

## ⚠️ Keep Terminal Open

- The server runs in the terminal
- Don't close the terminal window
- Press `Ctrl+C` to stop the server when done

---

## 🎯 After Server Starts

You should see:
- ✅ Growth Buddy landing page
- ✅ "Continue with Google" button
- ✅ All features working

---

**Just run `npm run dev` - that's all you need!** 🚀


