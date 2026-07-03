import { prisma, isDbReady } from './db';
import { sendLeadEmail, sendUserConfirmationEmail } from './email';
import { appendLeadToSheet, createTourEvent, checkDoubleBooking } from './google';
import {
  saveUnifiedLead,
  logEmail,
  extractEmailId,
  recordEvent,
  attachEmailToLead,
  hashIp,
  normalizeLeadType,
} from './analytics';

export type LeadType = 'tour' | 'apply' | 'sell' | 'contact';

export interface TourLead {
  type: 'tour';
  property: string;
  date: string;
  time: string;
  name: string;
  phone?: string;
  email?: string;
  moveBy?: string;
  notes?: string;
}

export interface ApplyLead {
  type: 'apply';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string;
  currentAddress?: string;
  coApplicants?: string;
  pets?: string;
  petDesc?: string;
  vehicles?: string;
  employer?: string;
  jobTitle?: string;
  income?: string;
  employedSince?: string;
  prevLandlord?: string;
  prevLandlordPhone?: string;
  reasonLeaving?: string;
  property?: string;
  unitType?: string;
  moveIn?: string;
  budget?: string;
  notes?: string;
}

export interface SellLead {
  type: 'sell';
  name: string;
  phone?: string;
  email?: string;
  addr: string;
  propertyType?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  timeline?: string;
  notes?: string;
}

export interface ContactLead {
  type: 'contact';
  name: string;
  phone?: string;
  email?: string;
  property?: string;
  message?: string;
  moveBy?: string;
  bedrooms?: string;
}

export type LeadPayload = TourLead | ApplyLead | SellLead | ContactLead;

export interface LeadMeta {
  source?: string;
  ip?: string;
  honeypot?: string;
}

function generateLeadId() {
  return `YS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function nowCentral() {
  return new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
}

function validate(payload: LeadPayload, meta?: LeadMeta): string | null {
  // Honeypot check
  if (meta?.honeypot && meta.honeypot.trim().length > 0) {
    console.log('[LEADS] Honeypot triggered, rejecting submission');
    return 'Invalid submission.';
  }

  switch (payload.type) {
    case 'tour': {
      if (!payload.name?.trim()) {
        return 'Full name is required.';
      }
      if (!payload.phone?.trim()) {
        return 'Phone number is required.';
      }
      if (!payload.email?.trim()) {
        return 'Email address is required.';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
        return 'Please enter a valid email address.';
      }
      if (!payload.property) {
        return 'Property is required.';
      }
      if (!payload.date) {
        return 'Preferred tour date is required.';
      }
      if (!payload.time) {
        return 'Preferred tour time is required.';
      }
      return null;
    }
    case 'apply': {
      if (!payload.firstName?.trim() || !payload.lastName?.trim()) {
        return 'First name and last name are required.';
      }
      if (!payload.email?.trim()) {
        return 'Email address is required.';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
        return 'Please enter a valid email address.';
      }
      if (!payload.phone?.trim()) {
        return 'Phone number is required.';
      }
      return null;
    }
    case 'sell': {
      if (!payload.name?.trim()) {
        return 'Name is required.';
      }
      if (!payload.phone?.trim()) {
        return 'Phone number is required.';
      }
      if (!payload.email?.trim()) {
        return 'Email address is required.';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
        return 'Please enter a valid email address.';
      }
      if (!payload.addr?.trim()) {
        return 'Property address is required.';
      }
      return null;
    }
    case 'contact': {
      if (!payload.name?.trim()) {
        return 'Full name is required.';
      }
      if (!payload.phone?.trim()) {
        return 'Phone number is required.';
      }
      if (!payload.email?.trim()) {
        return 'Email address is required.';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
        return 'Please enter a valid email address.';
      }
      if (!payload.message?.trim()) {
        return 'Message is required.';
      }
      return null;
    }
    default:
      return 'Unknown lead type.';
  }
}

function getFullName(payload: LeadPayload): string {
  if (payload.type === 'apply') {
    return `${payload.firstName} ${payload.lastName}`;
  }
  return payload.name;
}

function getProperty(payload: LeadPayload): string | null {
  if (payload.type === 'tour') return payload.property;
  if (payload.type === 'apply') return payload.property || null;
  if (payload.type === 'sell') return payload.addr;
  if (payload.type === 'contact') return payload.property || null;
  return null;
}

function getMoveInDate(payload: LeadPayload): string | null {
  if (payload.type === 'tour') return payload.moveBy || null;
  if (payload.type === 'apply') return payload.moveIn || null;
  if (payload.type === 'contact') return payload.moveBy || null;
  return null;
}

function getMessage(payload: LeadPayload): string | null {
  if (payload.type === 'tour') return payload.notes || null;
  if (payload.type === 'sell') return payload.notes || null;
  if (payload.type === 'contact') return payload.message || null;
  return null;
}

function getExtraNotes(payload: LeadPayload): string | null {
  if (payload.type === 'apply') {
    const extra: Record<string, unknown> = {
      dob: payload.dob,
      currentAddress: payload.currentAddress,
      coApplicants: payload.coApplicants,
      pets: payload.pets,
      petDesc: payload.petDesc,
      vehicles: payload.vehicles,
      employer: payload.employer,
      jobTitle: payload.jobTitle,
      income: payload.income,
      employedSince: payload.employedSince,
      prevLandlord: payload.prevLandlord,
      prevLandlordPhone: payload.prevLandlordPhone,
      reasonLeaving: payload.reasonLeaving,
      unitType: payload.unitType,
      budget: payload.budget,
    };
    Object.keys(extra).forEach((k) => {
      if (extra[k] == null || extra[k] === '') delete extra[k];
    });
    return Object.keys(extra).length > 0 ? JSON.stringify(extra) : null;
  }
  if (payload.type === 'sell') {
    const extra: Record<string, unknown> = {
      propertyType: payload.propertyType,
      beds: payload.beds,
      baths: payload.baths,
      sqft: payload.sqft,
      timeline: payload.timeline,
    };
    Object.keys(extra).forEach((k) => {
      if (extra[k] == null || extra[k] === '') delete extra[k];
    });
    return Object.keys(extra).length > 0 ? JSON.stringify(extra) : null;
  }
  if (payload.type === 'contact') {
    const extra: Record<string, unknown> = {
      bedrooms: payload.bedrooms,
    };
    Object.keys(extra).forEach((k) => {
      if (extra[k] == null || extra[k] === '') delete extra[k];
    });
    return Object.keys(extra).length > 0 ? JSON.stringify(extra) : null;
  }
  return null;
}

interface SaveResult {
  dbId: string | null;
  leadRowId: string | null;
}

async function saveToDb(payload: LeadPayload, leadId: string, source: string): Promise<SaveResult> {
  if (!isDbReady() || !prisma) {
    console.warn('[LEADS] DB not ready, skipping database save');
    return { dbId: null, leadRowId: null };
  }

  try {
    switch (payload.type) {
      case 'tour': {
        const tour = await prisma.tour.create({
          data: {
            property: payload.property,
            date: payload.date,
            time: payload.time,
            name: payload.name,
            email: payload.email || null,
            phone: payload.phone || null,
            moveBy: payload.moveBy || null,
            notes: payload.notes || null,
          },
        });
        const leadRowId = await saveUnifiedLead({
          rawType: 'tour',
          leadType: 'booking',
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          property: payload.property,
          message: payload.notes,
          metadata: { date: payload.date, time: payload.time, moveBy: payload.moveBy, tourId: tour.id, leadId },
          sourcePage: source,
        });
        return { dbId: tour.id, leadRowId };
      }
      case 'apply': {
        const app = await prisma.application.create({
          data: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            dob: payload.dob || null,
            currentAddress: payload.currentAddress || null,
            coApplicants: payload.coApplicants || null,
            pets: payload.pets || null,
            petDesc: payload.petDesc || null,
            vehicles: payload.vehicles || null,
            employer: payload.employer || null,
            jobTitle: payload.jobTitle || null,
            income: payload.income || null,
            employedSince: payload.employedSince || null,
            prevLandlord: payload.prevLandlord || null,
            prevLandlordPhone: payload.prevLandlordPhone || null,
            reasonLeaving: payload.reasonLeaving || null,
            property: payload.property || null,
            unitType: payload.unitType || null,
            moveIn: payload.moveIn || null,
            budget: payload.budget || null,
            notes: payload.notes || null,
          },
        });
        const leadRowId = await saveUnifiedLead({
          rawType: 'apply',
          leadType: 'application_interest',
          name: `${payload.firstName} ${payload.lastName}`,
          email: payload.email,
          phone: payload.phone,
          property: payload.property,
          message: payload.notes,
          metadata: { applicationId: app.id, unitType: payload.unitType, moveIn: payload.moveIn, leadId },
          sourcePage: source,
        });
        return { dbId: app.id, leadRowId };
      }
      case 'sell':
      case 'contact': {
        const lead = await prisma.lead.create({
          data: {
            type: payload.type,
            leadType: normalizeLeadType(payload.type),
            name: payload.name,
            email: payload.email || null,
            phone: payload.phone || null,
            property: payload.type === 'contact' ? payload.property || null : payload.addr,
            message: payload.type === 'contact' ? payload.message || null : payload.notes || null,
            sourcePage: source,
            metadata:
              payload.type === 'sell'
                ? JSON.stringify({
                    propertyType: payload.propertyType,
                    beds: payload.beds,
                    baths: payload.baths,
                    sqft: payload.sqft,
                    timeline: payload.timeline,
                  })
                : payload.type === 'contact'
                ? JSON.stringify({
                    moveBy: payload.moveBy,
                    bedrooms: payload.bedrooms,
                  })
                : null,
          },
        });
        return { dbId: lead.id, leadRowId: lead.id };
      }
    }
  } catch (err) {
    console.error(`[LEADS] DB save failed for ${payload.type}:`, err);
    return { dbId: null, leadRowId: null };
  }
}

async function writeToSheets(payload: LeadPayload, leadId: string, calendarEventId: string | null, source: string) {
  const row = [
    leadId,
    nowCentral(),
    payload.type,
    getFullName(payload),
    payload.phone || null,
    payload.email || null,
    getProperty(payload),
    payload.type === 'tour' ? payload.date : null,
    payload.type === 'tour' ? payload.time : null,
    getMoveInDate(payload),
    getMessage(payload),
    source,
    'New',
    null, // Assigned Employee
    calendarEventId,
    getExtraNotes(payload),
  ];

  try {
    return await appendLeadToSheet(row);
  } catch (err) {
    console.error('[LEADS] Sheets write failed:', err);
    return null;
  }
}

async function createCalendarEventIfNeeded(payload: LeadPayload, leadId: string, source: string) {
  if (payload.type !== 'tour') return null;

  try {
    const isBooked = await checkDoubleBooking(payload.date, payload.time);
    if (isBooked) {
      console.warn(`[LEADS] Time slot already booked: ${payload.date} ${payload.time}`);
    }

    return await createTourEvent({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      property: payload.property,
      date: payload.date,
      time: payload.time,
      moveBy: payload.moveBy,
      notes: payload.notes,
      leadId,
      source,
    });
  } catch (err) {
    console.error('[LEADS] Calendar event creation failed:', err);
    return null;
  }
}

function buildEmailSubject(payload: LeadPayload): string {
  const property = getProperty(payload);
  const name = getFullName(payload);
  switch (payload.type) {
    case 'tour':
      return `[Tour Request] ${name} — ${property || 'Unknown Property'}`;
    case 'apply':
      return `[Application] ${name} — ${property || 'No Property Selected'}`;
    case 'sell':
      return `[Property Sale Inquiry] ${name} — ${payload.addr}`;
    case 'contact':
      return `[Lead] ${name} — ${property || 'General Inquiry'}`;
  }
}

function buildEmailBody(payload: LeadPayload, leadId: string, source: string): string {
  const lines: string[] = [
    'New lead submitted from the website.',
    '',
    'Lead Details:',
    `Lead ID: ${leadId}`,
    `Type: ${payload.type.toUpperCase()}`,
    `Name: ${getFullName(payload)}`,
    `Phone: ${payload.phone || 'N/A'}`,
    `Email: ${payload.email || 'N/A'}`,
    `Property: ${getProperty(payload) || 'N/A'}`,
  ];

  if (payload.type === 'tour') {
    lines.push(`Tour Date: ${payload.date}`);
    lines.push(`Tour Time: ${payload.time}`);
    lines.push(`Move-In Date: ${payload.moveBy || 'N/A'}`);
    lines.push(`Notes: ${payload.notes || 'N/A'}`);
  }

  if (payload.type === 'apply') {
    lines.push(`Move-In Date: ${payload.moveIn || 'N/A'}`);
    lines.push(`Unit Type: ${payload.unitType || 'N/A'}`);
    lines.push(`Income: ${payload.income || 'N/A'}`);
    lines.push(`Pets: ${payload.pets === 'no' ? 'None' : payload.petDesc || payload.pets || 'N/A'}`);
    lines.push(`Employer: ${payload.employer || 'N/A'}`);
    lines.push(`Notes: ${payload.notes || 'N/A'}`);
  }

  if (payload.type === 'sell') {
    lines.push(`Property Address: ${payload.addr}`);
    lines.push(`Property Type: ${payload.propertyType || 'N/A'}`);
    lines.push(`Beds: ${payload.beds || 'N/A'}`);
    lines.push(`Baths: ${payload.baths || 'N/A'}`);
    lines.push(`Sq Ft: ${payload.sqft || 'N/A'}`);
    lines.push(`Timeline: ${payload.timeline || 'N/A'}`);
    lines.push(`Notes: ${payload.notes || 'N/A'}`);
  }

  if (payload.type === 'contact') {
    lines.push(`Move-In Timeframe: ${payload.moveBy || 'N/A'}`);
    lines.push(`Bedrooms Needed: ${payload.bedrooms || 'N/A'}`);
    lines.push(`Message: ${payload.message || 'N/A'}`);
  }

  lines.push('');
  lines.push(`Lead Source: ${source}`);
  lines.push(`Submitted At: ${nowCentral()}`);
  lines.push('');
  lines.push('Actions Needed:');
  lines.push('Please contact this lead as soon as possible.');
  lines.push('');
  lines.push('Replying to this email will reply directly to the customer.');

  return lines.join('\n');
}

async function sendNotification(payload: LeadPayload, leadId: string, source: string, leadRowId: string | null) {
  const subject = buildEmailSubject(payload);
  const toEmail = (process.env.EMAIL_TO || process.env.LEADS_TO_EMAIL || 'office@yellowstone-am.com').trim();
  const emailType = payload.type === 'tour' ? 'booking_notification' : 'lead_notification';

  try {
    const body = buildEmailBody(payload, leadId, source);
    const replyTo = payload.email || undefined;
    const result = await sendLeadEmail(subject, body, { replyTo });

    const resendEmailId = extractEmailId(result);
    await logEmail({ resendEmailId, leadId: leadRowId, emailType, toEmail, subject, status: 'sent' });
    if (leadRowId && resendEmailId) await attachEmailToLead(leadRowId, resendEmailId);
    await recordEvent({
      eventType: 'email_sent',
      metadata: { emailType, leadId: leadRowId, resendEmailId },
    });

    return result;
  } catch (err) {
    console.error('[LEADS] Email notification failed:', err);
    await logEmail({
      leadId: leadRowId,
      emailType,
      toEmail,
      subject,
      status: 'failed',
      errorMessage: err instanceof Error ? err.message : String(err),
    });
    await recordEvent({ eventType: 'email_failed', metadata: { emailType, leadId: leadRowId } });
    return null;
  }
}

async function sendUserConfirmation(payload: LeadPayload, leadRowId: string | null) {
  try {
    const email = payload.email;
    if (!email || !email.includes('@')) return null;

    let result = null;
    if (payload.type === 'tour') {
      result = await sendUserConfirmationEmail({
        to: email,
        type: 'tour',
        name: payload.name,
        property: payload.property,
        date: payload.date,
        time: payload.time,
      });
    } else if (payload.type === 'contact') {
      result = await sendUserConfirmationEmail({
        to: email,
        type: 'contact',
        name: payload.name,
        property: payload.property,
      });
    }

    if (result) {
      await logEmail({
        resendEmailId: extractEmailId(result),
        leadId: leadRowId,
        emailType: 'confirmation',
        toEmail: email,
        subject: payload.type === 'tour' ? 'Tour request confirmation' : 'Inquiry confirmation',
        status: 'sent',
      });
    }

    return result;
  } catch (err) {
    console.error('[LEADS] User confirmation email failed:', err);
    return null;
  }
}

export interface ProcessLeadResult {
  success: boolean;
  leadId: string;
  dbId: string | null;
  sheetRange: string | null;
  calendarEventId: string | null;
  emailSent: boolean;
  error?: string;
}

export async function processLead(
  payload: LeadPayload,
  meta: LeadMeta
): Promise<ProcessLeadResult> {
  console.log('[LEADS] Processing lead:', payload.type);

  const validationError = validate(payload, meta);
  if (validationError) {
    console.warn('[LEADS] Validation failed:', validationError);
    return { success: false, leadId: '', dbId: null, sheetRange: null, calendarEventId: null, emailSent: false, error: validationError };
  }

  const leadId = generateLeadId();
  const source = meta.source || 'Website';

  console.log('[LEADS] Generated lead ID:', leadId);

  // 1. Save to DB (detail table + unified lead row for analytics)
  console.log('[LEADS] Saving to database...');
  const { dbId, leadRowId } = await saveToDb(payload, leadId, source);
  console.log('[LEADS] DB save result:', dbId || 'skipped/failed');

  // 2. Record analytics event (best-effort)
  await recordEvent({
    eventType: payload.type === 'tour' ? 'booking_submit' : 'form_submit',
    pagePath: source && source.startsWith('http') ? (() => { try { return new URL(source).pathname; } catch { return source; } })() : source,
    ipHash: meta.ip ? hashIp(meta.ip) : null,
    metadata: { leadType: payload.type, leadRowId, leadId },
  });

  // 3. Create calendar event if tour
  console.log('[LEADS] Checking calendar event...');
  const calendarEventId = await createCalendarEventIfNeeded(payload, leadId, source);
  console.log('[LEADS] Calendar event result:', calendarEventId || 'skipped/failed');

  // 4. Write to Google Sheets
  console.log('[LEADS] Writing to Google Sheets...');
  const sheetRange = await writeToSheets(payload, leadId, calendarEventId, source);
  console.log('[LEADS] Sheets write result:', sheetRange || 'skipped/failed');

  // 5. Send email notification to team
  console.log('[LEADS] Sending team notification...');
  const emailResult = await sendNotification(payload, leadId, source, leadRowId);
  console.log('[LEADS] Team notification result:', emailResult ? 'sent' : 'failed');

  // 6. Send user confirmation email (best-effort)
  console.log('[LEADS] Sending user confirmation...');
  await sendUserConfirmation(payload, leadRowId);

  return {
    success: true,
    leadId,
    dbId,
    sheetRange,
    calendarEventId,
    emailSent: !!emailResult,
  };
}
