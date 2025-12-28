# Components Documentation

## Tasks Components

### DailyTodoChecklist

A modern daily todo checklist with animations and real-time updates.

**Features:**
- ✅ Mark tasks as complete with smooth animations
- ✅ Add new tasks inline
- ✅ Delete tasks with hover reveal
- ✅ Progress tracking (completion percentage)
- ✅ Priority badges
- ✅ Optimistic UI updates
- ✅ Automatic sorting (incomplete first, then by priority)

**Usage:**
```tsx
import { DailyTodoChecklist } from '@/components/tasks';

<DailyTodoChecklist
  tasks={tasks}
  date="2024-01-15"
  onTaskUpdate={(updatedTasks) => setTasks(updatedTasks)}
  onTaskDelete={(taskId) => console.log('Deleted:', taskId)}
/>
```

**Props:**
- `tasks: Task[]` - Array of tasks to display
- `date: string` - Date in YYYY-MM-DD format
- `onTaskUpdate?: (tasks: Task[]) => void` - Callback when tasks are updated
- `onTaskDelete?: (taskId: string) => void` - Callback when a task is deleted

---

## Habits Components

### HabitTrackerGrid

Weekly view of a single habit's completion status.

**Features:**
- ✅ 7-day weekly grid (Monday to Sunday)
- ✅ Click to toggle completion
- ✅ Today indicator (ring effect)
- ✅ Weekly completion stats
- ✅ Progress bar
- ✅ Smooth animations

**Usage:**
```tsx
import { HabitTrackerGrid } from '@/components/habits';

<HabitTrackerGrid
  habit={habit}
  completions={completions}
  onCompletionChange={(habitId, date, completed) => {
    // Handle completion change
  }}
/>
```

**Props:**
- `habit: Habit` - The habit to display
- `completions: Array<{ date: string; completed: boolean }>` - Completion data
- `onCompletionChange?: (habitId: string, date: string, completed: boolean) => void` - Callback on toggle

### HabitTrackerList

Renders multiple habits with their weekly grids.

**Usage:**
```tsx
import { HabitTrackerList } from '@/components/habits';

<HabitTrackerList
  habits={[
    { habit: habit1, completions: completions1 },
    { habit: habit2, completions: completions2 },
  ]}
  onCompletionChange={(habitId, date, completed) => {
    // Handle completion change
  }}
/>
```

---

## Animation Features

All components use Framer Motion for smooth animations:

1. **Entry Animations**: Cards fade in and slide up
2. **Completion Animations**: Checkmarks rotate and scale in
3. **Hover Effects**: Scale and shadow changes
4. **Progress Bars**: Smooth width transitions
5. **Staggered Animations**: Items appear one after another
6. **Layout Animations**: Smooth transitions when items are added/removed

---

## Real-time Updates

Both components use optimistic updates for instant UI feedback:

1. Update local state immediately
2. Make API call in background
3. Revert on error (if API call fails)

This ensures a smooth, responsive user experience.


