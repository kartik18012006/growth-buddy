/**
 * Dashboard API Service
 */

import { apiClient } from './client';

export interface DashboardStats {
  tasksToday: number;
  tasksCompleted: number;
  habitsToday: number;
  habitsCompleted: number;
  sleepHours?: number;
  longestStreak: number;
}

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/api/dashboard');
  },
};


