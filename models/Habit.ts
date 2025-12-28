import mongoose, { Schema, Model } from 'mongoose';
import connectDB from '@/lib/db';

if (mongoose.connection.readyState === 0) {
  connectDB();
}

interface IHabit {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category?: string;
  frequency?: 'daily' | 'weekly' | 'custom';
  reminderTime?: Date;
  color?: string;
  icon?: string;
  archived?: boolean;
  archivedAt?: Date;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const habitSchema = new Schema<IHabit>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    maxlength: [100, 'Habit name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    index: true,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily',
    index: true,
  },
  reminderTime: {
    type: Date,
  },
  color: {
    type: String,
    default: '#3B82F6',
  },
  icon: {
    type: String,
    default: 'default',
  },
  archived: {
    type: Boolean,
    default: false,
    index: true,
  },
  archivedAt: {
    type: Date,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

habitSchema.index({ userId: 1, archived: 1, createdAt: -1 });
habitSchema.index({ userId: 1, category: 1 });

habitSchema.pre('save', function(next) {
  if (this.isModified('archived')) {
    if (this.archived && !this.archivedAt) {
      this.archivedAt = new Date();
    } else if (!this.archived) {
      this.archivedAt = undefined;
    }
  }
  next();
});

const Habit: Model<IHabit> = mongoose.models.Habit || mongoose.model<IHabit>('Habit', habitSchema);

export default Habit;
export type { IHabit };



