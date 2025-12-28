/**
 * Habit Consistency Chart Component
 * Shows habit completion consistency (daily, weekly, monthly)
 */

'use client';

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subDays, subWeeks, subMonths } from 'date-fns';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HabitConsistencyChartProps {
  habits: Array<{
    habitId: string;
    habitName: string;
    completions: Array<{
      date: string;
      completed: boolean;
    }>;
  }>;
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange?: (period: 'daily' | 'weekly' | 'monthly') => void;
}

export default function HabitConsistencyChart({
  habits,
  period,
  onPeriodChange,
}: HabitConsistencyChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    let labels: string[] = [];
    const habitData: Record<string, number[]> = {};

    // Initialize habit data
    habits.forEach((habit) => {
      habitData[habit.habitId] = [];
    });

    if (period === 'daily') {
      // Last 30 days
      const startDate = subDays(now, 29);
      const days = eachDayOfInterval({ start: startDate, end: now });
      
      labels = days.map((day) => format(day, 'MMM d'));

      habits.forEach((habit) => {
        const completionMap = new Map<string, boolean>();
        habit.completions.forEach((c) => {
          const dateStr = format(new Date(c.date), 'yyyy-MM-dd');
          completionMap.set(dateStr, c.completed);
        });

        days.forEach((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const completed = completionMap.get(dateStr) || false;
          habitData[habit.habitId].push(completed ? 1 : 0);
        });
      });
    } else if (period === 'weekly') {
      // Last 12 weeks
      const startDate = subWeeks(now, 11);
      const weeks = eachWeekOfInterval(
        { start: startDate, end: now },
        { weekStartsOn: 1 }
      );
      
      labels = weeks.map((week) => `Week ${format(week, 'w')}`);

      habits.forEach((habit) => {
        weeks.forEach((week) => {
          const weekStart = startOfWeek(week, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
          
          const weekCompletions = habit.completions.filter((c) => {
            const date = new Date(c.date);
            return date >= weekStart && date <= weekEnd && c.completed;
          });
          
          const totalDays = 7;
          const completionRate = weekCompletions.length / totalDays;
          habitData[habit.habitId].push(completionRate * 100);
        });
      });
    } else {
      // Last 12 months
      const startDate = subMonths(now, 11);
      const months = eachMonthOfInterval({ start: startDate, end: now });
      
      labels = months.map((month) => format(month, 'MMM yyyy'));

      habits.forEach((habit) => {
        months.forEach((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          
          const monthCompletions = habit.completions.filter((c) => {
            const date = new Date(c.date);
            return date >= monthStart && date <= monthEnd && c.completed;
          });
          
          const daysInMonth = monthEnd.getDate();
          const completionRate = monthCompletions.length / daysInMonth;
          habitData[habit.habitId].push(completionRate * 100);
        });
      });
    }

    // Create datasets for each habit
    const colors = [
      'rgb(239, 68, 68)',   // red
      'rgb(34, 197, 94)',   // green
      'rgb(59, 130, 246)',  // blue
      'rgb(168, 85, 247)',  // purple
      'rgb(251, 191, 36)',  // yellow
      'rgb(249, 115, 22)',  // orange
      'rgb(236, 72, 153)',  // pink
      'rgb(20, 184, 166)',  // teal
    ];

    const datasets = habits.map((habit, index) => ({
      label: habit.habitName,
      data: habitData[habit.habitId] || [],
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.1)'),
      fill: false,
      tension: 0.4,
    }));

    return { labels, datasets };
  }, [habits, period]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: period === 'daily' ? 45 : 0,
          minRotation: 0,
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: period === 'daily' ? 1 : 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value: any) {
            if (period === 'daily') {
              return value === 1 ? 'Done' : '';
            }
            return value + '%';
          },
        },
      },
    },
  };

  const periodOptions: Array<'daily' | 'weekly' | 'monthly'> = ['daily', 'weekly', 'monthly'];

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Habit Consistency</h3>
        <div className="flex gap-2">
          {periodOptions.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange?.(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 shadow-md"
      >
        <h4 className="text-sm font-medium text-gray-600 mb-4">
          {period === 'daily' ? 'Daily Completion' : 'Completion Rate (%)'}
        </h4>
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </motion.div>
    </div>
  );
}


