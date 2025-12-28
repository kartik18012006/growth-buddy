import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { calculateMonthlyImprovementScore } from '@/lib/scoring/calculator';

/**
 * GET /api/scoring/monthly?months=6
 * Get monthly improvement scores
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const months = parseInt(searchParams.get('months') || '6');

    const improvements = await calculateMonthlyImprovementScore(months);
    
    return NextResponse.json({ improvements });
  } catch (error: any) {
    console.error('Error calculating monthly improvement:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate improvement' },
      { status: 500 }
    );
  }
}


