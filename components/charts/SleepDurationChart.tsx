/**
 * Sleep Duration Chart Component
 * Shows sleep duration trends (daily, weekly, monthly)
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

interface SleepDurationChartProps {
  sleepRecords: Array<{
    date: string;
    hoursSlept: number;
    goalHours?: number;
    qualityRating?: number;
  }>;
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange?: (period: 'daily' | 'weekly' | 'monthly') => void;
}

export default function SleepDurationChart({
  sleepRecords,
  period,
  onPeriodChange,
}: SleepDurationChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    let labels: string[] = [];
    let hoursData: (number | null)[] = [];
    let goalData: (number | null)[] = [];
    let qualityData: (number | null)[] = [];

    if (period === 'daily') {
      // Last 30 days
      const startDate = subDays(now, 29);
      const days = eachDayOfInterval({ start: startDate, end: now });
      
      labels = days.map((day) => format(day, 'MMM d'));

      const recordMap = new Map<string, typeof sleepRecords[0]>();
      sleepRecords.forEach((record) => {
        const dateStr = format(new Date(record.date), 'yyyy-MM-dd');
        recordMap.set(dateStr, record);
      });

      days.forEach((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const record = recordMap.get(dateStr);
        hoursData.push(record?.hoursSlept || null);
        goalData.push(record?.goalHours || null);
        qualityData.push(record?.qualityRating || null);
      });
    } else if (period === 'weekly') {
      // Last 12 weeks
      const startDate = subWeeks(now, 11);
      const weeks = eachWeekOfInterval(
        { start: startDate, end: now },
        { weekStartsOn: 1 }
      );
      
      labels = weeks.map((week) => `Week ${format(week, 'w')}`);

      weeks.forEach((week) => {
        const weekStart = startOfWeek(week, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
        
        const weekRecords = sleepRecords.filter((r) => {
          const date = new Date(r.date);
          return date >= weekStart && date <= weekEnd;
        });

        if (weekRecords.length > 0) {
          const avgHours = weekRecords.reduce((sum, r) => sum + r.hoursSlept, 0) / weekRecords.length;
          const avgGoal = weekRecords.reduce((sum, r) => sum + (r.goalHours || 0), 0) / weekRecords.length;
          const avgQuality = weekRecords.reduce((sum, r) => sum + (r.qualityRating || 0), 0) / weekRecords.length;
          
          hoursData.push(Math.round(avgHours * 10) / 10);
          goalData.push(avgGoal > 0 ? Math.round(avgGoal * 10) / 10 : null);
          qualityData.push(avgQuality > 0 ? Math.round(avgQuality * 10) / 10 : null);
        } else {
          hoursData.push(null);
          goalData.push(null);
          qualityData.push(null);
        }
      });
    } else {
      // Last 12 months
      const startDate = subMonths(now, 11);
      const months = eachMonthOfInterval({ start: startDate, end: now });
      
      labels = months.map((month) => format(month, 'MMM yyyy'));

      months.forEach((month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        
        const monthRecords = sleepRecords.filter((r) => {
          const date = new Date(r.date);
          return date >= monthStart && date <= monthEnd;
        });

        if (monthRecords.length > 0) {
          const avgHours = monthRecords.reduce((sum, r) => sum + r.hoursSlept, 0) / monthRecords.length;
          const avgGoal = monthRecords.reduce((sum, r) => sum + (r.goalHours || 0), 0) / monthRecords.length;
          const avgQuality = monthRecords.reduce((sum, r) => sum + (r.qualityRating || 0), 0) / monthRecords.length;
          
          hoursData.push(Math.round(avgHours * 10) / 10);
          goalData.push(avgGoal > 0 ? Math.round(avgGoal * 10) / 10 : null);
          qualityData.push(avgQuality > 0 ? Math.round(avgQuality * 10) / 10 : null);
        } else {
          hoursData.push(null);
          goalData.push(null);
          qualityData.push(null);
        }
      });
    }

    return { labels, hoursData, goalData, qualityData };
  }, [sleepRecords, period]);

  const durationData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Hours Slept',
        data: chartData.hoursData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Goal Hours',
        data: chartData.goalData,
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        fill: false,
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };

  const qualityData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Sleep Quality (1-5)',
        data: chartData.qualityData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
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

  // Calculate averages
  const avgHours = chartData.hoursData.filter((h) => h !== null).reduce((sum, h) => sum + (h || 0), 0) / chartData.hoursData.filter((h) => h !== null).length || 0;
  const avgQuality = chartData.qualityData.filter((q) => q !== null).reduce((sum, q) => sum + (q || 0), 0) / chartData.qualityData.filter((q) => q !== null).length || 0;

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Sleep Duration</h3>
        <div className="flex gap-2">
          {periodOptions.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange?.(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4"
        >
          <p className="text-sm text-gray-600 mb-1">Average Hours</p>
          <p className="text-2xl font-bold text-blue-600">
            {avgHours > 0 ? avgHours.toFixed(1) : '--'}h
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4"
        >
          <p className="text-sm text-gray-600 mb-1">Average Quality</p>
          <p className="text-2xl font-bold text-green-600">
            {avgQuality > 0 ? avgQuality.toFixed(1) : '--'}/5
          </p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Duration Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-md"
        >
          <h4 className="text-sm font-medium text-gray-600 mb-4">Hours Slept vs Goal</h4>
          <div className="h-64">
            <Line data={durationData} options={options} />
          </div>
        </motion.div>

        {/* Quality Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-md"
        >
          <h4 className="text-sm font-medium text-gray-600 mb-4">Sleep Quality</h4>
          <div className="h-64">
            <Line data={qualityData} options={options} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}


