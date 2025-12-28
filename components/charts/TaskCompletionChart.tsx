/**
 * Task Completion Chart Component
 * Shows task completion trends (daily, weekly, monthly)
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
import { useState, useMemo } from 'react';
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

interface TaskCompletionChartProps {
  tasks: Array<{
    date: string;
    completed: boolean;
    createdAt?: string;
  }>;
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange?: (period: 'daily' | 'weekly' | 'monthly') => void;
}

export default function TaskCompletionChart({
  tasks,
  period,
  onPeriodChange,
}: TaskCompletionChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    let labels: string[] = [];
    let completedData: number[] = [];
    let totalData: number[] = [];

    if (period === 'daily') {
      // Last 30 days
      const startDate = subDays(now, 29);
      const days = eachDayOfInterval({ start: startDate, end: now });
      
      labels = days.map((day) => format(day, 'MMM d'));
      
      const taskMap = new Map<string, { completed: number; total: number }>();
      tasks.forEach((task) => {
        const dateStr = format(new Date(task.date), 'yyyy-MM-dd');
        const dayStr = format(new Date(task.date), 'MMM d');
        
        if (!taskMap.has(dayStr)) {
          taskMap.set(dayStr, { completed: 0, total: 0 });
        }
        
        const stats = taskMap.get(dayStr)!;
        stats.total++;
        if (task.completed) stats.completed++;
      });

      days.forEach((day) => {
        const dayStr = format(day, 'MMM d');
        const stats = taskMap.get(dayStr) || { completed: 0, total: 0 };
        completedData.push(stats.completed);
        totalData.push(stats.total);
      });
    } else if (period === 'weekly') {
      // Last 12 weeks
      const startDate = subWeeks(now, 11);
      const weeks = eachWeekOfInterval(
        { start: startDate, end: now },
        { weekStartsOn: 1 }
      );
      
      labels = weeks.map((week) => `Week ${format(week, 'w')}`);
      
      const taskMap = new Map<string, { completed: number; total: number }>();
      tasks.forEach((task) => {
        const taskDate = new Date(task.date);
        const weekStart = startOfWeek(taskDate, { weekStartsOn: 1 });
        const weekKey = `Week ${format(weekStart, 'w')}`;
        
        if (!taskMap.has(weekKey)) {
          taskMap.set(weekKey, { completed: 0, total: 0 });
        }
        
        const stats = taskMap.get(weekKey)!;
        stats.total++;
        if (task.completed) stats.completed++;
      });

      weeks.forEach((week) => {
        const weekKey = `Week ${format(week, 'w')}`;
        const stats = taskMap.get(weekKey) || { completed: 0, total: 0 };
        completedData.push(stats.completed);
        totalData.push(stats.total);
      });
    } else {
      // Last 12 months
      const startDate = subMonths(now, 11);
      const months = eachMonthOfInterval({ start: startDate, end: now });
      
      labels = months.map((month) => format(month, 'MMM yyyy'));
      
      const taskMap = new Map<string, { completed: number; total: number }>();
      tasks.forEach((task) => {
        const taskDate = new Date(task.date);
        const monthKey = format(taskDate, 'MMM yyyy');
        
        if (!taskMap.has(monthKey)) {
          taskMap.set(monthKey, { completed: 0, total: 0 });
        }
        
        const stats = taskMap.get(monthKey)!;
        stats.total++;
        if (task.completed) stats.completed++;
      });

      months.forEach((month) => {
        const monthKey = format(month, 'MMM yyyy');
        const stats = taskMap.get(monthKey) || { completed: 0, total: 0 };
        completedData.push(stats.completed);
        totalData.push(stats.total);
      });
    }

    return { labels, completedData, totalData };
  }, [tasks, period]);

  const completionRates = chartData.completedData.map((completed, i) => {
    const total = chartData.totalData[i];
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Completed',
        data: chartData.completedData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Total',
        data: chartData.totalData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };

  const rateData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: completionRates,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

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
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
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
        <h3 className="text-lg font-semibold text-gray-900">Task Completion</h3>
        <div className="flex gap-2">
          {periodOptions.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange?.(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Completion Count Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-md"
        >
          <h4 className="text-sm font-medium text-gray-600 mb-4">Tasks Completed vs Total</h4>
          <div className="h-64">
            <Line data={data} options={options} />
          </div>
        </motion.div>

        {/* Completion Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-md"
        >
          <h4 className="text-sm font-medium text-gray-600 mb-4">Completion Rate</h4>
          <div className="h-64">
            <Line data={rateData} options={options} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}


