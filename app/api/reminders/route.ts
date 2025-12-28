import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Reminder from '@/models/Reminder';
import Task from '@/models/Task';
import Habit from '@/models/Habit';

/**
 * GET /api/reminders
 * Get all reminders for the current user
 */
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
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    const query: any = { userId: user._id };

    if (entityType) {
      query.entityType = entityType;
    }

    if (entityId) {
      query.entityId = entityId;
    }

    const reminders = await Reminder.find(query).sort({ reminderTime: 1 });

    // Populate entity details
    const remindersWithEntities = await Promise.all(
      reminders.map(async (reminder) => {
        let entity = null;
        if (reminder.entityType === 'task') {
          entity = await Task.findById(reminder.entityId);
        } else if (reminder.entityType === 'habit') {
          entity = await Habit.findById(reminder.entityId);
        }

        return {
          ...reminder.toObject(),
          entity: entity
            ? {
                _id: entity._id,
                name: reminder.entityType === 'task' ? entity.title : entity.name,
              }
            : null,
        };
      })
    );

    return NextResponse.json(remindersWithEntities);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/reminders
 * Create a new reminder
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

    // Validation
    if (!body.entityType || !['task', 'habit'].includes(body.entityType)) {
      return NextResponse.json(
        { error: 'entityType must be "task" or "habit"' },
        { status: 400 }
      );
    }

    if (!body.entityId) {
      return NextResponse.json({ error: 'entityId is required' }, { status: 400 });
    }

    if (!body.reminderTime) {
      return NextResponse.json({ error: 'reminderTime is required' }, { status: 400 });
    }

    // Verify entity exists and belongs to user
    let entity;
    if (body.entityType === 'task') {
      entity = await Task.findOne({ _id: body.entityId, userId: user._id });
    } else {
      entity = await Habit.findOne({ _id: body.entityId, userId: user._id });
    }

    if (!entity) {
      return NextResponse.json(
        { error: `${body.entityType} not found` },
        { status: 404 }
      );
    }

    // Parse reminder time
    // Accept both "HH:MM" format and full ISO date
    let reminderTime: Date;
    if (typeof body.reminderTime === 'string' && body.reminderTime.includes(':')) {
      // Format: "09:00" or "09:00:00"
      const [hours, minutes] = body.reminderTime.split(':').map(Number);
      reminderTime = new Date();
      reminderTime.setHours(hours, minutes || 0, 0, 0);
    } else {
      reminderTime = new Date(body.reminderTime);
    }

    // Create reminder
    const reminder = await Reminder.create({
      userId: user._id,
      entityType: body.entityType,
      entityId: body.entityId,
      reminderTime: reminderTime,
      daysOfWeek: body.daysOfWeek || [0, 1, 2, 3, 4, 5, 6], // Default to all days
      enabled: body.enabled !== undefined ? body.enabled : true,
      notificationMethod: body.notificationMethod || 'email',
      timezone: body.timezone || user.timezone || 'UTC',
    });

    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


