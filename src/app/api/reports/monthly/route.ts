import { NextRequest } from 'next/server';
import { handleReportRequest } from '../handler';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  return handleReportRequest(req, 'monthly');
}

export async function POST(req: NextRequest) {
  return handleReportRequest(req, 'monthly');
}
