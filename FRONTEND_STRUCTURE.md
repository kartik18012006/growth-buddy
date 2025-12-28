# Frontend Structure - Growth Buddy

## 📁 Folder Structure

```
app/
├── (auth)/
│   └── page.tsx                 # Landing page (public)
├── (protected)/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── tasks/
│   │   └── page.tsx
│   ├── habits/
│   │   └── page.tsx
│   ├── sleep/
│   │   └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── api/                         # API routes (backend)
├── layout.tsx                   # Root layout
├── providers.tsx                # App providers (NextAuth, etc.)
└── globals.css                  # Global styles

components/
├── auth/
│   ├── ProtectedRoute.tsx       # Route protection component
│   └── AuthGuard.tsx            # Auth guard component
├── ui/
│   ├── Button.tsx               # Reusable button component
│   ├── LoadingSpinner.tsx       # Loading spinner
│   └── index.ts                 # UI components export
└── Layout.tsx                   # Main layout component

lib/
├── api/
│   ├── client.ts                # API client (base)
│   ├── tasks.ts                 # Tasks API service
│   ├── habits.ts                # Habits API service
│   ├── sleep.ts                 # Sleep API service
│   ├── calendar.ts              # Calendar API service
│   ├── dashboard.ts             # Dashboard API service
│   └── index.ts                 # API services export
├── hooks/
│   └── useAuth.ts               # Authentication hook
├── utils/
│   ├── date.ts                  # Date utilities
│   ├── errors.ts                # Error handling utilities
│   └── index.ts                 # Utils export
├── db.ts                        # Database connection
├── google-calendar.ts           # Google Calendar service
└── utils.ts                     # Shared utilities (cn, etc.)

types/
└── next-auth.d.ts               # NextAuth type definitions

middleware.ts                    # Next.js middleware (route protection)
```

---

## 🔐 Authentication Flow

### 1. Public Routes
- `/` - Landing page (sign in)

### 2. Protected Routes
- `/dashboard` - Dashboard
- `/tasks` - Tasks page
- `/habits` - Habits page
- `/sleep` - Sleep tracking
- `/analytics` - Analytics
- `/settings` - Settings

### 3. Protection Methods

#### Method 1: Middleware (Recommended)
```typescript
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*', ...],
};
```

#### Method 2: ProtectedRoute Component
```typescript
// In page component
<ProtectedRoute>
  <YourPageContent />
</ProtectedRoute>
```

#### Method 3: useAuth Hook
```typescript
const { isAuthenticated, isLoading } = useAuth(true);
```

---

## 📡 API Service Layer

### Usage Example

```typescript
import { tasksApi } from '@/lib/api';

// Get tasks
const tasks = await tasksApi.getTasks('2024-01-15');

// Create task
const newTask = await tasksApi.createTask({
  title: 'My Task',
  date: '2024-01-15',
  syncToCalendar: true,
});

// Update task
await tasksApi.updateTask(taskId, { completed: true });

// Delete task
await tasksApi.deleteTask(taskId);
```

### Error Handling

```typescript
import { tasksApi, ApiError } from '@/lib/api';
import { handleApiError } from '@/lib/utils';

try {
  const tasks = await tasksApi.getTasks();
} catch (error) {
  const { message, isAuthError } = handleApiError(error);
  
  if (isAuthError) {
    // Redirect to login
    router.push('/');
  } else {
    // Show error message
    toast.error(message);
  }
}
```

---

## 🎨 Components

### UI Components

Located in `components/ui/`:

- **Button** - Reusable button with variants
- **LoadingSpinner** - Loading indicator

### Auth Components

Located in `components/auth/`:

- **ProtectedRoute** - Wraps protected pages
- **AuthGuard** - Shows loading while checking auth

---

## 🪝 Custom Hooks

### useAuth Hook

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

function MyComponent() {
  const { 
    session, 
    isAuthenticated, 
    isLoading, 
    user,
    signIn, 
    signOut 
  } = useAuth(true); // requireAuth = true

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return <div>Welcome, {user?.name}!</div>;
}
```

---

## 🛠️ Utilities

### Date Utilities

```typescript
import { formatDate, getRelativeDate, getDateString } from '@/lib/utils/date';

formatDate(new Date()); // "Jan 15, 2024"
getRelativeDate(new Date()); // "Today"
getDateString(); // "2024-01-15"
```

### Error Utilities

```typescript
import { handleApiError, isAuthError } from '@/lib/utils/errors';

const { message, isAuthError } = handleApiError(error);
```

---

## 🎯 Best Practices

### 1. Always use API service layer
❌ Don't:
```typescript
const response = await fetch('/api/tasks');
```

✅ Do:
```typescript
const tasks = await tasksApi.getTasks();
```

### 2. Handle errors properly
```typescript
try {
  const data = await api.someMethod();
} catch (error) {
  const { message, isAuthError } = handleApiError(error);
  // Handle appropriately
}
```

### 3. Use protected routes
```typescript
// Option 1: Middleware (automatic)
// Already configured in middleware.ts

// Option 2: Component wrapper
<ProtectedRoute>
  <PageContent />
</ProtectedRoute>

// Option 3: Hook
const { isAuthenticated } = useAuth(true);
```

### 4. Use TypeScript types
```typescript
import { Task, Habit, SleepRecord } from '@/lib/api';

function MyComponent({ task }: { task: Task }) {
  // Type-safe!
}
```

### 5. Centralize API calls
- All API calls go through `lib/api/`
- No direct `fetch()` calls in components
- Consistent error handling

---

## 📝 Migration Guide

### From Direct Fetch to API Service

**Before:**
```typescript
const response = await fetch('/api/tasks');
const tasks = await response.json();
```

**After:**
```typescript
import { tasksApi } from '@/lib/api';
const tasks = await tasksApi.getTasks();
```

### From Manual Auth Check to useAuth Hook

**Before:**
```typescript
const { data: session, status } = useSession();
const router = useRouter();

useEffect(() => {
  if (status === 'unauthenticated') {
    router.push('/');
  }
}, [status, router]);
```

**After:**
```typescript
const { isAuthenticated, isLoading } = useAuth(true);
```

---

## ✅ Checklist

- [x] API service layer created
- [x] Authentication hooks and components
- [x] Protected routes configured
- [x] Error handling utilities
- [x] Date utilities
- [x] UI components
- [x] Clean folder structure
- [x] TypeScript types
- [x] Documentation

---

**Frontend structure is complete and ready to use!** 🎉


