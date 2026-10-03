import { pingSupabase } from '@/lib/pingSupabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DAY = 24 * 60 * 60 * 1000;
let lastRun = 0; 
export async function GET() {
  if (Date.now() - lastRun < DAY) {
    return NextResponse.json({ ok: true, skipped: true });
  }
  lastRun = Date.now();
  const ok = await pingSupabase();
  return NextResponse.json({ ok });
}