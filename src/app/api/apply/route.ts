import { NextRequest, NextResponse } from 'next/server';
import { processLead } from '@/lib/leads';
import { checkRateLimit } from '@/lib/rate-limit';
import { EMPTY_APPLICATION, ApplicationData, validateApplication } from '@/lib/application';

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
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({success:false,message:'Invalid application.'},{status:400});
    const data = Object.fromEntries(Object.entries(EMPTY_APPLICATION).map(([key,initial]) => [key, key === 'consent' ? body[key] === true : typeof body[key] === 'string' ? body[key].trim() : initial])) as ApplicationData;
    const errors = validateApplication(data);
    if (Object.keys(errors).length) return NextResponse.json({success:false,message:'Please complete the required application details and authorization.',errors},{status:400});
    const source = req.headers.get('referer') || 'Website';

    const result = await processLead(
      {
        type: 'apply',
        consent: data.consent,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        currentAddress: data.currentAddress,
        coApplicants: data.coApplicants,
        pets: data.pets,
        petDesc: data.petDesc,
        vehicles: data.vehicles,
        employer: data.employer,
        jobTitle: data.jobTitle,
        income: data.income,
        employedSince: data.employedSince,
        prevLandlord: data.prevLandlord,
        prevLandlordPhone: data.prevLandlordPhone,
        reasonLeaving: data.reasonLeaving,
        property: data.property,
        unitType: data.unitType,
        moveIn: data.moveIn,
        budget: data.budget,
        notes: data.notes,
      },
      { source, ip }
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Invalid submission.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application received successfully.',
      leadId: result.leadId,
      id: result.dbId,
    });
  } catch (err) {
    console.error('[APPLY API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again or call us.' },
      { status: 500 }
    );
  }
}
