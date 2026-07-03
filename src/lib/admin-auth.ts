import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const ADMIN_COOKIE = 'ys_admin_analytics';

export function adminToken(): string | null {
  const password = process.env.ADMIN_ANALYTICS_PASSWORD;
  if (!password) return null;
  return createHash('sha256').update(`${password}:ys-admin-v1`).digest('hex');
}

export function verifyAdminPassword(input: string): boolean {
  const password = process.env.ADMIN_ANALYTICS_PASSWORD;
  if (!password || !input) return false;
  const a = createHash('sha256').update(input).digest();
  const b = createHash('sha256').update(password).digest();
  return timingSafeEqual(a, b);
}

export async function isAdminAuthed(): Promise<boolean> {
  const token = adminToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === token;
}

export function isAdminRequest(req: NextRequest): boolean {
  const token = adminToken();
  if (!token) return false;
  return req.cookies.get(ADMIN_COOKIE)?.value === token;
}
