import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// --- Provider detection ---
// Priority: SMTP > SendGrid > Resend > console simulation
const useSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
const useSendGrid = !!process.env.SENDGRID_API_KEY && !useSmtp;
const useResend = !!process.env.RESEND_API_KEY && !useSmtp && !useSendGrid;

// Lazy-load SendGrid only if needed
let sendgridLib: typeof import('@sendgrid/mail') | null = null;
function getSendgrid() {
  if (!sendgridLib && useSendGrid) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sg = require('@sendgrid/mail') as typeof import('@sendgrid/mail');
    sg.setApiKey(process.env.SENDGRID_API_KEY!);
    sendgridLib = sg;
  }
  return sendgridLib;
}

const resend = useResend ? new Resend(process.env.RESEND_API_KEY!) : null;

// Build SMTP transporter once
function getSmtpTransporter() {
  if (!useSmtp) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export function getFromEmail(): string {
  return process.env.EMAIL_FROM || 'RentInAlvin Website <no-reply@rentinalvin.com>';
}

function getToRecipients(): string[] {
  return (process.env.EMAIL_TO || process.env.LEADS_TO_EMAIL || 'office@yellowstone-am.com')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}

function getCcRecipients(): string[] {
  const cc = (process.env.EMAIL_CC || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (cc.length > 0) return cc;

  // Fallback employees if EMAIL_CC is not set
  return [
    'manager@yellowstone-am.com',
    'dor@yellowstone-am.com',
    'lise@yellowstone-am.com',
    'zoe@yellowstone-am.com',
  ];
}

async function sendViaSmtp(
  from: string,
  to: string[],
  cc: string[],
  replyTo: string,
  subject: string,
  text: string,
  html?: string
) {
  const transporter = getSmtpTransporter();
  if (!transporter) throw new Error('SMTP not configured');

  const result = await transporter.sendMail({
    from,
    to,
    cc: cc.length > 0 ? cc : undefined,
    replyTo,
    subject,
    text,
    html: html || undefined,
  });

  return result;
}

async function sendViaSendGrid(
  from: string,
  to: string[],
  cc: string[],
  replyTo: string,
  subject: string,
  text: string,
  html?: string
) {
  const sg = getSendgrid();
  if (!sg) throw new Error('SendGrid not configured');

  return await sg.send({
    from,
    to,
    cc: cc.length > 0 ? cc : undefined,
    replyTo,
    subject,
    text,
    html: html || undefined,
  });
}

async function sendViaResend(
  from: string,
  to: string[],
  cc: string[],
  replyTo: string,
  subject: string,
  text: string,
  html?: string
) {
  if (!resend) throw new Error('Resend not configured');
  return await resend.emails.send({
    from,
    to,
    cc: cc.length > 0 ? cc : undefined,
    reply_to: replyTo,
    subject,
    text,
    html: html || undefined,
  });
}

export async function sendLeadEmail(
  subject: string,
  body: string,
  options: {
    to?: string[];
    cc?: string[];
    replyTo?: string;
    html?: string;
  } = {}
) {
  const from = getFromEmail();
  const toRecipients = options.to && options.to.length > 0 ? options.to : getToRecipients();
  const ccRecipients = options.cc && options.cc.length > 0 ? options.cc : getCcRecipients();
  const replyTo = options.replyTo || from;

  let provider: string;
  if (useSmtp) provider = 'smtp';
  else if (useSendGrid) provider = 'sendgrid';
  else if (useResend) provider = 'resend';
  else provider = 'none';

  console.log('[EMAIL] Preparing to send lead notification:');
  console.log('[EMAIL] Provider:', provider);
  console.log('[EMAIL] From:', from);
  console.log('[EMAIL] Reply-To:', replyTo);
  console.log('[EMAIL] To:', toRecipients.join(', '));
  console.log('[EMAIL] CC:', ccRecipients.join(', '));
  console.log('[EMAIL] Subject:', subject);

  if (provider === 'none') {
    console.warn('[EMAIL] No email provider configured. Email would have been sent:');
    console.warn('From:', from);
    console.warn('Reply-To:', replyTo);
    console.warn('To:', toRecipients.join(', '));
    console.warn('CC:', ccRecipients.join(', '));
    console.warn('Subject:', subject);
    console.warn('Body:', body);
    return { id: 'simulated', message: 'Email simulated — add SMTP, SENDGRID_API_KEY, or RESEND_API_KEY to send real emails' };
  }

  try {
    let result;
    if (provider === 'smtp') {
      result = await sendViaSmtp(from, toRecipients, ccRecipients, replyTo, subject, body, options.html);
      console.log('[EMAIL] Sent via SMTP:', result.messageId);
    } else if (provider === 'sendgrid') {
      result = await sendViaSendGrid(from, toRecipients, ccRecipients, replyTo, subject, body, options.html);
      console.log('[EMAIL] Sent via SendGrid:', result);
    } else {
      result = await sendViaResend(from, toRecipients, ccRecipients, replyTo, subject, body, options.html);
      console.log('[EMAIL] Sent via Resend:', result);
    }
    return result;
  } catch (err) {
    console.error('[EMAIL] Send failed:', err);
    throw new Error('Failed to send email notification');
  }
}

export async function sendUserConfirmationEmail({
  to,
  type,
  name,
  property,
  date,
  time,
}: {
  to: string;
  type: 'tour' | 'contact';
  name: string;
  property?: string;
  date?: string;
  time?: string;
}) {
  const from = getFromEmail();
  const replyTo = 'office@yellowstone-am.com';

  let subject = '';
  let text = '';
  let html = '';

  if (type === 'tour') {
    subject = `Your tour request has been received — ${property || 'RentInAlvin.com'}`;
    text = [
      `Hi ${name},`,
      '',
      'Thank you for scheduling a tour with Yellowstone Management. We have received your request and will confirm your appointment within 24 hours.',
      '',
      'Tour Details:',
      `Property: ${property || 'TBD'}`,
      `Date: ${date || 'TBD'}`,
      `Time: ${time || 'TBD'}`,
      '',
      'What to expect:',
      '• A member of our leasing team will reach out by phone or email to confirm.',
      '• If you need to reschedule, simply reply to this email or call us at (832) 210-3968.',
      '• Please bring a photo ID to the tour.',
      '',
      'Office Location:',
      '410 S 2nd Street, Alvin, TX 77511',
      '',
      'We look forward to meeting you.',
      '',
      'Warmly,',
      'The Yellowstone Management Team',
      'office@yellowstone-am.com',
      '(832) 210-3968',
    ].join('\n');

    html = `<div style="font-family:Georgia,serif;color:#1A1815;max-width:520px;margin:0 auto;padding:32px 24px;background:#FBF7F0;">
      <h2 style="font-weight:400;font-size:22px;margin:0 0 16px;color:#1F3A2E;">Hi ${name},</h2>
      <p style="line-height:1.6;margin:0 0 16px;">Thank you for scheduling a tour with Yellowstone Management. We have received your request and will confirm your appointment within 24 hours.</p>
      <div style="background:#F4EEE4;border:1px solid rgba(26,24,21,0.12);padding:16px;margin:16px 0;">
        <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#5C5750;font-weight:600;margin-bottom:8px;">Tour Details</div>
        <div style="line-height:1.6;"><strong>Property:</strong> ${property || 'TBD'}</div>
        <div style="line-height:1.6;"><strong>Date:</strong> ${date || 'TBD'}</div>
        <div style="line-height:1.6;"><strong>Time:</strong> ${time || 'TBD'}</div>
      </div>
      <p style="line-height:1.6;margin:0 0 8px;"><strong>What to expect</strong></p>
      <ul style="padding-left:20px;line-height:1.6;margin:0 0 16px;">
        <li>A member of our leasing team will reach out by phone or email to confirm.</li>
        <li>If you need to reschedule, simply reply to this email or call us at (832) 210-3968.</li>
        <li>Please bring a photo ID to the tour.</li>
      </ul>
      <p style="line-height:1.6;margin:0 0 4px;"><strong>Office</strong><br>410 S 2nd Street, Alvin, TX 77511</p>
      <p style="line-height:1.6;margin:24px 0 0;">We look forward to meeting you.<br><br>Warmly,<br><strong>The Yellowstone Management Team</strong><br><a href="mailto:office@yellowstone-am.com" style="color:#1F3A2E;">office@yellowstone-am.com</a><br>(832) 210-3968</p>
    </div>`;
  } else {
    subject = 'We received your inquiry — RentInAlvin.com';
    text = [
      `Hi ${name},`,
      '',
      'Thank you for reaching out to Yellowstone Management. We have received your inquiry and a member of our leasing team will follow up with you within one business day.',
      '',
      'If your request is urgent, feel free to call or text us directly:',
      '(832) 210-3968',
      '',
      'Office Location:',
      '410 S 2nd Street, Alvin, TX 77511',
      '',
      'Warmly,',
      'The Yellowstone Management Team',
      'office@yellowstone-am.com',
    ].join('\n');

    html = `<div style="font-family:Georgia,serif;color:#1A1815;max-width:520px;margin:0 auto;padding:32px 24px;background:#FBF7F0;">
      <h2 style="font-weight:400;font-size:22px;margin:0 0 16px;color:#1F3A2E;">Hi ${name},</h2>
      <p style="line-height:1.6;margin:0 0 16px;">Thank you for reaching out to Yellowstone Management. We have received your inquiry and a member of our leasing team will follow up with you within one business day.</p>
      <p style="line-height:1.6;margin:0 0 16px;">If your request is urgent, feel free to call or text us directly at <strong>(832) 210-3968</strong>.</p>
      <p style="line-height:1.6;margin:0 0 4px;"><strong>Office</strong><br>410 S 2nd Street, Alvin, TX 77511</p>
      <p style="line-height:1.6;margin:24px 0 0;">Warmly,<br><strong>The Yellowstone Management Team</strong><br><a href="mailto:office@yellowstone-am.com" style="color:#1F3A2E;">office@yellowstone-am.com</a></p>
    </div>`;
  }

  let provider: string;
  if (useSmtp) provider = 'smtp';
  else if (useSendGrid) provider = 'sendgrid';
  else if (useResend) provider = 'resend';
  else provider = 'none';

  if (provider === 'none') {
    console.warn('[EMAIL] No email provider configured. User confirmation would have been sent:');
    console.warn('To:', to);
    console.warn('Subject:', subject);
    return { id: 'simulated', message: 'User confirmation simulated — add SMTP, SENDGRID_API_KEY, or RESEND_API_KEY to send real emails' };
  }

  try {
    let result;
    if (provider === 'smtp') {
      result = await sendViaSmtp(from, [to], [], replyTo, subject, text, html);
    } else if (provider === 'sendgrid') {
      result = await sendViaSendGrid(from, [to], [], replyTo, subject, text, html);
    } else {
      result = await sendViaResend(from, [to], [], replyTo, subject, text, html);
    }
    return result;
  } catch (err) {
    console.error('[EMAIL] User confirmation email failed:', err);
    return null;
  }
}
