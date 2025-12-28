import mongoose, { Schema, Model } from 'mongoose';
import connectDB from '@/lib/db';

// Connect to database if not already connected
if (mongoose.connection.readyState === 0) {
  connectDB();
}

interface IUser {
  email: string;
  passwordHash?: string;
  name: string;
  timezone?: string;
  emailVerified?: boolean;
  lastLoginAt?: Date;
  preferences?: {
    defaultView?: 'dashboard' | 'habits' | 'tasks';
    dateFormat?: string;
    theme?: 'light' | 'dark' | 'auto';
    notificationSettings?: {
      email?: boolean;
      reminders?: boolean;
    };
  };
  googleCalendarConnection?: {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    calendarIds?: string[];
    syncPreferences?: {
      twoWaySync?: boolean;
      autoCreateEvents?: boolean;
      autoCreateTasks?: boolean;
    };
    connectedAt?: Date;
    lastSyncedAt?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  timezone: {
    type: String,
    default: 'UTC',
    trim: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  lastLoginAt: {
    type: Date,
  },
  preferences: {
    defaultView: {
      type: String,
      enum: ['dashboard', 'habits', 'tasks'],
      default: 'dashboard',
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY',
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light',
    },
    notificationSettings: {
      email: {
        type: Boolean,
        default: true,
      },
      reminders: {
        type: Boolean,
        default: true,
      },
    },
  },
  googleCalendarConnection: {
    accessToken: {
      type: String,
      select: false, // Security: don't include in default queries
    },
    refreshToken: {
      type: String,
      select: false, // Security: don't include in default queries
    },
    tokenExpiresAt: Date,
    calendarIds: [String],
    syncPreferences: {
      twoWaySync: Boolean,
      autoCreateEvents: Boolean,
      autoCreateTasks: Boolean,
    },
    connectedAt: Date,
    lastSyncedAt: Date,
  },
}, {
  timestamps: true,
});

userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
export type { IUser };


