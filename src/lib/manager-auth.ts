import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

// Manager auth is completely separate from the dev/admin auth: its own password,
// its own cookie. A manager can never reach /dev/analytics or dev settings.
export const MANAGER_COOKIE = 'ys_manager';

export function managerToken(): string | null {
  const password = process.env.MANAGER_PASSWORD;
  if (!password) return null;
  return createHash('sha256').update(`${password}:ys-manager-v1`).digest('hex');
}

export function verifyManagerPassword(input: string): boolean {
  const password = process.env.MANAGER_PASSWORD;
  if (!password || !input) return false;
  const a = createHash('sha256').update(input).digest();
  const b = createHash('sha256').update(password).digest();
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isManagerAuthed(): Promise<boolean> {
  const token = managerToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(MANAGER_COOKIE)?.value === token;
}

export function isManagerRequest(req: NextRequest): boolean {
  const token = managerToken();
  if (!token) return false;
  return req.cookies.get(MANAGER_COOKIE)?.value === token;
}
