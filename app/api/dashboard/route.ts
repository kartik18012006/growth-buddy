import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Task from '@/models/Task';
import Habit from '@/models/Habit';
import HabitCompletion from '@/models/HabitCompletion';
import SleepRecord from '@/models/SleepRecord';

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's tasks
    const tasks = await Task.find({
      userId: user._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });

    // Get active habits
    const habits = await Habit.find({
      userId: user._id,
      archived: false,
      frequency: 'daily',
    });

    // Get today's habit completions
    const habitCompletions = await HabitCompletion.find({
      userId: user._id,
      date: today,
    });

    // Get yesterday's sleep (last night)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sleepRecord = await SleepRecord.findOne({
      userId: user._id,
      date: yesterday,
    });

    // Calculate longest streak
    const allCompletions = await HabitCompletion.find({
      userId: user._id,
      completed: true,
    }).sort({ date: -1 }).limit(1000);

    let longestStreak = 0;
    if (allCompletions.length > 0) {
      let currentStreak = 0;
      let expectedDate = new Date(allCompletions[0].date);
      expectedDate.setHours(0, 0, 0, 0);

      for (const completion of allCompletions) {
        const completionDate = new Date(completion.date);
        completionDate.setHours(0, 0, 0, 0);

        if (completionDate.getTime() === expectedDate.getTime()) {
          currentStreak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          break;
        }
      }
    }

    return NextResponse.json({
      tasksToday: tasks.length,
      tasksCompleted: tasks.filter(t => t.completed).length,
      habitsToday: habits.length,
      habitsCompleted: habitCompletions.filter(h => h.completed).length,
      sleepHours: sleepRecord?.hoursSlept,
      longestStreak,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



