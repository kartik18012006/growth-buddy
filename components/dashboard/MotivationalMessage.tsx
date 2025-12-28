/**
 * Motivational Message Component
 * Shows contextual, non-cringe motivational messages
 */

'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface MotivationalMessageProps {
  tasksCompleted?: number;
  tasksTotal?: number;
  longestStreak?: number;
  score?: number;
}

const getMotivationalMessage = (
  tasksCompleted: number = 0,
  tasksTotal: number = 0,
  longestStreak: number = 0,
  score: number = 0
): string => {
  const completionRate = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;

  // Morning messages (before noon)
  const hour = new Date().getHours();
  const isMorning = hour < 12;

  if (isMorning && tasksTotal === 0) {
    return "Today's a fresh start. What will you accomplish?";
  }

  if (completionRate === 100 && tasksTotal > 0) {
    return "You've completed everything today. Time to celebrate!";
  }

  if (longestStreak >= 7) {
    return `A ${longestStreak}-day streak? That's consistency at its finest.`;
  }

  if (score >= 90) {
    return "You're on fire this week. Keep the momentum going.";
  }

  if (completionRate >= 75 && tasksTotal > 0) {
    return "You're making solid progress. Keep it up.";
  }

  if (longestStreak >= 3) {
    return `${longestStreak} days strong. Small steps, big wins.`;
  }

  if (completionRate >= 50 && tasksTotal > 0) {
    return "You're halfway there. One task at a time.";
  }

  if (tasksTotal > 0 && completionRate < 50) {
    return "Every task you complete is progress. You've got this.";
  }

  return "Small steps lead to big changes. Start with one thing.";
};

export default function MotivationalMessage({
  tasksCompleted = 0,
  tasksTotal = 0,
  longestStreak = 0,
  score = 0,
}: MotivationalMessageProps) {
  const message = getMotivationalMessage(tasksCompleted, tasksTotal, longestStreak, score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100"
    >
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-gray-800 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}


