import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { calculateTodayScore } from '@/lib/scoring/calculator';

/**
 * GET /api/scoring/daily
 * Get today's performance score
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const score = await calculateTodayScore();
    
    return NextResponse.json(score);
  } catch (error: any) {
    console.error('Error calculating daily score:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate score' },
      { status: 500 }
    );
  }
}


