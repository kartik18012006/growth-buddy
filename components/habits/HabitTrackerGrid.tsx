/**
 * Habit Tracker Grid Component (Weekly View)
 * Shows 7 days with completion status for each habit
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, parseISO, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { habitsApi } from '@/lib/api';
import type { Habit } from '@/lib/api/habits';

interface HabitTrackerGridProps {
  habit: Habit;
  completions: Array<{
    date: string;
    completed: boolean;
  }>;
  onCompletionChange?: (habitId: string, date: string, completed: boolean) => void;
}

export default function HabitTrackerGrid({
  habit,
  completions,
  onCompletionChange,
}: HabitTrackerGridProps) {
  // Get current week (Monday to Sunday)
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Create completion map
  const completionMap = new Map<string, boolean>();
  completions.forEach((c) => {
    const dateStr = format(parseISO(c.date), 'yyyy-MM-dd');
    completionMap.set(dateStr, c.completed);
  });

  const handleToggleDay = async (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const currentState = completionMap.get(dateStr) || false;
    const newState = !currentState;

    // Optimistic update
    completionMap.set(dateStr, newState);
    onCompletionChange?.(habit._id, dateStr, newState);

    try {
      await habitsApi.completeHabit(habit._id, dateStr, newState);
    } catch (error) {
      console.error('Error updating habit completion:', error);
      // Revert on error
      completionMap.set(dateStr, currentState);
    }
  };

  // Calculate weekly stats
  const completedDays = weekDays.filter((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return completionMap.get(dateStr);
  }).length;
  const completionRate = Math.round((completedDays / 7) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{habit.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">This week</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">{completedDays}/7</div>
          <div className="text-xs text-gray-500">{completionRate}%</div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const completed = completionMap.get(dateStr) || false;
          const isTodayDay = isToday(day);
          const dayName = format(day, 'EEE'); // Mon, Tue, etc.

          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex flex-col items-center gap-2"
            >
              {/* Day Label */}
              <span
                className={cn(
                  'text-xs font-medium',
                  isTodayDay ? 'text-blue-600 font-bold' : 'text-gray-500'
                )}
              >
                {dayName}
              </span>

              {/* Day Number */}
              <span
                className={cn(
                  'text-xs',
                  isTodayDay ? 'text-blue-600 font-bold' : 'text-gray-400'
                )}
              >
                {format(day, 'd')}
              </span>

              {/* Completion Button */}
              <motion.button
                onClick={() => handleToggleDay(day)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'relative w-10 h-10 rounded-xl flex items-center justify-center',
                  'transition-all duration-300 border-2',
                  'shadow-sm hover:shadow-md',
                  completed
                    ? 'bg-gradient-to-br shadow-md'
                    : 'bg-white border-gray-200 hover:border-blue-300',
                  isTodayDay && 'ring-2 ring-offset-2 ring-blue-400/50'
                )}
                style={
                  completed
                    ? {
                        background: `linear-gradient(135deg, ${habit.color || '#60A5FA'}99, ${habit.color || '#60A5FA'}CC)`,
                        borderColor: habit.color || '#60A5FA',
                      }
                    : undefined
                }
              >
                <AnimatePresence mode="wait">
                  {completed ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="circle"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-3 h-3 rounded-full border-2 border-gray-300"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        />
      </div>
    </div>
  );
}


