import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { supabaseAdmin, isSupabaseConfigured } from './supabase';

const COOKIE_NAME = 'bimba_admin_session';
const SECRET_KEY = process.env.SESSION_SECRET || 'bimba_super_secure_session_key_2026';

export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'bimba@admin2026',
};

// Generates an HMAC-signed token
export function createSessionToken(username: string): string {
  const timestamp = Date.now().toString();
  const payload = `${username}:${timestamp}`;
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

// Validates the HMAC-signed token
export function verifySessionToken(token: string): boolean {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return false;

    const payload = Buffer.from(encodedPayload, 'base64').toString('utf8');
    const [username, timestamp] = payload.split(':');

    // Check expiration (7 days)
    const tokenTime = parseInt(timestamp, 10);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (isNaN(tokenTime) || Date.now() - tokenTime > maxAge) return false;

    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

// Authenticates credentials against Supabase admin_users table (with fallback to static credentials)
export async function authenticateCredentials(username: string, password: string): Promise<boolean> {
  // 1. Try Supabase admin_users table if configured
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      if (!error && user && user.password_hash) {
        // Compare with bcrypt hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) return true;
        // Or if saved as plain text for quick setup
        if (user.password_hash === password) return true;
      }
    } catch (e) {
      console.warn('Supabase auth query error, attempting local credentials fallback:', e);
    }
  }

  // 2. Static credentials fallback
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return true;
  }

  return false;
}

// Server-side check for authentication
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export { COOKIE_NAME };
