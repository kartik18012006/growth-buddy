import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Habit from '@/models/Habit';
import HabitCompletion from '@/models/HabitCompletion';
import { subDays } from 'date-fns';

/**
 * GET /api/habits/batch-stats?habitIds=id1,id2,id3
 * Get completion stats for multiple habits in a single optimized query
 * This significantly reduces API calls and improves performance
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
    const habitIdsParam = searchParams.get('habitIds');
    
    if (!habitIdsParam) {
      return NextResponse.json({ error: 'habitIds parameter is required' }, { status: 400 });
    }

    const habitIds = habitIdsParam.split(',').filter(id => id.trim());
    
    if (habitIds.length === 0) {
      return NextResponse.json({ stats: [] });
    }

    // Calculate date range (last 30 days)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = subDays(endDate, 29);
    startDate.setHours(0, 0, 0, 0);

    // Fetch all completions for all habits in a single query
    const completions = await HabitCompletion.find({
      userId: user._id,
      habitId: { $in: habitIds },
      date: { $gte: startDate, $lte: endDate },
    })
      .lean()
      .sort({ date: -1 });

    // Fetch habits in a single query
    const habits = await Habit.find({
      _id: { $in: habitIds },
      userId: user._id,
    }).lean();

    // Group completions by habitId
    const completionsByHabit = new Map<string, any[]>();
    completions.forEach((completion: any) => {
      const habitIdStr = completion.habitId.toString();
      if (!completionsByHabit.has(habitIdStr)) {
        completionsByHabit.set(habitIdStr, []);
      }
      completionsByHabit.get(habitIdStr)!.push(completion);
    });

    // Build stats for each habit
    const stats = habits.map((habit: any) => {
      const habitCompletions = completionsByHabit.get(habit._id.toString()) || [];
      
      // Get today's completion - normalize dates for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      
      const todayCompletion = habitCompletions.find((c: any) => {
        const completionDate = new Date(c.date);
        completionDate.setHours(0, 0, 0, 0);
        return completionDate.getTime() === todayTime;
      });

      // Format completions array
      const formattedCompletions = habitCompletions.map((c: any) => ({
        date: c.date,
        completed: c.completed,
        notes: c.notes,
      }));

      return {
        habitId: habit._id.toString(),
        habitName: habit.name,
        todayCompleted: todayCompletion?.completed || false,
        completions: formattedCompletions,
      };
    });

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching batch habit stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

