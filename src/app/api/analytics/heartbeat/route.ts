import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

let tableEnsured = false;
async function ensureTable() {
  if (tableEnsured) return;
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
    tableEnsured = true;
  } catch (err) {
    console.warn('Failed to ensure active_visitors table:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      try {
        const raw = await req.text();
        body = JSON.parse(raw || '{}');
      } catch {
        body = {};
      }
    }

    const visitorId = (body.visitorId || '').toString().trim().slice(0, 64);
    if (!visitorId) {
      return NextResponse.json({ success: false, error: 'Valid visitorId is required' }, { status: 400 });
    }

    const pagePath = (body.path || '/').toString().trim().slice(0, 255) || '/';

    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const ipHash = createHash('sha256').update(clientIp).digest('hex').slice(0, 32);
    const userAgent = (req.headers.get('user-agent') || '').slice(0, 250);

    // Upsert current active visitor with exact current timestamp
    await sql`
      INSERT INTO active_visitors (id, page_path, ip_hash, user_agent, last_seen_at)
      VALUES (${visitorId}, ${pagePath}, ${ipHash}, ${userAgent}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        page_path = EXCLUDED.page_path,
        user_agent = EXCLUDED.user_agent,
        ip_hash = EXCLUDED.ip_hash,
        last_seen_at = NOW()
    `;

    // Opportunistic cleanup of historical sessions older than 48 hours (1 out of every 50 pings)
    if (Math.random() < 0.02) {
      sql`DELETE FROM active_visitors WHERE last_seen_at < NOW() - INTERVAL '48 hours'`.catch(() => {});
    }

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'HealthGhuru Live Visitor Heartbeat' });
}
