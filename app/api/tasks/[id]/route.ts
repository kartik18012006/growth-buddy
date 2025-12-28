import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Task from '@/models/Task';
import { updateCalendarEvent, deleteCalendarEvent, getUserTimezone } from '@/lib/google-calendar';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    const task = await Task.findOne({ _id: params.id, userId: user._id });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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
    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      body,
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Auto-sync to calendar if task has calendarEventId and user has calendar connected
    if (task.calendarEventId && user.googleCalendarConnection?.accessToken) {
      try {
        const timeZone = await getUserTimezone(user._id.toString());
        
        await updateCalendarEvent(
          user._id.toString(),
          task.calendarEventId,
          task.title,
          task.description,
          task.date,
          task.dueTime,
          timeZone
        );
      } catch (error) {
        console.error('Error auto-syncing task update to calendar:', error);
        // Don't fail task update if calendar sync fails
      }
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    const task = await Task.findOne({ _id: params.id, userId: user._id });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Delete calendar event if it exists
    if (task.calendarEventId && user.googleCalendarConnection?.accessToken) {
      try {
        await deleteCalendarEvent(user._id.toString(), task.calendarEventId);
      } catch (error) {
        console.error('Error deleting calendar event:', error);
        // Continue with task deletion even if calendar delete fails
      }
    }

    await Task.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


