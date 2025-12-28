/**
 * Habit Streaks Component
 * Shows current habit streaks with visual indicators
 */

'use client';

import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitStreak {
  habitId: string;
  habitName: string;
  currentStreak: number;
  color?: string;
}

interface HabitStreaksProps {
  streaks: HabitStreak[];
}

export default function HabitStreaks({ streaks }: HabitStreaksProps) {
  const sortedStreaks = [...streaks].sort((a, b) => b.currentStreak - a.currentStreak);
  const longestStreak = sortedStreaks[0]?.currentStreak || 0;

  if (streaks.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Habit Streaks</h2>
        <div className="text-center py-8 text-gray-400">
          <Flame className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No active streaks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Habit Streaks</h2>
        {longestStreak > 0 && (
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="w-5 h-5" />
            <span className="text-sm font-bold">{longestStreak}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sortedStreaks.slice(0, 5).map((streak, index) => (
          <motion.div
            key={streak.habitId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: streak.color || '#60A5FA' }}
              />
              <span className="text-sm font-medium text-gray-800 truncate">
                {streak.habitName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">{streak.currentStreak}</span>
              <span className="text-xs text-gray-500">days</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


