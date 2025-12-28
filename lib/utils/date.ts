/**
 * Date Utilities
 */

import { format, parseISO, startOfDay, endOfDay, isToday, isTomorrow, isYesterday } from 'date-fns';

/**
 * Format date for display
 */
export function formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string, formatStr: string = 'MMM dd, yyyy h:mm a'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format time only
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
}

/**
 * Get relative date string (Today, Tomorrow, Yesterday, or date)
 */
export function getRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) return 'Today';
  if (isTomorrow(dateObj)) return 'Tomorrow';
  if (isYesterday(dateObj)) return 'Yesterday';
  
  return formatDate(dateObj);
}

/**
 * Get date for API requests (ISO string)
 */
export function getDateString(date: Date = new Date()): string {
  return startOfDay(date).toISOString().split('T')[0];
}

/**
 * Parse date string to Date object
 */
export function parseDateString(dateString: string): Date {
  return parseISO(dateString);
}


