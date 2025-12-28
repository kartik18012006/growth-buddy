'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import {
  TaskCompletionChart,
  HabitConsistencyChart,
  SleepDurationChart,
} from '@/components/charts';
import { tasksApi, habitsApi, sleepApi } from '@/lib/api';
import { format, subDays } from 'date-fns';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Period state
  const [taskPeriod, setTaskPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [habitPeriod, setHabitPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [sleepPeriod, setSleepPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Data state
  const [tasks, setTasks] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [sleepRecords, setSleepRecords] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      loadAllData();
    }
  }, [session]);

  const loadAllData = async () => {
    try {
      // Load tasks (last 30 days for daily, more for weekly/monthly)
      const daysToLoad = taskPeriod === 'daily' ? 30 : taskPeriod === 'weekly' ? 90 : 365;
      const startDate = format(subDays(new Date(), daysToLoad), 'yyyy-MM-dd');
      
      const allTasks: any[] = [];
      for (let i = 0; i < daysToLoad; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        try {
          const dayTasks = await tasksApi.getTasks(date);
          allTasks.push(...dayTasks);
        } catch (error) {
          // Continue if error
        }
      }
      setTasks(allTasks);

      // Load habits
      const habitsData = await habitsApi.getHabits();
      const habitsWithCompletions = await Promise.all(
        habitsData.map(async (habit) => {
          try {
            const stats = await habitsApi.getHabitStats('daily', habit._id);
            return {
              habitId: habit._id,
              habitName: habit.name,
              completions: stats.stats[0]?.completions || [],
            };
          } catch (error) {
            return {
              habitId: habit._id,
              habitName: habit.name,
              completions: [],
            };
          }
        })
      );
      setHabits(habitsWithCompletions);

      // Load sleep records
      const sleepData = await sleepApi.getSleepRecords(30);
      setSleepRecords(sleepData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render page immediately - don't block on loading

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your progress and trends</p>
          </div>
        </div>

        {/* Task Completion Chart */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200">
          <TaskCompletionChart
            tasks={tasks}
            period={taskPeriod}
            onPeriodChange={setTaskPeriod}
          />
        </div>

        {/* Habit Consistency Chart */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200">
          <HabitConsistencyChart
            habits={habits}
            period={habitPeriod}
            onPeriodChange={setHabitPeriod}
          />
        </div>

        {/* Sleep Duration Chart */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200">
          <SleepDurationChart
            sleepRecords={sleepRecords}
            period={sleepPeriod}
            onPeriodChange={setSleepPeriod}
          />
        </div>
      </div>
    </Layout>
  );
}
