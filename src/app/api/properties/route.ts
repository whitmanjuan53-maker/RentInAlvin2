import { NextResponse } from 'next/server';
import { getProperties } from '@/lib/properties';

export const dynamic = 'force-dynamic';

// Public read of property content for the site. Always returns something usable:
// getProperties() falls back to the built-in list if the database is empty or down.
export async function GET() {
  try {
    const properties = await getProperties();
    return NextResponse.json({ properties });
  } catch (err) {
    console.error('[API /properties] Error:', err);
    return NextResponse.json({ properties: [] });
  }
}
