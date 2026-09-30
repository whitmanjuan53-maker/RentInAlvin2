import { z } from 'zod';
import { prisma } from './db';

const recipientSchema = z.string().trim().email('Enter a valid email address.').max(254);

export const reportRecipientsSchema = z.object({
  weeklyRecipient: recipientSchema,
  monthlyRecipient: recipientSchema,
}).strict();

export type ReportRecipientType = 'weekly' | 'monthly';

export interface ReportRecipients {
  weeklyRecipient: string;
  monthlyRecipient: string;
}

export function defaultReportRecipient(): string {
  return (process.env.ANALYTICS_REPORT_TO || process.env.EMAIL_TO || '').trim();
}

export async function getReportRecipient(type: ReportRecipientType): Promise<string> {
  if (!prisma) throw new Error('Database not available');
  try {
    const settings = await prisma.reportSettings.findUnique({ where: { id: type } });
    return settings?.recipient ?? defaultReportRecipient();
  } catch (error) {
    // Preserve existing scheduled delivery while the additive table is being deployed.
    if ((error as { code?: string }).code === 'P2021') return defaultReportRecipient();
    throw error;
  }
}

export async function getReportRecipients(): Promise<ReportRecipients> {
  const [weeklyRecipient, monthlyRecipient] = await Promise.all([
    getReportRecipient('weekly'),
    getReportRecipient('monthly'),
  ]);
  return { weeklyRecipient, monthlyRecipient };
}
