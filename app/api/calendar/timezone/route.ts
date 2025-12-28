import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getUserTimezone } from '@/lib/google-calendar';

/**
 * GET /api/calendar/timezone
 * Get user's timezone from Google Calendar
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

    // Check if Google Calendar is connected
    if (!user.googleCalendarConnection?.accessToken) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 400 }
      );
    }

    const timeZone = await getUserTimezone(user._id.toString());

    // Update user timezone if we successfully fetched it
    if (timeZone && timeZone !== user.timezone) {
      user.timezone = timeZone;
      await user.save();
    }

    return NextResponse.json({
      timeZone,
      updated: timeZone !== user.timezone,
    });
  } catch (error: any) {
    console.error('Error fetching timezone:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch timezone' },
      { status: 500 }
    );
  }
}


