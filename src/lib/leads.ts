import { prisma, isDbReady } from './db';
import { sendLeadEmail, GENERAL_RECIPIENTS, TOUR_RECIPIENTS } from './email';
import { appendLeadToSheet, createTourEvent, checkDoubleBooking } from './google';

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
}

export type LeadPayload = TourLead | ApplyLead | SellLead | ContactLead;

function generateLeadId() {
  return `YS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function nowCentral() {
  return new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
}

function validate(payload: LeadPayload): string | null {
  switch (payload.type) {
    case 'tour':
      if (!payload.property || !payload.date || !payload.time || !payload.name) {
        return 'Property, date, time, and name are required.';
      }
      if (!payload.phone && !payload.email) {
        return 'Please provide at least a phone number or email.';
      }
      return null;
    case 'apply':
      if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone) {
        return 'First name, last name, email, and phone are required.';
      }
      return null;
    case 'sell':
      if (!payload.name || !payload.addr) {
        return 'Name and property address are required.';
      }
      if (!payload.phone && !payload.email) {
        return 'Please provide at least a phone number or email.';
      }
      return null;
    case 'contact':
      if (!payload.name) {
        return 'Name is required.';
      }
      if (!payload.phone && !payload.email) {
        return 'Please provide at least a phone number or email.';
      }
      return null;
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
    // Remove undefined/null values
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
  return null;
}

async function saveToDb(payload: LeadPayload, leadId: string) {
  if (!isDbReady() || !prisma) {
    console.warn('[LEADS] DB not ready, skipping database save');
    return null;
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
        return tour.id;
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
        return app.id;
      }
      case 'sell':
      case 'contact': {
        const lead = await prisma.lead.create({
          data: {
            type: payload.type,
            name: payload.name,
            email: payload.email || null,
            phone: payload.phone || null,
            property: payload.type === 'contact' ? payload.property || null : payload.addr,
            message: payload.type === 'contact' ? payload.message || null : payload.notes || null,
            metadata:
              payload.type === 'sell'
                ? JSON.stringify({
                    propertyType: payload.propertyType,
                    beds: payload.beds,
                    baths: payload.baths,
                    sqft: payload.sqft,
                    timeline: payload.timeline,
                  })
                : null,
          },
        });
        return lead.id;
      }
    }
  } catch (err) {
    console.error(`[LEADS] DB save failed for ${payload.type}:`, err);
    return null;
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
  switch (payload.type) {
    case 'tour':
      return `New Website Tour Request - ${property || 'Unknown Property'}`;
    case 'apply':
      return `New Website Application - ${property || 'No Property Selected'}`;
    case 'sell':
      return `New Website Property Sale Inquiry - ${payload.addr}`;
    case 'contact':
      return `New Website Contact Lead - ${property || 'General Inquiry'}`;
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
    lines.push(`Message: ${payload.message || 'N/A'}`);
  }

  lines.push('');
  lines.push(`Lead Source: ${source}`);
  lines.push(`Submitted At: ${nowCentral()}`);
  lines.push('');
  lines.push('Actions Needed:');
  lines.push('Please contact this lead as soon as possible.');

  return lines.join('\n');
}

async function sendNotification(payload: LeadPayload, leadId: string, source: string) {
  try {
    const subject = buildEmailSubject(payload);
    const body = buildEmailBody(payload, leadId, source);
    const to = payload.type === 'tour' ? TOUR_RECIPIENTS : GENERAL_RECIPIENTS;
    return await sendLeadEmail(subject, body, to);
  } catch (err) {
    console.error('[LEADS] Email notification failed:', err);
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
  meta: { source?: string; ip?: string }
): Promise<ProcessLeadResult> {
  const validationError = validate(payload);
  if (validationError) {
    return { success: false, leadId: '', dbId: null, sheetRange: null, calendarEventId: null, emailSent: false, error: validationError };
  }

  const leadId = generateLeadId();
  const source = meta.source || 'Website';

  // 1. Save to DB
  const dbId = await saveToDb(payload, leadId);

  // 2. Create calendar event if tour
  const calendarEventId = await createCalendarEventIfNeeded(payload, leadId, source);

  // 3. Write to Google Sheets
  const sheetRange = await writeToSheets(payload, leadId, calendarEventId, source);

  // 4. Send email notification
  const emailResult = await sendNotification(payload, leadId, source);

  return {
    success: true,
    leadId,
    dbId,
    sheetRange,
    calendarEventId,
    emailSent: !!emailResult,
  };
}
