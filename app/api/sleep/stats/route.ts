import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/models/User';
import SleepRecord from '@/models/SleepRecord';

/**
 * GET /api/sleep/stats?period=daily|weekly|monthly&startDate=<optional>&endDate=<optional>
 * Fetch sleep statistics formatted for charts (daily, weekly, or monthly periods)
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
    const period = searchParams.get('period') || 'daily'; // daily, weekly, monthly
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let start: Date;
    let end: Date = new Date();
    end.setHours(23, 59, 59, 999);

    // Set start date based on period
    if (startDate) {
      start = new Date(startDate);
    } else {
      start = new Date();
      switch (period) {
        case 'daily':
          // Last 7 days by default for daily view
          start.setDate(start.getDate() - 6);
          start.setHours(0, 0, 0, 0);
          break;
        case 'weekly':
          // Last 4 weeks by default
          start.setDate(start.getDate() - 27);
          start.setHours(0, 0, 0, 0);
          break;
        case 'monthly':
          // Last 12 months by default
          start.setMonth(start.getMonth() - 11);
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          break;
        default:
          start.setDate(start.getDate() - 6);
          start.setHours(0, 0, 0, 0);
      }
    }

    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    }

    // Get all sleep records in the date range
    const records = await SleepRecord.find({
      userId: user._id,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 }); // Sort ascending for chronological order

    // Format data based on period
    let chartData: any[] = [];
    let summary: any = {
      totalRecords: records.length,
      averageHours: 0,
      averageQuality: 0,
      goalMetCount: 0,
      totalDays: 0,
    };

    if (records.length > 0) {
      // Calculate summary statistics
      const totalHours = records.reduce((sum, r) => sum + r.hoursSlept, 0);
      const recordsWithQuality = records.filter(r => r.qualityRating);
      const totalQuality = recordsWithQuality.reduce((sum, r) => sum + (r.qualityRating || 0), 0);
      const recordsWithGoal = records.filter(r => r.goalHours);
      const goalMet = recordsWithGoal.filter(r => r.hoursSlept >= (r.goalHours || 0)).length;

      summary.averageHours = Math.round((totalHours / records.length) * 100) / 100;
      summary.averageQuality = recordsWithQuality.length > 0
        ? Math.round((totalQuality / recordsWithQuality.length) * 100) / 100
        : 0;
      summary.goalMetCount = goalMet;
      summary.totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Format data for charts
      if (period === 'daily') {
        // Daily: one data point per day
        chartData = records.map(record => ({
          date: record.date.toISOString().split('T')[0],
          hoursSlept: record.hoursSlept,
          qualityRating: record.qualityRating || null,
          goalHours: record.goalHours || null,
          goalMet: record.goalHours ? record.hoursSlept >= record.goalHours : null,
          bedtime: record.bedtime ? record.bedtime.toISOString() : null,
          wakeTime: record.wakeTime ? record.wakeTime.toISOString() : null,
        }));
      } else if (period === 'weekly') {
        // Weekly: aggregate by week
        const weeklyMap = new Map<string, { hours: number[]; quality: number[]; count: number }>();

        records.forEach(record => {
          const recordDate = new Date(record.date);
          const weekStart = new Date(recordDate);
          const day = weekStart.getDay();
          const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
          weekStart.setDate(diff);
          weekStart.setHours(0, 0, 0, 0);
          const weekKey = weekStart.toISOString().split('T')[0];

          if (!weeklyMap.has(weekKey)) {
            weeklyMap.set(weekKey, { hours: [], quality: [], count: 0 });
          }

          const weekData = weeklyMap.get(weekKey)!;
          weekData.hours.push(record.hoursSlept);
          if (record.qualityRating) {
            weekData.quality.push(record.qualityRating);
          }
          weekData.count++;
        });

        chartData = Array.from(weeklyMap.entries()).map(([weekStart, data]) => {
          const avgHours = data.hours.reduce((a, b) => a + b, 0) / data.hours.length;
          const avgQuality = data.quality.length > 0
            ? data.quality.reduce((a, b) => a + b, 0) / data.quality.length
            : null;

          return {
            date: weekStart,
            hoursSlept: Math.round(avgHours * 100) / 100,
            qualityRating: avgQuality ? Math.round(avgQuality * 100) / 100 : null,
            daysRecorded: data.count,
          };
        });
      } else if (period === 'monthly') {
        // Monthly: aggregate by month
        const monthlyMap = new Map<string, { hours: number[]; quality: number[]; count: number }>();

        records.forEach(record => {
          const recordDate = new Date(record.date);
          const monthKey = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;

          if (!monthlyMap.has(monthKey)) {
            monthlyMap.set(monthKey, { hours: [], quality: [], count: 0 });
          }

          const monthData = monthlyMap.get(monthKey)!;
          monthData.hours.push(record.hoursSlept);
          if (record.qualityRating) {
            monthData.quality.push(record.qualityRating);
          }
          monthData.count++;
        });

        chartData = Array.from(monthlyMap.entries()).map(([monthKey, data]) => {
          const avgHours = data.hours.reduce((a, b) => a + b, 0) / data.hours.length;
          const avgQuality = data.quality.length > 0
            ? data.quality.reduce((a, b) => a + b, 0) / data.quality.length
            : null;

          return {
            date: monthKey,
            hoursSlept: Math.round(avgHours * 100) / 100,
            qualityRating: avgQuality ? Math.round(avgQuality * 100) / 100 : null,
            daysRecorded: data.count,
          };
        });
      }
    }

    return NextResponse.json({
      period,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      summary,
      data: chartData,
    });
  } catch (error) {
    console.error('Error fetching sleep stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


