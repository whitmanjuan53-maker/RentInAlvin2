import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';
import { getWeeklyReportRecipient, reportRecipientSchema } from '@/lib/report-settings';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json({ recipient: await getWeeklyReportRecipient() }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not load report settings. Please retry.' }, { status: 503 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const origin = req.headers.get('origin');
  if (origin) {
    try {
      const source = new URL(origin);
      // Next can use an internal hostname behind a proxy. Host is the public
      // destination header; browsers cannot override it in a cross-origin fetch.
      if (!['http:', 'https:'].includes(source.protocol) || source.host !== (req.headers.get('host') || req.nextUrl.host)) {
        return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }
  }
  const parsed = reportRecipientSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter one valid email address.' }, { status: 400 });
  if (!prisma) return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  try {
    await prisma.reportSettings.upsert({
      where: { id: 'weekly' },
      create: { id: 'weekly', recipient: parsed.data.recipient },
      update: { recipient: parsed.data.recipient },
    });
    return NextResponse.json(parsed.data, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not save the recipient. Please retry or contact your site administrator.' }, { status: 503 });
  }
}
