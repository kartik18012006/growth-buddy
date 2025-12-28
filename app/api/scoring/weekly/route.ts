import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { calculateWeeklyTrendScore } from '@/lib/scoring/calculator';

/**
 * GET /api/scoring/weekly
 * Get weekly trend score
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trend = await calculateWeeklyTrendScore();
    
    return NextResponse.json(trend);
  } catch (error: any) {
    console.error('Error calculating weekly trend:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate trend' },
      { status: 500 }
    );
  }
}


