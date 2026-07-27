import { NextRequest, NextResponse } from 'next/server';
import { prisma, isDbReady } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin-auth';

function escapeCsv(v: unknown): string {
  const s = v == null ? '' : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isDbReady() || !prisma) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }

  const days = Math.min(parseInt(req.nextUrl.searchParams.get('days') || '7', 10) || 7, 90);
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const rows = await prisma.emailLog.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: 'desc' },
  });

  const leadIds = [...new Set(rows.map((r) => r.leadId).filter(Boolean) as string[])];
  const leads = leadIds.length
    ? await prisma.lead.findMany({
        where: { id: { in: leadIds } },
        select: { id: true, name: true, email: true, phone: true, property: true, leadType: true },
      })
    : [];
  const leadById = new Map(leads.map((l) => [l.id, l]));

  const headers = [
    'createdAt',
    'emailType',
    'toEmail',
    'subject',
    'status',
    'resendEmailId',
    'leadName',
    'leadEmail',
    'leadPhone',
    'leadProperty',
    'leadType',
    'errorMessage',
  ];

  const csv = [
    headers.join(','),
    ...rows.map((r) => {
      const lead = r.leadId ? leadById.get(r.leadId) : undefined;
      return [
        r.createdAt.toISOString(),
        r.emailType,
        r.toEmail,
        r.subject,
        r.status,
        r.resendEmailId ?? '',
        lead?.name ?? '',
        lead?.email ?? '',
        lead?.phone ?? '',
        lead?.property ?? '',
        lead?.leadType ?? '',
        r.errorMessage ?? '',
      ]
        .map(escapeCsv)
        .join(',');
    }),
  ].join('\r\n');

  const filename = `email-report-${days}d-${new Date().toISOString().split('T')[0]}.csv`;
  return new NextResponse('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
