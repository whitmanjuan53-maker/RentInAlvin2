import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';
import { buildLeadDocument } from '@/lib/lead-document';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  try {
    // Intentionally all-time, without the dashboard's recent-lead limit.
    const leads = await prisma.lead.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      select: { id: true, createdAt: true, leadType: true, name: true, email: true, phone: true,
        property: true, status: true, message: true, sourcePage: true, metadata: true },
    });
    const generatedAt = new Date();
    const document = await buildLeadDocument(leads, generatedAt);
    return new NextResponse(new Uint8Array(document), { headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="RentInAlvin-all-leads-${generatedAt.toISOString().slice(0, 10)}.docx"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    } });
  } catch (error) {
    console.error('[LEAD EXPORT] Failed to generate document', error);
    return NextResponse.json({ error: 'Could not create the lead document. Please retry.' }, { status: 500 });
  }
}
