/**
 * Daily Todo Checklist Component
 * Modern checklist with smooth animations and real-time updates
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { tasksApi } from '@/lib/api';
import type { Task } from '@/lib/api/tasks';

interface DailyTodoChecklistProps {
  tasks: Task[];
  date: string; // YYYY-MM-DD format
  onTaskUpdate?: (updatedTasks: Task[]) => void;
  onTaskDelete?: (taskId: string) => void;
}

export default function DailyTodoChecklist({
  tasks,
  date,
  onTaskUpdate,
  onTaskDelete,
}: DailyTodoChecklistProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleToggleComplete = async (task: Task) => {
    const taskId = task._id;
    const newCompletedState = !task.completed;

    // Optimistic update
    setUpdatingIds((prev) => new Set(prev).add(taskId));
    const updatedTasks = localTasks.map((t) =>
      t._id === taskId ? { ...t, completed: newCompletedState, completedAt: newCompletedState ? new Date().toISOString() : undefined } : t
    );
    setLocalTasks(updatedTasks);
    onTaskUpdate?.(updatedTasks);

    try {
      await tasksApi.completeTask(taskId, newCompletedState);
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert on error
      setLocalTasks(localTasks);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const newTask: Task = {
      _id: tempId,
      userId: '',
      title: newTaskTitle,
      date,
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Optimistic add
    setLocalTasks([...localTasks, newTask]);
    setNewTaskTitle('');
    setShowAddForm(false);

    try {
      const createdTask = await tasksApi.createTask({
        title: newTaskTitle,
        date,
      });
      setLocalTasks((prev) => prev.map((t) => (t._id === tempId ? createdTask : t)));
      onTaskUpdate?.(localTasks.map((t) => (t._id === tempId ? createdTask : t)));
    } catch (error) {
      console.error('Error creating task:', error);
      setLocalTasks(localTasks.filter((t) => t._id !== tempId));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // Optimistic delete
    const taskToDelete = localTasks.find((t) => t._id === taskId);
    setLocalTasks(localTasks.filter((t) => t._id !== taskId));
    onTaskDelete?.(taskId);

    try {
      await tasksApi.deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      // Revert on error
      if (taskToDelete) {
        setLocalTasks([...localTasks, taskToDelete]);
      }
    }
  };

  const completedCount = localTasks.filter((t) => t.completed).length;
  const totalCount = localTasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Sort: incomplete first, then by priority, then by creation date
  const sortedTasks = [...localTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">
            {completedCount} of {totalCount} completed
          </p>
        </div>
        {totalCount > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              layout
              className={cn(
                'group flex items-center gap-3 p-4 rounded-2xl',
                'bg-white/80 backdrop-blur-sm border-2 transition-all duration-200',
                task.completed
                  ? 'border-gray-200 bg-gray-50/50'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md',
                updatingIds.has(task._id) && 'opacity-60'
              )}
            >
              {/* Checkbox */}
              <motion.button
                onClick={() => handleToggleComplete(task)}
                disabled={updatingIds.has(task._id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'relative flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center',
                  'transition-all duration-300',
                  task.completed
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-md'
                    : 'bg-white border-2 border-gray-300 hover:border-blue-400'
                )}
              >
                <AnimatePresence>
                  {task.completed && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                  {!task.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-2 h-2 rounded-full bg-gray-400"
                    />
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <motion.h3
                  className={cn(
                    'font-medium transition-all duration-200',
                    task.completed
                      ? 'text-gray-500 line-through'
                      : 'text-gray-900'
                  )}
                  animate={{
                    opacity: task.completed ? 0.6 : 1,
                  }}
                >
                  {task.title}
                </motion.h3>
                {task.description && !task.completed && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}
              </div>

              {/* Priority Badge */}
              {!task.completed && task.priority === 'high' && (
                <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                  High
                </span>
              )}

              {/* Delete Button */}
              <motion.button
                onClick={() => handleDeleteTask(task._id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Task Form */}
        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-200"
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask();
                if (e.key === 'Escape') {
                  setShowAddForm(false);
                  setNewTaskTitle('');
                }
              }}
              placeholder="Task title..."
              autoFocus
              className="w-full px-4 py-2 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAddTask}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewTaskTitle('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Task</span>
          </motion.button>
        )}

        {/* Empty State */}
        {localTasks.length === 0 && !showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <Circle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No tasks for today</p>
            <p className="text-sm">Add a task to get started!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


