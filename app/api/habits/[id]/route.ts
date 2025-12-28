import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Habit from '@/models/Habit';
import HabitCompletion from '@/models/HabitCompletion';

/**
 * GET /api/habits/[id]
 * Get a single habit by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const habit = await Habit.findOne({
      _id: params.id,
      userId: user._id,
    }).lean();

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error('Error fetching habit:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/habits/[id]
 * Update a habit
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const habit = await Habit.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      body,
      { new: true, runValidators: true }
    ).lean();

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json(habit);
  } catch (error: any) {
    console.error('Error updating habit:', error);
    const errorMessage = error?.message || 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: error?.name === 'ValidationError' ? 400 : 500 }
    );
  }
}

/**
 * DELETE /api/habits/[id]
 * Delete a habit and all its completions
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if habit exists and belongs to user
    const habit = await Habit.findOne({
      _id: params.id,
      userId: user._id,
    });

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Delete all completions for this habit
    await HabitCompletion.deleteMany({
      habitId: params.id,
      userId: user._id,
    });

    // Delete the habit
    await Habit.deleteOne({ _id: params.id, userId: user._id });

    return NextResponse.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

