/**
 * Cron endpoint for processing reminders
 * 
 * This endpoint should be called by a cron service (Vercel Cron, AWS EventBridge, etc.)
 * or scheduled via node-cron in development.
 * 
 * Example cron schedule: Every minute: * * * * *
 */

import { NextRequest, NextResponse } from 'next/server';
import { processReminders } from '@/lib/reminder-scheduler';

export async function GET(req: NextRequest) {
  try {
    // Optional: Add authentication token check for security
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await processReminders();

    return NextResponse.json({
      success: true,
      processed: result.processed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in reminder cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

// Allow POST as well (some cron services use POST)
export async function POST(req: NextRequest) {
  return GET(req);
}


