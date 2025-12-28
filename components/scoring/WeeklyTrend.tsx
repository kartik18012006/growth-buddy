/**
 * Weekly Trend Component
 * Shows weekly growth trend
 */

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format, parseISO } from 'date-fns';
import type { WeeklyTrend } from '@/lib/scoring/algorithm';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyTrendProps {
  trend: WeeklyTrend;
}

export default function WeeklyTrendChart({ trend }: WeeklyTrendProps) {
  const trendIcon = trend.trend === 'improving' 
    ? <TrendingUp className="w-5 h-5 text-green-500" />
    : trend.trend === 'declining'
    ? <TrendingDown className="w-5 h-5 text-red-500" />
    : <Minus className="w-5 h-5 text-gray-500" />;

  const trendColor = trend.trend === 'improving'
    ? 'text-green-600'
    : trend.trend === 'declining'
    ? 'text-red-600'
    : 'text-gray-600';

  const chartData = {
    labels: trend.scores.map(s => format(parseISO(s.date), 'EEE')),
    datasets: [
      {
        label: 'Daily Score',
        data: trend.scores.map(s => s.score),
        borderColor: trend.trend === 'improving' ? 'rgb(34, 197, 94)' : trend.trend === 'declining' ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)',
        backgroundColor: trend.trend === 'improving' ? 'rgba(34, 197, 94, 0.1)' : trend.trend === 'declining' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
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
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Weekly Trend</h2>
        <div className="flex items-center gap-2">
          {trendIcon}
          <span className={`text-sm font-semibold ${trendColor}`}>
            {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{trend.averageScore}</span>
          <span className="text-sm text-gray-500">avg this week</span>
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          {format(parseISO(trend.weekStart), 'MMM d')} - {format(parseISO(trend.weekEnd), 'MMM d')}
        </p>
      </div>
    </div>
  );
}


