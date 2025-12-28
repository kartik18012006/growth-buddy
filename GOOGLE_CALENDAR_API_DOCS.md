# Google Calendar API Documentation

Complete API documentation for Google Calendar integration in Growth Buddy.

**Base URL:** `http://localhost:3002/api/calendar`

**Authentication:** All endpoints require NextAuth session (Google OAuth with Calendar scopes)

---

## 📋 API Endpoints

### 1. Sync Task to Calendar

**POST** `/api/calendar/sync`

Sync a task to Google Calendar (create, update, or delete calendar event).

**Request Body:**
```json
{
  "taskId": "65a1b2c3d4e5f6a7b8c9d0e1",
  "syncAction": "create" // "create" | "update" | "delete"
}
```

**Response:** `200 OK`

```json
{
  "message": "Calendar event created",
  "eventId": "abc123xyz",
  "event": {
    "id": "abc123xyz",
    "summary": "Complete project proposal",
    "start": {
      "dateTime": "2024-01-15T09:00:00Z",
      "timeZone": "America/New_York"
    },
    "end": {
      "dateTime": "2024-01-15T10:00:00Z",
      "timeZone": "America/New_York"
    }
  },
  "task": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "calendarEventId": "abc123xyz",
    ...
  },
  "timeZone": "America/New_York"
}
```

**Sample Request:**
```bash
curl -X POST "http://localhost:3002/api/calendar/sync" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "taskId": "65a1b2c3d4e5f6a7b8c9d0e1",
    "syncAction": "create"
  }'
```

**Features:**
- ✅ Duplicate detection (checks for existing events before creating)
- ✅ Automatic timezone handling
- ✅ Creates all-day events if no time specified
- ✅ Updates existing events if `calendarEventId` exists
- ✅ Deletes calendar events when syncAction is "delete"

---

### 2. Fetch Calendar Events

**GET** `/api/calendar/events`

Fetch events from Google Calendar for a date range.

**Query Parameters:**
- `startDate` (optional): Start date in ISO format. Defaults to today.
- `endDate` (optional): End date in ISO format. Defaults to 30 days from now.
- `calendarId` (optional): Calendar ID. Defaults to "primary".

**Response:** `200 OK`

```json
{
  "events": [
    {
      "id": "abc123xyz",
      "title": "Meeting with Team",
      "description": "Weekly sync meeting",
      "start": "2024-01-15T09:00:00Z",
      "end": "2024-01-15T10:00:00Z",
      "timeZone": "America/New_York",
      "location": "Conference Room A",
      "htmlLink": "https://calendar.google.com/calendar/event?eid=...",
      "status": "confirmed"
    }
  ],
  "timeZone": "America/New_York",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.999Z"
}
```

**Sample Request:**
```bash
curl -X GET "http://localhost:3002/api/calendar/events?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

---

### 3. Get User Timezone

**GET** `/api/calendar/timezone`

Get the user's timezone from Google Calendar settings.

**Response:** `200 OK`

```json
{
  "timeZone": "America/New_York",
  "updated": true
}
```

**Sample Request:**
```bash
curl -X GET "http://localhost:3002/api/calendar/timezone" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

---

## 🔄 Auto-Sync Features

### Automatic Calendar Sync

Tasks are automatically synced to calendar when:

1. **Creating a task** with `syncToCalendar: true`:
   ```json
   POST /api/tasks
   {
     "title": "My Task",
     "date": "2024-01-15",
     "syncToCalendar": true
   }
   ```

2. **Updating a task** that already has a `calendarEventId`:
   - Task update automatically updates the calendar event
   - No additional API call needed

3. **Deleting a task** that has a `calendarEventId`:
   - Calendar event is automatically deleted
   - No additional API call needed

---

## 🔒 Security Features

### Token Refresh

- Tokens are automatically refreshed when expired or expiring soon (5-minute buffer)
- New tokens are saved to the database
- No user action required
- Handles token refresh errors gracefully

### Duplicate Prevention

- Before creating a calendar event, the system searches for existing events
- Searches by title and date
- If duplicate found, links to existing event instead of creating new one
- Prevents calendar clutter

---

## 🌍 Timezone Handling

1. **Fetches timezone** from Google Calendar settings
2. **Stores timezone** in User model for future use
3. **Creates events** in user's timezone
4. **All-day events** use date format (no time component)
5. **Timed events** use dateTime format with timezone

---

## 📝 Task Creation with Calendar Sync

### Example: Create Task and Sync to Calendar

```typescript
// Frontend code
const createTaskWithCalendar = async () => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Team Meeting',
      description: 'Weekly sync meeting',
      date: '2024-01-15',
      dueTime: '2024-01-15T10:00:00Z',
      priority: 'high',
      syncToCalendar: true, // This triggers calendar sync
    }),
  });
  
  const task = await response.json();
  console.log('Task created with calendar event:', task.calendarEventId);
};
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "error": "Google Calendar not connected"
}
```

**Solution:** User needs to re-authenticate with Google to get Calendar scopes.

### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

**Solution:** User must be signed in.

### 404 Not Found

```json
{
  "error": "Task not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to sync to calendar: [error message]"
}
```

---

## 🔄 Token Refresh Flow

```
1. User makes API request
   ↓
2. System checks if token is expired/expiring
   ↓
3. If yes, refresh token using refresh_token
   ↓
4. Save new tokens to database
   ↓
5. Continue with original request
```

---

## 🧪 Testing Examples

### Test Complete Flow

```bash
# 1. Create task with calendar sync
curl -X POST "http://localhost:3002/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "title": "Test Calendar Task",
    "date": "2024-01-15",
    "dueTime": "2024-01-15T14:00:00Z",
    "syncToCalendar": true
  }'

# 2. Verify event was created (check response for calendarEventId)

# 3. Update task (calendar event auto-updates)
curl -X PATCH "http://localhost:3002/api/tasks/TASK_ID" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "title": "Updated Task Title"
  }'

# 4. Fetch calendar events
curl -X GET "http://localhost:3002/api/calendar/events?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# 5. Delete task (calendar event auto-deletes)
curl -X DELETE "http://localhost:3002/api/tasks/TASK_ID" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

---

## 📚 Implementation Details

### Event Creation Logic

- **All-day events**: Used when task has no `dueTime`
- **Timed events**: Used when task has `dueTime`
- **Timezone**: Fetched from Google Calendar or uses user's stored timezone
- **Duplicate check**: Runs before creating new event

### Event Update Logic

- Only updates if task has `calendarEventId`
- Preserves existing event properties
- Updates title, description, start/end times
- Maintains timezone

### Event Deletion Logic

- Deletes calendar event when task is deleted
- Handles 404 errors (event already deleted)
- Clears `calendarEventId` from task

---

## ⚠️ Important Notes

1. **Re-authentication Required**: Users must sign out and sign in again to get Calendar scopes
2. **Token Storage**: Tokens are stored securely (marked as `select: false` in schema)
3. **Error Handling**: Calendar sync errors don't prevent task operations
4. **Duplicate Prevention**: System checks for duplicates before creating events
5. **Timezone**: Automatically fetched and stored from Google Calendar

---

## 🎯 Best Practices

1. **Always check for calendar connection** before syncing
2. **Handle errors gracefully** - don't block task operations
3. **Use duplicate detection** to prevent calendar clutter
4. **Respect user timezone** - always use user's timezone for events
5. **Update lastSyncedAt** to track sync activity

---

**Google Calendar integration is complete and ready to use!** 🎉


