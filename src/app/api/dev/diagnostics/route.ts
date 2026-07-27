import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics = {
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrlConfigured: !!process.env.DATABASE_URL,
    adminPasswordConfigured: !!process.env.ADMIN_ANALYTICS_PASSWORD,
    resendKeyConfigured: !!process.env.RESEND_API_KEY,
    resendWebhookConfigured: !!process.env.RESEND_WEBHOOK_SECRET,
    dbConnected: false,
    dbError: null as string | null,
    dbCounts: null as Record<string, number> | null,
  };

  if (prisma) {
    try {
      const [leads, tours, applications, emailLogs, analyticsEvents, weeklyReports] = await Promise.all([
        prisma.lead.count(),
        prisma.tour.count(),
        prisma.application.count(),
        prisma.emailLog.count(),
        prisma.analyticsEvent.count(),
        prisma.weeklyReport.count(),
      ]);
      diagnostics.dbConnected = true;
      diagnostics.dbCounts = { leads, tours, applications, emailLogs, analyticsEvents, weeklyReports };
    } catch (err) {
      diagnostics.dbError = err instanceof Error ? err.message : String(err);
    }
  } else {
    diagnostics.dbError = 'Prisma client is not initialized. Check DATABASE_URL.';
  }

  return NextResponse.json(diagnostics);
}
