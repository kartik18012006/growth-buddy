# Dashboard Design - Growth Buddy

## 📊 Overview

Modern, clean dashboard page that provides users with a comprehensive overview of their daily progress and weekly performance.

---

## 🎨 Design Features

### Layout

- **Header**: Today's date with calendar icon
- **Motivational Message**: Contextual, non-cringe messages at the top
- **Main Grid**: 3-column layout (2 columns on left, 1 on right)
  - Left: Today's Tasks, Habit Streaks
  - Right: Weekly Score, Sleep Summary

### Components

1. **Today's Tasks**
   - Shows up to 5 incomplete tasks
   - Quick completion checkboxes
   - Completion count (X/Total)
   - Empty state with icon

2. **Habit Streaks**
   - Top 5 habits with longest streaks
   - Visual flame icon for longest streak
   - Color-coded by habit color
   - Shows streak count in days

3. **Sleep Summary**
   - Last night's sleep hours
   - Progress bar vs goal
   - Sleep quality stars (if available)
   - Average hours display
   - Gradient background (indigo to purple)

4. **Weekly Score**
   - Circular progress indicator
   - Score out of 100
   - Contextual label (Excellent, Great job, etc.)
   - Breakdown of tasks and habits
   - Gradient background (blue to indigo)

5. **Motivational Message**
   - Context-aware messages
   - Changes based on progress
   - Non-cringe, encouraging tone
   - Gradient background (purple to pink)

---

## 💬 Motivational Messages

Messages are contextual and change based on:

- **Time of day** (morning vs afternoon)
- **Task completion rate**
- **Habit streaks**
- **Weekly score**
- **Current progress**

Examples:
- "Today's a fresh start. What will you accomplish?" (Morning, no tasks)
- "You've completed everything today. Time to celebrate!" (100% completion)
- "A 7-day streak? That's consistency at its finest." (Long streak)
- "You're on fire this week. Keep the momentum going." (High score)
- "Small steps lead to big changes. Start with one thing." (Default)

---

## 🎯 Weekly Score Calculation

The weekly score is a weighted average:

```
Score = (Task Score × 0.6) + (Habit Score × 0.4)

Where:
- Task Score = (Completed Tasks / Total Tasks) × 100
- Habit Score = (Completed Habit Days / Total Habit Days) × 100
```

**Score Labels:**
- 90-100: "Excellent!"
- 75-89: "Great job!"
- 60-74: "Good progress"
- 40-59: "Keep going"
- 0-39: "Room to grow"

---

## 📱 Responsive Design

### Desktop (lg and above)
- 3-column grid
- 2 columns left, 1 column right
- Full-width components

### Tablet (md)
- 2-column grid
- Stacks vertically on smaller screens

### Mobile (sm)
- Single column
- Full-width cards
- Optimized spacing

---

## 🎨 Color Scheme

### Cards
- **White**: Primary card background
- **Gradients**: Weekly Score (blue), Sleep Summary (indigo), Message (purple)

### Accents
- **Blue**: Tasks, Weekly Score
- **Purple**: Habits, Motivational Message
- **Indigo**: Sleep
- **Orange**: Streaks, highlights

---

## ✨ Animations

All components use Framer Motion:

1. **Entry**: Fade in + slide (from left/right)
2. **Staggered**: Components appear sequentially
3. **Progress Bars**: Smooth width transitions
4. **Circular Score**: Animated stroke dash
5. **Hover Effects**: Subtle scale on interactive elements

---

## 📊 Data Flow

```
Dashboard Page
  ├── Load Today's Tasks
  ├── Load Habit Streaks
  ├── Load Last Night's Sleep
  └── Calculate Weekly Score
      ├── Get Weekly Tasks (7 days)
      ├── Get Weekly Habits
      └── Calculate Score
```

---

## 🔄 Real-time Updates

- Tasks can be completed directly from dashboard
- Updates trigger data refresh
- Optimistic UI updates for instant feedback
- Smooth animations on state changes

---

## 📝 Component Props

### TodaysTasks
```tsx
<TodaysTasks
  tasks={Task[]}
  onTaskUpdate={() => void}
/>
```

### HabitStreaks
```tsx
<HabitStreaks
  streaks={Array<{
    habitId: string;
    habitName: string;
    currentStreak: number;
    color?: string;
  }>}
/>
```

### SleepSummary
```tsx
<SleepSummary
  lastNight?: {
    date: string;
    hoursSlept: number;
    qualityRating?: number;
    goalHours?: number;
  }
  averageHours?: number
/>
```

### WeeklyScore
```tsx
<WeeklyScore
  score={number}  // 0-100
  tasksCompleted={number}
  tasksTotal={number}
  habitsCompleted={number}
  habitsTotal={number}
/>
```

### MotivationalMessage
```tsx
<MotivationalMessage
  tasksCompleted={number}
  tasksTotal={number}
  longestStreak={number}
  score={number}
/>
```

---

## 🎯 Key Features

1. **At-a-glance Overview**: Everything important in one view
2. **Quick Actions**: Complete tasks directly from dashboard
3. **Progress Tracking**: Visual indicators for all metrics
4. **Motivational**: Encouraging, contextual messages
5. **Responsive**: Works beautifully on all devices
6. **Real-time**: Instant updates on interactions

---

## 🚀 Usage

The dashboard is the default landing page after login. It automatically:

1. Loads today's tasks
2. Calculates habit streaks
3. Fetches sleep data
4. Computes weekly score
5. Displays contextual message

Users can interact with:
- Task checkboxes (complete/uncomplete)
- Navigate to full pages (Tasks, Habits, Sleep, Analytics)

---

**Dashboard is complete and ready to use!** 🎉


