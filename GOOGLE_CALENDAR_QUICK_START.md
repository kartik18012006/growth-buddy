# Google Calendar Integration - Quick Start

## ⚡ 5-Minute Setup

### Step 1: Enable Google Calendar API

1. Go to: https://console.cloud.google.com/apis/library
2. Search: "Google Calendar API"
3. Click "Enable"

### Step 2: Update NextAuth Scopes

Edit `app/api/auth/[...nextauth]/route.ts`:

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

### Step 3: Install Package

```bash
npm install googleapis
```

### Step 4: Re-authenticate

Users need to sign out and sign in again to get Calendar permissions.

### Step 5: Test

```bash
# Create task with calendar sync
POST /api/tasks
{
  "title": "My Task",
  "date": "2024-01-15",
  "syncToCalendar": true
}
```

**That's it!** Tasks will sync to Google Calendar.

---

See `GOOGLE_CALENDAR_SETUP.md` for detailed instructions.


