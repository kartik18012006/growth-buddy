# Performance and Consistency Scoring Algorithm

## 📊 Overview

A comprehensive scoring system that combines task completion, habit streaks, and sleep consistency into a unified performance score.

---

## 🧮 Algorithm Details

### Daily Score Calculation

**Formula:**
```
Daily Score = (Task Score × 0.40) + (Habit Score × 0.35) + (Sleep Score × 0.25)
```

**Weights:**
- **Tasks**: 40% (productivity focus)
- **Habits**: 35% (consistency focus)  
- **Sleep**: 25% (health foundation)

**Range:** 0-100 points

---

### Component Scores

#### 1. Task Completion Score (0-100)

Direct percentage of completed tasks:
```
Task Score = (Completed Tasks / Total Tasks) × 100
```

If no tasks: `0`

---

#### 2. Habit Streak Score (0-100)

Non-linear scoring based on streak length:

| Streak Days | Score Range | Formula |
|-------------|-------------|---------|
| 0 days | 0 | - |
| 1-3 days | 25-50 | 25 + (days × 8.33) |
| 4-7 days | 50-75 | 50 + ((days - 3) × 6.25) |
| 8-14 days | 75-90 | 75 + ((days - 7) × 2.14) |
| 15+ days | 90-100 | 90 + ((days - 14) × 0.5) |

**Logic:** Rewards consistency, with diminishing returns for very long streaks.

---

#### 3. Sleep Consistency Score (0-100)

Combines goal adherence and quality:

```
Sleep Score = Goal Adherence (0-70) + Quality Bonus (0-30)
```

**Goal Adherence (0-70 points):**
```
Goal Adherence = (Hours Slept / Goal Hours) × 70
```

**Quality Bonus (0-30 points):**
- If quality rating provided (1-5 scale):
  ```
  Quality Bonus = ((Quality - 1) / 4) × 30
  ```
- If no quality rating:
  - Goal met (>60%): 15 points
  - Partial (40-60%): 10 points
  - Below goal (<40%): 5 points

---

## 📈 Weekly Trend Calculation

### Average Score
```
Weekly Average = Sum(Daily Scores) / Number of Days
```

### Trend Detection
1. Split week into two halves
2. Calculate average for each half
3. Compare averages:

```
Change % = ((Second Half Avg - First Half Avg) / First Half Avg) × 100
```

**Trend Classification:**
- **Improving**: Change > +5%
- **Declining**: Change < -5%
- **Stable**: Change between -5% and +5%

---

## 📊 Monthly Improvement Calculation

### Average Score
```
Monthly Average = Sum(Daily Scores in Month) / Days in Month
```

### Improvement Percentage
```
Improvement % = ((Current Month - Previous Month) / Previous Month) × 100
```

### Consistency Score

Uses **Coefficient of Variation**:

```
Mean = Average of daily scores
StdDev = Standard deviation of daily scores
CV = (StdDev / Mean) × 100

Consistency Score = 100 - (CV × 2)
```

Lower variation = Higher consistency score

**Range:** 0-100 (100 = perfectly consistent)

---

## 🎯 Score Labels

| Score Range | Label | Color | Description |
|-------------|-------|-------|-------------|
| 90-100 | Excellent | Green | Outstanding performance! |
| 75-89 | Great | Blue | You're doing great! |
| 60-74 | Good | Yellow | Solid progress. |
| 40-59 | Fair | Orange | Room for improvement. |
| 0-39 | Needs Work | Red | Let's build momentum! |

---

## 📡 API Endpoints

### GET /api/scoring/daily
Returns today's performance score with breakdown.

**Response:**
```json
{
  "date": "2024-01-15",
  "score": 85,
  "breakdown": {
    "tasks": 90,
    "habits": 80,
    "sleep": 85
  },
  "weights": {
    "tasks": 0.40,
    "habits": 0.35,
    "sleep": 0.25
  }
}
```

---

### GET /api/scoring/weekly
Returns weekly trend with daily scores.

**Response:**
```json
{
  "weekStart": "2024-01-08",
  "weekEnd": "2024-01-14",
  "averageScore": 82,
  "trend": "improving",
  "changePercent": 8.5,
  "scores": [
    { "date": "2024-01-08", "score": 75, ... },
    ...
  ]
}
```

---

### GET /api/scoring/monthly?months=6
Returns monthly improvement scores.

**Response:**
```json
{
  "improvements": [
    {
      "month": "Aug 2024",
      "averageScore": 72,
      "improvementPercent": 0,
      "consistencyScore": 85,
      "peakScore": 95,
      "lowestScore": 50
    },
    ...
  ]
}
```

---

## 💻 Usage Examples

### Calculate Today's Score

```typescript
import { scoringApi } from '@/lib/api';

const dailyScore = await scoringApi.getDailyScore();
console.log(`Today's score: ${dailyScore.score}`);
console.log(`Task contribution: ${dailyScore.breakdown.tasks}`);
```

### Get Weekly Trend

```typescript
const weeklyTrend = await scoringApi.getWeeklyTrend();
console.log(`Trend: ${weeklyTrend.trend}`);
console.log(`Change: ${weeklyTrend.changePercent}%`);
```

### Get Monthly Improvement

```typescript
const monthly = await scoringApi.getMonthlyImprovement(6);
monthly.improvements.forEach(month => {
  console.log(`${month.month}: ${month.averageScore} (${month.improvementPercent}% change)`);
});
```

---

## 🎨 Visualization Components

### PerformanceScore
Shows daily score with:
- Circular progress indicator
- Score breakdown (Tasks, Habits, Sleep)
- Progress bars for each component
- Score label and description

### WeeklyTrendChart
Shows weekly trend with:
- Line chart of daily scores
- Trend indicator (improving/declining/stable)
- Change percentage
- Average score display

### MonthlyImprovementChart
Shows monthly improvement with:
- Line chart of monthly averages
- Consistency score overlay
- Peak, average, and consistency stats
- Improvement percentage

---

## 🔧 Algorithm Parameters

### Weights (Customizable)
```typescript
weights: {
  tasks: 0.40,   // 40% weight
  habits: 0.35,  // 35% weight
  sleep: 0.25,   // 25% weight
}
```

### Habit Streak Thresholds
- Building phase: 1-3 days
- Consistent phase: 4-7 days
- Strong phase: 8-14 days
- Excellent phase: 15+ days

### Trend Sensitivity
- Improvement threshold: +5%
- Decline threshold: -5%

---

## 📊 Example Calculations

### Example 1: High Performer
- Tasks: 100% completion (100 points)
- Habits: 14-day streak (90 points)
- Sleep: 8 hours (goal: 8, quality: 5) → 100 points

**Daily Score:**
```
(100 × 0.40) + (90 × 0.35) + (100 × 0.25) = 96.5 → 97
```

### Example 2: Average Performer
- Tasks: 60% completion (60 points)
- Habits: 5-day streak (62.5 points)
- Sleep: 7 hours (goal: 8, quality: 4) → 86.25 points

**Daily Score:**
```
(60 × 0.40) + (62.5 × 0.35) + (86.25 × 0.25) = 68.3 → 68
```

### Example 3: Building Consistency
- Tasks: 40% completion (40 points)
- Habits: 2-day streak (41.66 points)
- Sleep: 6 hours (goal: 8) → 67.5 points

**Daily Score:**
```
(40 × 0.40) + (41.66 × 0.35) + (67.5 × 0.25) = 47.7 → 48
```

---

## 🎯 Design Principles

1. **Weighted Balance**: Tasks slightly weighted, but habits and sleep matter
2. **Non-linear Rewards**: Long habit streaks rewarded but with diminishing returns
3. **Holistic Health**: Sleep included as foundation for performance
4. **Consistency Focus**: Monthly consistency score rewards steady progress
5. **Clear Feedback**: Score labels provide actionable guidance

---

## 📈 Future Enhancements

- [ ] Customizable weights per user
- [ ] Goal-based scoring (custom targets)
- [ ] Historical comparison (same week last month)
- [ ] Predictive scoring (trend forecasting)
- [ ] Category breakdowns (work vs personal tasks)

---

**Scoring algorithm is complete and ready to use!** 📊✨


