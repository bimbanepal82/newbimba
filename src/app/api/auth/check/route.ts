import { NextResponse } from 'next/server';
import { isAuthenticated, ADMIN_CREDENTIALS } from '@/lib/auth';

export async function GET() {
  const authed = await isAuthenticated();
  return NextResponse.json({
    authenticated: authed,
    username: authed ? ADMIN_CREDENTIALS.username : null,
  });
}
