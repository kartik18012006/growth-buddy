import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Task from '@/models/Task';
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  checkDuplicateEvent,
  getUserTimezone,
} from '@/lib/google-calendar';

/**
 * POST /api/calendar/sync
 * Sync a task to Google Calendar (create or update)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if Google Calendar is connected
    if (!user.googleCalendarConnection?.accessToken) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { taskId, syncAction } = body; // syncAction: 'create' | 'update' | 'delete'

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const task = await Task.findOne({ _id: taskId, userId: user._id });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Get user timezone
    let timeZone = user.timezone || 'UTC';
    try {
      timeZone = await getUserTimezone(user._id.toString());
      // Update user timezone if we fetched it from Google
      if (!user.timezone) {
        user.timezone = timeZone;
        await user.save();
      }
    } catch (error) {
      console.error('Error fetching timezone, using default:', error);
    }

    let calendarEvent;
    let updatedTask = task;

    if (syncAction === 'delete' && task.calendarEventId) {
      // Delete calendar event
      try {
        await deleteCalendarEvent(user._id.toString(), task.calendarEventId);
        task.calendarEventId = undefined;
        await task.save();
        return NextResponse.json({
          message: 'Calendar event deleted',
          task: task.toObject(),
        });
      } catch (error: any) {
        // If event not found in calendar, just clear the reference
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          task.calendarEventId = undefined;
          await task.save();
          return NextResponse.json({
            message: 'Calendar event reference cleared',
            task: task.toObject(),
          });
        }
        throw error;
      }
    } else if (syncAction === 'create' || (!task.calendarEventId && !syncAction)) {
      // Create new calendar event (check for duplicates first)
      const duplicateId = await checkDuplicateEvent(
        user._id.toString(),
        task.title,
        task.date,
        timeZone
      );

      if (duplicateId) {
        // Link to existing event
        task.calendarEventId = duplicateId;
        await task.save();
        return NextResponse.json({
          message: 'Linked to existing calendar event',
          eventId: duplicateId,
          task: task.toObject(),
        });
      }

      // Create new event
      calendarEvent = await createCalendarEvent(
        user._id.toString(),
        task._id.toString(),
        task.title,
        task.description,
        task.date,
        task.dueTime,
        timeZone
      );

      if (calendarEvent.id) {
        task.calendarEventId = calendarEvent.id;
        await task.save();
      } else {
        throw new Error('Calendar event created but no ID returned');
      }
    } else if (syncAction === 'update' || task.calendarEventId) {
      // Update existing calendar event
      if (!task.calendarEventId) {
        return NextResponse.json(
          { error: 'Task does not have a calendar event ID' },
          { status: 400 }
        );
      }

      calendarEvent = await updateCalendarEvent(
        user._id.toString(),
        task.calendarEventId,
        task.title,
        task.description,
        task.date,
        task.dueTime,
        timeZone
      );
    }

    // Update last synced timestamp
    if (user.googleCalendarConnection) {
      user.googleCalendarConnection.lastSyncedAt = new Date();
      await user.save();
    }

    const updatedTaskDoc = await Task.findById(task._id);

    return NextResponse.json({
      message: syncAction === 'update' ? 'Calendar event updated' : 'Calendar event created',
      eventId: calendarEvent?.id || task.calendarEventId,
      event: calendarEvent,
      task: updatedTaskDoc?.toObject(),
      timeZone,
    });
  } catch (error: any) {
    console.error('Error syncing to calendar:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync to calendar' },
      { status: 500 }
    );
  }
}


