import { z } from 'zod';
import { prisma } from './db';

export const reportRecipientSchema = z.object({
  recipient: z.string().trim().email('Enter a valid email address.').max(254),
}).strict();

export function defaultReportRecipient(): string {
  return (process.env.ANALYTICS_REPORT_TO || process.env.EMAIL_TO || '').trim();
}

export async function getWeeklyReportRecipient(): Promise<string> {
  if (!prisma) throw new Error('Database not available');
  try {
    const settings = await prisma.reportSettings.findUnique({ where: { id: 'weekly' } });
    return settings?.recipient ?? defaultReportRecipient();
  } catch (error) {
    // Preserve existing scheduled delivery while the additive table is being deployed.
    if ((error as { code?: string }).code === 'P2021') return defaultReportRecipient();
    throw error;
  }
}
