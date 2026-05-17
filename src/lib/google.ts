import { google } from 'googleapis';

let cachedAuth: ReturnType<typeof createAuth> | null = null;

function createAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    return null;
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/calendar',
    ],
  });
}

function getAuth() {
  if (!cachedAuth) {
    cachedAuth = createAuth();
  }
  return cachedAuth;
}

function isConfigured() {
  return !!process.env.GOOGLE_CLIENT_EMAIL && !!process.env.GOOGLE_PRIVATE_KEY;
}

const SHEET_HEADERS = [
  'Lead ID',
  'Submitted At',
  'Type',
  'Full Name',
  'Phone',
  'Email',
  'Property Interested In',
  'Tour Date',
  'Tour Time',
  'Move-In Date',
  'Message',
  'Lead Source',
  'Lead Status',
  'Assigned Employee',
  'Calendar Event ID',
  'Notes',
];

export async function appendLeadToSheet(row: (string | null)[]) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId || !isConfigured()) {
    console.warn('[SHEETS] Google Sheets not configured, skipping append');
    return null;
  }

  const auth = getAuth();
  if (!auth) {
    console.warn('[SHEETS] Auth failed, skipping append');
    return null;
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });

    // Ensure headers exist
    try {
      const headerRes = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'A1:Q1',
      });

      if (!headerRes.data.values || headerRes.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: 'A1:Q1',
          valueInputOption: 'RAW',
          requestBody: { values: [SHEET_HEADERS] },
        });
      }
    } catch (err) {
      console.error('[SHEETS] Header check failed:', err);
    }

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    return result.data.updates?.updatedRange || null;
  } catch (err) {
    console.error('[SHEETS] Append failed:', err);
    throw new Error('Failed to write to Google Sheets');
  }
}

const PROPERTY_ADDRESSES: Record<string, string> = {
  'Kings Haven': '410 S 2nd St, Alvin, TX 77511',
  'Kings Manor': '328 S 2nd St, Alvin, TX 77511',
  'Kings Haven (100)': '100 S 2nd St, Alvin, TX 77511',
  'French Quarter': '2550 S Bypass 35, Alvin, TX 77511',
  'Royal Oaks': '418 S Jackson St, Alvin, TX 77511',
  'White House': '1606 W Sealy St, Alvin, TX 77511',
};

function parseTimeTo24h(timeStr: string): { hours: number; minutes: number } {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
}

export async function createTourEvent(params: {
  name: string;
  phone?: string;
  email?: string;
  property: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "9:00 AM"
  moveBy?: string;
  notes?: string;
  leadId: string;
  source?: string;
}) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId || !isConfigured()) {
    console.warn('[CALENDAR] Google Calendar not configured, skipping event creation');
    return null;
  }

  const auth = getAuth();
  if (!auth) {
    console.warn('[CALENDAR] Auth failed, skipping event creation');
    return null;
  }

  try {
    const { hours, minutes } = parseTimeTo24h(params.time);

    const startDateTime = new Date(
      `${params.date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00-06:00`
    );
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

    const location = PROPERTY_ADDRESSES[params.property] || params.property;

    const calendar = google.calendar({ version: 'v3', auth });

    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `Tour Booking - ${params.name} - ${params.property}`,
        location,
        description: [
          `Name: ${params.name}`,
          `Phone: ${params.phone || 'N/A'}`,
          `Email: ${params.email || 'N/A'}`,
          `Property: ${params.property}`,
          `Preferred Move-In Date: ${params.moveBy || 'N/A'}`,
          `Message: ${params.notes || 'N/A'}`,
          `Lead Source: ${params.source || 'Website'}`,
          `Submitted At: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}`,
          `Lead ID: ${params.leadId}`,
        ].join('\n'),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Chicago',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Chicago',
        },
      },
    });

    return event.data.id || null;
  } catch (err) {
    console.error('[CALENDAR] Event creation failed:', err);
    throw new Error('Failed to create Google Calendar event');
  }
}

export async function checkDoubleBooking(date: string, time: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId || !isConfigured()) {
    return false; // Can't check, allow through
  }

  const auth = getAuth();
  if (!auth) return false;

  try {
    const { hours, minutes } = parseTimeTo24h(time);
    const startDateTime = new Date(
      `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00-06:00`
    );
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

    const calendar = google.calendar({ version: 'v3', auth });

    const res = await calendar.events.list({
      calendarId,
      timeMin: startDateTime.toISOString(),
      timeMax: endDateTime.toISOString(),
      singleEvents: true,
    });

    return (res.data.items?.length || 0) > 0;
  } catch (err) {
    console.error('[CALENDAR] Double booking check failed:', err);
    return false;
  }
}
