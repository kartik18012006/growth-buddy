import mongoose, { Schema, Model } from 'mongoose';
import connectDB from '@/lib/db';

if (mongoose.connection.readyState === 0) {
  connectDB();
}

interface ITask {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  priority?: 'high' | 'medium' | 'low';
  completed?: boolean;
  completedAt?: Date;
  dueTime?: Date;
  category?: string;
  calendarEventId?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const taskSchema = new Schema<ITask>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  date: {
    type: Date,
    required: [true, 'Task date is required'],
    index: true,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
    index: true,
  },
  completed: {
    type: Boolean,
    default: false,
    index: true,
  },
  completedAt: {
    type: Date,
  },
  dueTime: {
    type: Date,
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    index: true,
  },
  calendarEventId: {
    type: String,
    index: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

taskSchema.index({ userId: 1, date: -1 });
taskSchema.index({ userId: 1, completed: 1, date: -1 });
taskSchema.index({ userId: 1, date: 1, priority: -1 });

taskSchema.pre('save', function(next) {
  if (this.isModified('completed')) {
    if (this.completed && !this.completedAt) {
      this.completedAt = new Date();
    } else if (!this.completed) {
      this.completedAt = undefined;
    }
  }
  next();
});

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);

export default Task;
export type { ITask };



