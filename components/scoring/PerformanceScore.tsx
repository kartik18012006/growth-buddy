/**
 * Performance Score Display Component
 * Shows daily score with breakdown
 */

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, Moon, CheckSquare } from 'lucide-react';
import { getScoreLabel } from '@/lib/scoring/algorithm';
import type { DailyScore } from '@/lib/scoring/algorithm';

interface PerformanceScoreProps {
  score: DailyScore;
}

export default function PerformanceScore({ score }: PerformanceScoreProps) {
  const scoreLabel = getScoreLabel(score.score);

  const colorClasses = {
    green: 'from-green-400 to-green-500',
    blue: 'from-blue-400 to-blue-500',
    yellow: 'from-yellow-400 to-yellow-500',
    orange: 'from-orange-400 to-orange-500',
    red: 'from-red-400 to-red-500',
  };

  const bgGradient = `bg-gradient-to-br ${colorClasses[scoreLabel.color as keyof typeof colorClasses] || colorClasses.blue}`;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Performance Score</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${bgGradient} text-white`}>
          {scoreLabel.label}
        </span>
      </div>

      {/* Main Score */}
      <div className="relative w-40 h-40 mx-auto mb-6">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className="text-gray-200"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className={
              scoreLabel.color === 'green' ? 'text-green-500' :
              scoreLabel.color === 'blue' ? 'text-blue-500' :
              scoreLabel.color === 'yellow' ? 'text-yellow-500' :
              scoreLabel.color === 'orange' ? 'text-orange-500' :
              'text-red-500'
            }
            strokeDasharray={`${2 * Math.PI * 70}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - score.score / 100) }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-gray-900">{score.score}</span>
          <span className="text-xs text-gray-500 mt-1">out of 100</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Tasks</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{score.breakdown.tasks.toFixed(0)}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.breakdown.tasks}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Weight: {(score.weights.tasks * 100).toFixed(0)}%</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Habits</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{score.breakdown.habits.toFixed(0)}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.breakdown.habits}%` }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Weight: {(score.weights.habits * 100).toFixed(0)}%</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">Sleep</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{score.breakdown.sleep.toFixed(0)}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.breakdown.sleep}%` }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Weight: {(score.weights.sleep * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 text-center">{scoreLabel.description}</p>
      </div>
    </div>
  );
}

