# Growth Buddy REST API Documentation

Complete API documentation for Growth Buddy with request/response examples.

**Base URL:** `http://localhost:3001/api`

**Authentication:** All endpoints require NextAuth session (Google OAuth)

---

## 📋 Table of Contents

1. [Tasks (Todos) APIs](#tasks-todos-apis)
2. [Habits APIs](#habits-apis)
3. [Habit Statistics APIs](#habit-statistics-apis)
4. [Sleep Tracking APIs](#sleep-tracking-apis)

---

## 📝 Tasks (Todos) APIs

### 1. Get Tasks

**GET** `/api/tasks`

Get tasks for a specific date (defaults to today).

**Query Parameters:**
- `date` (optional): Date in ISO format (e.g., `2024-01-15`). Defaults to today.

**Response:** `200 OK`

```json
[
  {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
    "title": "Complete project proposal",
    "description": "Write and submit the Q4 project proposal",
    "date": "2024-01-15T00:00:00.000Z",
    "priority": "high",
    "completed": false,
    "completedAt": null,
    "dueTime": "2024-01-15T17:00:00.000Z",
    "category": "work",
    "order": 0,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  }
]
```

**Sample Request:**
```bash
curl -X GET "http://localhost:3001/api/tasks?date=2024-01-15" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

### 2. Create Task

**POST** `/api/tasks`

Create a new task/todo.

**Request Body:**
```json
{
  "title": "Complete project proposal",
  "description": "Write and submit the Q4 project proposal",
  "date": "2024-01-15",
  "priority": "high",
  "dueTime": "2024-01-15T17:00:00.000Z",
  "category": "work"
}
```

**Required Fields:**
- `title` (string): Task title

**Optional Fields:**
- `description` (string): Task description
- `date` (string): Date in ISO format. Defaults to today.
- `priority` (string): `"high"`, `"medium"`, or `"low"`. Defaults to `"medium"`.
- `dueTime` (string): Due date/time in ISO format
- `category` (string): Task category

**Response:** `201 Created`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
  "title": "Complete project proposal",
  "description": "Write and submit the Q4 project proposal",
  "date": "2024-01-15T00:00:00.000Z",
  "priority": "high",
  "completed": false,
  "completedAt": null,
  "dueTime": "2024-01-15T17:00:00.000Z",
  "category": "work",
  "order": 0,
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T08:00:00.000Z"
}
```

**Sample Request:**
```bash
curl -X POST "http://localhost:3001/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "title": "Complete project proposal",
    "description": "Write and submit the Q4 project proposal",
    "date": "2024-01-15",
    "priority": "high",
    "category": "work"
  }'
```

---

### 3. Get Task by ID

**GET** `/api/tasks/[id]`

Get a specific task by ID.

**Response:** `200 OK`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
  "title": "Complete project proposal",
  "description": "Write and submit the Q4 project proposal",
  "date": "2024-01-15T00:00:00.000Z",
  "priority": "high",
  "completed": false,
  "completedAt": null,
  "dueTime": "2024-01-15T17:00:00.000Z",
  "category": "work",
  "order": 0,
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T08:00:00.000Z"
}
```

**Error Response:** `404 Not Found`

```json
{
  "error": "Task not found"
}
```

**Sample Request:**
```bash
curl -X GET "http://localhost:3001/api/tasks/65a1b2c3d4e5f6a7b8c9d0e1" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

### 4. Update Task

**PATCH** `/api/tasks/[id]`

Update a task (partial update supported).

**Request Body:**
```json
{
  "title": "Updated task title",
  "priority": "low",
  "description": "Updated description"
}
```

**Optional Fields (all optional, only include fields to update):**
- `title` (string)
- `description` (string)
- `date` (string)
- `priority` (string): `"high"`, `"medium"`, or `"low"`
- `dueTime` (string)
- `category` (string)
- `completed` (boolean)

**Response:** `200 OK`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
  "title": "Updated task title",
  "description": "Updated description",
  "date": "2024-01-15T00:00:00.000Z",
  "priority": "low",
  "completed": false,
  "completedAt": null,
  "dueTime": "2024-01-15T17:00:00.000Z",
  "category": "work",
  "order": 0,
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T09:00:00.000Z"
}
```

**Sample Request:**
```bash
curl -X PATCH "http://localhost:3001/api/tasks/65a1b2c3d4e5f6a7b8c9d0e1" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "title": "Updated task title",
    "priority": "low"
  }'
```

---

### 5. Mark Task as Completed

**PATCH** `/api/tasks/[id]/complete`

Mark a task as completed or uncompleted.

**Request Body:**
```json
{
  "completed": true
}
```

**Required Fields:**
- `completed` (boolean): `true` to mark as completed, `false` to uncomplete

**Response:** `200 OK`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
  "title": "Complete project proposal",
  "description": "Write and submit the Q4 project proposal",
  "date": "2024-01-15T00:00:00.000Z",
  "priority": "high",
  "completed": true,
  "completedAt": "2024-01-15T10:30:00.000Z",
  "dueTime": "2024-01-15T17:00:00.000Z",
  "category": "work",
  "order": 0,
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Sample Request:**
```bash
curl -X PATCH "http://localhost:3001/api/tasks/65a1b2c3d4e5f6a7b8c9d0e1/complete" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "completed": true
  }'
```

---

### 6. Delete Task

**DELETE** `/api/tasks/[id]`

Delete a task.

**Response:** `200 OK`

```json
{
  "message": "Task deleted"
}
```

**Error Response:** `404 Not Found`

```json
{
  "error": "Task not found"
}
```

**Sample Request:**
```bash
curl -X DELETE "http://localhost:3001/api/tasks/65a1b2c3d4e5f6a7b8c9d0e1" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

## 🎯 Habits APIs

### 1. Get Habits

**GET** `/api/habits`

Get all habits for the current user.

**Query Parameters:**
- `includeArchived` (optional): `"true"` to include archived habits. Defaults to `false`.

**Response:** `200 OK`

```json
[
  {
    "_id": "65a1b2c3d4e5f6a7b8c9d0f1",
    "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
    "name": "Morning Meditation",
    "description": "10 minutes of meditation every morning",
    "category": "wellness",
    "frequency": "daily",
    "reminderTime": null,
    "color": "#8B5CF6",
    "icon": "meditation",
    "archived": false,
    "archivedAt": null,
    "order": 0,
    "todayCompleted": false,
    "completionId": null,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z"
  }
]
```

**Sample Request:**
```bash
curl -X GET "http://localhost:3001/api/habits?includeArchived=false" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

### 2. Create Habit

**POST** `/api/habits`

Create a new habit.

**Request Body:**
```json
{
  "name": "Morning Meditation",
  "description": "10 minutes of meditation every morning",
  "category": "wellness",
  "frequency": "daily",
  "reminderTime": "2024-01-15T07:00:00.000Z",
  "color": "#8B5CF6",
  "icon": "meditation"
}
```

**Required Fields:**
- `name` (string): Habit name

**Optional Fields:**
- `description` (string): Habit description
- `category` (string): Habit category
- `frequency` (string): `"daily"`, `"weekly"`, or `"custom"`. Defaults to `"daily"`.
- `reminderTime` (string): Reminder time in ISO format
- `color` (string): Hex color code. Defaults to `"#3B82F6"`.
- `icon` (string): Icon identifier. Defaults to `"default"`.

**Response:** `201 Created`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0f1",
  "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
  "name": "Morning Meditation",
  "description": "10 minutes of meditation every morning",
  "category": "wellness",
  "frequency": "daily",
  "reminderTime": "2024-01-15T07:00:00.000Z",
  "color": "#8B5CF6",
  "icon": "meditation",
  "archived": false,
  "archivedAt": null,
  "order": 0,
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T08:00:00.000Z"
}
```

**Sample Request:**
```bash
curl -X POST "http://localhost:3001/api/habits" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "name": "Morning Meditation",
    "description": "10 minutes of meditation every morning",
    "category": "wellness",
    "frequency": "daily",
    "color": "#8B5CF6"
  }'
```

---

### 3. Mark Habit Done for Specific Date

**POST** `/api/habits/complete`

Mark a habit as completed or not completed for a specific date.

**Request Body:**
```json
{
  "habitId": "65a1b2c3d4e5f6a7b8c9d0f1",
  "date": "2024-01-15",
  "completed": true,
  "notes": "Felt great after meditation!"
}
```

**Required Fields:**
- `habitId` (string): Habit ID

**Optional Fields:**
- `date` (string): Date in ISO format (YYYY-MM-DD). Defaults to today.
- `completed` (boolean): `true` to mark as completed, `false` to mark as not completed. Defaults to `true`.
- `notes` (string): Optional notes about the completion

**Response:** `200 OK`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0f2",
  "habitId": "65a1b2c3d4e5f6a7b8c9d0f1",
  "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
  "date": "2024-01-15T00:00:00.000Z",
  "completed": true,
  "notes": "Felt great after meditation!",
  "completedAt": "2024-01-15T07:15:00.000Z",
  "createdAt": "2024-01-15T07:15:00.000Z",
  "updatedAt": "2024-01-15T07:15:00.000Z"
}
```

**Sample Request:**
```bash
curl -X POST "http://localhost:3001/api/habits/complete" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "habitId": "65a1b2c3d4e5f6a7b8c9d0f1",
    "date": "2024-01-15",
    "completed": true,
    "notes": "Felt great after meditation!"
  }'
```

---

## 📊 Habit Statistics APIs

### Get Habit Completion Statistics

**GET** `/api/habits/stats`

Get habit completion statistics for daily, weekly, or monthly periods.

**Query Parameters:**
- `period` (optional): `"daily"`, `"weekly"`, or `"monthly"`. Defaults to `"daily"`.
- `habitId` (optional): Specific habit ID to get stats for. If not provided, returns stats for all habits.
- `startDate` (optional): Start date in ISO format. Defaults based on period.
- `endDate` (optional): End date in ISO format. Defaults to today.

**Response:** `200 OK`

**Daily Stats (period=daily):**
```json
{
  "period": "daily",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-01-15T23:59:59.999Z",
  "stats": [
    {
      "habitId": "65a1b2c3d4e5f6a7b8c9d0f1",
      "habitName": "Morning Meditation",
      "period": "daily",
      "startDate": "2024-01-15T00:00:00.000Z",
      "endDate": "2024-01-15T23:59:59.999Z",
      "totalDays": 1,
      "completedCount": 1,
      "missedCount": 0,
      "completionRate": 100,
      "currentStreak": 12,
      "completions": [
        {
          "date": "2024-01-15T00:00:00.000Z",
          "completed": true,
          "notes": "Felt great!"
        }
      ]
    }
  ]
}
```

**Weekly Stats (period=weekly):**
```json
{
  "period": "weekly",
  "startDate": "2024-01-08T00:00:00.000Z",
  "endDate": "2024-01-15T23:59:59.999Z",
  "stats": [
    {
      "habitId": "65a1b2c3d4e5f6a7b8c9d0f1",
      "habitName": "Morning Meditation",
      "period": "weekly",
      "startDate": "2024-01-08T00:00:00.000Z",
      "endDate": "2024-01-15T23:59:59.999Z",
      "totalDays": 7,
      "completedCount": 6,
      "missedCount": 1,
      "completionRate": 85.71,
      "currentStreak": 12,
      "completions": [
        {
          "date": "2024-01-15T00:00:00.000Z",
          "completed": true,
          "notes": null
        },
        {
          "date": "2024-01-14T00:00:00.000Z",
          "completed": true,
          "notes": null
        }
      ]
    }
  ]
}
```

**Monthly Stats (period=monthly):**
```json
{
  "period": "monthly",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.999Z",
  "stats": [
    {
      "habitId": "65a1b2c3d4e5f6a7b8c9d0f1",
      "habitName": "Morning Meditation",
      "period": "monthly",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z",
      "totalDays": 31,
      "completedCount": 28,
      "missedCount": 3,
      "completionRate": 90.32,
      "currentStreak": 12,
      "completions": [
        {
          "date": "2024-01-31T00:00:00.000Z",
          "completed": true,
          "notes": null
        }
      ]
    }
  ]
}
```

**Sample Requests:**
```bash
# Daily stats for today
curl -X GET "http://localhost:3001/api/habits/stats?period=daily" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Weekly stats
curl -X GET "http://localhost:3001/api/habits/stats?period=weekly" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Monthly stats
curl -X GET "http://localhost:3001/api/habits/stats?period=monthly" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Stats for specific habit
curl -X GET "http://localhost:3001/api/habits/stats?period=weekly&habitId=65a1b2c3d4e5f6a7b8c9d0f1" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Custom date range
curl -X GET "http://localhost:3001/api/habits/stats?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

## 😴 Sleep Tracking APIs

### 1. Get Sleep Records

**GET** `/api/sleep`

Get sleep records for a specific date or date range.

**Query Parameters:**
- `date` (optional): Single date in ISO format (e.g., `2024-01-15`). Returns record for that date only.
- `days` (optional): Number of days to fetch (e.g., `30`). Defaults to 30. Returns last N days of records.

**Response:** `200 OK`

**Single Date:**
```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0s1",
  "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
  "date": "2024-01-15T00:00:00.000Z",
  "hoursSlept": 7.5,
  "bedtime": "2024-01-14T23:00:00.000Z",
  "wakeTime": "2024-01-15T06:30:00.000Z",
  "qualityRating": 4,
  "notes": "Slept well but woke up once",
  "goalHours": 8,
  "createdAt": "2024-01-15T07:00:00.000Z",
  "updatedAt": "2024-01-15T07:00:00.000Z"
}
```

**Date Range:**
```json
[
  {
    "_id": "65a1b2c3d4e5f6a7b8c9d0s2",
    "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
    "date": "2024-01-15T00:00:00.000Z",
    "hoursSlept": 7.5,
    "qualityRating": 4,
    "goalHours": 8
  },
  {
    "_id": "65a1b2c3d4e5f6a7b8c9d0s1",
    "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
    "date": "2024-01-14T00:00:00.000Z",
    "hoursSlept": 8.0,
    "qualityRating": 5,
    "goalHours": 8
  }
]
```

**Sample Requests:**
```bash
# Get sleep for specific date
curl -X GET "http://localhost:3001/api/sleep?date=2024-01-15" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Get last 7 days
curl -X GET "http://localhost:3001/api/sleep?days=7" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

### 2. Add/Update Sleep Hours

**POST** `/api/sleep`

Add or update sleep hours for a specific date.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "hoursSlept": 7.5,
  "bedtime": "2024-01-14T23:00:00.000Z",
  "wakeTime": "2024-01-15T06:30:00.000Z",
  "qualityRating": 4,
  "notes": "Slept well but woke up once",
  "goalHours": 8
}
```

**Required Fields:**
- `hoursSlept` (number): Hours slept (0-24)

**Optional Fields:**
- `date` (string): Date in ISO format (YYYY-MM-DD). Defaults to today.
- `bedtime` (string): Bedtime in ISO format
- `wakeTime` (string): Wake time in ISO format
- `qualityRating` (number): Sleep quality rating (1-5)
- `notes` (string): Notes about sleep
- `goalHours` (number): Sleep goal in hours (0-24)

**Response:** `201 Created`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0s1",
  "userId": "65a1b2c3d4e5f6a7b8c9d0e0",
  "date": "2024-01-15T00:00:00.000Z",
  "hoursSlept": 7.5,
  "bedtime": "2024-01-14T23:00:00.000Z",
  "wakeTime": "2024-01-15T06:30:00.000Z",
  "qualityRating": 4,
  "notes": "Slept well but woke up once",
  "goalHours": 8,
  "createdAt": "2024-01-15T07:00:00.000Z",
  "updatedAt": "2024-01-15T07:00:00.000Z"
}
```

**Sample Request:**
```bash
curl -X POST "http://localhost:3001/api/sleep" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "date": "2024-01-15",
    "hoursSlept": 7.5,
    "qualityRating": 4,
    "goalHours": 8,
    "notes": "Slept well"
  }'
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "hoursSlept is required"
}
```

or

```json
{
  "error": "hoursSlept must be between 0 and 24"
}
```

---

### 3. Get Sleep Statistics (Chart Data)

**GET** `/api/sleep/stats`

Get sleep statistics formatted for charts (daily, weekly, or monthly periods).

**Query Parameters:**
- `period` (optional): `"daily"`, `"weekly"`, or `"monthly"`. Defaults to `"daily"`.
- `startDate` (optional): Start date in ISO format. Defaults based on period.
- `endDate` (optional): End date in ISO format. Defaults to today.

**Default Periods:**
- `daily`: Last 7 days
- `weekly`: Last 4 weeks (28 days)
- `monthly`: Last 12 months

**Response:** `200 OK`

**Daily Stats (period=daily):**
```json
{
  "period": "daily",
  "startDate": "2024-01-09T00:00:00.000Z",
  "endDate": "2024-01-15T23:59:59.999Z",
  "summary": {
    "totalRecords": 7,
    "averageHours": 7.5,
    "averageQuality": 4.2,
    "goalMetCount": 5,
    "totalDays": 7
  },
  "data": [
    {
      "date": "2024-01-09",
      "hoursSlept": 8.0,
      "qualityRating": 4,
      "goalHours": 8,
      "goalMet": true,
      "bedtime": "2024-01-08T23:00:00.000Z",
      "wakeTime": "2024-01-09T07:00:00.000Z"
    },
    {
      "date": "2024-01-10",
      "hoursSlept": 7.5,
      "qualityRating": 4,
      "goalHours": 8,
      "goalMet": false,
      "bedtime": null,
      "wakeTime": null
    }
  ]
}
```

**Weekly Stats (period=weekly):**
```json
{
  "period": "weekly",
  "startDate": "2023-12-19T00:00:00.000Z",
  "endDate": "2024-01-15T23:59:59.999Z",
  "summary": {
    "totalRecords": 28,
    "averageHours": 7.6,
    "averageQuality": 4.1,
    "goalMetCount": 22,
    "totalDays": 28
  },
  "data": [
    {
      "date": "2023-12-18",
      "hoursSlept": 7.5,
      "qualityRating": 4.1,
      "daysRecorded": 7
    },
    {
      "date": "2023-12-25",
      "hoursSlept": 7.8,
      "qualityRating": 4.3,
      "daysRecorded": 7
    },
    {
      "date": "2024-01-01",
      "hoursSlept": 7.4,
      "qualityRating": 4.0,
      "daysRecorded": 7
    },
    {
      "date": "2024-01-08",
      "hoursSlept": 7.5,
      "qualityRating": 4.2,
      "daysRecorded": 7
    }
  ]
}
```

**Monthly Stats (period=monthly):**
```json
{
  "period": "monthly",
  "startDate": "2023-02-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.999Z",
  "summary": {
    "totalRecords": 180,
    "averageHours": 7.6,
    "averageQuality": 4.1,
    "goalMetCount": 145,
    "totalDays": 365
  },
  "data": [
    {
      "date": "2023-02",
      "hoursSlept": 7.5,
      "qualityRating": 4.0,
      "daysRecorded": 28
    },
    {
      "date": "2023-03",
      "hoursSlept": 7.7,
      "qualityRating": 4.2,
      "daysRecorded": 31
    },
    {
      "date": "2024-01",
      "hoursSlept": 7.6,
      "qualityRating": 4.1,
      "daysRecorded": 15
    }
  ]
}
```

**Sample Requests:**
```bash
# Daily stats (last 7 days)
curl -X GET "http://localhost:3001/api/sleep/stats?period=daily" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Weekly stats (last 4 weeks)
curl -X GET "http://localhost:3001/api/sleep/stats?period=weekly" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Monthly stats (last 12 months)
curl -X GET "http://localhost:3001/api/sleep/stats?period=monthly" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Custom date range
curl -X GET "http://localhost:3001/api/sleep/stats?period=daily&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

**Response Fields Explained:**

- `summary`: Aggregate statistics
  - `totalRecords`: Number of sleep records in the period
  - `averageHours`: Average hours slept
  - `averageQuality`: Average quality rating (if available)
  - `goalMetCount`: Number of days where sleep goal was met
  - `totalDays`: Total days in the period

- `data`: Array of data points formatted for charts
  - `date`: Date or date range identifier
  - `hoursSlept`: Hours slept (or average for weekly/monthly)
  - `qualityRating`: Quality rating (or average for weekly/monthly)
  - `goalHours`: Sleep goal (daily only)
  - `goalMet`: Whether goal was met (daily only)
  - `bedtime`/`wakeTime`: Bedtime and wake time (daily only)
  - `daysRecorded`: Number of days recorded (weekly/monthly only)

---

## ❌ Error Responses

All endpoints may return these error responses:

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 🔐 Authentication

All endpoints require authentication via NextAuth.js session. In browser environments, cookies are automatically handled. For API testing, you need to include the session cookie.

**Getting Session Token:**
1. Sign in via the web interface
2. Open browser developer tools (F12)
3. Go to Application/Storage → Cookies
4. Copy the `next-auth.session-token` value

---

## 📝 Notes

- All dates should be in ISO 8601 format (YYYY-MM-DD or full ISO datetime)
- Dates are normalized to midnight (00:00:00) for consistent querying
- All responses are in JSON format
- The API uses HTTP status codes to indicate success/failure
- All endpoints are scoped to the authenticated user (users can only access their own data)

---

## 🚀 Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get tasks for a date |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/[id]` | Get task by ID |
| PATCH | `/api/tasks/[id]` | Update task |
| PATCH | `/api/tasks/[id]/complete` | Mark task as completed |
| DELETE | `/api/tasks/[id]` | Delete task |
| GET | `/api/habits` | Get all habits |
| POST | `/api/habits` | Create a habit |
| POST | `/api/habits/complete` | Mark habit done for date |
| GET | `/api/habits/stats` | Get habit completion stats |
| GET | `/api/sleep` | Get sleep records |
| POST | `/api/sleep` | Add/update sleep hours |
| GET | `/api/sleep/stats` | Get sleep statistics (chart data) |
| GET | `/api/reminders` | Get all reminders |
| POST | `/api/reminders` | Create reminder |
| GET | `/api/reminders/[id]` | Get reminder by ID |
| PATCH | `/api/reminders/[id]` | Update reminder |
| DELETE | `/api/reminders/[id]` | Delete reminder |

---

**Last Updated:** January 2024

