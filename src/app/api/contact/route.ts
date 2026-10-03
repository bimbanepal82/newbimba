import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; 

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true }); 

  const { error } = await supabaseAdmin.from('contact_messages').insert({
    name: String(body.name ?? '').trim(),
    email: String(body.email ?? '').trim(),
    inquiry_type: String(body.inquiryType ?? 'General'),
    subject: String(body.subject ?? '').trim(),
    message: String(body.message ?? '').trim(),
  });

  if (error) {
    console.error('[contact] insert failed:', error.message);
    return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}