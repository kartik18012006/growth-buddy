import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Task from '@/models/Task';
import { createCalendarEvent, getUserTimezone, checkDuplicateEvent } from '@/lib/google-calendar';

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      userId: user._id,
      date: { $gte: targetDate, $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000) },
    }).sort({ priority: -1, createdAt: 1 });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/tasks
 * Create a new task/todo
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

    const body = await req.json();
    
    if (!body.title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const task = await Task.create({
      userId: user._id,
      title: body.title,
      description: body.description,
      date: new Date(body.date || Date.now()),
      priority: body.priority || 'medium',
      dueTime: body.dueTime ? new Date(body.dueTime) : undefined,
      category: body.category,
    });

    // Auto-sync to calendar if enabled
    if (body.syncToCalendar && user.googleCalendarConnection?.accessToken) {
      try {
        const timeZone = await getUserTimezone(user._id.toString());
        
        // Check for duplicates before creating
        const duplicateId = await checkDuplicateEvent(
          user._id.toString(),
          task.title,
          task.date,
          timeZone
        );

        if (!duplicateId) {
          const calendarEvent = await createCalendarEvent(
            user._id.toString(),
            task._id.toString(),
            task.title,
            task.description,
            task.date,
            task.dueTime,
            timeZone
          );
          task.calendarEventId = calendarEvent.id;
          await task.save();
        } else {
          task.calendarEventId = duplicateId;
          await task.save();
        }
      } catch (error) {
        console.error('Error auto-syncing to calendar:', error);
        // Don't fail task creation if calendar sync fails
      }
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


