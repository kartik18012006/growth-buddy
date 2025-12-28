import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import HabitCompletion from '@/models/HabitCompletion';
import { subDays, format, parseISO } from 'date-fns';

/**
 * GET /api/habits/completions
 * Get completion data for all habits (last 30 days)
 * Optimized batch endpoint to avoid N+1 queries
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
    const habitId = searchParams.get('habitId');
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range (last N days)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = subDays(endDate, days - 1);
    startDate.setHours(0, 0, 0, 0);

    // Build query
    const query: any = {
      userId: user._id,
      date: { $gte: startDate, $lte: endDate },
    };

    if (habitId) {
      query.habitId = habitId;
    }

    // Fetch all completions in a single query
    const completions = await HabitCompletion.find(query)
      .lean()
      .sort({ date: -1 });

    // Group by habitId and date
    const completionsByHabit = new Map<string, Map<string, boolean>>();
    
    completions.forEach((completion: any) => {
      const habitIdStr = completion.habitId.toString();
      const dateStr = format(completion.date, 'yyyy-MM-dd');
      
      if (!completionsByHabit.has(habitIdStr)) {
        completionsByHabit.set(habitIdStr, new Map());
      }
      
      const habitCompletions = completionsByHabit.get(habitIdStr)!;
      habitCompletions.set(dateStr, completion.completed);
    });

    // Convert to array format
    const result: Record<string, Array<{ date: string; completed: boolean }>> = {};
    
    completionsByHabit.forEach((dates, habitId) => {
      result[habitId] = Array.from(dates.entries()).map(([date, completed]) => ({
        date: new Date(date + 'T00:00:00.000Z').toISOString(),
        completed,
      }));
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching habit completions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

