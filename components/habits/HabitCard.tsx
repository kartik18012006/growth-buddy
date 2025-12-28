/**
 * Habit Card Component
 * Modern Gen-Z inspired habit card with rounded design and smooth animations
 */

'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: {
    _id: string;
    name: string;
    description?: string;
    category?: string;
    color?: string;
    todayCompleted: boolean;
    streak?: number;
  };
  onToggle: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
  index: number;
}

export default function HabitCard({ habit, onToggle, onDelete, index }: HabitCardProps) {
  const colorVariants: Record<string, string> = {
    '#FF6B9D': 'from-pink-200 to-pink-100',
    '#A78BFA': 'from-purple-200 to-purple-100',
    '#60A5FA': 'from-blue-200 to-blue-100',
    '#34D399': 'from-green-200 to-green-100',
    '#FBBF24': 'from-yellow-200 to-yellow-100',
    '#FB923C': 'from-orange-200 to-orange-100',
    '#4ADE80': 'from-emerald-200 to-emerald-100',
    '#C084FC': 'from-violet-200 to-violet-100',
  };

  const defaultGradient = 'from-blue-200 to-blue-100';
  const gradientClass = habit.color 
    ? colorVariants[habit.color] || defaultGradient
    : defaultGradient;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br backdrop-blur-sm',
          'border border-white/50 shadow-lg shadow-black/5',
          'transition-all duration-300',
          'min-h-[140px] flex flex-col',
          habit.todayCompleted
            ? 'bg-gradient-to-br from-gray-50 to-gray-100/50'
            : gradientClass
        )}
      >
        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit._id);
            }}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors z-10"
            title="Delete habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

        <div className="relative flex items-start gap-4 flex-1">
          {/* Interactive Checkbox */}
          <motion.button
            type="button"
            onClick={() => onToggle(habit._id)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className={cn(
              'relative flex-shrink-0 w-12 h-12 rounded-2xl',
              'flex items-center justify-center',
              'transition-all duration-300 ease-out',
              'shadow-md hover:shadow-lg',
              habit.todayCompleted
                ? 'bg-gradient-to-br from-emerald-400 to-emerald-500'
                : 'bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 hover:border-gray-300'
            )}
          >
            {habit.todayCompleted && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </motion.div>
            )}
            {!habit.todayCompleted && (
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            )}
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <motion.h3
                  className={cn(
                    'text-lg font-semibold mb-1 transition-all duration-300',
                    habit.todayCompleted
                      ? 'text-gray-500 line-through'
                      : 'text-gray-800'
                  )}
                >
                  {habit.name}
                </motion.h3>

                {habit.description && (
                  <p className={cn(
                    'text-sm mb-3 transition-colors duration-300',
                    habit.todayCompleted
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  )}>
                    {habit.description}
                  </p>
                )}

                {/* Category Badge */}
                {habit.category && (
                  <div className="inline-flex items-center gap-2">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      'backdrop-blur-sm transition-all duration-300',
                      habit.todayCompleted
                        ? 'bg-gray-200/50 text-gray-500'
                        : 'bg-white/60 text-gray-700'
                    )}>
                      {habit.category}
                    </span>
                    {habit.streak && habit.streak > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100/80 text-amber-700">
                        <Sparkles className="w-3 h-3" />
                        {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Color Indicator */}
              {habit.color && (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-1 shadow-sm"
                  style={{ backgroundColor: habit.color }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

