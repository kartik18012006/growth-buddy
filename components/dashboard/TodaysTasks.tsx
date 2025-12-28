/**
 * Today's Tasks Component
 * Shows today's tasks with quick completion
 */

'use client';

import { motion } from 'framer-motion';
import { Check, Circle, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { tasksApi } from '@/lib/api';
import type { Task } from '@/lib/api/tasks';
import { useState } from 'react';

interface TodaysTasksProps {
  tasks: Task[];
  onTaskUpdate?: () => void;
}

export default function TodaysTasks({ tasks, onTaskUpdate }: TodaysTasksProps) {
  const [localTasks, setLocalTasks] = useState(tasks);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const handleToggleComplete = async (task: Task) => {
    const taskId = task._id;
    const newCompletedState = !task.completed;

    setUpdatingIds((prev) => new Set(prev).add(taskId));
    setLocalTasks(
      localTasks.map((t) =>
        t._id === taskId
          ? { ...t, completed: newCompletedState, completedAt: newCompletedState ? new Date().toISOString() : undefined }
          : t
      )
    );

    try {
      await tasksApi.completeTask(taskId, newCompletedState);
      onTaskUpdate?.();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  const completedCount = localTasks.filter((t) => t.completed).length;
  const totalCount = localTasks.length;

  const incompleteTasks = localTasks.filter((t) => !t.completed).slice(0, 5);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Today's Tasks</h2>
        <span className="text-sm font-medium text-gray-600">
          {completedCount}/{totalCount}
        </span>
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Circle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No tasks for today</p>
        </div>
      ) : (
        <div className="space-y-2">
          {incompleteTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors',
                  updatingIds.has(task._id) && 'opacity-50'
                )}
              >
                <motion.button
                  onClick={() => handleToggleComplete(task)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'flex-shrink-0 w-5 h-5 rounded-md border-2 transition-colors',
                    'hover:border-blue-400'
                  )}
                  style={{
                    borderColor: task.completed ? '#10b981' : '#d1d5db',
                    backgroundColor: task.completed ? '#10b981' : 'transparent',
                  }}
                >
                  {task.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </motion.button>
                <span className="flex-1 text-sm font-medium text-gray-800">{task.title}</span>
              </motion.div>
            ))}

          {completedCount > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                {completedCount} task{completedCount !== 1 ? 's' : ''} completed today
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

