# Growth Buddy - Product Blueprint

## Executive Summary

Growth Buddy is a comprehensive personal development and productivity web application that helps users track their habits, manage daily tasks, monitor sleep patterns, and visualize their progress over time. The app integrates with Google Calendar to provide context-aware scheduling and reminders.

---

## 1. Feature List

### MVP (Minimum Viable Product)

#### Core Features
1. **User Authentication**
   - Email/password signup and login
   - Password reset functionality
   - Basic user profile (name, email)

2. **Daily To-Do Lists**
   - Create, edit, delete tasks
   - Mark tasks as complete/incomplete
   - Tasks persist per day (date-based)
   - Simple priority levels (high/medium/low)

3. **Habit Checklist**
   - Create custom habits
   - Mark habits as done/not done daily
   - Basic habit streak counter
   - Habit list view (daily)

4. **Sleep Tracking**
   - Manual entry of hours slept
   - Date-based sleep records
   - Simple sleep log display

5. **Basic Dashboard**
   - Today's to-do list summary
   - Today's habit checklist
   - Quick sleep entry
   - Current habit streaks

6. **Data Visualization (Basic)**
   - Daily habit completion chart (last 7 days)
   - Sleep hours chart (last 7 days)
   - Simple line/bar graphs

#### Technical MVP Requirements
- Responsive web design (mobile-friendly)
- Data persistence (database)
- Basic authentication and authorization
- Simple REST API or serverless functions
- Basic error handling and validation

---

### Future Features (Post-MVP)

#### Enhanced Tracking & Analytics
1. **Advanced Habit Features**
   - Habit categories/tags
   - Habit frequency settings (daily, weekly, custom)
   - Habit notes/journal entries
   - Habit templates library
   - Habit sharing with community

2. **Enhanced To-Do Lists**
   - Task categories/projects
   - Task due dates and times
   - Task recurring patterns
   - Subtasks/checklists within tasks
   - Task attachments/files
   - Task collaboration (share with others)

3. **Advanced Sleep Tracking**
   - Sleep quality ratings
   - Bedtime and wake time tracking
   - Sleep notes/journal
   - Sleep goal setting
   - Sleep reminders (bedtime/wake)

4. **Comprehensive Analytics**
   - Weekly performance reports
   - Monthly performance reports
   - Yearly overview
   - Habit consistency scores (%)
   - Completion rate trends
   - Correlation analysis (e.g., sleep vs. productivity)
   - Export data (CSV, PDF)

5. **Google Calendar Integration**
   - Sync tasks/to-dos to calendar events
   - Import calendar events as tasks
   - Two-way sync capability
   - Calendar-based reminders
   - Smart scheduling suggestions

6. **Reminder System**
   - Email reminders
   - Push notifications (if mobile app)
   - In-app notifications
   - Customizable reminder times
   - Habit-specific reminders
   - Task deadline reminders
   - Sleep reminders (bedtime/wake)

7. **Social & Gamification**
   - Friend connections
   - Leaderboards
   - Achievement badges
   - Streak milestones
   - Share progress on social media

8. **Additional Features**
   - Mood tracking
   - Energy level tracking
   - Notes/journaling
   - Goal setting (SMART goals)
   - Pomodoro timer
   - Meditation/mindfulness tracking
   - Expense tracking
   - Health metrics (exercise, weight, etc.)

---

## 2. User Flow

### A. Signup Flow
1. User visits Growth Buddy homepage
2. Clicks "Sign Up" or "Get Started"
3. Enters email and password
4. (Optional) Verifies email
5. Onboarding wizard:
   - Welcome screen
   - Tutorial: "Let's set up your first habit"
   - Create 1-3 initial habits
   - Optional: Connect Google Calendar
6. Redirected to Dashboard

### B. Daily Usage Flow (Returning User)

#### Morning Routine
1. User logs in (or returns to app)
2. Lands on Dashboard
3. Reviews today's to-do list
4. Reviews today's habit checklist
5. Marks completed habits/tasks
6. (Optional) Enters previous night's sleep hours
7. Plans day: adds new tasks

#### Throughout the Day
1. Receives reminder notifications (if enabled)
2. Updates task status as items are completed
3. Marks habits as done when performed
4. Adds new tasks as needed

#### Evening Routine
1. Reviews daily progress
2. Marks remaining habits as done/not done
3. Enters today's sleep hours
4. Reviews tomorrow's scheduled items (if calendar integrated)
5. Plans next day's to-do list (optional)

### C. Weekly/Monthly Review Flow
1. User navigates to Analytics/Reports page
2. Views weekly/monthly performance graphs
3. Reviews habit consistency scores
4. Identifies trends and areas for improvement
5. Adjusts habits/goals based on insights

### D. Habit Management Flow
1. User navigates to "Habits" page
2. Views all habits and current streaks
3. Creates new habit (name, category, optional description)
4. Edits existing habit
5. Archives/deletes habit
6. Views habit detail page with full history

### E. Calendar Integration Flow
1. User navigates to Settings → Integrations
2. Clicks "Connect Google Calendar"
3. Authorizes via OAuth
4. Selects which calendars to sync
5. Configures sync preferences (one-way/two-way)
6. Confirms connection successful
7. Tasks/habits sync automatically going forward

---

## 3. Key Screens/Pages

### 3.1 Authentication Pages

#### Sign Up Page
- **Elements:**
  - Email input field
  - Password input field (with strength indicator)
  - Confirm password field
  - "Sign Up" button
  - Link to "Already have an account? Log in"
  - Terms of service / Privacy policy links

#### Login Page
- **Elements:**
  - Email input field
  - Password input field
  - "Log In" button
  - "Forgot Password?" link
  - Link to "Don't have an account? Sign up"
  - Optional: "Remember me" checkbox

#### Password Reset Page
- **Elements:**
  - Email input field
  - "Send Reset Link" button
  - Confirmation message

### 3.2 Main Application Pages

#### Dashboard (Home Page)
- **Layout:** Single-page dashboard with widgets
- **Sections:**
  - **Header:**
    - App logo/branding
    - Navigation menu
    - User profile icon/dropdown
    - Notification bell
  - **Today's Date Display:** Large, prominent date display
  - **Quick Stats Widget:**
    - Today's tasks completed: X/Y
    - Today's habits completed: X/Y
    - Current longest streak
  - **Today's To-Do List Widget:**
    - List of today's tasks
    - Checkbox to mark complete
    - "+ Add Task" button
    - Shows priority indicators
  - **Today's Habits Widget:**
    - List of daily habits
    - Checkbox/toggle to mark done/not done
    - Streak indicator next to each habit
    - "+ Add Habit" button (if none exist)
  - **Sleep Entry Widget:**
    - "Enter last night's sleep: X hours" input
    - Quick input buttons (6h, 7h, 8h, 9h)
    - Submit button
    - Last 3 nights display (mini chart)
  - **Today's Calendar Events Widget:** (if calendar integrated)
    - Upcoming events today
    - Link to full calendar view

#### To-Do Lists Page
- **Layout:** Full-page task management interface
- **Elements:**
  - Date picker to view different days
  - Filter options (All, Pending, Completed, By Priority)
  - Task list with:
    - Checkbox
    - Task title
    - Priority badge
    - Due time (if set)
    - Edit/Delete icons
  - "+ Add New Task" button/modal
  - Task detail view (when clicked/expanded):
    - Full description
    - Edit form
    - Delete option

#### Habits Page
- **Layout:** List/grid view of all habits
- **Elements:**
  - "Create New Habit" button
  - Habit cards/list items showing:
    - Habit name
    - Current streak (e.g., "🔥 12 days")
    - Completion percentage (last 7/30 days)
    - Today's status (done/not done toggle)
    - Edit/Delete icons
  - Filter/Sort options:
    - All habits
    - Active habits
    - Archived habits
    - Sort by streak, name, completion rate
  - Habit detail view (click to expand):
    - Full history chart
    - Notes/journal entries
    - Edit form
    - Archive/Delete option

#### Sleep Tracking Page
- **Layout:** Calendar view + graph
- **Elements:**
  - Month calendar view with sleep hours per day
    - Color-coded (e.g., green = 7-9h, yellow = 5-7h, red = <5h)
  - Sleep entry form:
    - Date picker
    - Hours input (slider or number input)
    - Optional: Sleep quality rating (1-5 stars)
    - Optional: Bedtime/wake time
    - Optional: Notes
    - Submit button
  - Sleep statistics:
    - Average sleep (last 7/30 days)
    - Sleep goal progress
    - Longest consecutive nights meeting goal
  - Sleep graph:
    - Line/bar chart showing sleep hours over time
    - Time range selector (7 days, 30 days, 90 days, 1 year)

#### Analytics/Reports Page
- **Layout:** Multi-section dashboard with graphs
- **Sections:**
  - **Date Range Selector:**
    - Quick filters (Today, Week, Month, Year, Custom)
  - **Habit Consistency Section:**
    - Bar chart: Habit completion % per habit
    - Heatmap calendar: Daily habit completion (last 30 days)
    - Line chart: Habit consistency trends over time
  - **Task Completion Section:**
    - Daily task completion rate chart
    - Weekly/monthly task completion summary
    - Productivity trends
  - **Sleep Analysis Section:**
    - Sleep hours chart (daily/weekly/monthly)
    - Average sleep by day of week
    - Sleep goal adherence %
  - **Combined Insights:**
    - Correlation charts (e.g., sleep vs. task completion)
    - Weekly performance score
    - Monthly summary card
  - **Export Options:**
    - Export to CSV/PDF buttons

#### Calendar Integration Page
- **Layout:** Settings-style page with connection status
- **Elements:**
  - Google Calendar connection status indicator
  - "Connect Google Calendar" button (if not connected)
  - "Disconnect" button (if connected)
  - Sync settings:
    - Two-way sync toggle
    - Selected calendars (multi-select)
    - Auto-create events from tasks toggle
    - Auto-create tasks from events toggle
  - Calendar preview:
    - Embedded calendar view or event list
    - Recent synced items log

#### Settings Page
- **Layout:** Standard settings page with sections
- **Sections:**
  - **Profile:**
    - Name, email
    - Profile picture upload
    - Change password
  - **Preferences:**
    - Default view (Dashboard/Habits/Tasks)
    - Date format
    - Time zone
    - Theme (Light/Dark mode)
  - **Notifications:**
    - Email notification preferences
    - Reminder settings
    - Notification times
  - **Integrations:**
    - Google Calendar settings
    - Future: Other integrations
  - **Data:**
    - Export data
    - Delete account
    - Privacy settings

### 3.3 Modal/Overlay Components

#### Task Creation/Edit Modal
- Task title input
- Description textarea
- Priority selector (High/Medium/Low)
- Due date/time picker
- Category/tag selector (future)
- Save/Cancel buttons

#### Habit Creation/Edit Modal
- Habit name input
- Description textarea
- Category selector
- Frequency selector (Daily/Weekly/Custom)
- Reminder time selector (optional)
- Save/Cancel buttons

#### Onboarding Modal/Wizard
- Multi-step wizard:
  1. Welcome message
  2. Tutorial: "What is Growth Buddy?"
  3. Create first habit
  4. Create first task
  5. Optional: Connect calendar
  6. "Get Started" completion

---

## 4. Data That Needs to Be Tracked

### 4.1 User Data

#### User Table
```sql
- user_id (Primary Key, UUID)
- email (Unique, String)
- password_hash (String)
- name (String)
- created_at (Timestamp)
- updated_at (Timestamp)
- timezone (String, default: UTC)
- email_verified (Boolean, default: false)
- last_login_at (Timestamp)
- preferences (JSON):
  - default_view
  - date_format
  - theme
  - notification_settings
```

### 4.2 Task/To-Do Data

#### Tasks Table
```sql
- task_id (Primary Key, UUID)
- user_id (Foreign Key → users.user_id)
- title (String, required)
- description (Text, optional)
- date (Date, required) -- The day this task belongs to
- priority (Enum: 'high', 'medium', 'low', default: 'medium')
- completed (Boolean, default: false)
- completed_at (Timestamp, nullable)
- due_time (Time, nullable) -- Optional specific time
- created_at (Timestamp)
- updated_at (Timestamp)
- category (String, nullable) -- Future: categories/tags
- calendar_event_id (String, nullable) -- If synced to Google Calendar
```

### 4.3 Habit Data

#### Habits Table
```sql
- habit_id (Primary Key, UUID)
- user_id (Foreign Key → users.user_id)
- name (String, required)
- description (Text, optional)
- category (String, nullable)
- frequency (Enum: 'daily', 'weekly', 'custom', default: 'daily')
- reminder_time (Time, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
- archived (Boolean, default: false)
- archived_at (Timestamp, nullable)
```

#### Habit Entries Table (Daily Habit Completion Records)
```sql
- entry_id (Primary Key, UUID)
- habit_id (Foreign Key → habits.habit_id)
- user_id (Foreign Key → users.user_id)
- date (Date, required)
- completed (Boolean, default: false)
- notes (Text, optional)
- created_at (Timestamp)
- updated_at (Timestamp)
- UNIQUE(habit_id, date) -- One entry per habit per day
```

#### Habit Streaks Table (Computed/Cached)
```sql
- streak_id (Primary Key, UUID)
- habit_id (Foreign Key → habits.habit_id)
- user_id (Foreign Key → users.user_id)
- current_streak (Integer, default: 0)
- longest_streak (Integer, default: 0)
- last_completed_date (Date, nullable)
- updated_at (Timestamp)
```

### 4.4 Sleep Data

#### Sleep Entries Table
```sql
- sleep_id (Primary Key, UUID)
- user_id (Foreign Key → users.user_id)
- date (Date, required) -- Date of the night (e.g., Jan 1 for Jan 1-2 night)
- hours_slept (Decimal, required) -- e.g., 7.5 hours
- bedtime (Time, nullable) -- Future: when user went to bed
- wake_time (Time, nullable) -- Future: when user woke up
- quality_rating (Integer, nullable) -- 1-5 stars, future feature
- notes (Text, optional)
- created_at (Timestamp)
- updated_at (Timestamp)
- UNIQUE(user_id, date) -- One entry per user per day
```

### 4.5 Calendar Integration Data

#### Calendar Connections Table
```sql
- connection_id (Primary Key, UUID)
- user_id (Foreign Key → users.user_id)
- provider (String, default: 'google')
- access_token (Encrypted String)
- refresh_token (Encrypted String)
- token_expires_at (Timestamp)
- calendar_ids (JSON Array) -- List of synced calendar IDs
- sync_preferences (JSON):
  - two_way_sync (Boolean)
  - auto_create_events (Boolean)
  - auto_create_tasks (Boolean)
- connected_at (Timestamp)
- last_synced_at (Timestamp)
```

#### Calendar Sync Log Table (Optional, for debugging/audit)
```sql
- log_id (Primary Key, UUID)
- user_id (Foreign Key → users.user_id)
- connection_id (Foreign Key → calendar_connections.connection_id)
- action (Enum: 'sync_to_calendar', 'sync_from_calendar', 'error')
- entity_type (String) -- 'task', 'event'
- entity_id (UUID)
- calendar_event_id (String)
- status (Enum: 'success', 'error')
- error_message (Text, nullable)
- created_at (Timestamp)
```

### 4.6 Reminder/Notification Data

#### Reminders Table
```sql
- reminder_id (Primary Key, UUID)
- user_id (Foreign Key → users.user_id)
- entity_type (Enum: 'habit', 'task')
- entity_id (UUID)
- reminder_time (Time, required)
- days_of_week (JSON Array) -- [0,1,2,3,4,5,6] for Mon-Sun
- enabled (Boolean, default: true)
- last_sent_at (Timestamp, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Notifications Table (In-app notifications)
```sql
- notification_id (Primary Key, UUID)
- user_id (Foreign Key → users.user_id)
- type (Enum: 'reminder', 'achievement', 'system')
- title (String)
- message (Text)
- link (String, nullable) -- Link to relevant page
- read (Boolean, default: false)
- read_at (Timestamp, nullable)
- created_at (Timestamp)
```

### 4.7 Analytics/Cached Data (Optional, for performance)

#### Daily Stats Table (Computed daily, cached for fast queries)
```sql
- stat_id (Primary Key, UUID)
- user_id (Foreign Key → users.user_id)
- date (Date, required)
- tasks_completed (Integer, default: 0)
- tasks_total (Integer, default: 0)
- habits_completed (Integer, default: 0)
- habits_total (Integer, default: 0)
- sleep_hours (Decimal, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
- UNIQUE(user_id, date)
```

### 4.8 Data Relationships Summary

```
User (1) ──→ (many) Tasks
User (1) ──→ (many) Habits
User (1) ──→ (many) HabitEntries
User (1) ──→ (many) SleepEntries
User (1) ──→ (1) CalendarConnection
User (1) ──→ (many) Reminders
User (1) ──→ (many) Notifications
User (1) ──→ (many) DailyStats

Habit (1) ──→ (many) HabitEntries
Habit (1) ──→ (1) HabitStreak
Task (1) ──→ (0 or 1) CalendarEvent (via calendar_event_id)
```

### 4.9 Additional Data Considerations

#### Indexes (for performance)
- `tasks.user_id, date` (composite index)
- `habit_entries.user_id, date` (composite index)
- `habit_entries.habit_id, date` (composite index)
- `sleep_entries.user_id, date` (composite index)
- All foreign keys should be indexed

#### Data Retention
- Consider data retention policies (e.g., keep data for 2 years, archive older)
- Soft deletes for user deletions (keep data for 30 days, then hard delete)

#### Data Privacy
- Encrypt sensitive data (passwords, OAuth tokens)
- GDPR compliance considerations:
  - User data export
  - User data deletion
  - Data portability

---

## 5. Technical Architecture Recommendations (Bonus)

### Frontend
- **Framework:** React.js or Next.js (for SSR/SSG)
- **State Management:** Redux or Context API + React Query
- **UI Library:** Material-UI, Tailwind CSS, or Chakra UI
- **Charts:** Chart.js, Recharts, or D3.js
- **Date Handling:** date-fns or dayjs
- **Form Handling:** React Hook Form or Formik

### Backend
- **Option 1:** Node.js/Express or Next.js API routes
- **Option 2:** Python/FastAPI or Django
- **Option 3:** Serverless functions (AWS Lambda, Vercel Functions)
- **Database:** PostgreSQL (recommended) or MongoDB
- **ORM/ODM:** Prisma, TypeORM, or Mongoose

### Authentication
- **Options:**
  - JWT tokens
  - NextAuth.js (if using Next.js)
  - Auth0 or Firebase Auth
  - OAuth2 for Google Calendar

### Google Calendar Integration
- **API:** Google Calendar API v3
- **OAuth:** OAuth 2.0
- **Library:** Google API Client Library

### Hosting & Deployment
- **Frontend:** Vercel, Netlify, or AWS Amplify
- **Backend:** AWS, Google Cloud, or Railway
- **Database:** AWS RDS, Google Cloud SQL, or Supabase

### Monitoring & Analytics
- Error tracking: Sentry
- Analytics: Mixpanel, Amplitude, or Google Analytics
- Logging: Winston, Pino, or CloudWatch

---

## 6. MVP Development Phases

### Phase 1: Foundation (Weeks 1-2)
- User authentication (signup/login)
- Basic database schema
- User dashboard (skeleton)
- Basic routing

### Phase 2: Core Features (Weeks 3-5)
- To-do list functionality
- Habit checklist functionality
- Sleep tracking
- Basic data persistence

### Phase 3: Visualization (Week 6)
- Basic charts/graphs (7-day views)
- Dashboard integration

### Phase 4: Polish & Testing (Week 7-8)
- UI/UX refinements
- Responsive design
- Bug fixes
- User testing

### Phase 5: Launch Prep (Week 9-10)
- Production deployment
- Documentation
- Beta testing
- Marketing materials

---

## 7. Success Metrics (KPIs)

### User Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- Average session duration
- Return rate (users returning after 7 days)

### Feature Usage
- % of users creating habits
- % of users using to-do lists daily
- % of users tracking sleep
- Average number of habits per user
- Average number of tasks per day

### Retention
- Day 1 retention
- Day 7 retention
- Day 30 retention
- Churn rate

### Product Health
- Habit completion rate
- Task completion rate
- Average habit streak length
- User satisfaction score (NPS)

---

## Conclusion

This blueprint provides a comprehensive foundation for building Growth Buddy. The MVP focuses on core functionality to validate the product concept, while future features can be prioritized based on user feedback and business goals.

**Next Steps:**
1. Validate MVP feature set with potential users
2. Create detailed wireframes/mockups
3. Set up development environment and project structure
4. Begin Phase 1 development
5. Establish user feedback collection mechanism



