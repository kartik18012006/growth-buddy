'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import {
  TodaysTasks,
  HabitStreaks,
  SleepSummary,
  WeeklyScore,
  MotivationalMessage,
} from '@/components/dashboard';
import { tasksApi, habitsApi, sleepApi } from '@/lib/api';
import { format, startOfWeek, endOfWeek, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface DashboardStats {
  tasksToday: number;
  tasksCompleted: number;
  habitsToday: number;
  habitsCompleted: number;
  longestStreak: number;
  sleepHours?: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [habitStreaks, setHabitStreaks] = useState<any[]>([]);
  const [lastNightSleep, setLastNightSleep] = useState<any>();
  const [averageSleepHours, setAverageSleepHours] = useState<number>();
  const [weeklyScore, setWeeklyScore] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState({
    tasksCompleted: 0,
    tasksTotal: 0,
    habitsCompleted: 0,
    habitsTotal: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      loadDashboardData();
    }
  }, [session]);

  const loadDashboardData = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

      // Load today's tasks
      const tasks = await tasksApi.getTasks(today);
      setTodayTasks(tasks);

      // Load habits with streaks
      const habits = await habitsApi.getHabits();
      const habitsWithStats = await Promise.all(
        habits.map(async (habit) => {
          try {
            const stats = await habitsApi.getHabitStats('daily', habit._id);
            const habitStats = stats.stats[0];
            return {
              habitId: habit._id,
              habitName: habit.name,
              currentStreak: habitStats?.currentStreak || 0,
              color: habit.color,
            };
          } catch (error) {
            return {
              habitId: habit._id,
              habitName: habit.name,
              currentStreak: 0,
              color: habit.color,
            };
          }
        })
      );
      setHabitStreaks(habitsWithStats.filter((h) => h.currentStreak > 0));

      // Load last night's sleep
      try {
        const sleepData = await sleepApi.getSleepRecord(yesterday);
        if (sleepData) {
          setLastNightSleep(sleepData);
        }
      } catch (error) {
        // No sleep data
      }

      // Calculate average sleep hours for summary
      try {
        const recentSleep = await sleepApi.getSleepRecords(7);
        if (recentSleep.length > 0) {
          const avgHours = recentSleep.reduce((sum, r) => sum + r.hoursSlept, 0) / recentSleep.length;
          setAverageSleepHours(avgHours);
        }
      } catch (error) {
        // Continue without average
      }

      // Calculate weekly score
      let tasksCompleted = 0;
      let tasksTotal = 0;
      let habitsCompleted = 0;
      let habitsTotal = 0;

      // Get weekly tasks
      for (let i = 0; i < 7; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        try {
          const dayTasks = await tasksApi.getTasks(date);
          tasksTotal += dayTasks.length;
          tasksCompleted += dayTasks.filter((t) => t.completed).length;
        } catch (error) {
          // Continue
        }
      }

      // Get weekly habits
      habitsWithStats.forEach((habit) => {
        habitsTotal += 7; // 7 days in a week
        // This is simplified - in production, calculate actual weekly completions
        habitsCompleted += Math.min(habit.currentStreak, 7);
      });

      setWeeklyStats({ tasksCompleted, tasksTotal, habitsCompleted, habitsTotal });

      // Calculate score (weighted average)
      const taskScore = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;
      const habitScore = habitsTotal > 0 ? (habitsCompleted / habitsTotal) * 100 : 0;
      const overallScore = tasksTotal + habitsTotal > 0
        ? Math.round((taskScore * 0.6 + habitScore * 0.4))
        : 0;
      setWeeklyScore(overallScore);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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

  const today = format(new Date(), 'EEEE, MMMM d');
  const tasksCompletedToday = todayTasks.filter((t) => t.completed).length;
  const longestStreak = habitStreaks.length > 0
    ? Math.max(...habitStreaks.map((h) => h.currentStreak))
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{today}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </motion.div>

        {/* Motivational Message */}
        <MotivationalMessage
          tasksCompleted={tasksCompletedToday}
          tasksTotal={todayTasks.length}
          longestStreak={longestStreak}
          score={weeklyScore}
        />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TodaysTasks tasks={todayTasks} onTaskUpdate={loadDashboardData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <HabitStreaks streaks={habitStreaks} />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WeeklyScore
                score={weeklyScore}
                tasksCompleted={weeklyStats.tasksCompleted}
                tasksTotal={weeklyStats.tasksTotal}
                habitsCompleted={weeklyStats.habitsCompleted}
                habitsTotal={weeklyStats.habitsTotal}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SleepSummary
                lastNight={lastNightSleep}
                averageHours={averageSleepHours}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
