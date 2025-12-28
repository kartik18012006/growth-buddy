/**
 * Scoring Calculator
 * 
 * Higher-level functions that fetch data and calculate scores
 */

import {
  calculateDailyScore,
  calculateHabitStreakScore,
  calculateSleepConsistencyScore,
  calculateWeeklyTrend,
  calculateMonthlyImprovement,
  calculateConsistencyScore,
  type DailyScore,
  type WeeklyTrend,
  type MonthlyImprovement,
} from './algorithm';
import { tasksApi, habitsApi, sleepApi } from '@/lib/api';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths, eachDayOfInterval } from 'date-fns';

/**
 * Calculate today's score
 */
export async function calculateTodayScore(userId?: string): Promise<DailyScore> {
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Fetch today's tasks
  const tasks = await tasksApi.getTasks(today);
  const taskCompletionRate = tasks.length > 0
    ? (tasks.filter(t => t.completed).length / tasks.length) * 100
    : 0;

  // Fetch habits and calculate streak score
  const habits = await habitsApi.getHabits();
  let longestStreak = 0;
  
  for (const habit of habits) {
    try {
      const stats = await habitsApi.getHabitStats('daily', habit._id);
      const habitStats = stats.stats[0];
      if (habitStats?.currentStreak > longestStreak) {
        longestStreak = habitStats.currentStreak;
      }
    } catch (error) {
      // Continue
    }
  }
  
  const habitStreakScore = calculateHabitStreakScore(longestStreak);

  // Fetch last night's sleep
  let sleepConsistencyScore = 0;
  try {
    const sleepRecord = await sleepApi.getSleepRecord(yesterday);
    if (sleepRecord) {
      sleepConsistencyScore = calculateSleepConsistencyScore(
        sleepRecord.hoursSlept,
        sleepRecord.goalHours || 8,
        sleepRecord.qualityRating
      );
    }
  } catch (error) {
    // No sleep data, use default
  }

  return calculateDailyScore({
    taskCompletionRate,
    habitStreakScore,
    sleepConsistencyScore,
  });
}

/**
 * Calculate weekly trend
 */
export async function calculateWeeklyTrendScore(userId?: string): Promise<WeeklyTrend> {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const dailyScores: DailyScore[] = [];

  for (const day of days) {
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // Fetch tasks
    let taskCompletionRate = 0;
    try {
      const tasks = await tasksApi.getTasks(dateStr);
      taskCompletionRate = tasks.length > 0
        ? (tasks.filter(t => t.completed).length / tasks.length) * 100
        : 0;
    } catch (error) {
      // Continue
    }

    // Calculate habit streak (use current longest streak for all days)
    const habits = await habitsApi.getHabits();
    let longestStreak = 0;
    for (const habit of habits) {
      try {
        const stats = await habitsApi.getHabitStats('daily', habit._id);
        const habitStats = stats.stats[0];
        if (habitStats?.currentStreak > longestStreak) {
          longestStreak = habitStats.currentStreak;
        }
      } catch (error) {
        // Continue
      }
    }
    const habitStreakScore = calculateHabitStreakScore(longestStreak);

    // Fetch sleep for previous night
    let sleepConsistencyScore = 0;
    const previousDay = subDays(day, 1);
    try {
      const sleepRecord = await sleepApi.getSleepRecord(format(previousDay, 'yyyy-MM-dd'));
      if (sleepRecord) {
        sleepConsistencyScore = calculateSleepConsistencyScore(
          sleepRecord.hoursSlept,
          sleepRecord.goalHours || 8,
          sleepRecord.qualityRating
        );
      }
    } catch (error) {
      // Continue
    }

    const score = calculateDailyScore({
      taskCompletionRate,
      habitStreakScore,
      sleepConsistencyScore,
    });
    
    dailyScores.push({
      ...score,
      date: dateStr,
    });
  }

  return calculateWeeklyTrend(dailyScores);
}

/**
 * Calculate monthly improvement
 */
export async function calculateMonthlyImprovementScore(
  months: number = 6
): Promise<MonthlyImprovement[]> {
  const monthlyData: Array<{ month: string; averageScore: number; dailyScores: number[] }> = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(new Date(), i));
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const monthScores: number[] = [];

    for (const day of days) {
      const dateStr = format(day, 'yyyy-MM-dd');
      
      // Fetch tasks
      let taskCompletionRate = 0;
      try {
        const tasks = await tasksApi.getTasks(dateStr);
        taskCompletionRate = tasks.length > 0
          ? (tasks.filter(t => t.completed).length / tasks.length) * 100
          : 0;
      } catch (error) {
        // Continue
      }

      // Calculate habit streak
      const habits = await habitsApi.getHabits();
      let longestStreak = 0;
      for (const habit of habits) {
        try {
          const stats = await habitsApi.getHabitStats('daily', habit._id);
          const habitStats = stats.stats[0];
          if (habitStats?.currentStreak > longestStreak) {
            longestStreak = habitStats.currentStreak;
          }
        } catch (error) {
          // Continue
        }
      }
      const habitStreakScore = calculateHabitStreakScore(longestStreak);

      // Fetch sleep
      let sleepConsistencyScore = 0;
      const previousDay = subDays(day, 1);
      try {
        const sleepRecord = await sleepApi.getSleepRecord(format(previousDay, 'yyyy-MM-dd'));
        if (sleepRecord) {
          sleepConsistencyScore = calculateSleepConsistencyScore(
            sleepRecord.hoursSlept,
            sleepRecord.goalHours || 8,
            sleepRecord.qualityRating
          );
        }
      } catch (error) {
        // Continue
      }

      const score = calculateDailyScore({
        taskCompletionRate,
        habitStreakScore,
        sleepConsistencyScore,
      });
      
      monthScores.push(score.score);
    }

    const averageScore = monthScores.length > 0
      ? Math.round(monthScores.reduce((sum, s) => sum + s, 0) / monthScores.length)
      : 0;

    monthlyData.push({
      month: format(monthStart, 'MMM yyyy'),
      averageScore,
      dailyScores: monthScores,
    });
  }

  // Calculate improvement percentages
  const improvements = monthlyData.map((current, index) => {
    const previous = monthlyData[index - 1];
    const improvementPercent = previous
      ? ((current.averageScore - previous.averageScore) / previous.averageScore) * 100
      : 0;

    const consistencyScore = calculateConsistencyScore(current.dailyScores);

    return {
      month: current.month,
      averageScore: current.averageScore,
      improvementPercent: Math.round(improvementPercent * 10) / 10,
      consistencyScore,
      peakScore: current.dailyScores.length > 0 ? Math.max(...current.dailyScores) : 0,
      lowestScore: current.dailyScores.length > 0 ? Math.min(...current.dailyScores) : 0,
    };
  });

  return improvements;
}


