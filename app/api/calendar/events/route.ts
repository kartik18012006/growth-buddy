import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { fetchCalendarEvents, getUserTimezone } from '@/lib/google-calendar';

/**
 * GET /api/calendar/events
 * Fetch calendar events from Google Calendar
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

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const calendarId = searchParams.get('calendarId') || 'primary';

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default: 30 days

    // Get timezone
    let timeZone = user.timezone || 'UTC';
    try {
      timeZone = await getUserTimezone(user._id.toString());
    } catch (error) {
      console.error('Error fetching timezone:', error);
    }

    const events = await fetchCalendarEvents(
      user._id.toString(),
      start,
      end,
      calendarId
    );

    // Format events for response
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      timeZone: event.start?.timeZone || timeZone,
      location: event.location,
      htmlLink: event.htmlLink,
      status: event.status,
    }));

    return NextResponse.json({
      events: formattedEvents,
      timeZone,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}


