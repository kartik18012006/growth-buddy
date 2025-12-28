# Mongoose Schemas - Usage Guide

This document provides usage examples and best practices for the Growth Buddy Mongoose schemas.

## Installation

```bash
npm install mongoose
```

## Database Connection

```javascript
const mongoose = require('mongoose');
const { User, Task, Habit, HabitCompletion, SleepRecord, Reminder } = require('./mongoose-schemas');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

## Schema Overview

### 1. User Schema

**Key Fields:**
- `email` (unique, indexed)
- `passwordHash` (not selected by default for security)
- `name`, `timezone`
- `preferences` (nested object)
- `googleCalendarConnection` (nested object for OAuth tokens)

**Usage Example:**

```javascript
// Create a new user
const user = new User({
  email: 'user@example.com',
  passwordHash: 'hashed_password_here',
  name: 'John Doe',
  timezone: 'America/New_York',
  preferences: {
    defaultView: 'dashboard',
    theme: 'dark'
  }
});
await user.save();

// Find user by email (with password)
const userWithPassword = await User.findOne({ email: 'user@example.com' })
  .select('+passwordHash');

// Check if Google Calendar is connected
if (user.isGoogleCalendarConnected) {
  // Handle connected calendar
}
```

---

### 2. Task Schema

**Key Fields:**
- `userId` (reference to User)
- `title`, `description`, `date`
- `priority` (high/medium/low)
- `completed`, `completedAt`
- `dueTime`, `category`
- `calendarEventId` (for Google Calendar sync)

**Usage Example:**

```javascript
// Create a new task
const task = new Task({
  userId: user._id,
  title: 'Complete project proposal',
  description: 'Write and submit the Q4 project proposal',
  date: new Date('2024-01-15'),
  priority: 'high',
  dueTime: new Date('2024-01-15T17:00:00'),
  category: 'work'
});
await task.save();

// Get all tasks for a user on a specific date
const tasks = await Task.find({
  userId: user._id,
  date: new Date('2024-01-15')
}).sort({ priority: -1, createdAt: 1 });

// Get pending tasks
const pendingTasks = await Task.find({
  userId: user._id,
  completed: false,
  date: { $gte: new Date() }
}).sort({ date: 1, priority: -1 });

// Mark task as complete (completedAt is auto-set via pre-save hook)
task.completed = true;
await task.save();

// Check if task is overdue
if (task.isOverdue) {
  console.log('This task is overdue!');
}
```

---

### 3. Habit Schema

**Key Fields:**
- `userId` (reference to User)
- `name`, `description`, `category`
- `frequency` (daily/weekly/custom)
- `reminderTime`
- `archived`, `archivedAt`
- `color`, `icon` (for UI)

**Usage Example:**

```javascript
// Create a new habit
const habit = new Habit({
  userId: user._id,
  name: 'Morning Meditation',
  description: '10 minutes of meditation every morning',
  category: 'wellness',
  frequency: 'daily',
  reminderTime: new Date('2024-01-01T07:00:00'), // 7 AM
  color: '#8B5CF6',
  icon: 'meditation'
});
await habit.save();

// Get all active habits for a user
const activeHabits = await Habit.find({
  userId: user._id,
  archived: false
}).sort({ order: 1, createdAt: 1 });

// Archive a habit (archivedAt is auto-set via pre-save hook)
habit.archived = true;
await habit.save();
```

---

### 4. HabitCompletion Schema

**Key Fields:**
- `habitId` (reference to Habit)
- `userId` (reference to User)
- `date` (normalized to midnight)
- `completed` (boolean)
- `notes`, `completedAt`

**Usage Example:**

```javascript
// Mark habit as completed for today
const completion = new HabitCompletion({
  habitId: habit._id,
  userId: user._id,
  date: new Date(), // Will be normalized to midnight
  completed: true,
  notes: 'Felt great after meditation!'
});
await completion.save();

// Get completion history for a habit
const habitHistory = await HabitCompletion.find({
  habitId: habit._id
}).sort({ date: -1 }).limit(30);

// Get all completions for a user on a specific date
const todayCompletions = await HabitCompletion.find({
  userId: user._id,
  date: new Date() // Normalized to midnight
}).populate('habitId');

// Calculate streak for a habit
async function calculateStreak(habitId) {
  const completions = await HabitCompletion.find({
    habitId,
    completed: true
  }).sort({ date: -1 });
  
  let streak = 0;
  let expectedDate = new Date();
  expectedDate.setHours(0, 0, 0, 0);
  
  for (const completion of completions) {
    const completionDate = new Date(completion.date);
    completionDate.setHours(0, 0, 0, 0);
    
    if (completionDate.getTime() === expectedDate.getTime()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}
```

---

### 5. SleepRecord Schema

**Key Fields:**
- `userId` (reference to User)
- `date` (normalized to midnight)
- `hoursSlept` (required, 0-24)
- `bedtime`, `wakeTime`
- `qualityRating` (1-5)
- `goalHours`, `notes`

**Usage Example:**

```javascript
// Record sleep
const sleepRecord = new SleepRecord({
  userId: user._id,
  date: new Date(), // Will be normalized to midnight
  hoursSlept: 7.5,
  bedtime: new Date('2024-01-14T23:00:00'),
  wakeTime: new Date('2024-01-15T06:30:00'),
  qualityRating: 4,
  goalHours: 8,
  notes: 'Slept well but woke up once'
});
await sleepRecord.save();

// Get sleep records for last 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
sevenDaysAgo.setHours(0, 0, 0, 0);

const recentSleep = await SleepRecord.find({
  userId: user._id,
  date: { $gte: sevenDaysAgo }
}).sort({ date: -1 });

// Calculate average sleep
const avgSleep = await SleepRecord.aggregate([
  { $match: { userId: user._id, date: { $gte: sevenDaysAgo } } },
  { $group: { _id: null, avgHours: { $avg: '$hoursSlept' } } }
]);

// Check if goal was met
if (sleepRecord.goalMet) {
  console.log('Sleep goal achieved!');
}
```

---

### 6. Reminder Schema

**Key Fields:**
- `userId` (reference to User)
- `entityType` (habit/task)
- `entityId` (reference to Habit or Task)
- `reminderTime`
- `daysOfWeek` (array: 0=Sunday, 6=Saturday)
- `enabled`, `lastSentAt`
- `notificationMethod` (email/push/both)

**Usage Example:**

```javascript
// Create a reminder for a habit
const reminder = new Reminder({
  userId: user._id,
  entityType: 'habit',
  entityId: habit._id,
  reminderTime: new Date('2024-01-01T07:00:00'), // 7 AM
  daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  enabled: true,
  notificationMethod: 'both',
  timezone: 'America/New_York'
});
await reminder.save();

// Get all active reminders for a user
const activeReminders = await Reminder.find({
  userId: user._id,
  enabled: true
}).populate('entityId');

// Get reminders that need to be sent (for cron job)
const now = new Date();
const remindersToSend = await Reminder.find({
  enabled: true,
  reminderTime: { $lte: now },
  $or: [
    { lastSentAt: { $exists: false } },
    { lastSentAt: { $lt: new Date(now.getTime() - 60 * 60 * 1000) } } // Not sent in last hour
  ]
});

// Update lastSentAt after sending
reminder.lastSentAt = new Date();
await reminder.save();
```

---

## Common Query Patterns

### Get Dashboard Data for Today

```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);

// Get today's tasks
const tasks = await Task.find({
  userId: user._id,
  date: today
}).sort({ priority: -1, createdAt: 1 });

// Get today's habits with completion status
const habits = await Habit.find({
  userId: user._id,
  archived: false,
  frequency: 'daily'
});

const habitCompletions = await HabitCompletion.find({
  userId: user._id,
  date: today
});

// Get last night's sleep
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const sleepRecord = await SleepRecord.findOne({
  userId: user._id,
  date: yesterday
});
```

### Calculate Habit Statistics

```javascript
async function getHabitStats(userId, habitId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  
  const completions = await HabitCompletion.find({
    userId,
    habitId,
    date: { $gte: startDate }
  });
  
  const total = completions.length;
  const completed = completions.filter(c => c.completed).length;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  // Calculate current streak
  const streak = await calculateStreak(habitId);
  
  return {
    totalDays: total,
    completedDays: completed,
    completionRate: completionRate.toFixed(1),
    currentStreak: streak
  };
}
```

### Get Weekly Performance

```javascript
async function getWeeklyPerformance(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  // Tasks
  const tasks = await Task.find({
    userId,
    date: { $gte: weekAgo, $lte: today }
  });
  
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const taskCompletionRate = tasks.length > 0 
    ? (tasksCompleted / tasks.length) * 100 
    : 0;
  
  // Habits
  const habitCompletions = await HabitCompletion.find({
    userId,
    date: { $gte: weekAgo, $lte: today }
  });
  
  const habitsCompleted = habitCompletions.filter(h => h.completed).length;
  const habitCompletionRate = habitCompletions.length > 0
    ? (habitsCompleted / habitCompletions.length) * 100
    : 0;
  
  // Sleep
  const sleepRecords = await SleepRecord.find({
    userId,
    date: { $gte: weekAgo, $lte: today }
  });
  
  const avgSleep = sleepRecords.length > 0
    ? sleepRecords.reduce((sum, r) => sum + r.hoursSlept, 0) / sleepRecords.length
    : null;
  
  return {
    tasks: {
      total: tasks.length,
      completed: tasksCompleted,
      completionRate: taskCompletionRate.toFixed(1)
    },
    habits: {
      total: habitCompletions.length,
      completed: habitsCompleted,
      completionRate: habitCompletionRate.toFixed(1)
    },
    sleep: {
      averageHours: avgSleep ? avgSleep.toFixed(1) : null,
      recordsCount: sleepRecords.length
    }
  };
}
```

---

## Best Practices

### 1. Date Normalization

Always normalize dates to midnight (00:00:00) for consistent querying:

```javascript
const date = new Date();
date.setHours(0, 0, 0, 0);
```

The schemas include pre-save hooks that normalize dates automatically for `HabitCompletion` and `SleepRecord`.

### 2. Using Lean Queries

For read-only operations, use `.lean()` for better performance:

```javascript
// Faster, returns plain JavaScript objects
const tasks = await Task.find({ userId: user._id }).lean();
```

### 3. Pagination

Implement pagination for large result sets:

```javascript
const page = 1;
const limit = 20;
const skip = (page - 1) * limit;

const tasks = await Task.find({ userId: user._id })
  .sort({ date: -1 })
  .skip(skip)
  .limit(limit);
```

### 4. Aggregation for Analytics

Use MongoDB aggregation pipeline for complex analytics:

```javascript
// Average sleep by day of week
const sleepByDayOfWeek = await SleepRecord.aggregate([
  { $match: { userId: user._id } },
  {
    $group: {
      _id: { $dayOfWeek: '$date' },
      avgHours: { $avg: '$hoursSlept' }
    }
  }
]);
```

### 5. Indexes

The schemas include recommended indexes. Monitor slow queries and add additional indexes as needed:

```javascript
// Add custom index if needed
taskSchema.index({ userId: 1, category: 1, date: -1 });
```

### 6. Error Handling

Always handle validation errors:

```javascript
try {
  const task = new Task({ /* ... */ });
  await task.save();
} catch (error) {
  if (error.name === 'ValidationError') {
    // Handle validation errors
    console.error(error.errors);
  }
}
```

---

## Migration Notes

### Date Handling

- All date fields should use JavaScript `Date` objects
- Dates are automatically normalized in pre-save hooks where needed
- Use timezone-aware dates when dealing with user-specific times

### References (Populate)

Use `.populate()` to get referenced documents:

```javascript
// Get task with user details
const task = await Task.findById(taskId).populate('userId', 'name email');

// Get habit with completion history
const habit = await Habit.findById(habitId);
const completions = await HabitCompletion.find({ habitId: habit._id })
  .populate('habitId');
```

### Virtual Fields

Virtual fields are computed properties that don't persist to the database:

```javascript
// These are available but not stored in DB
task.isOverdue
sleepRecord.goalMet
user.isGoogleCalendarConnected
```

---

## Security Considerations

1. **Password Hashing**: Never store plain text passwords. Use bcrypt or similar.
2. **OAuth Tokens**: Encrypt Google Calendar tokens (use mongoose-encryption or similar).
3. **Query Filtering**: Always filter by `userId` to prevent unauthorized access.
4. **Select Fields**: Password fields use `select: false` - explicitly select when needed.

---

## Performance Tips

1. Use indexes on frequently queried fields
2. Use `.lean()` for read-only queries
3. Implement pagination for large datasets
4. Use aggregation pipelines for complex analytics
5. Consider caching frequently accessed data (e.g., DailyStats)
6. Monitor query performance and optimize slow queries



