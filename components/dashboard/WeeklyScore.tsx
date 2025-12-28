/**
 * Weekly Improvement Score Component
 * Shows overall weekly performance score
 */

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeeklyScoreProps {
  score: number; // 0-100
  tasksCompleted?: number;
  tasksTotal?: number;
  habitsCompleted?: number;
  habitsTotal?: number;
}

export default function WeeklyScore({ score, tasksCompleted = 0, tasksTotal = 0, habitsCompleted = 0, habitsTotal = 0 }: WeeklyScoreProps) {
  const getScoreLabel = (s: number) => {
    if (s >= 90) return { text: 'Excellent!', color: 'text-green-600', bg: 'from-green-400 to-green-500' };
    if (s >= 75) return { text: 'Great job!', color: 'text-blue-600', bg: 'from-blue-400 to-blue-500' };
    if (s >= 60) return { text: 'Good progress', color: 'text-yellow-600', bg: 'from-yellow-400 to-yellow-500' };
    if (s >= 40) return { text: 'Keep going', color: 'text-orange-600', bg: 'from-orange-400 to-orange-500' };
    return { text: 'Room to grow', color: 'text-gray-600', bg: 'from-gray-400 to-gray-500' };
  };

  const scoreLabel = getScoreLabel(score);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">This Week</h2>
        </div>
        <TrendingUp className="w-5 h-5 text-blue-600" />
      </div>

      <div className="space-y-4">
        {/* Score Circle */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className={cn('text-blue-500')}
              strokeDasharray={`${2 * Math.PI * 56}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - score / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-900">{score}</span>
            <span className="text-xs text-gray-500">score</span>
          </div>
        </div>

        {/* Score Label */}
        <div className="text-center">
          <p className={cn('text-lg font-semibold', scoreLabel.color)}>
            {scoreLabel.text}
          </p>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-blue-100">
          <div>
            <p className="text-xs text-gray-600 mb-1">Tasks</p>
            <p className="text-lg font-bold text-gray-900">
              {tasksCompleted}/{tasksTotal}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Habits</p>
            <p className="text-lg font-bold text-gray-900">
              {habitsCompleted}/{habitsTotal}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


