# 🚀 How to Start the Development Server

## Quick Fix

The "Connection Refused" error means **the server is not running**. 

### Step 1: Open Terminal

Open a terminal window (or use VS Code's integrated terminal).

### Step 2: Navigate to Project

```bash
cd "/Users/kartikkumar/Documents/Growth Buddy"
```

### Step 3: Start the Server

```bash
npm run dev
```

### Step 4: Wait for Server to Start

You should see output like:
```
✓ Ready on http://localhost:3002
```

### Step 5: Open Browser

Open your browser and go to:
```
http://localhost:3002
```

**Note:** Port changed from 3001 to 3002 to avoid conflicts.

---

## ⚠️ Important

- **Keep the terminal open** - the server runs in the terminal
- **Don't close the terminal** - closing it stops the server
- **Look for errors** - if you see red errors, the server didn't start properly

---

## 🔧 If You See Errors

### Error: Port Already in Use

**Solution:** Use a different port or kill the process:
```bash
# Kill process on port 3002
lsof -ti:3002 | xargs kill -9

# Or use port 3000
npm run dev:3000
```

### Error: Module Not Found

**Solution:** Install dependencies:
```bash
npm install
```

### Error: MongoDB Connection Error

**Solution:** Check your `.env.local` file has correct `MONGODB_URI`

---

## ✅ Success Indicators

When the server starts successfully, you'll see:
- ✅ `✓ Ready on http://localhost:3002`
- ✅ No red error messages
- ✅ Terminal shows "compiled successfully"

Then you can open `http://localhost:3002` in your browser!

---

**Just run `npm run dev` and the website will work!** 🎉


