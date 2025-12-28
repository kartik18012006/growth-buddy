# API Quick Reference Card

## 📋 Tasks (Todos)

### Create Task
```bash
POST /api/tasks
Body: { "title": "Task name", "priority": "high", "date": "2024-01-15" }
```

### Get Tasks
```bash
GET /api/tasks?date=2024-01-15
```

### Get Task by ID
```bash
GET /api/tasks/[id]
```

### Update Task
```bash
PATCH /api/tasks/[id]
Body: { "title": "Updated title", "priority": "low" }
```

### Mark Task as Completed
```bash
PATCH /api/tasks/[id]/complete
Body: { "completed": true }
```

### Delete Task
```bash
DELETE /api/tasks/[id]
```

---

## 🎯 Habits

### Create Habit
```bash
POST /api/habits
Body: { "name": "Morning Meditation", "category": "wellness" }
```

### Get Habits
```bash
GET /api/habits?includeArchived=false
```

### Mark Habit Done
```bash
POST /api/habits/complete
Body: { "habitId": "...", "date": "2024-01-15", "completed": true }
```

### Get Habit Stats
```bash
# Daily
GET /api/habits/stats?period=daily

# Weekly
GET /api/habits/stats?period=weekly

# Monthly
GET /api/habits/stats?period=monthly

# Specific habit
GET /api/habits/stats?period=weekly&habitId=...
```

---

## 😴 Sleep Tracking

### Get Sleep Records
```bash
GET /api/sleep?date=2024-01-15
GET /api/sleep?days=30
```

### Add/Update Sleep
```bash
POST /api/sleep
Body: { "date": "2024-01-15", "hoursSlept": 7.5, "qualityRating": 4 }
```

### Get Sleep Stats (Chart Data)
```bash
# Daily (last 7 days)
GET /api/sleep/stats?period=daily

# Weekly (last 4 weeks)
GET /api/sleep/stats?period=weekly

# Monthly (last 12 months)
GET /api/sleep/stats?period=monthly
```

---

See `API_DOCUMENTATION.md` for complete documentation with request/response examples.

