import { NextRequest, NextResponse } from 'next/server';
import { verifyManagerPassword, managerToken, MANAGER_COOKIE } from '@/lib/manager-auth';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit(`manager-login:${ip}`, 5, 60000);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const password = typeof body.password === 'string' ? body.password : '';

    if (!process.env.MANAGER_PASSWORD) {
      return NextResponse.json(
        { error: 'MANAGER_PASSWORD is not configured on the server.' },
        { status: 500 }
      );
    }

    if (!verifyManagerPassword(password)) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(MANAGER_COOKIE, managerToken()!, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error('[API /manager/login] Error:', err);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(MANAGER_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
