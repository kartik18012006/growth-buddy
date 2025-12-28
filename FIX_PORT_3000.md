# Fix: Port 3000 Already in Use Error

## Problem
You're seeing this error:
```
Error: listen EPERM: operation not permitted 0.0.0.0:3000
```

This means port 3000 is either:
- Already being used by another process
- Blocked by system permissions
- Another Next.js dev server is already running

## Solution Options

### Option 1: Use Port 3001 (Quickest Fix) ✅

I've updated your `package.json` to use port 3001 by default. Just run:

```bash
npm run dev
```

Then open: **http://localhost:3001**

If you want to use port 3000, use:
```bash
npm run dev:3000
```

### Option 2: Kill Process Using Port 3000

If you want to free up port 3000, find and kill the process:

**On macOS/Linux:**
```bash
# Find the process using port 3000
lsof -ti:3000

# Kill it (replace PID with the number from above)
kill -9 <PID>

# Or kill directly:
lsof -ti:3000 | xargs kill -9
```

**On Windows:**
```bash
# Find the process
netstat -ano | findstr :3000

# Kill it (replace PID with the number from the last column)
taskkill /PID <PID> /F
```

### Option 3: Check for Running Next.js Processes

Look for any running Node.js/Next.js processes:

**On macOS/Linux:**
```bash
ps aux | grep next
ps aux | grep node
```

Kill any that are running on port 3000.

## Update Your Browser Bookmark

If you switched to port 3001, remember to use:
- **http://localhost:3001** instead of http://localhost:3000

## Update Environment Variable (Optional)

If you change the port permanently, you might want to update `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3001
```

But for development, Next.js is flexible, so this is optional.

---

## Quick Fix Summary

**Just run:**
```bash
npm run dev
```

**And open:**
```
http://localhost:3001
```

You're all set! 🚀


