import { NextRequest, NextResponse } from 'next/server';
import { processLead } from '@/lib/leads';
import { checkRateLimit } from '@/lib/rate-limit';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit(ip, 5, 60000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { property, date, time, name, email, phone, moveBy, notes, website } = body;

    const source = req.headers.get('referer') || 'Website';
    const result = await processLead(
      { type: 'tour', property, date, time, name, email, phone, moveBy, notes },
      { source, ip, honeypot: website }
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Invalid submission.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tour request received successfully.',
      leadId: result.leadId,
      id: result.dbId,
      calendarEventId: result.calendarEventId,
    });
  } catch (err) {
    console.error('[TOUR API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again or call us.' },
      { status: 500 }
    );
  }
}
