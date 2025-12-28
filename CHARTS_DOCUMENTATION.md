# Charts Documentation

## Overview

Comprehensive chart components for visualizing task completion, habit consistency, and sleep duration with daily, weekly, and monthly views.

---

## Components

### 1. TaskCompletionChart

Shows task completion trends over time.

**Features:**
- ✅ Daily, weekly, monthly views
- ✅ Completed vs Total tasks comparison
- ✅ Completion rate percentage
- ✅ Clean labels and tooltips
- ✅ Mobile responsive
- ✅ Smooth animations

**Usage:**
```tsx
import { TaskCompletionChart } from '@/components/charts';

<TaskCompletionChart
  tasks={tasks}
  period="daily"
  onPeriodChange={(period) => setPeriod(period)}
/>
```

**Props:**
- `tasks: Array<{date: string, completed: boolean}>` - Task data
- `period: 'daily' | 'weekly' | 'monthly'` - Time period
- `onPeriodChange?: (period) => void` - Period change callback

---

### 2. HabitConsistencyChart

Shows habit completion consistency across multiple habits.

**Features:**
- ✅ Daily, weekly, monthly views
- ✅ Multiple habits on same chart
- ✅ Color-coded by habit
- ✅ Completion rate visualization
- ✅ Mobile responsive

**Usage:**
```tsx
import { HabitConsistencyChart } from '@/components/charts';

<HabitConsistencyChart
  habits={[
    {
      habitId: '1',
      habitName: 'Meditation',
      completions: [{ date: '2024-01-15', completed: true }],
    },
  ]}
  period="weekly"
  onPeriodChange={(period) => setPeriod(period)}
/>
```

**Props:**
- `habits: Array<{habitId: string, habitName: string, completions: Array}>` - Habit data
- `period: 'daily' | 'weekly' | 'monthly'` - Time period
- `onPeriodChange?: (period) => void` - Period change callback

---

### 3. SleepDurationChart

Shows sleep duration and quality trends.

**Features:**
- ✅ Daily, weekly, monthly views
- ✅ Hours slept vs goal hours
- ✅ Sleep quality rating
- ✅ Average statistics
- ✅ Mobile responsive

**Usage:**
```tsx
import { SleepDurationChart } from '@/components/charts';

<SleepDurationChart
  sleepRecords={[
    {
      date: '2024-01-15',
      hoursSlept: 8,
      goalHours: 8,
      qualityRating: 4,
    },
  ]}
  period="daily"
  onPeriodChange={(period) => setPeriod(period)}
/>
```

**Props:**
- `sleepRecords: Array<{date: string, hoursSlept: number, goalHours?: number, qualityRating?: number}>` - Sleep data
- `period: 'daily' | 'weekly' | 'monthly'` - Time period
- `onPeriodChange?: (period) => void` - Period change callback

---

## Chart Features

### Period Views

**Daily:**
- Last 30 days
- Shows day-by-day data
- Labels: "MMM d" (e.g., "Jan 15")

**Weekly:**
- Last 12 weeks
- Aggregated by week
- Labels: "Week X"

**Monthly:**
- Last 12 months
- Aggregated by month
- Labels: "MMM yyyy" (e.g., "Jan 2024")

### Responsive Design

- Charts automatically adjust to container width
- Mobile-friendly labels (rotated on small screens)
- Touch-friendly tooltips
- Maintains aspect ratio on all devices

### Animations

- Smooth fade-in on load
- Staggered animations for multiple charts
- Hover effects on interactive elements

---

## Data Format

### Tasks
```typescript
{
  date: string;        // ISO date string
  completed: boolean;   // Completion status
  createdAt?: string;   // Optional creation date
}
```

### Habits
```typescript
{
  habitId: string;
  habitName: string;
  completions: Array<{
    date: string;       // ISO date string
    completed: boolean;
  }>;
}
```

### Sleep Records
```typescript
{
  date: string;         // ISO date string
  hoursSlept: number;   // Hours of sleep
  goalHours?: number;   // Optional goal
  qualityRating?: number; // 1-5 rating
}
```

---

## Styling

### Colors

**Task Completion:**
- Completed: Green (`rgb(34, 197, 94)`)
- Total: Blue (`rgb(59, 130, 246)`)

**Habit Consistency:**
- Multiple colors (red, green, blue, purple, yellow, orange, pink, teal)

**Sleep Duration:**
- Hours Slept: Blue (`rgb(59, 130, 246)`)
- Goal: Yellow (`rgb(251, 191, 36)`)
- Quality: Green (`rgb(34, 197, 94)`)

### Chart Options

- Clean grid lines
- Point style legends
- Dark tooltips with padding
- Responsive font sizes
- No rotation on mobile (except daily view)

---

## Usage Example

```tsx
'use client';

import { useState, useEffect } from 'react';
import {
  TaskCompletionChart,
  HabitConsistencyChart,
  SleepDurationChart,
} from '@/components/charts';
import { tasksApi, habitsApi, sleepApi } from '@/lib/api';

export default function AnalyticsPage() {
  const [taskPeriod, setTaskPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [sleepRecords, setSleepRecords] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // Load tasks
    const tasksData = await tasksApi.getTasks();
    setTasks(tasksData);

    // Load habits
    const habitsData = await habitsApi.getHabits();
    // Process habits with completions...
    setHabits(processedHabits);

    // Load sleep
    const sleepData = await sleepApi.getSleepRecords(30);
    setSleepRecords(sleepData);
  }

  return (
    <div className="space-y-8">
      <TaskCompletionChart
        tasks={tasks}
        period={taskPeriod}
        onPeriodChange={setTaskPeriod}
      />
      
      <HabitConsistencyChart
        habits={habits}
        period="weekly"
        onPeriodChange={() => {}}
      />
      
      <SleepDurationChart
        sleepRecords={sleepRecords}
        period="daily"
        onPeriodChange={() => {}}
      />
    </div>
  );
}
```

---

## Mobile Responsiveness

All charts are fully responsive:

1. **Container**: Uses `maintainAspectRatio: false` for flexible height
2. **Labels**: Auto-rotate on mobile (45° for daily view)
3. **Grid**: Responsive grid layout (1 column mobile, 2 columns desktop)
4. **Touch**: Touch-friendly tooltips and interactions
5. **Fonts**: Smaller font sizes on mobile (11px)

---

## Performance

- Uses `useMemo` for data processing
- Efficient date calculations
- Minimal re-renders
- Optimized Chart.js configuration

---

**All charts are ready to use!** 📊✨


