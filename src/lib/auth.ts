import { cookies } from 'next/headers';
import crypto from 'crypto';

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

    if (username !== ADMIN_CREDENTIALS.username) return false;

    // Check expiration (e.g. 7 days)
    const tokenTime = parseInt(timestamp, 10);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (isNaN(tokenTime) || Date.now() - tokenTime > maxAge) return false;

    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

// Server-side check for authentication
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

// Cookie helper
export { COOKIE_NAME };
