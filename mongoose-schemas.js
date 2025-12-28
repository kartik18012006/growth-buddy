/**
 * Growth Buddy - MongoDB Schemas (Mongoose)
 * 
 * This file contains all Mongoose schemas for the Growth Buddy application.
 * 
 * Usage:
 * - Import schemas in your models: const User = require('./models/User')
 * - Or use directly: const user = new User({ ... })
 */

const mongoose = require('mongoose');

// ============================================================================
// USER SCHEMA
// ============================================================================

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    index: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    select: false // Don't include in queries by default for security
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  timezone: {
    type: String,
    default: 'UTC',
    trim: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLoginAt: {
    type: Date
  },
  preferences: {
    defaultView: {
      type: String,
      enum: ['dashboard', 'habits', 'tasks'],
      default: 'dashboard'
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notificationSettings: {
      email: {
        type: Boolean,
        default: true
      },
      reminders: {
        type: Boolean,
        default: true
      }
    }
  },
  googleCalendarConnection: {
    accessToken: {
      type: String,
      select: false // Encrypt this in production
    },
    refreshToken: {
      type: String,
      select: false // Encrypt this in production
    },
    tokenExpiresAt: {
      type: Date
    },
    calendarIds: [{
      type: String
    }],
    syncPreferences: {
      twoWaySync: {
        type: Boolean,
        default: false
      },
      autoCreateEvents: {
        type: Boolean,
        default: true
      },
      autoCreateTasks: {
        type: Boolean,
        default: false
      }
    },
    connectedAt: {
      type: Date
    },
    lastSyncedAt: {
      type: Date
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for User schema
userSchema.index({ email: 1 }); // Already unique, but explicit index
userSchema.index({ createdAt: -1 }); // For sorting users by registration date

// Virtual for checking if Google Calendar is connected
userSchema.virtual('isGoogleCalendarConnected').get(function() {
  return !!(this.googleCalendarConnection && this.googleCalendarConnection.accessToken);
});

// ============================================================================
// TASK / TODO SCHEMA
// ============================================================================

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Task date is required'],
    index: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
    index: true
  },
  completed: {
    type: Boolean,
    default: false,
    index: true
  },
  completedAt: {
    type: Date
  },
  dueTime: {
    type: Date // Stores both date and time
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    index: true
  },
  calendarEventId: {
    type: String, // Google Calendar event ID if synced
    index: true
  },
  order: {
    type: Number,
    default: 0 // For custom sorting/ordering
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for Task schema (for common query patterns)
taskSchema.index({ userId: 1, date: -1 }); // Get tasks for a user by date (newest first)
taskSchema.index({ userId: 1, completed: 1, date: -1 }); // Get pending/completed tasks
taskSchema.index({ userId: 1, date: 1, priority: -1 }); // Get tasks sorted by priority
taskSchema.index({ userId: 1, calendarEventId: 1 }); // For calendar sync lookups
taskSchema.index({ date: 1 }); // For queries across all users (admin/reporting)

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueTime || this.completed) return false;
  return new Date() > this.dueTime;
});

// Pre-save hook to set completedAt
taskSchema.pre('save', function(next) {
  if (this.isModified('completed')) {
    if (this.completed && !this.completedAt) {
      this.completedAt = new Date();
    } else if (!this.completed) {
      this.completedAt = null;
    }
  }
  next();
});

// ============================================================================
// HABIT SCHEMA
// ============================================================================

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    maxlength: [100, 'Habit name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    index: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily',
    index: true
  },
  reminderTime: {
    type: Date // Stores time of day (use date-fns or similar to extract time)
  },
  color: {
    type: String,
    default: '#3B82F6', // Default blue color for UI
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color hex code']
  },
  icon: {
    type: String, // Icon name/identifier (e.g., 'fitness', 'reading', 'meditation')
    default: 'default'
  },
  archived: {
    type: Boolean,
    default: false,
    index: true
  },
  archivedAt: {
    type: Date
  },
  order: {
    type: Number,
    default: 0 // For custom sorting
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for Habit schema
habitSchema.index({ userId: 1, archived: 1, createdAt: -1 }); // Get active habits for user
habitSchema.index({ userId: 1, category: 1 }); // Get habits by category

// Virtual for current streak (will be calculated from HabitCompletion records)
habitSchema.virtual('currentStreak', {
  ref: 'HabitCompletion',
  localField: '_id',
  foreignField: 'habitId',
  options: { 
    match: { completed: true },
    sort: { date: -1 },
    limit: 1000 // Reasonable limit for streak calculation
  }
});

// Pre-save hook to set archivedAt
habitSchema.pre('save', function(next) {
  if (this.isModified('archived')) {
    if (this.archived && !this.archivedAt) {
      this.archivedAt = new Date();
    } else if (!this.archived) {
      this.archivedAt = null;
    }
  }
  next();
});

// ============================================================================
// HABIT COMPLETION SCHEMA
// ============================================================================

const habitCompletionSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: [true, 'Habit ID is required'],
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Completion date is required'],
    index: true
  },
  completed: {
    type: Boolean,
    default: false,
    index: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  completedAt: {
    type: Date // Timestamp of when user marked it complete
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for HabitCompletion schema
habitCompletionSchema.index({ habitId: 1, date: -1 }); // Get completions for a habit
habitCompletionSchema.index({ userId: 1, date: -1 }); // Get all completions for a user by date
habitCompletionSchema.index({ habitId: 1, date: 1 }, { unique: true }); // One entry per habit per day
habitCompletionSchema.index({ userId: 1, habitId: 1, date: -1 }); // Get user's habit completion history
habitCompletionSchema.index({ userId: 1, completed: 1, date: -1 }); // Get completed/incomplete habits

// Pre-save hook to set completedAt and normalize date (remove time component)
habitCompletionSchema.pre('save', function(next) {
  // Normalize date to midnight (start of day) for consistent querying
  if (this.date) {
    this.date.setHours(0, 0, 0, 0);
  }
  
  if (this.isModified('completed')) {
    if (this.completed && !this.completedAt) {
      this.completedAt = new Date();
    } else if (!this.completed) {
      this.completedAt = null;
    }
  }
  next();
});

// ============================================================================
// SLEEP RECORD SCHEMA
// ============================================================================

const sleepRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Sleep date is required'],
    index: true
  },
  hoursSlept: {
    type: Number,
    required: [true, 'Hours slept is required'],
    min: [0, 'Hours slept cannot be negative'],
    max: [24, 'Hours slept cannot exceed 24 hours']
  },
  bedtime: {
    type: Date // When user went to bed
  },
  wakeTime: {
    type: Date // When user woke up
  },
  qualityRating: {
    type: Number,
    min: [1, 'Quality rating must be at least 1'],
    max: [5, 'Quality rating cannot exceed 5'],
    index: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  goalHours: {
    type: Number, // User's sleep goal for this night (can change over time)
    min: [0, 'Goal hours cannot be negative'],
    max: [24, 'Goal hours cannot exceed 24 hours']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for SleepRecord schema
sleepRecordSchema.index({ userId: 1, date: -1 }); // Get sleep records for a user by date
sleepRecordSchema.index({ userId: 1, date: 1 }, { unique: true }); // One entry per user per day
sleepRecordSchema.index({ userId: 1, qualityRating: 1 }); // For filtering by quality
sleepRecordSchema.index({ date: -1 }); // For queries across all users (admin/reporting)

// Pre-save hook to normalize date
sleepRecordSchema.pre('save', function(next) {
  // Normalize date to midnight (start of day) for consistent querying
  if (this.date) {
    this.date.setHours(0, 0, 0, 0);
  }
  next();
});

// Virtual for checking if sleep goal was met
sleepRecordSchema.virtual('goalMet').get(function() {
  if (!this.goalHours || !this.hoursSlept) return null;
  return this.hoursSlept >= this.goalHours;
});

// ============================================================================
// REMINDER SCHEMA
// ============================================================================

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  entityType: {
    type: String,
    enum: ['habit', 'task'],
    required: [true, 'Entity type is required'],
    index: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Entity ID is required'],
    index: true
  },
  reminderTime: {
    type: Date,
    required: [true, 'Reminder time is required']
  },
  daysOfWeek: [{
    type: Number,
    min: [0, 'Day of week must be 0-6'],
    max: [6, 'Day of week must be 0-6']
  }], // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  enabled: {
    type: Boolean,
    default: true,
    index: true
  },
  lastSentAt: {
    type: Date
  },
  notificationMethod: {
    type: String,
    enum: ['email', 'push', 'both'],
    default: 'email'
  },
  timezone: {
    type: String,
    default: 'UTC' // Store timezone for accurate reminder scheduling
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for Reminder schema
reminderSchema.index({ userId: 1, enabled: 1 }); // Get active reminders for user
reminderSchema.index({ entityType: 1, entityId: 1 }); // Find reminders for specific entity
reminderSchema.index({ enabled: 1, reminderTime: 1 }); // For reminder cron job queries
reminderSchema.index({ userId: 1, entityType: 1, entityId: 1 }); // Find reminder for user's entity

// Virtual for dynamic reference to Habit or Task
reminderSchema.virtual('entity', {
  ref: function() {
    return this.entityType === 'habit' ? 'Habit' : 'Task';
  },
  localField: 'entityId',
  foreignField: '_id',
  justOne: true
});

// ============================================================================
// OPTIONAL: DAILY STATS SCHEMA (Cached/Computed Data)
// ============================================================================

const dailyStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true
  },
  tasksCompleted: {
    type: Number,
    default: 0,
    min: 0
  },
  tasksTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  habitsCompleted: {
    type: Number,
    default: 0,
    min: 0
  },
  habitsTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  sleepHours: {
    type: Number
  },
  completionRate: {
    type: Number, // Calculated: (tasksCompleted + habitsCompleted) / (tasksTotal + habitsTotal) * 100
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for DailyStats schema
dailyStatsSchema.index({ userId: 1, date: -1 }); // Get stats for user by date
dailyStatsSchema.index({ userId: 1, date: 1 }, { unique: true }); // One stat per user per day
dailyStatsSchema.index({ date: -1 }); // For queries across all users

// Pre-save hook to normalize date and calculate completion rate
dailyStatsSchema.pre('save', function(next) {
  // Normalize date
  if (this.date) {
    this.date.setHours(0, 0, 0, 0);
  }
  
  // Calculate completion rate
  const total = this.tasksTotal + this.habitsTotal;
  if (total > 0) {
    this.completionRate = ((this.tasksCompleted + this.habitsCompleted) / total) * 100;
  } else {
    this.completionRate = 0;
  }
  
  next();
});

// ============================================================================
// CREATE AND EXPORT MODELS
// ============================================================================

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
const Habit = mongoose.model('Habit', habitSchema);
const HabitCompletion = mongoose.model('HabitCompletion', habitCompletionSchema);
const SleepRecord = mongoose.model('SleepRecord', sleepRecordSchema);
const Reminder = mongoose.model('Reminder', reminderSchema);
const DailyStats = mongoose.model('DailyStats', dailyStatsSchema);

module.exports = {
  User,
  Task,
  Habit,
  HabitCompletion,
  SleepRecord,
  Reminder,
  DailyStats
};

// ============================================================================
// INDEX RECOMMENDATIONS SUMMARY
// ============================================================================

/*
PERFORMANCE OPTIMIZATION NOTES:

1. User Collection:
   - email: Unique index (automatic with unique: true)
   - createdAt: For sorting users by registration

2. Task Collection:
   - userId + date: Most common query (get tasks for a user on a date)
   - userId + completed + date: Filter by completion status
   - userId + date + priority: Sort by priority
   - userId + calendarEventId: For calendar sync lookups

3. Habit Collection:
   - userId + archived: Get active habits
   - userId + category: Filter by category

4. HabitCompletion Collection:
   - habitId + date: Unique constraint (one entry per habit per day)
   - userId + date: Get all completions for a user
   - userId + habitId + date: Get user's habit history
   - userId + completed + date: Filter by completion

5. SleepRecord Collection:
   - userId + date: Unique constraint (one entry per user per day)
   - userId + qualityRating: Filter by quality

6. Reminder Collection:
   - userId + enabled: Get active reminders
   - enabled + reminderTime: For reminder cron job
   - entityType + entityId: Find reminders for entity

7. DailyStats Collection (optional):
   - userId + date: Unique constraint
   - For pre-computed analytics queries

ADDITIONAL OPTIMIZATIONS:
- Use lean() queries when you don't need full Mongoose documents (faster)
- Implement pagination for large result sets
- Consider TTL indexes for temporary data (e.g., password reset tokens)
- Use aggregation pipeline for complex analytics queries
- Monitor slow queries and add indexes as needed
- Consider read replicas for analytics/reporting queries
*/



