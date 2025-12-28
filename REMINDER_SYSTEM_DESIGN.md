# Reminder System Architecture - Growth Buddy

## 📋 Overview

This document describes the architecture and implementation of the reminder system for Growth Buddy. The system supports task and habit reminders with daily scheduling, email notifications, and in-app notifications.

---

## 🏗️ Architecture

### System Components

1. **Database Layer**: Reminder model stores reminder configurations
2. **API Layer**: REST APIs to create, update, delete reminders
3. **Scheduler Service**: Background job scheduler (cron-based)
4. **Notification Service**: Email and in-app notification delivery
5. **Reminder Processor**: Logic to determine what reminders to send

### Architecture Diagram

```
┌─────────────────┐
│   User Action   │
│ (Create/Update  │
│    Reminder)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Endpoints  │
│  (REST API)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MongoDB        │
│  (Reminder      │
│   Collection)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cron Scheduler │
│  (Every minute) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Reminder        │
│ Processor       │
│ (Check & Queue) │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────────┐
│  Email  │ │  In-App     │
│ Service │ │ Notification│
└─────────┘ └─────────────┘
```

---

## 🗄️ Database Schema

The Reminder model (already exists):

```typescript
{
  userId: ObjectId,
  entityType: 'habit' | 'task',
  entityId: ObjectId,
  reminderTime: Date,        // Time of day (HH:MM)
  daysOfWeek: [0-6],         // [0=Sunday, 1=Monday, ..., 6=Saturday]
  enabled: Boolean,
  lastSentAt: Date,          // Track when last sent
  notificationMethod: 'email' | 'push' | 'both',
  timezone: String
}
```

---

## 📡 API Endpoints

### 1. Create Reminder

**POST** `/api/reminders`

```json
{
  "entityType": "task",
  "entityId": "65a1b2c3d4e5f6a7b8c9d0e1",
  "reminderTime": "09:00",
  "daysOfWeek": [1, 2, 3, 4, 5],
  "notificationMethod": "email"
}
```

### 2. Get Reminders

**GET** `/api/reminders?entityType=task&entityId=<id>`

### 3. Update Reminder

**PATCH** `/api/reminders/[id]`

### 4. Delete Reminder

**DELETE** `/api/reminders/[id]`

---

## ⏰ Scheduler Approach

### Option 1: Node-Cron (Recommended for Development)

Run a cron job in the Next.js application itself (using `node-cron`).

**Pros:**
- Simple setup
- No external services needed
- Good for development

**Cons:**
- Runs only when server is running
- Not ideal for production at scale

### Option 2: Separate Worker Service

Run a separate Node.js service that handles scheduling.

**Pros:**
- Scalable
- Can run independently
- Better resource management

**Cons:**
- More complex setup
- Requires separate deployment

### Option 3: Cloud Cron Jobs (Recommended for Production)

Use cloud scheduler (Vercel Cron, AWS EventBridge, Google Cloud Scheduler).

**Pros:**
- Reliable
- Scalable
- No server dependency

**Cons:**
- Requires cloud setup
- May have cost implications

---

## 🔔 Notification Methods

### 1. Email Notifications

- Use email service (SendGrid, Resend, AWS SES)
- HTML email templates
- User preference support

### 2. In-App Notifications

- Store notifications in database
- Frontend polls or uses WebSocket
- Real-time updates

### 3. Push Notifications (Future)

- Web Push API
- Mobile app push notifications

---

## 📝 Implementation Details

### Reminder Processing Logic

1. **Check Active Reminders**: Query reminders where `enabled = true`
2. **Filter by Time**: Check if current time matches `reminderTime`
3. **Filter by Day**: Check if current day is in `daysOfWeek`
4. **Check Last Sent**: Avoid duplicate sends (only send if not sent today)
5. **Queue Notification**: Create notification job
6. **Update Last Sent**: Mark reminder as sent

### Time Zone Handling

- Store user timezone in reminder
- Convert reminder time to UTC for storage
- Convert back to user timezone when checking

---

## 🔒 Error Handling

- Retry failed notifications
- Log errors for debugging
- Mark reminders as failed if persistent errors
- User notification if reminder service is down

---

## 📊 Monitoring

- Track reminder send success/failure rates
- Monitor cron job execution
- Alert on service failures
- Analytics on reminder effectiveness

---

## 🚀 Deployment Considerations

1. **Development**: Use node-cron in same process
2. **Production**: Use cloud cron + worker service
3. **Scaling**: Consider queue system (Bull, BullMQ) for high volume
4. **Reliability**: Implement retry logic and dead letter queue

---

## 💰 Cost Considerations

- Email service costs (per email)
- Database queries (MongoDB operations)
- Compute resources for scheduler
- Cloud scheduler costs (if used)

---

## 🔄 Future Enhancements

- Recurring reminders (weekly, monthly)
- Smart reminders (adaptive based on user behavior)
- Reminder templates
- Batch notifications
- Reminder snooze functionality
- Analytics dashboard


