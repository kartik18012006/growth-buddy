/**
 * Habits API Service
 */

import { apiClient } from './client';

export interface Habit {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  category?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  reminderTime?: string;
  color: string;
  icon: string;
  archived: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHabitData {
  name: string;
  description?: string;
  category?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  reminderTime?: string;
  color?: string;
  icon?: string;
}

export interface HabitCompletion {
  _id: string;
  habitId: string;
  userId: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface HabitStats {
  habitId: string;
  habitName: string;
  period: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  completedCount: number;
  missedCount: number;
  completionRate: number;
  currentStreak: number;
  completions: Array<{
    date: string;
    completed: boolean;
    notes?: string;
  }>;
}

export const habitsApi = {
  /**
   * Get all habits
   */
  getHabits: async (): Promise<Habit[]> => {
    return apiClient.get<Habit[]>('/api/habits');
  },

  /**
   * Get a single habit by ID
   */
  getHabit: async (id: string): Promise<Habit> => {
    return apiClient.get<Habit>(`/api/habits/${id}`);
  },

  /**
   * Create a new habit
   */
  createHabit: async (data: CreateHabitData): Promise<Habit> => {
    return apiClient.post<Habit>('/api/habits', data);
  },

  /**
   * Update a habit
   */
  updateHabit: async (id: string, data: Partial<CreateHabitData>): Promise<Habit> => {
    return apiClient.patch<Habit>(`/api/habits/${id}`, data);
  },

  /**
   * Delete a habit
   */
  deleteHabit: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/api/habits/${id}`);
  },

  /**
   * Mark habit as completed for a date
   */
  completeHabit: async (
    habitId: string,
    date: string,
    completed: boolean,
    notes?: string
  ): Promise<HabitCompletion> => {
    return apiClient.post<HabitCompletion>('/api/habits/complete', {
      habitId,
      date,
      completed,
      notes,
    });
  },

  /**
   * Get habit statistics
   */
  getHabitStats: async (
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    habitId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ period: string; startDate: string; endDate: string; stats: HabitStats[] }> => {
    const params: Record<string, string> = { period };
    if (habitId) params.habitId = habitId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiClient.get('/api/habits/stats', params);
  },
};


