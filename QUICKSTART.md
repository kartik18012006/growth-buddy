# Quick Start Guide

Get Growth Buddy up and running in minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in your values:

   **MongoDB URI:**
   - Local: `mongodb://localhost:27017/growth-buddy`
   - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/growth-buddy`

   **NextAuth Secret:**
   Generate a random secret:
   ```bash
   openssl rand -base64 32
   ```

   **Google OAuth Credentials:**
   - Go to https://console.cloud.google.com/
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret

## Step 3: Start MongoDB

**If using local MongoDB:**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Or run directly
mongod
```

**If using MongoDB Atlas:**
- No local setup needed, just use your connection string

## Step 4: Run the Application

```bash
npm run dev
```

## Step 5: Open in Browser

Navigate to: http://localhost:3000

## Step 6: Sign In

Click "Continue with Google" and sign in with your Google account.

That's it! You're ready to start tracking your habits and tasks.

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running (if local)
- Check your MONGODB_URI in `.env.local`
- Verify MongoDB Atlas network access settings (if using Atlas)

### Google OAuth Error
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in `.env.local`
- Check that redirect URI matches exactly: `http://localhost:3000/api/auth/callback/google`
- Make sure Google+ API is enabled in Google Cloud Console

### NextAuth Error
- Verify NEXTAUTH_SECRET is set in `.env.local`
- Make sure NEXTAUTH_URL matches your current URL (http://localhost:3000 for dev)

## Next Steps

- Create your first habit
- Add some tasks for today
- Log your sleep hours
- Check out the analytics dashboard

Happy tracking! 🚀



