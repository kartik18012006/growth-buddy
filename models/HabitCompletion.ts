import mongoose, { Schema, Model } from 'mongoose';
import connectDB from '@/lib/db';

if (mongoose.connection.readyState === 0) {
  connectDB();
}

interface IHabitCompletion {
  habitId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  completed: boolean;
  notes?: string;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const habitCompletionSchema = new Schema<IHabitCompletion>({
  habitId: {
    type: Schema.Types.ObjectId,
    ref: 'Habit',
    required: [true, 'Habit ID is required'],
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  date: {
    type: Date,
    required: [true, 'Completion date is required'],
    index: true,
  },
  completed: {
    type: Boolean,
    default: false,
    index: true,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

habitCompletionSchema.index({ habitId: 1, date: -1 });
habitCompletionSchema.index({ userId: 1, date: -1 });
habitCompletionSchema.index({ habitId: 1, date: 1 }, { unique: true });
habitCompletionSchema.index({ userId: 1, habitId: 1, date: -1 });
habitCompletionSchema.index({ userId: 1, completed: 1, date: -1 });

habitCompletionSchema.pre('save', function(next) {
  if (this.date) {
    this.date.setHours(0, 0, 0, 0);
  }
  if (this.isModified('completed')) {
    if (this.completed && !this.completedAt) {
      this.completedAt = new Date();
    } else if (!this.completed) {
      this.completedAt = undefined;
    }
  }
  next();
});

const HabitCompletion: Model<IHabitCompletion> = mongoose.models.HabitCompletion || mongoose.model<IHabitCompletion>('HabitCompletion', habitCompletionSchema);

export default HabitCompletion;
export type { IHabitCompletion };



