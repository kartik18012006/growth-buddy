/**
 * Sleep API Service
 */

import { apiClient } from './client';

export interface SleepRecord {
  _id: string;
  userId: string;
  date: string;
  hoursSlept: number;
  bedtime?: string;
  wakeTime?: string;
  qualityRating?: number;
  notes?: string;
  goalHours?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSleepRecordData {
  date?: string;
  hoursSlept: number;
  bedtime?: string;
  wakeTime?: string;
  qualityRating?: number;
  notes?: string;
  goalHours?: number;
}

export interface SleepStats {
  period: string;
  startDate: string;
  endDate: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: (number | null)[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
    fill?: boolean;
    borderDash?: number[];
    yAxisID?: string;
  }>;
  rawRecords: SleepRecord[];
}

export const sleepApi = {
  /**
   * Get sleep record for a specific date
   */
  getSleepRecord: async (date: string): Promise<SleepRecord | null> => {
    return apiClient.get<SleepRecord>(`/api/sleep?date=${date}`);
  },

  /**
   * Get sleep records for a date range
   */
  getSleepRecords: async (days: number = 30): Promise<SleepRecord[]> => {
    return apiClient.get<SleepRecord[]>(`/api/sleep?days=${days}`);
  },

  /**
   * Add or update sleep hours
   */
  upsertSleepRecord: async (data: CreateSleepRecordData): Promise<SleepRecord> => {
    return apiClient.post<SleepRecord>('/api/sleep', data);
  },

  /**
   * Get sleep statistics formatted for charts
   */
  getSleepStats: async (
    period: 'daily' | 'weekly' | 'monthly' | 'custom' = 'daily',
    numDays: number = 30
  ): Promise<SleepStats> => {
    const params: Record<string, string> = { period };
    if (period === 'custom') {
      params.numDays = numDays.toString();
    }
    return apiClient.get<SleepStats>('/api/sleep/stats', params);
  },
};


