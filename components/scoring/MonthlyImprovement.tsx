/**
 * Monthly Improvement Component
 * Shows monthly improvement graph
 */

'use client';

import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
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
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MonthlyImprovement } from '@/lib/scoring/algorithm';

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

interface MonthlyImprovementProps {
  improvements: MonthlyImprovement[];
}

export default function MonthlyImprovementChart({ improvements }: MonthlyImprovementProps) {
  const chartData = {
    labels: improvements.map(i => i.month),
    datasets: [
      {
        label: 'Average Score',
        data: improvements.map(i => i.averageScore),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Consistency Score',
        data: improvements.map(i => i.consistencyScore),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: false,
        tension: 0.4,
        borderDash: [5, 5],
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
        },
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

  const latestImprovement = improvements[improvements.length - 1];
  const isImproving = latestImprovement?.improvementPercent > 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Monthly Improvement</h2>
        {latestImprovement && (
          <div className="flex items-center gap-2">
            {isImproving ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm font-semibold ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
              {latestImprovement.improvementPercent > 0 ? '+' : ''}
              {latestImprovement.improvementPercent.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="h-80 mb-6">
        <Line data={chartData} options={options} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Peak Score</p>
          <p className="text-lg font-bold text-gray-900">
            {latestImprovement?.peakScore || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Average</p>
          <p className="text-lg font-bold text-gray-900">
            {latestImprovement?.averageScore || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Consistency</p>
          <p className="text-lg font-bold text-gray-900">
            {latestImprovement?.consistencyScore || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}


