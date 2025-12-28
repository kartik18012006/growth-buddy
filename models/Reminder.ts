import mongoose, { Schema, Model } from 'mongoose';
import connectDB from '@/lib/db';

if (mongoose.connection.readyState === 0) {
  connectDB();
}

interface IReminder {
  userId: mongoose.Types.ObjectId;
  entityType: 'habit' | 'task';
  entityId: mongoose.Types.ObjectId;
  reminderTime: Date;
  daysOfWeek?: number[];
  enabled?: boolean;
  lastSentAt?: Date;
  notificationMethod?: 'email' | 'push' | 'both';
  timezone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const reminderSchema = new Schema<IReminder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  entityType: {
    type: String,
    enum: ['habit', 'task'],
    required: [true, 'Entity type is required'],
    index: true,
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Entity ID is required'],
    index: true,
  },
  reminderTime: {
    type: Date,
    required: [true, 'Reminder time is required'],
  },
  daysOfWeek: [{
    type: Number,
    min: [0, 'Day of week must be 0-6'],
    max: [6, 'Day of week must be 0-6'],
  }],
  enabled: {
    type: Boolean,
    default: true,
    index: true,
  },
  lastSentAt: {
    type: Date,
  },
  notificationMethod: {
    type: String,
    enum: ['email', 'push', 'both'],
    default: 'email',
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
}, {
  timestamps: true,
});

reminderSchema.index({ userId: 1, enabled: 1 });
reminderSchema.index({ entityType: 1, entityId: 1 });
reminderSchema.index({ enabled: 1, reminderTime: 1 });
reminderSchema.index({ userId: 1, entityType: 1, entityId: 1 });

const Reminder: Model<IReminder> = mongoose.models.Reminder || mongoose.model<IReminder>('Reminder', reminderSchema);

export default Reminder;
export type { IReminder };



