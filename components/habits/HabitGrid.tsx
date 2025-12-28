/**
 * Habit Grid Component
 * Daily habit visualization with dots/ticks for the past 30 days
 */

'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { format, subDays, isToday, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { habitsApi } from '@/lib/api';

interface HabitGridProps {
  habitId: string;
  completions: Array<{
    date: string;
    completed: boolean;
  }>;
  color?: string;
  onCompletionChange?: (habitId: string, date: string, completed: boolean) => void;
}

export default function HabitGrid({ habitId, completions, color = '#60A5FA', onCompletionChange }: HabitGridProps) {
  // Generate last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date,
      dateString: format(date, 'yyyy-MM-dd'),
      isToday: isToday(date),
    };
  });

  // Create a map for quick lookup
  const completionMap = new Map(
    completions.map((c) => [format(parseISO(c.date), 'yyyy-MM-dd'), c.completed])
  );

  // Calculate completion rate
  const completedCount = days.filter((day) => completionMap.get(day.dateString)).length;
  const completionRate = Math.round((completedCount / days.length) * 100);

  const handleDayClick = async (day: Date, dayString: string) => {
    const currentState = completionMap.get(dayString) || false;
    const newState = !currentState;

    // Notify parent immediately for optimistic update
    onCompletionChange?.(habitId, dayString, newState);

    try {
      await habitsApi.completeHabit(habitId, dayString, newState);
    } catch (error) {
      console.error('Error updating habit completion:', error);
      // Revert on error
      onCompletionChange?.(habitId, dayString, currentState);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">
          Last 30 days
        </span>
        <span className="text-xs font-semibold text-gray-800">
          {completionRate}%
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-10 gap-2">
        {days.map((day, index) => {
          const completed = completionMap.get(day.dateString) || false;
          const isTodayDay = day.isToday;

          return (
            <motion.div
              key={day.dateString}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              className="relative group"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                {format(day.date, 'MMM d, yyyy')}
                {completed && ' ✓'}
              </div>

              {/* Dot/Tick */}
              <motion.button
                type="button"
                onClick={() => handleDayClick(day.date, day.dateString)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center',
                  'transition-all duration-200 cursor-pointer',
                  'border-2',
                  completed
                    ? 'bg-gradient-to-br shadow-md'
                    : 'bg-gray-100 border-gray-200 hover:border-gray-300',
                  isTodayDay && 'ring-2 ring-offset-2 ring-blue-400/50'
                )}
                style={
                  completed
                    ? {
                        background: `linear-gradient(135deg, ${color}99, ${color}CC)`,
                        borderColor: color,
                      }
                    : undefined
                }
              >
                {completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                )}
                {!completed && (
                  <div
                    className="w-2 h-2 rounded-full opacity-40"
                    style={{ backgroundColor: color }}
                  />
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

