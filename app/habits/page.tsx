'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { HabitCard, HabitGrid, AddHabitForm } from '@/components/habits';
import { Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { habitsApi } from '@/lib/api';
import type { Habit } from '@/lib/api/habits';
import { format, parseISO } from 'date-fns';

interface HabitWithCompletion extends Habit {
  todayCompleted: boolean;
  completions?: Array<{ date: string; completed: boolean }>;
}

export default function HabitsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [habits, setHabits] = useState<HabitWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchHabits();
    }
  }, [session]);

  const fetchHabits = async () => {
    try {
      const habitsData = await habitsApi.getHabits();
      
      // Fetch completion status for each habit
      const habitsWithCompletion = await Promise.all(
        habitsData.map(async (habit) => {
          try {
            const stats = await habitsApi.getHabitStats('daily', habit._id);
            const todayCompletion = stats.stats[0]?.completions?.find(
              (c) => format(parseISO(c.date), 'yyyy-MM-dd') === today
            );
            
            return {
              ...habit,
              todayCompleted: todayCompletion?.completed || false,
              completions: stats.stats[0]?.completions || [],
            };
          } catch (error) {
            return {
              ...habit,
              todayCompleted: false,
              completions: [],
            };
          }
        })
      );

      setHabits(habitsWithCompletion);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (formData: {
    name: string;
    description?: string;
    category?: string;
    color?: string;
  }) => {
    try {
      await habitsApi.createHabit(formData);
      // Refresh all habits to ensure consistent data and proper grid display
      await fetchHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleToggleComplete = async (habitId: string) => {
    try {
      // Get current state and calculate new state
      const habit = habits.find((h) => h._id === habitId);
      if (!habit) return;

      const newCompletedState = !habit.todayCompleted;

      // Optimistic update - update UI immediately
      setHabits((prevHabits) => {
        const currentHabit = prevHabits.find((h) => h._id === habitId);
        if (!currentHabit) return prevHabits;
        
        // Update completions array to include today
        // Convert today to ISO format to match API response format
        const todayISO = new Date(today + 'T00:00:00.000Z').toISOString();
        const updatedCompletions = [...(currentHabit.completions || [])];
        const todayIndex = updatedCompletions.findIndex(
          (c) => format(parseISO(c.date), 'yyyy-MM-dd') === today
        );
        
        if (todayIndex >= 0) {
          updatedCompletions[todayIndex] = { date: todayISO, completed: newCompletedState };
        } else {
          updatedCompletions.push({ date: todayISO, completed: newCompletedState });
        }
        
        return prevHabits.map((h) =>
          h._id === habitId
            ? {
                ...h,
                todayCompleted: newCompletedState,
                completions: updatedCompletions,
              }
            : h
        );
      });

      // Update on server
      await habitsApi.completeHabit(habitId, today, newCompletedState);

      // Refresh completions for the grid and update completion status from server
      const stats = await habitsApi.getHabitStats('daily', habitId);
      const habitStats = stats.stats[0];
      const todayCompletion = habitStats?.completions?.find(
        (c) => format(parseISO(c.date), 'yyyy-MM-dd') === today
      );
      
      // Update local state with fresh data from server
      setHabits((prevHabits) =>
        prevHabits.map((h) =>
          h._id === habitId
            ? {
                ...h,
                todayCompleted: todayCompletion?.completed || false,
                completions: habitStats?.completions || [],
              }
            : h
        )
      );
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      // Revert on error
      await fetchHabits();
    }
  };

  const handleGridCompletionChange = async (habitId: string, date: string, completed: boolean) => {
    try {
      // Update local state optimistically
      setHabits((prevHabits) =>
        prevHabits.map((h) => {
          if (h._id !== habitId) return h;

          // Update completions array
          const updatedCompletions = [...(h.completions || [])];
          const existingIndex = updatedCompletions.findIndex(
            (c) => format(parseISO(c.date), 'yyyy-MM-dd') === date
          );
          
          if (existingIndex >= 0) {
            updatedCompletions[existingIndex] = { date, completed };
          } else {
            updatedCompletions.push({ date, completed });
          }

          // Update todayCompleted if the date is today
          const isTodayDate = date === today;
          const newTodayCompleted = isTodayDate ? completed : h.todayCompleted;

          return {
            ...h,
            todayCompleted: newTodayCompleted,
            completions: updatedCompletions,
          };
        })
      );

      // Refresh from server to ensure consistency
      const stats = await habitsApi.getHabitStats('daily', habitId);
      const habitStats = stats.stats[0];
      const todayCompletion = habitStats?.completions?.find(
        (c) => format(parseISO(c.date), 'yyyy-MM-dd') === today
      );

      setHabits((prevHabits) =>
        prevHabits.map((h) =>
          h._id === habitId
            ? {
                ...h,
                todayCompleted: todayCompletion?.completed || false,
                completions: habitStats?.completions || [],
              }
            : h
        )
      );
    } catch (error) {
      console.error('Error updating grid completion:', error);
      // Revert optimistic update on error
      await fetchHabits();
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  const completedToday = habits.filter((h) => h.todayCompleted).length;
  const completionRate = habits.length > 0 
    ? Math.round((completedToday / habits.length) * 100) 
    : 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Habits</h1>
              <p className="text-gray-600">
                Build consistency, one day at a time
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-5 h-5" />
              <span>New Habit</span>
            </motion.button>
          </div>

          {/* Stats Card */}
          {habits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-white/50 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Today's Progress</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {completedToday} / {habits.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-blue-600">{completionRate}%</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 h-3 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Habits Grid */}
        {habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-12 text-center border border-white/50 shadow-lg"
          >
            <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700 mb-2">No habits yet</p>
            <p className="text-gray-500 mb-6">Create your first habit to start building consistency!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Create Habit</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {habits.map((habit, index) => (
              <motion.div
                key={habit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex flex-col space-y-4"
              >
                <HabitCard
                  habit={habit}
                  onToggle={handleToggleComplete}
                  index={index}
                />
                {/* Habit Grid */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-md flex-1">
                  <HabitGrid
                    habitId={habit._id}
                    completions={habit.completions || []}
                    color={habit.color || '#60A5FA'}
                    onCompletionChange={handleGridCompletionChange}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Habit Form */}
      <AddHabitForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddHabit}
      />
    </Layout>
  );
}
