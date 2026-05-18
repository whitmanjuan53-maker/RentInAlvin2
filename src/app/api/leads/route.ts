import { NextRequest, NextResponse } from 'next/server';
import { processLead, type LeadPayload } from '@/lib/leads';
import { checkRateLimit } from '@/lib/rate-limit';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  console.log('[API /leads] Received POST request');

  try {
    const ip = getClientIp(req);
    console.log('[API /leads] Client IP:', ip);

    const limit = checkRateLimit(ip, 5, 60000);
    if (!limit.allowed) {
      console.warn('[API /leads] Rate limit exceeded for IP:', ip);
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const payload = body as LeadPayload & { website?: string };

    console.log('[API /leads] Payload type:', payload.type);

    if (!payload.type) {
      console.warn('[API /leads] Missing lead type');
      return NextResponse.json(
        { success: false, message: 'Lead type is required.' },
        { status: 400 }
      );
    }

    const source = req.headers.get('referer') || 'Website';
    const result = await processLead(payload, { source, ip, honeypot: payload.website });

    if (!result.success) {
      console.warn('[API /leads] Processing failed:', result.error);
      return NextResponse.json(
        { success: false, message: result.error || 'Invalid submission.' },
        { status: 400 }
      );
    }

    console.log('[API /leads] Lead processed successfully. ID:', result.leadId);

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully.',
      leadId: result.leadId,
      dbId: result.dbId,
      calendarEventId: result.calendarEventId,
    });
  } catch (err) {
    console.error('[API /leads] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again or call us.' },
      { status: 500 }
    );
  }
}
