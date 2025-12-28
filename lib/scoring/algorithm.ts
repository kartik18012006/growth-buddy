/**
 * Performance and Consistency Scoring Algorithm
 * 
 * Calculates daily, weekly, and monthly scores based on:
 * - Task completion percentage
 * - Habit streaks
 * - Sleep consistency
 */

export interface ScoringInputs {
  taskCompletionRate: number; // 0-100 (percentage)
  habitStreakScore: number; // 0-100 (normalized from streak days)
  sleepConsistencyScore: number; // 0-100 (based on goal adherence)
}

export interface DailyScore {
  date: string;
  score: number; // 0-100
  breakdown: {
    tasks: number; // 0-100
    habits: number; // 0-100
    sleep: number; // 0-100
  };
  weights: {
    tasks: number;
    habits: number;
    sleep: number;
  };
}

export interface WeeklyTrend {
  weekStart: string;
  weekEnd: string;
  averageScore: number;
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number; // Percentage change from previous week
  scores: DailyScore[];
}

export interface MonthlyImprovement {
  month: string;
  averageScore: number;
  improvementPercent: number; // Compared to previous month
  consistencyScore: number; // How consistent the scores were
  peakScore: number;
  lowestScore: number;
}

/**
 * Calculate daily performance score
 * 
 * Formula:
 * Score = (Task Score × 0.40) + (Habit Score × 0.35) + (Sleep Score × 0.25)
 * 
 * Weights:
 * - Tasks: 40% (productivity focus)
 * - Habits: 35% (consistency focus)
 * - Sleep: 25% (health foundation)
 */
export function calculateDailyScore(inputs: ScoringInputs): DailyScore {
  const weights = {
    tasks: 0.40,
    habits: 0.35,
    sleep: 0.25,
  };

  // Normalize inputs to 0-100 range
  const taskScore = Math.max(0, Math.min(100, inputs.taskCompletionRate));
  const habitScore = Math.max(0, Math.min(100, inputs.habitStreakScore));
  const sleepScore = Math.max(0, Math.min(100, inputs.sleepConsistencyScore));

  // Calculate weighted score
  const score = Math.round(
    taskScore * weights.tasks +
    habitScore * weights.habits +
    sleepScore * weights.sleep
  );

  return {
    date: new Date().toISOString().split('T')[0],
    score: Math.max(0, Math.min(100, score)), // Ensure 0-100 range
    breakdown: {
      tasks: taskScore,
      habits: habitScore,
      sleep: sleepScore,
    },
    weights,
  };
}

/**
 * Calculate habit streak score (0-100)
 * 
 * Scoring:
 * - 0 days: 0
 * - 1-3 days: 25-50 (building)
 * - 4-7 days: 50-75 (consistent)
 * - 8-14 days: 75-90 (strong)
 * - 15+ days: 90-100 (excellent)
 */
export function calculateHabitStreakScore(longestStreak: number): number {
  if (longestStreak === 0) return 0;
  if (longestStreak <= 3) return 25 + (longestStreak * 8.33); // 25-50
  if (longestStreak <= 7) return 50 + ((longestStreak - 3) * 6.25); // 50-75
  if (longestStreak <= 14) return 75 + ((longestStreak - 7) * 2.14); // 75-90
  return Math.min(100, 90 + ((longestStreak - 14) * 0.5)); // 90-100
}

/**
 * Calculate sleep consistency score (0-100)
 * 
 * Factors:
 * - Goal adherence (hours slept vs goal)
 * - Consistency (variance from average)
 * - Quality (if available)
 */
export function calculateSleepConsistencyScore(
  hoursSlept: number,
  goalHours: number = 8,
  qualityRating?: number // 1-5 scale
): number {
  // Goal adherence (0-70 points)
  const goalAdherence = Math.min(70, (hoursSlept / goalHours) * 70);
  
  // Quality bonus (0-30 points)
  let qualityBonus = 0;
  if (qualityRating) {
    // Convert 1-5 rating to 0-30 points
    qualityBonus = ((qualityRating - 1) / 4) * 30;
  } else {
    // If no quality rating, give partial points based on goal adherence
    qualityBonus = goalAdherence > 60 ? 15 : goalAdherence > 40 ? 10 : 5;
  }

  return Math.round(Math.min(100, goalAdherence + qualityBonus));
}

/**
 * Calculate weekly trend
 */
export function calculateWeeklyTrend(dailyScores: DailyScore[]): WeeklyTrend {
  if (dailyScores.length === 0) {
    return {
      weekStart: '',
      weekEnd: '',
      averageScore: 0,
      trend: 'stable',
      changePercent: 0,
      scores: [],
    };
  }

  // Sort by date
  const sortedScores = [...dailyScores].sort((a, b) => 
    a.date.localeCompare(b.date)
  );

  const weekStart = sortedScores[0].date;
  const weekEnd = sortedScores[sortedScores.length - 1].date;

  // Calculate average
  const averageScore = Math.round(
    sortedScores.reduce((sum, s) => sum + s.score, 0) / sortedScores.length
  );

  // Calculate trend
  const firstHalf = sortedScores.slice(0, Math.ceil(sortedScores.length / 2));
  const secondHalf = sortedScores.slice(Math.ceil(sortedScores.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.score, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s.score, 0) / secondHalf.length;
  
  const changePercent = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  
  let trend: 'improving' | 'stable' | 'declining';
  if (changePercent > 5) trend = 'improving';
  else if (changePercent < -5) trend = 'declining';
  else trend = 'stable';

  return {
    weekStart,
    weekEnd,
    averageScore,
    trend,
    changePercent: Math.round(changePercent * 10) / 10,
    scores: sortedScores,
  };
}

/**
 * Calculate monthly improvement
 */
export function calculateMonthlyImprovement(
  monthlyScores: Array<{ month: string; averageScore: number }>
): MonthlyImprovement[] {
  return monthlyScores.map((current, index) => {
    const previous = monthlyScores[index - 1];
    
    const improvementPercent = previous
      ? ((current.averageScore - previous.averageScore) / previous.averageScore) * 100
      : 0;

    return {
      month: current.month,
      averageScore: current.averageScore,
      improvementPercent: Math.round(improvementPercent * 10) / 10,
      consistencyScore: 0, // Would need daily scores for this month to calculate
      peakScore: current.averageScore,
      lowestScore: current.averageScore,
    };
  });
}

/**
 * Calculate consistency score (coefficient of variation)
 * Lower variation = higher consistency
 */
export function calculateConsistencyScore(scores: number[]): number {
  if (scores.length === 0) return 0;

  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // Coefficient of variation
  const cv = mean > 0 ? (stdDev / mean) * 100 : 100;
  
  // Convert to 0-100 score (lower CV = higher consistency)
  // CV of 0 = 100 points, CV of 50+ = 0 points
  const consistencyScore = Math.max(0, Math.min(100, 100 - (cv * 2)));
  
  return Math.round(consistencyScore);
}

/**
 * Get score label and color
 */
export function getScoreLabel(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 90) {
    return {
      label: 'Excellent',
      color: 'green',
      description: 'Outstanding performance!',
    };
  }
  if (score >= 75) {
    return {
      label: 'Great',
      color: 'blue',
      description: 'You\'re doing great!',
    };
  }
  if (score >= 60) {
    return {
      label: 'Good',
      color: 'yellow',
      description: 'Solid progress.',
    };
  }
  if (score >= 40) {
    return {
      label: 'Fair',
      color: 'orange',
      description: 'Room for improvement.',
    };
  }
  return {
    label: 'Needs Work',
    color: 'red',
    description: 'Let\'s build momentum!',
  };
}


