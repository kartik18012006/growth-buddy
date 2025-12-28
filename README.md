# Growth Buddy

A comprehensive personal development and productivity web application that helps users track their habits, manage daily tasks, monitor sleep patterns, and visualize their progress over time.

## Features

- ✅ **Google OAuth Authentication** - Secure login with Google
- 📋 **Daily To-Do Lists** - Create, edit, and manage tasks with priorities
- 🎯 **Habit Tracking** - Build consistency with daily habit checklists
- 😴 **Sleep Tracking** - Monitor sleep patterns and quality
- 📊 **Analytics Dashboard** - Visualize progress with charts and insights
- 🔔 **Reminder System** - Never miss a habit or task
- 📅 **Google Calendar Integration** - Sync tasks with Google Calendar (optional)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (Google OAuth)
- **Database**: MongoDB with Mongoose
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud like MongoDB Atlas)
- Google OAuth credentials

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/growth-buddy.git
cd growth-buddy
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
# Database (MongoDB Atlas connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Generate NextAuth Secret:**

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in your `.env.local` file.

5. **Set up Google OAuth:**

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select an existing one
- Go to **APIs & Services** → **Credentials**
- Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
- Configure OAuth consent screen if prompted (select External for public access)
- Application type: **"Web application"**
- Name: **"Growth Buddy"**
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google` (for local development)
  - Add your production URL after deployment: `https://yourdomain.com/api/auth/callback/google`
- Click **"CREATE"**
- Copy the **Client ID** and **Client Secret** to your `.env.local` file
- **Important:** Client ID must include the full `.apps.googleusercontent.com` suffix

6. **Start the development server:**

```bash
npm run dev
```

7. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables (same as `.env.local` but update `NEXTAUTH_URL` to your Vercel URL)
4. Update Google Cloud Console redirect URI with your Vercel URL
5. Deploy!

## Project Structure

```
growth-buddy/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth configuration
│   │   ├── dashboard/     # Dashboard data endpoint
│   │   ├── tasks/         # Tasks CRUD endpoints
│   │   ├── habits/        # Habits CRUD endpoints
│   │   └── sleep/         # Sleep records endpoints
│   ├── dashboard/         # Dashboard page
│   ├── tasks/             # Tasks page
│   ├── habits/            # Habits page
│   ├── sleep/             # Sleep tracking page
│   ├── analytics/         # Analytics page
│   ├── settings/          # Settings page
│   └── page.tsx           # Landing/hero page
├── components/            # Reusable React components
│   └── Layout.tsx         # Main layout with sidebar
├── lib/                   # Utility functions
│   └── db.ts             # MongoDB connection
├── models/                # Mongoose models
│   ├── User.ts
│   ├── Task.ts
│   ├── Habit.ts
│   ├── HabitCompletion.ts
│   ├── SleepRecord.ts
│   └── Reminder.ts
└── types/                 # TypeScript type definitions
```

## Usage

### First Time Setup

1. Visit the homepage and click "Continue with Google"
2. Sign in with your Google account
3. You'll be redirected to the dashboard
4. Start by creating your first habit or task!

### Daily Usage

1. **Dashboard**: View your daily overview, stats, and quick actions
2. **Tasks**: Add and manage daily to-do items
3. **Habits**: Check off your daily habits and track streaks
4. **Sleep**: Log your sleep hours and quality
5. **Analytics**: View your progress over time
6. **Settings**: Manage your account and preferences

## API Endpoints

- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/tasks` - Get tasks (with optional date query)
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task
- `GET /api/habits` - Get habits
- `POST /api/habits` - Create a new habit
- `POST /api/habits/complete` - Mark habit as complete/incomplete
- `GET /api/sleep` - Get sleep records (with optional days query)
- `POST /api/sleep` - Create/update sleep record

## Development

### Run in Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## Database Schema

The application uses MongoDB with the following main collections:

- **Users**: User accounts and preferences
- **Tasks**: Daily to-do items
- **Habits**: Habit definitions
- **HabitCompletions**: Daily habit completion records
- **SleepRecords**: Sleep tracking data
- **Reminders**: Reminder configurations

See `models/` directory for detailed schema definitions.

## Future Enhancements

- [ ] Advanced analytics with correlation analysis
- [ ] Weekly and monthly reports
- [ ] Goal setting (SMART goals)
- [ ] Task categories and projects
- [ ] Habit templates library
- [ ] Email reminders
- [ ] Push notifications
- [ ] Mobile app
- [ ] Social features (friends, leaderboards)
- [ ] Data export (CSV, PDF)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on the repository.

---

Built with ❤️ using Next.js and MongoDB



