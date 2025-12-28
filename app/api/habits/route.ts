import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Habit from '@/models/Habit';
import HabitCompletion from '@/models/HabitCompletion';

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
    const includeArchived = searchParams.get('includeArchived') === 'true';

    const query: any = { userId: user._id };
    if (!includeArchived) {
      query.archived = false;
    }

    const habits = await Habit.find(query).sort({ order: 1, createdAt: 1 });

    // Get today's completions
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get completions for all habits in a single query
    const habitIds = habits.map(h => h._id);
    const completions = await HabitCompletion.find({
      userId: user._id,
      habitId: { $in: habitIds },
      date: today,
    }).lean();

    // Create a map for fast lookup
    const completionMap = new Map(
      completions.map(c => [c.habitId.toString(), c])
    );

    const habitsWithCompletion = habits.map(habit => {
      const completion = completionMap.get(habit._id.toString());
      return {
        ...habit.toObject(),
        todayCompleted: completion?.completed || false,
        completionId: completion?._id,
      };
    });

    return NextResponse.json(habitsWithCompletion);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/habits
 * Create a new habit
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Find or create user if not found (handles async sign-in user creation failure)
    let user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log('Creating new user:', session.user.email);
      user = await User.create({
        email: session.user.email,
        name: session.user.name || 'User',
        emailVerified: true,
        lastLoginAt: new Date(),
      });
    }

    const body = await req.json();
    
    if (!body.name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const habit = await Habit.create({
      userId: user._id,
      name: body.name,
      description: body.description,
      category: body.category,
      frequency: body.frequency || 'daily',
      reminderTime: body.reminderTime ? new Date(body.reminderTime) : undefined,
      color: body.color || '#3B82F6',
      icon: body.icon || 'default',
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error: any) {
    console.error('Error creating habit:', error);
    
    // Extract error message from Mongoose validation errors
    let errorMessage = 'Internal server error';
    if (error?.message) {
      errorMessage = error.message;
      
      // Clean up MongoDB connection errors for user display
      if (errorMessage.includes('MongoDB Atlas') || errorMessage.includes('IP') || errorMessage.includes('whitelist')) {
        errorMessage = errorMessage.split('\n\n')[0]; // Take only the first part
      }
    } else if (error?.name === 'ValidationError') {
      errorMessage = Object.values(error.errors || {})
        .map((e: any) => e.message)
        .join(', ');
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error?.name === 'ValidationError' ? 400 : 500 }
    );
  }
}


