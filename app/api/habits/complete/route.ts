import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import HabitCompletion from '@/models/HabitCompletion';

/**
 * POST /api/habits/complete
 * Mark a habit as completed or not completed for a specific date
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
    
    if (!body.habitId) {
      return NextResponse.json({ error: 'habitId is required' }, { status: 400 });
    }

    const date = body.date ? new Date(body.date) : new Date();
    date.setHours(0, 0, 0, 0);

    const completion = await HabitCompletion.findOneAndUpdate(
      {
        habitId: body.habitId,
        userId: user._id,
        date: date,
      },
      {
        habitId: body.habitId,
        userId: user._id,
        date: date,
        completed: body.completed !== undefined ? body.completed : true,
        notes: body.notes,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(completion);
  } catch (error) {
    console.error('Error updating habit completion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


