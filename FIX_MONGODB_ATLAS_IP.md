# Fix MongoDB Atlas IP Whitelist for Vercel

## Problem
You're getting this error when creating tasks/habits:
```
Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

## Why This Happens
Vercel serverless functions use **dynamic IP addresses** that change on every request. You can't whitelist a single IP address.

## Solution: Allow All IPs (0.0.0.0/0)

### Step 1: Go to MongoDB Atlas
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster
3. Click **"Network Access"** in the left sidebar

### Step 2: Add IP Address
1. Click **"ADD IP ADDRESS"** button
2. Click **"ALLOW ACCESS FROM ANYWHERE"** button (or manually enter `0.0.0.0/0`)
3. Add a comment: `Vercel Serverless Functions`
4. Click **"CONFIRM"**

### Step 3: Wait 1-2 Minutes
MongoDB Atlas takes 1-2 minutes to apply the changes.

### Step 4: Test Your App
Go back to your Vercel app and try creating a task or habit again. It should work now!

## Security Note
✅ **This is SAFE for Vercel deployments** because:
- Your MongoDB connection is protected by username/password (in MONGODB_URI)
- Vercel serverless functions are secure
- This is the recommended approach for serverless applications

## Alternative (More Secure but Complex)
If you want to be extra secure, you can:
1. Use MongoDB Atlas VPC Peering with Vercel (requires Pro plan)
2. Or use MongoDB Atlas Private Endpoint (requires specific Vercel setup)

For most use cases, **0.0.0.0/0 is perfectly fine** and is what MongoDB recommends for serverless.

---

**After making this change, your app should work immediately!**

