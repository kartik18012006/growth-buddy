# Scoring Algorithm - Complete ✅

## 🎉 What's Been Created

### 1. **Core Algorithm** (`lib/scoring/algorithm.ts`)

✅ `calculateDailyScore()` - Main scoring function
✅ `calculateHabitStreakScore()` - Non-linear streak scoring
✅ `calculateSleepConsistencyScore()` - Sleep goal + quality scoring
✅ `calculateWeeklyTrend()` - Trend detection (improving/declining/stable)
✅ `calculateMonthlyImprovement()` - Month-over-month improvement
✅ `calculateConsistencyScore()` - Coefficient of variation
✅ `getScoreLabel()` - Score categorization (Excellent, Great, etc.)

### 2. **Calculator Functions** (`lib/scoring/calculator.ts`)

✅ `calculateTodayScore()` - Fetch data and calculate today's score
✅ `calculateWeeklyTrendScore()` - Calculate weekly trend
✅ `calculateMonthlyImprovementScore()` - Calculate monthly improvements

### 3. **API Endpoints** (`app/api/scoring/`)

✅ `GET /api/scoring/daily` - Today's score
✅ `GET /api/scoring/weekly` - Weekly trend
✅ `GET /api/scoring/monthly` - Monthly improvement

### 4. **API Service** (`lib/api/scoring.ts`)

✅ TypeScript types for all score data
✅ API client functions

### 5. **Visualization Components** (`components/scoring/`)

✅ `PerformanceScore` - Daily score display with breakdown
✅ `WeeklyTrendChart` - Weekly trend line chart
✅ `MonthlyImprovementChart` - Monthly improvement line chart

### 6. **Documentation**

✅ `SCORING_ALGORITHM.md` - Complete algorithm documentation

---

## 📊 Scoring Formula

### Daily Score
```
Score = (Task % × 0.40) + (Habit Streak × 0.35) + (Sleep × 0.25)
```

**Weights:**
- Tasks: 40%
- Habits: 35%
- Sleep: 25%

**Range:** 0-100

---

## 🎯 Component Scoring

### Task Score
- Direct percentage: `(Completed / Total) × 100`

### Habit Streak Score
- Non-linear progression:
  - 1-3 days: 25-50 points
  - 4-7 days: 50-75 points
  - 8-14 days: 75-90 points
  - 15+ days: 90-100 points

### Sleep Score
- Goal adherence (0-70): `(Hours / Goal) × 70`
- Quality bonus (0-30): Based on 1-5 rating
- Total: 0-100 points

---

## 📈 Trend Calculation

### Weekly Trend
- Split week into halves
- Compare averages
- Classify: Improving (+5%), Stable (-5% to +5%), Declining (-5%)

### Monthly Improvement
- Month-over-month percentage change
- Consistency score (coefficient of variation)
- Peak and lowest scores

---

## 🎨 Visualization Features

### PerformanceScore Component
- Circular progress indicator (0-100)
- Breakdown bars (Tasks, Habits, Sleep)
- Score label (Excellent, Great, Good, etc.)
- Weight indicators

### WeeklyTrendChart Component
- Line chart with daily scores
- Trend indicator (arrow + percentage)
- Average score display
- Date range

### MonthlyImprovementChart Component
- Line chart (average + consistency)
- Improvement percentage
- Peak, average, consistency stats
- Multi-month view

---

## 📡 API Usage

```typescript
import { scoringApi } from '@/lib/api';

// Get today's score
const daily = await scoringApi.getDailyScore();

// Get weekly trend
const weekly = await scoringApi.getWeeklyTrend();

// Get monthly improvement (last 6 months)
const monthly = await scoringApi.getMonthlyImprovement(6);
```

---

## 📊 Example Outputs

### Daily Score
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

### Weekly Trend
```json
{
  "weekStart": "2024-01-08",
  "weekEnd": "2024-01-14",
  "averageScore": 82,
  "trend": "improving",
  "changePercent": 8.5,
  "scores": [...]
}
```

### Monthly Improvement
```json
{
  "improvements": [
    {
      "month": "Jan 2024",
      "averageScore": 75,
      "improvementPercent": 10.5,
      "consistencyScore": 85,
      "peakScore": 95,
      "lowestScore": 60
    }
  ]
}
```

---

## 🎯 Score Labels

| Score | Label | Color |
|-------|-------|-------|
| 90-100 | Excellent | Green |
| 75-89 | Great | Blue |
| 60-74 | Good | Yellow |
| 40-59 | Fair | Orange |
| 0-39 | Needs Work | Red |

---

## ✅ Features

- ✅ Weighted scoring algorithm
- ✅ Non-linear habit streak rewards
- ✅ Sleep goal + quality scoring
- ✅ Weekly trend detection
- ✅ Monthly improvement tracking
- ✅ Consistency measurement
- ✅ Clean visualization components
- ✅ TypeScript types
- ✅ API endpoints
- ✅ Comprehensive documentation

---

**Scoring algorithm is complete and ready to use!** 📊✨


