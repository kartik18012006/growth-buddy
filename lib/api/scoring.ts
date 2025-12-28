/**
 * Scoring API Service
 */

import { apiClient } from './client';

export interface DailyScore {
  date: string;
  score: number;
  breakdown: {
    tasks: number;
    habits: number;
    sleep: number;
  };
  weights: {
    tasks: number;
    habits: number;
    sleep: number;
  };
}

export interface WeeklyTrend {
  weekStart: string;
  weekEnd: string;
  averageScore: number;
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
  scores: DailyScore[];
}

export interface MonthlyImprovement {
  month: string;
  averageScore: number;
  improvementPercent: number;
  consistencyScore: number;
  peakScore: number;
  lowestScore: number;
}

export const scoringApi = {
  /**
   * Get today's performance score
   */
  getDailyScore: async (): Promise<DailyScore> => {
    return apiClient.get<DailyScore>('/api/scoring/daily');
  },

  /**
   * Get weekly trend
   */
  getWeeklyTrend: async (): Promise<WeeklyTrend> => {
    return apiClient.get<WeeklyTrend>('/api/scoring/weekly');
  },

  /**
   * Get monthly improvement scores
   */
  getMonthlyImprovement: async (months: number = 6): Promise<{ improvements: MonthlyImprovement[] }> => {
    return apiClient.get<{ improvements: MonthlyImprovement[] }>(
      `/api/scoring/monthly?months=${months}`
    );
  },
};


