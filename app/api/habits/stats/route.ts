import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Habit from '@/models/Habit';
import HabitCompletion from '@/models/HabitCompletion';

/**
 * GET /api/habits/stats?period=daily|weekly|monthly&habitId=<optional>
 * Fetch habit completion statistics for daily, weekly, or monthly periods
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
    const period = searchParams.get('period') || 'daily'; // daily, weekly, monthly
    const habitId = searchParams.get('habitId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let start: Date;
    let end: Date = new Date();
    end.setHours(23, 59, 59, 999);

    // Set start date based on period
    if (startDate) {
      start = new Date(startDate);
    } else {
      start = new Date();
      switch (period) {
        case 'daily':
          start.setHours(0, 0, 0, 0);
          break;
        case 'weekly':
          // Start of week (Monday)
          const day = start.getDay();
          const diff = start.getDate() - day + (day === 0 ? -6 : 1);
          start.setDate(diff);
          start.setHours(0, 0, 0, 0);
          break;
        case 'monthly':
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          break;
        default:
          start.setHours(0, 0, 0, 0);
      }
    }

    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    }

    // Build query
    const query: any = {
      userId: user._id,
      date: { $gte: start, $lte: end },
    };

    if (habitId) {
      query.habitId = habitId;
    }

    // Get completions - use .lean() for faster queries
    const completions = await HabitCompletion.find(query).sort({ date: -1 }).lean();

    // Get habits if not filtering by specific habit - use .lean() for faster queries
    let habits: any[] = [];
    if (!habitId) {
      const habitQuery: any = { userId: user._id, archived: false };
      habits = await Habit.find(habitQuery).lean();
    } else {
      const habit = await Habit.findOne({ _id: habitId, userId: user._id }).lean();
      if (habit) {
        habits = [habit];
      }
    }

    // Calculate statistics
    const stats = habits.map(habit => {
      const habitCompletions = completions.filter(
        c => c.habitId.toString() === habit._id.toString()
      );

      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const completedCount = habitCompletions.filter(c => c.completed).length;
      const missedCount = habitCompletions.filter(c => !c.completed).length;
      const completionRate = totalDays > 0 ? (completedCount / totalDays) * 100 : 0;

      // Calculate current streak
      const sortedCompletions = habitCompletions
        .filter(c => c.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      let currentStreak = 0;
      if (sortedCompletions.length > 0) {
        let expectedDate = new Date(sortedCompletions[0].date);
        expectedDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if streak includes today or yesterday
        let checkDate = new Date(today);
        if (expectedDate.getTime() !== today.getTime()) {
          checkDate.setDate(checkDate.getDate() - 1);
        }

        for (const completion of sortedCompletions) {
          const completionDate = new Date(completion.date);
          completionDate.setHours(0, 0, 0, 0);

          if (completionDate.getTime() === checkDate.getTime()) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      return {
        habitId: habit._id,
        habitName: habit.name,
        period,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalDays,
        completedCount,
        missedCount,
        completionRate: Math.round(completionRate * 100) / 100,
        currentStreak,
        completions: habitCompletions.map(c => ({
          date: c.date,
          completed: c.completed,
          notes: c.notes,
        })),
      };
    });

    return NextResponse.json({
      period,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      stats,
    });
  } catch (error) {
    console.error('Error fetching habit stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


