import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    // Allow admin access
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure table exists gracefully
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS active_visitors (
          id VARCHAR(64) PRIMARY KEY,
          page_path VARCHAR(255) NOT NULL,
          ip_hash VARCHAR(64),
          user_agent VARCHAR(255),
          last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_active_visitors_last_seen ON active_visitors(last_seen_at)
      `;
    } catch {}

    // 1. Fetch 100% REAL active unique visitors in the last 2 minutes
    const activeRes = await sql`
      SELECT count(DISTINCT id) as count 
      FROM active_visitors 
      WHERE last_seen_at >= NOW() - INTERVAL '2 minutes'
    `.catch(() => [{ count: 0 }]);

    // 2. Fetch 100% REAL today's unique visitors
    const todayRes = await sql`
      SELECT count(DISTINCT id) as count 
      FROM active_visitors 
      WHERE last_seen_at >= CURRENT_DATE
    `.catch(() => [{ count: 0 }]);

    // 3. Fetch 100% REAL pages visited right now
    const topPagesRes = await sql`
      SELECT page_path, count(DISTINCT id) as count
      FROM active_visitors
      WHERE last_seen_at >= NOW() - INTERVAL '2 minutes'
      GROUP BY page_path
      ORDER BY count DESC
      LIMIT 8
    `.catch(() => []);

    const realActiveCount = parseInt(activeRes[0]?.count || '0', 10);
    const realTodayCount = parseInt(todayRes[0]?.count || '0', 10);

    return NextResponse.json(
      {
        success: true,
        activeViewers: realActiveCount,
        realActiveSessions: realActiveCount,
        todayUniqueVisits: realTodayCount,
        activePages: topPagesRes.map((p: any) => ({
          path: p.page_path,
          count: parseInt(p.count, 10),
        })),
        timestamp: Date.now(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching live visitors in admin:', error);
    return NextResponse.json({
      success: true,
      activeViewers: 0,
      realActiveSessions: 0,
      todayUniqueVisits: 0,
      activePages: [],
      timestamp: Date.now(),
    });
  }
}
