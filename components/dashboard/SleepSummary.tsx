/**
 * Sleep Summary Component
 * Shows last night's sleep data
 */

'use client';

import { motion } from 'framer-motion';
import { Moon, TrendingUp, TrendingDown } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface SleepSummaryProps {
  lastNight?: {
    date: string;
    hoursSlept: number;
    qualityRating?: number;
    goalHours?: number;
  };
  averageHours?: number;
}

export default function SleepSummary({ lastNight, averageHours }: SleepSummaryProps) {
  const goalHours = lastNight?.goalHours || 8;
  const hoursSlept = lastNight?.hoursSlept || 0;
  const quality = lastNight?.qualityRating || 0;
  const goalMet = hoursSlept >= goalHours;

  const qualityStars = Array.from({ length: 5 }, (_, i) => i < (quality || 0));

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 shadow-lg border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">Sleep Summary</h2>
        </div>
        {averageHours && (
          <div className="text-xs text-gray-600">
            Avg: {averageHours.toFixed(1)}h
          </div>
        )}
      </div>

      {lastNight ? (
        <div className="space-y-4">
          {/* Hours Slept */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Last Night</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-indigo-600">{hoursSlept.toFixed(1)}</span>
                <span className="text-sm text-gray-600">hours</span>
              </div>
            </div>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((hoursSlept / goalHours) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'h-full rounded-full',
                  goalMet ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'
                )}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">Goal: {goalHours}h</span>
              {goalMet ? (
                <span className="text-xs text-green-600 font-medium">Goal met!</span>
              ) : (
                <span className="text-xs text-orange-600 font-medium">
                  {(goalHours - hoursSlept).toFixed(1)}h short
                </span>
              )}
            </div>
          </div>

          {/* Quality Rating */}
          {quality > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">Quality</span>
              <div className="flex gap-1">
                {qualityStars.map((filled, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      'w-5 h-5 rounded-full',
                      filled ? 'bg-yellow-400' : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Moon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No sleep data recorded</p>
        </div>
      )}
    </div>
  );
}


