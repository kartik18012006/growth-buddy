import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import SleepRecord from '@/models/SleepRecord';

/**
 * GET /api/sleep
 * Get sleep records - single date or range
 * Query params: date (single date) or days (last N days)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const days = parseInt(searchParams.get('days') || '30');

    if (date) {
      // Get single date
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const record = await SleepRecord.findOne({
        userId: user._id,
        date: targetDate,
      });
      return NextResponse.json(record);
    }

    // Get range of dates
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const records = await SleepRecord.find({
      userId: user._id,
      date: { $gte: startDate },
    }).sort({ date: -1 }); // Most recent first

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching sleep records:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/sleep
 * Add or update sleep hours for a specific date
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    
    if (body.hoursSlept === undefined || body.hoursSlept === null) {
      return NextResponse.json({ error: 'hoursSlept is required' }, { status: 400 });
    }

    if (body.hoursSlept < 0 || body.hoursSlept > 24) {
      return NextResponse.json({ error: 'hoursSlept must be between 0 and 24' }, { status: 400 });
    }

    if (body.qualityRating !== undefined && (body.qualityRating < 1 || body.qualityRating > 5)) {
      return NextResponse.json({ error: 'qualityRating must be between 1 and 5' }, { status: 400 });
    }

    const date = body.date ? new Date(body.date) : new Date();
    date.setHours(0, 0, 0, 0);

    const record = await SleepRecord.findOneAndUpdate(
      {
        userId: user._id,
        date: date,
      },
      {
        userId: user._id,
        date: date,
        hoursSlept: body.hoursSlept,
        bedtime: body.bedtime ? new Date(body.bedtime) : undefined,
        wakeTime: body.wakeTime ? new Date(body.wakeTime) : undefined,
        qualityRating: body.qualityRating,
        notes: body.notes,
        goalHours: body.goalHours,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating sleep record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


