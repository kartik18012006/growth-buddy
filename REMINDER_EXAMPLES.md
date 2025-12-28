# Reminder System - Complete Examples

## 📋 Complete Workflow Example

### Step 1: User Creates a Task

```bash
POST /api/tasks
{
  "title": "Morning Workout",
  "date": "2024-01-15",
  "priority": "high"
}

Response:
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "title": "Morning Workout",
  ...
}
```

### Step 2: User Sets Reminder for Task

```bash
POST /api/reminders
{
  "entityType": "task",
  "entityId": "65a1b2c3d4e5f6a7b8c9d0e1",
  "reminderTime": "06:30",
  "daysOfWeek": [1, 2, 3, 4, 5],
  "notificationMethod": "email"
}

Response:
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0f2",
  "entityType": "task",
  "entityId": "65a1b2c3d4e5f6a7b8c9d0e1",
  "reminderTime": "2024-01-15T06:30:00.000Z",
  "daysOfWeek": [1, 2, 3, 4, 5],
  "enabled": true,
  "notificationMethod": "email"
}
```

### Step 3: Cron Job Processes Reminder (6:30 AM on Weekday)

The cron job runs every minute and checks:

1. ✅ Current time is 06:30
2. ✅ Today is Monday (day 1) - matches daysOfWeek
3. ✅ Reminder is enabled
4. ✅ Not sent today (lastSentAt is null or yesterday)

### Step 4: Email Sent

Email sent to user:
```
Subject: Reminder: Morning Workout

Hello [User],

This is a reminder for your task:

Morning Workout

Scheduled Time: 6:30 AM

[Open Growth Buddy Button]
```

### Step 5: Reminder Updated

The reminder's `lastSentAt` is updated to prevent duplicate sends.

---

## 🔄 Real-World Scenarios

### Scenario 1: Daily Habit Reminder

**User wants**: Remind me to meditate every day at 7 AM

```javascript
POST /api/reminders
{
  "entityType": "habit",
  "entityId": "habit_id_here",
  "reminderTime": "07:00",
  "daysOfWeek": [0, 1, 2, 3, 4, 5, 6], // All days
  "notificationMethod": "email"
}
```

**Result**: User receives email at 7 AM every day

---

### Scenario 2: Weekday Task Reminder

**User wants**: Remind me about standup meeting only on weekdays at 9 AM

```javascript
POST /api/reminders
{
  "entityType": "task",
  "entityId": "task_id_here",
  "reminderTime": "09:00",
  "daysOfWeek": [1, 2, 3, 4, 5], // Monday-Friday
  "notificationMethod": "both" // Email + Push
}
```

**Result**: User receives notification at 9 AM, Monday-Friday only

---

### Scenario 3: Disable Reminder Temporarily

**User wants**: Stop reminders for a week (vacation)

```javascript
PATCH /api/reminders/reminder_id_here
{
  "enabled": false
}
```

**Result**: Reminder is disabled, can be re-enabled later

---

### Scenario 4: Change Reminder Time

**User wants**: Change reminder from 7 AM to 8 AM

```javascript
PATCH /api/reminders/reminder_id_here
{
  "reminderTime": "08:00"
}
```

**Result**: Reminder time updated, new time takes effect immediately

---

## 📧 Email Template Examples

### Task Reminder Email

```html
Subject: Reminder: Morning Workout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ Growth Buddy Reminder

Hello John,

This is a reminder for your task:

Morning Workout
Scheduled Time: 6:30 AM

[Open Growth Buddy] ← Button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're receiving this because you set up a reminder.
To manage reminders, visit your settings page.
```

### Habit Reminder Email

```html
Subject: Reminder: Morning Meditation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ Growth Buddy Reminder

Hello John,

This is a reminder for your habit:

Morning Meditation
Scheduled Time: 7:00 AM

[Open Growth Buddy] ← Button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep building your streak! 🔥
To manage reminders, visit your settings page.
```

---

## 🔧 Integration Examples

### Frontend: Create Reminder UI

```typescript
// In your React component
const createReminder = async (taskId: string, time: string) => {
  try {
    const response = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entityType: 'task',
        entityId: taskId,
        reminderTime: time, // e.g., "09:00"
        daysOfWeek: [1, 2, 3, 4, 5], // Weekdays
        notificationMethod: 'email',
      }),
    });
    
    if (response.ok) {
      const reminder = await response.json();
      console.log('Reminder created:', reminder);
    }
  } catch (error) {
    console.error('Error creating reminder:', error);
  }
};
```

### Frontend: List User's Reminders

```typescript
const fetchReminders = async () => {
  try {
    const response = await fetch('/api/reminders');
    if (response.ok) {
      const reminders = await response.json();
      return reminders;
    }
  } catch (error) {
    console.error('Error fetching reminders:', error);
  }
};
```

### Frontend: Toggle Reminder

```typescript
const toggleReminder = async (reminderId: string, enabled: boolean) => {
  try {
    const response = await fetch(`/api/reminders/${reminderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    
    if (response.ok) {
      console.log('Reminder updated');
    }
  } catch (error) {
    console.error('Error updating reminder:', error);
  }
};
```

---

## 🧪 Testing Reminders

### Test Reminder Creation

```bash
# Get a task ID first
curl -X GET "http://localhost:3001/api/tasks?date=2024-01-15" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# Create reminder for that task
curl -X POST "http://localhost:3001/api/reminders" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "entityType": "task",
    "entityId": "YOUR_TASK_ID",
    "reminderTime": "14:00",
    "daysOfWeek": [1,2,3,4,5],
    "notificationMethod": "email"
  }'
```

### Manually Trigger Cron (Testing)

```bash
curl -X GET "http://localhost:3001/api/cron/reminders" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Check Reminders

```bash
curl -X GET "http://localhost:3001/api/reminders" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

---

## 🎯 Best Practices

1. **Set Realistic Times**: Don't send too early/late
2. **Day Selection**: Use specific days (weekdays) to reduce noise
3. **User Control**: Always allow users to disable reminders
4. **Error Handling**: Handle email failures gracefully
5. **Testing**: Test with different time zones and times
6. **Monitoring**: Track reminder send success rates
7. **User Feedback**: Allow users to report reminder issues

---

## 📊 Monitoring Queries

### Get Reminders Sent Today

```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);

const remindersSentToday = await Reminder.find({
  lastSentAt: { $gte: today }
}).countDocuments();
```

### Get Active Reminders Count

```javascript
const activeReminders = await Reminder.find({
  enabled: true
}).countDocuments();
```

### Get Reminders by User

```javascript
const userReminders = await Reminder.find({
  userId: user._id,
  enabled: true
}).populate('entityId');
```

---

## 🚀 Production Checklist

- [ ] Email service integrated (SendGrid/Resend/AWS SES)
- [ ] CRON_SECRET set in environment variables
- [ ] Cron job configured (Vercel Cron or cloud scheduler)
- [ ] Email templates tested
- [ ] Error handling tested
- [ ] Time zone handling verified
- [ ] Reminder duplication prevention verified
- [ ] Monitoring/logging set up
- [ ] User notification preferences working
- [ ] Reminder management UI implemented

---

**All reminder system code is ready to use!** 🎉


