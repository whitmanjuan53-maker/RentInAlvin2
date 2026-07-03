import { NextRequest, NextResponse } from 'next/server';
import { runReport, renderReport, type ReportType } from '@/lib/report';
import { isAdminRequest } from '@/lib/admin-auth';

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get('authorization');
    if (auth === `Bearer ${cronSecret}`) return true;
    if (req.nextUrl.searchParams.get('secret') === cronSecret) return true;
  }
  // The logged-in admin can trigger or preview reports from /dev/analytics
  return isAdminRequest(req);
}

export async function handleReportRequest(req: NextRequest, type: ReportType) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ?preview=1 renders the email HTML without sending or saving anything
  if (req.nextUrl.searchParams.get('preview')) {
    const { html, subject } = await renderReport(type);
    return new NextResponse(
      `<!doctype html><html><head><meta charset="utf-8"><title>Preview: ${subject}</title></head>` +
      `<body style="margin:0;background:#eee;padding:20px 0;">` +
      `<p style="text-align:center;font-family:sans-serif;font-size:13px;color:#555;">` +
      `PREVIEW ONLY — nothing has been sent.<br>Subject: <strong>${subject}</strong></p>${html}</body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const result = await runReport(type);
  if (!result.ok) {
    return NextResponse.json({ error: result.error || 'Report failed' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    type,
    reportId: result.reportId,
    emailSent: result.emailSent,
    stats: result.stats,
  });
}
