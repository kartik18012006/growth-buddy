/**
 * Tasks API Service
 */

import { apiClient } from './client';

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: string;
  dueTime?: string;
  category?: string;
  calendarEventId?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  date?: string;
  priority?: 'high' | 'medium' | 'low';
  dueTime?: string;
  category?: string;
  syncToCalendar?: boolean;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  date?: string;
  priority?: 'high' | 'medium' | 'low';
  completed?: boolean;
  dueTime?: string;
  category?: string;
}

export const tasksApi = {
  /**
   * Get tasks for a specific date
   */
  getTasks: async (date?: string): Promise<Task[]> => {
    const params = date ? { date } : {};
    return apiClient.get<Task[]>('/api/tasks', params);
  },

  /**
   * Get a single task by ID
   */
  getTask: async (id: string): Promise<Task> => {
    return apiClient.get<Task>(`/api/tasks/${id}`);
  },

  /**
   * Create a new task
   */
  createTask: async (data: CreateTaskData): Promise<Task> => {
    return apiClient.post<Task>('/api/tasks', data);
  },

  /**
   * Update a task
   */
  updateTask: async (id: string, data: UpdateTaskData): Promise<Task> => {
    return apiClient.patch<Task>(`/api/tasks/${id}`, data);
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/api/tasks/${id}`);
  },

  /**
   * Mark task as completed
   */
  completeTask: async (id: string, completed: boolean): Promise<Task> => {
    return apiClient.patch<Task>(`/api/tasks/${id}/complete`, { completed });
  },
};


