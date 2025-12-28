# Google Calendar API Integration - Complete Setup Guide

## 📋 Overview

This guide will help you integrate Google Calendar API into Growth Buddy to sync tasks with Google Calendar events.

---

## 🔑 Step 1: Enable Google Calendar API

### 1.1 Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project (or create a new one)

### 1.2 Enable Google Calendar API

1. Navigate to: **APIs & Services** → **Library**
2. Search for: **"Google Calendar API"**
3. Click on it and press **"Enable"**

### 1.3 Verify OAuth Consent Screen

1. Go to: **APIs & Services** → **OAuth consent screen**
2. Make sure it's configured (you already did this for NextAuth)
3. Verify these scopes are added:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`

---

## 🔐 Step 2: Update OAuth Scopes

### 2.1 Update NextAuth Configuration

The Google OAuth provider needs to request Calendar scopes. Update your NextAuth config:

**File:** `app/api/auth/[...nextauth]/route.ts`

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
    },
  },
}),
```

---

## 📦 Step 3: Install Dependencies

```bash
npm install googleapis
```

---

## 🛠️ Step 4: Environment Variables

Your `.env.local` should already have:
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=http://localhost:3002
```

**No additional environment variables needed!**

---

## 🔄 Step 5: Re-authenticate Users

**Important:** Existing users need to re-authenticate to get Calendar scopes.

1. Users must sign out
2. Sign in again with Google
3. They'll be prompted to grant Calendar permissions
4. New tokens will be saved with Calendar access

---

## 📡 Step 6: API Endpoints Available

### Sync Task to Calendar

**POST** `/api/calendar/sync`

```json
{
  "taskId": "task_id_here",
  "syncAction": "create" // or "update" or "delete"
}
```

### Fetch Calendar Events

**GET** `/api/calendar/events?startDate=2024-01-01&endDate=2024-01-31`

### Get User Timezone

**GET** `/api/calendar/timezone`

---

## 🔄 Step 7: Auto-Sync Configuration

Tasks are automatically synced to calendar when:

1. **Creating a task** with `syncToCalendar: true` in the request body
2. **Updating a task** that already has a `calendarEventId`
3. **Deleting a task** that has a `calendarEventId`

---

## 🧪 Step 8: Testing

### Test Calendar Sync

```bash
# 1. Create a task
curl -X POST "http://localhost:3002/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "title": "Test Calendar Task",
    "date": "2024-01-15",
    "syncToCalendar": true
  }'

# 2. Sync existing task to calendar
curl -X POST "http://localhost:3002/api/calendar/sync" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "taskId": "YOUR_TASK_ID",
    "syncAction": "create"
  }'

# 3. Fetch calendar events
curl -X GET "http://localhost:3002/api/calendar/events?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# 4. Get timezone
curl -X GET "http://localhost:3002/api/calendar/timezone" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

---

## 🔒 Step 9: Token Refresh

The system automatically refreshes expired tokens:

- Tokens are checked before each API call
- If expired (or expiring within 5 minutes), they're refreshed
- New tokens are saved to the database
- No user action required

---

## 🚫 Duplicate Detection

The system prevents duplicate calendar events:

- Before creating an event, it searches for events with the same title on the same day
- If found, it links to the existing event instead of creating a duplicate
- This prevents multiple calendar events for the same task

---

## 🌍 Timezone Handling

- User timezone is fetched from Google Calendar settings
- All events are created in the user's timezone
- Timezone is stored in the User model for future use
- Events respect timezone when displaying times

---

## ⚠️ Important Notes

1. **Re-authentication Required**: Existing users must sign in again to get Calendar scopes
2. **Token Storage**: Access tokens and refresh tokens are stored securely (marked as `select: false`)
3. **Auto-Refresh**: Tokens are automatically refreshed when needed
4. **Error Handling**: Calendar sync errors don't prevent task creation/updates
5. **Duplicate Prevention**: System checks for duplicates before creating events

---

## 🔍 Troubleshooting

### Error: "Google Calendar not connected"

**Solution:** User needs to re-authenticate with Google to get Calendar scopes.

### Error: "Failed to refresh token"

**Solution:** 
- Check that refresh token is stored correctly
- User may need to re-authenticate
- Verify OAuth client credentials

### Events not appearing in calendar

**Solution:**
- Check task has `calendarEventId` set
- Verify user has granted Calendar permissions
- Check Google Calendar API is enabled
- Look at server logs for errors

### Timezone issues

**Solution:**
- System fetches timezone from Google Calendar
- Can also set `user.timezone` manually
- Events use the user's timezone

---

## 📚 Code Structure

```
lib/
  └── google-calendar.ts          # Calendar API service

app/api/calendar/
  ├── sync/route.ts               # Sync task to calendar
  ├── events/route.ts             # Fetch calendar events
  └── timezone/route.ts           # Get user timezone

app/api/tasks/
  └── [id]/route.ts               # Auto-sync on task updates/deletes
```

---

## ✅ Checklist

- [ ] Google Calendar API enabled in Google Cloud Console
- [ ] OAuth scopes added (calendar, calendar.events)
- [ ] NextAuth config updated with Calendar scopes
- [ ] `googleapis` package installed
- [ ] User re-authenticated (to get new scopes)
- [ ] Test calendar sync
- [ ] Verify events appear in Google Calendar
- [ ] Test timezone handling

---

## 🎯 Next Steps

1. Update NextAuth config with Calendar scopes
2. Re-authenticate users
3. Test creating a task with `syncToCalendar: true`
4. Verify event appears in Google Calendar
5. Test updating/deleting tasks and verify calendar sync

---

**The Google Calendar integration is ready to use!** 🎉


