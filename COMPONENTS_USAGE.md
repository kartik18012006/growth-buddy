# Components Usage Guide

## Quick Start

This guide shows how to use the new React components for daily todos and habit tracking.

---

## Daily Todo Checklist

### Basic Usage

```tsx
import { DailyTodoChecklist } from '@/components/tasks';
import { tasksApi } from '@/lib/api';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    async function loadTasks() {
      const data = await tasksApi.getTasks(today);
      setTasks(data);
    }
    loadTasks();
  }, []);

  return (
    <DailyTodoChecklist
      tasks={tasks}
      date={today}
      onTaskUpdate={(updatedTasks) => setTasks(updatedTasks)}
      onTaskDelete={(taskId) => {
        setTasks(tasks.filter(t => t._id !== taskId));
      }}
    />
  );
}
```

### Features
- ✅ Mark complete with animations
- ✅ Add new tasks inline
- ✅ Delete tasks
- ✅ Progress tracking
- ✅ Real-time UI updates

---

## Habit Tracker Grid (Weekly View)

### Single Habit

```tsx
import { HabitTrackerGrid } from '@/components/habits';
import { habitsApi } from '@/lib/api';
import { useEffect, useState } from 'react';

function HabitTracker() {
  const [habit, setHabit] = useState(null);
  const [completions, setCompletions] = useState([]);

  useEffect(() => {
    async function loadHabit() {
      const habitData = await habitsApi.getHabit('habit_id');
      setHabit(habitData);

      const stats = await habitsApi.getHabitStats('daily', habitData._id);
      setCompletions(stats.stats[0]?.completions || []);
    }
    loadHabit();
  }, []);

  if (!habit) return <div>Loading...</div>;

  return (
    <HabitTrackerGrid
      habit={habit}
      completions={completions}
      onCompletionChange={(habitId, date, completed) => {
        // Update local state
        setCompletions(prev => {
          const updated = [...prev];
          const index = updated.findIndex(c => c.date === date);
          if (index >= 0) {
            updated[index] = { date, completed };
          } else {
            updated.push({ date, completed });
          }
          return updated;
        });
      }}
    />
  );
}
```

### Multiple Habits

```tsx
import { HabitTrackerList } from '@/components/habits';
import { habitsApi } from '@/lib/api';
import { useEffect, useState } from 'react';

function HabitsTracker() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    async function loadHabits() {
      const habitsData = await habitsApi.getHabits();
      
      const habitsWithCompletions = await Promise.all(
        habitsData.map(async (habit) => {
          const stats = await habitsApi.getHabitStats('daily', habit._id);
          return {
            habit,
            completions: stats.stats[0]?.completions || [],
          };
        })
      );
      
      setHabits(habitsWithCompletions);
    }
    loadHabits();
  }, []);

  return (
    <HabitTrackerList
      habits={habits}
      onCompletionChange={(habitId, date, completed) => {
        setHabits(prev => prev.map(item => {
          if (item.habit._id === habitId) {
            const updated = [...item.completions];
            const index = updated.findIndex(c => c.date === date);
            if (index >= 0) {
              updated[index] = { date, completed };
            } else {
              updated.push({ date, completed });
            }
            return { ...item, completions: updated };
          }
          return item;
        }));
      }}
    />
  );
}
```

---

## Complete Example: Tasks Page

```tsx
'use client';

import { useState, useEffect } from 'react';
import { DailyTodoChecklist } from '@/components/tasks';
import { tasksApi } from '@/lib/api';
import { format } from 'date-fns';
import Layout from '@/components/Layout';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await tasksApi.getTasks(today);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <DailyTodoChecklist
          tasks={tasks}
          date={today}
          onTaskUpdate={(updatedTasks) => {
            setTasks(updatedTasks);
          }}
          onTaskDelete={(taskId) => {
            setTasks(tasks.filter(t => t._id !== taskId));
          }}
        />
      </div>
    </Layout>
  );
}
```

---

## Complete Example: Habits Weekly View

```tsx
'use client';

import { useState, useEffect } from 'react';
import { HabitTrackerList } from '@/components/habits';
import { habitsApi } from '@/lib/api';
import Layout from '@/components/Layout';

export default function HabitsWeeklyPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    try {
      const habitsData = await habitsApi.getHabits();
      
      const habitsWithCompletions = await Promise.all(
        habitsData.map(async (habit) => {
          try {
            const stats = await habitsApi.getHabitStats('daily', habit._id);
            return {
              habit,
              completions: stats.stats[0]?.completions || [],
            };
          } catch (error) {
            return {
              habit,
              completions: [],
            };
          }
        })
      );
      
      setHabits(habitsWithCompletions);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCompletionChange = async (habitId, date, completed) => {
    // Optimistic update
    setHabits(prev => prev.map(item => {
      if (item.habit._id === habitId) {
        const updated = [...item.completions];
        const index = updated.findIndex(c => c.date === date);
        if (index >= 0) {
          updated[index] = { date, completed };
        } else {
          updated.push({ date, completed });
        }
        return { ...item, completions: updated };
      }
      return item;
    }));
  };

  if (loading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Weekly Habit Tracker</h1>
        <HabitTrackerList
          habits={habits}
          onCompletionChange={handleCompletionChange}
        />
      </div>
    </Layout>
  );
}
```

---

## Animation Features

All components include:

1. **Entry Animations**: Smooth fade-in and slide-up
2. **Completion Animations**: Checkmark rotates and scales
3. **Hover Effects**: Scale and shadow changes
4. **Progress Bars**: Smooth width transitions
5. **Staggered Animations**: Items appear sequentially
6. **Layout Animations**: Smooth transitions when items change

---

## Real-time Updates

Both components use **optimistic updates**:

1. UI updates immediately (optimistic)
2. API call happens in background
3. On error, UI reverts to previous state

This provides instant feedback with proper error handling.

---

## Props Reference

### DailyTodoChecklist

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tasks` | `Task[]` | Yes | Array of tasks to display |
| `date` | `string` | Yes | Date in YYYY-MM-DD format |
| `onTaskUpdate` | `(tasks: Task[]) => void` | No | Callback when tasks are updated |
| `onTaskDelete` | `(taskId: string) => void` | No | Callback when task is deleted |

### HabitTrackerGrid

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `habit` | `Habit` | Yes | The habit to display |
| `completions` | `Array<{date: string, completed: boolean}>` | Yes | Completion data |
| `onCompletionChange` | `(habitId: string, date: string, completed: boolean) => void` | No | Callback on toggle |

### HabitTrackerList

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `habits` | `Array<{habit: Habit, completions: Array}>` | Yes | Array of habits with completions |
| `onCompletionChange` | `(habitId: string, date: string, completed: boolean) => void` | No | Callback on toggle |

---

**Components are ready to use!** 🎉


