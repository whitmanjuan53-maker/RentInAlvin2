import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function getRecipients(): string[] {
  const raw = process.env.LEADS_TO_EMAIL || process.env.EMAIL_TO || 'office@yellowstone-am.com';
  return raw.split(',').map((e) => e.trim()).filter(Boolean);
}

export const GENERAL_RECIPIENTS = [
  'manager@yellowstone-am.com',
  'aly@yellostone-am.com',
  'dor@yellostone-am.com',
  'lise@yellostone-am.com',
  'zoe@yellostone-am.com',
];

export const TOUR_RECIPIENTS = [
  'dor@yellostone-am.com',
  'lise@yellostone-am.com',
  'zoe@yellostone-am.com',
  'manager@yellowstone-am.com',
];

export async function sendLeadEmail(subject: string, body: string, to?: string[]) {
  const from = process.env.EMAIL_FROM || 'Yellowstone Asset Management <onboarding@resend.dev>';
  const recipients = to && to.length > 0 ? to : getRecipients();

  if (!resend) {
    console.warn('[EMAIL] Resend not configured. Email would have been sent:');
    console.warn('From:', from);
    console.warn('To:', recipients.join(', '));
    console.warn('Subject:', subject);
    console.warn('Body:', body);
    return { id: 'simulated', message: 'Email simulated — add RESEND_API_KEY to send real emails' };
  }

  try {
    const result = await resend.emails.send({
      from,
      to: recipients,
      subject,
      text: body,
    });
    return result;
  } catch (err) {
    console.error('Email send failed:', err);
    throw new Error('Failed to send email notification');
  }
}
