import mongoose, { Schema, Model } from 'mongoose';
import connectDB from '@/lib/db';

if (mongoose.connection.readyState === 0) {
  connectDB();
}

interface ISleepRecord {
  userId: mongoose.Types.ObjectId;
  date: Date;
  hoursSlept: number;
  bedtime?: Date;
  wakeTime?: Date;
  qualityRating?: number;
  notes?: string;
  goalHours?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const sleepRecordSchema = new Schema<ISleepRecord>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  date: {
    type: Date,
    required: [true, 'Sleep date is required'],
    index: true,
  },
  hoursSlept: {
    type: Number,
    required: [true, 'Hours slept is required'],
    min: [0, 'Hours slept cannot be negative'],
    max: [24, 'Hours slept cannot exceed 24 hours'],
  },
  bedtime: {
    type: Date,
  },
  wakeTime: {
    type: Date,
  },
  qualityRating: {
    type: Number,
    min: [1, 'Quality rating must be at least 1'],
    max: [5, 'Quality rating cannot exceed 5'],
    index: true,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  goalHours: {
    type: Number,
    min: [0, 'Goal hours cannot be negative'],
    max: [24, 'Goal hours cannot exceed 24 hours'],
  },
}, {
  timestamps: true,
});

sleepRecordSchema.index({ userId: 1, date: -1 });
sleepRecordSchema.index({ userId: 1, date: 1 }, { unique: true });
sleepRecordSchema.index({ userId: 1, qualityRating: 1 });

sleepRecordSchema.pre('save', function(next) {
  if (this.date) {
    this.date.setHours(0, 0, 0, 0);
  }
  next();
});

const SleepRecord: Model<ISleepRecord> = mongoose.models.SleepRecord || mongoose.model<ISleepRecord>('SleepRecord', sleepRecordSchema);

export default SleepRecord;
export type { ISleepRecord };



