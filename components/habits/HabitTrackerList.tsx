/**
 * Habit Tracker List Component
 * Shows multiple habits with their weekly grids
 */

'use client';

import { motion } from 'framer-motion';
import HabitTrackerGrid from './HabitTrackerGrid';
import type { Habit } from '@/lib/api/habits';

interface HabitTrackerListProps {
  habits: Array<{
    habit: Habit;
    completions: Array<{ date: string; completed: boolean }>;
  }>;
  onCompletionChange?: (habitId: string, date: string, completed: boolean) => void;
}

export default function HabitTrackerList({
  habits,
  onCompletionChange,
}: HabitTrackerListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium mb-2">No habits to track</p>
        <p className="text-sm">Create a habit to see your weekly progress!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {habits.map((item, index) => (
        <motion.div
          key={item.habit._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-gray-200 hover:border-blue-200 shadow-md hover:shadow-lg transition-all"
        >
          <HabitTrackerGrid
            habit={item.habit}
            completions={item.completions}
            onCompletionChange={onCompletionChange}
          />
        </motion.div>
      ))}
    </div>
  );
}


