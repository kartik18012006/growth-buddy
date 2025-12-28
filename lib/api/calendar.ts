/**
 * Calendar API Service
 */

import { apiClient } from './client';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  timeZone: string;
  location?: string;
  htmlLink?: string;
  status?: string;
}

export interface SyncCalendarResponse {
  message: string;
  eventId?: string;
  event?: any;
  task?: any;
  timeZone: string;
}

export const calendarApi = {
  /**
   * Sync task to Google Calendar
   */
  syncTask: async (
    taskId: string,
    syncAction: 'create' | 'update' | 'delete'
  ): Promise<SyncCalendarResponse> => {
    return apiClient.post<SyncCalendarResponse>('/api/calendar/sync', {
      taskId,
      syncAction,
    });
  },

  /**
   * Fetch calendar events
   */
  getEvents: async (
    startDate?: string,
    endDate?: string,
    calendarId: string = 'primary'
  ): Promise<{
    events: CalendarEvent[];
    timeZone: string;
    startDate: string;
    endDate: string;
  }> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (calendarId !== 'primary') params.calendarId = calendarId;

    return apiClient.get('/api/calendar/events', params);
  },

  /**
   * Get user's timezone from Google Calendar
   */
  getTimezone: async (): Promise<{ timeZone: string; updated: boolean }> => {
    return apiClient.get<{ timeZone: string; updated: boolean }>('/api/calendar/timezone');
  },
};


