/**
 * Google Calendar API Service
 * 
 * Handles Google Calendar API interactions including:
 * - Token refresh
 * - Creating/updating/deleting events
 * - Fetching events
 * - Duplicate detection
 * - Timezone handling
 */

import { google } from 'googleapis';
import User from '@/models/User';

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
}

/**
 * Get authenticated Google Calendar client
 */
export async function getCalendarClient(userId: string) {
  const user = await User.findById(userId).select('+googleCalendarConnection');
  
  if (!user?.googleCalendarConnection?.accessToken) {
    throw new Error('Google Calendar not connected');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + '/api/auth/callback/google'
  );

  oauth2Client.setCredentials({
    access_token: user.googleCalendarConnection.accessToken,
    refresh_token: user.googleCalendarConnection.refreshToken,
    expiry_date: user.googleCalendarConnection.tokenExpiresAt?.getTime(),
  });

  // Refresh token if expired or about to expire
  if (user.googleCalendarConnection.tokenExpiresAt) {
    const expiresAt = user.googleCalendarConnection.tokenExpiresAt.getTime();
    const now = Date.now();
    const fiveMinutesFromNow = now + 5 * 60 * 1000; // 5 minutes buffer

    if (expiresAt < fiveMinutesFromNow) {
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        
        // Update user with new tokens
        user.googleCalendarConnection.accessToken = credentials.access_token;
        if (credentials.refresh_token) {
          user.googleCalendarConnection.refreshToken = credentials.refresh_token;
        }
        user.googleCalendarConnection.tokenExpiresAt = credentials.expiry_date
          ? new Date(credentials.expiry_date)
          : undefined;
        
        await user.save();
        
        // Update OAuth2 client with new credentials
        oauth2Client.setCredentials(credentials);
      } catch (error) {
        console.error('Error refreshing token:', error);
        throw new Error('Failed to refresh Google Calendar token');
      }
    }
  }

  return {
    calendar: google.calendar({ version: 'v3', auth: oauth2Client }),
    user,
  };
}

/**
 * Create a calendar event from a task
 */
export async function createCalendarEvent(
  userId: string,
  taskId: string,
  taskTitle: string,
  taskDescription: string | undefined,
  taskDate: Date,
  taskDueTime: Date | undefined,
  timeZone: string = 'UTC'
) {
  const { calendar } = await getCalendarClient(userId);

  // Use task date, and if there's a dueTime, use that for the end time
  const startDate = new Date(taskDate);
  const endDate = taskDueTime ? new Date(taskDueTime) : new Date(taskDate);

  // If no specific time, make it an all-day event
  const isAllDay = !taskDueTime;

  const event: CalendarEvent = {
    summary: taskTitle,
    description: taskDescription || '',
    start: isAllDay
      ? {
          date: startDate.toISOString().split('T')[0],
          timeZone: timeZone,
        }
      : {
          dateTime: startDate.toISOString(),
          timeZone: timeZone,
        },
    end: isAllDay
      ? {
          date: endDate.toISOString().split('T')[0],
          timeZone: timeZone,
        }
      : {
          dateTime: endDate.toISOString(),
          timeZone: timeZone,
        },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error creating calendar event:', error);
    throw new Error(`Failed to create calendar event: ${error.message}`);
  }
}

/**
 * Update a calendar event
 */
export async function updateCalendarEvent(
  userId: string,
  eventId: string,
  taskTitle: string,
  taskDescription: string | undefined,
  taskDate: Date,
  taskDueTime: Date | undefined,
  timeZone: string = 'UTC'
) {
  const { calendar } = await getCalendarClient(userId);

  // First, get the existing event
  const existingEvent = await calendar.events.get({
    calendarId: 'primary',
    eventId: eventId,
  });

  const startDate = new Date(taskDate);
  const endDate = taskDueTime ? new Date(taskDueTime) : new Date(taskDate);
  const isAllDay = !taskDueTime;

  const event: CalendarEvent = {
    ...existingEvent.data,
    summary: taskTitle,
    description: taskDescription || '',
    start: isAllDay
      ? {
          date: startDate.toISOString().split('T')[0],
          timeZone: timeZone,
        }
      : {
          dateTime: startDate.toISOString(),
          timeZone: timeZone,
        },
    end: isAllDay
      ? {
          date: endDate.toISOString().split('T')[0],
          timeZone: timeZone,
        }
      : {
          dateTime: endDate.toISOString(),
          timeZone: timeZone,
        },
  };

  try {
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: event,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error updating calendar event:', error);
    throw new Error(`Failed to update calendar event: ${error.message}`);
  }
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(userId: string, eventId: string) {
  const { calendar } = await getCalendarClient(userId);

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    return true;
  } catch (error: any) {
    // If event not found, consider it already deleted
    if (error.code === 404) {
      return true;
    }
    console.error('Error deleting calendar event:', error);
    throw new Error(`Failed to delete calendar event: ${error.message}`);
  }
}

/**
 * Check if an event already exists (duplicate detection)
 */
export async function checkDuplicateEvent(
  userId: string,
  taskTitle: string,
  taskDate: Date,
  timeZone: string = 'UTC'
): Promise<string | null> {
  const { calendar } = await getCalendarClient(userId);

  try {
    // Search for events on the same day with the same title
    const startOfDay = new Date(taskDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(taskDate);
    endOfDay.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      q: taskTitle, // Search by title
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    // Find exact match by title
    for (const event of events) {
      if (event.summary === taskTitle) {
        return event.id || null;
      }
    }

    return null;
  } catch (error: any) {
    console.error('Error checking for duplicate event:', error);
    return null; // Return null on error, allow creation to proceed
  }
}

/**
 * Get user's timezone from Google Calendar
 */
export async function getUserTimezone(userId: string): Promise<string> {
  try {
    const { calendar } = await getCalendarClient(userId);

    const response = await calendar.calendars.get({
      calendarId: 'primary',
    });

    return response.data.timeZone || 'UTC';
  } catch (error) {
    console.error('Error fetching user timezone:', error);
    return 'UTC'; // Default to UTC if error
  }
}

/**
 * Fetch calendar events for a date range
 */
export async function fetchCalendarEvents(
  userId: string,
  startDate: Date,
  endDate: Date,
  calendarId: string = 'primary'
) {
  const { calendar } = await getCalendarClient(userId);

  try {
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error: any) {
    console.error('Error fetching calendar events:', error);
    throw new Error(`Failed to fetch calendar events: ${error.message}`);
  }
}


