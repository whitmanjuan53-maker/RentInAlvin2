import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma, isDbReady } from '@/lib/db';
import { isManagerRequest } from '@/lib/manager-auth';

export const dynamic = 'force-dynamic';

const ALLOWED_AVAILABILITY = ['Available now', 'Coming soon', 'Waitlist', 'Not listed'];

function str(v: unknown, max = 2000): string | undefined {
  if (typeof v !== 'string') return undefined;
  return v.slice(0, max);
}

function strArray(v: unknown, maxItems = 60, maxLen = 512): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  return v.filter((x) => typeof x === 'string').slice(0, maxItems).map((x) => x.slice(0, maxLen));
}

// Push manager edits to the live site immediately.
function revalidatePublic() {
  try {
    revalidatePath('/');
    revalidatePath('/es');
    revalidatePath('/communities');
  } catch {
    // Revalidation is best-effort; the next request will pick up changes anyway.
  }
}

export async function PUT(req: NextRequest) {
  if (!isManagerRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isDbReady() || !prisma) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const id = str(body.id, 64);
  if (!id) {
    return NextResponse.json({ error: 'Missing property id' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  const name = str(body.name, 200); if (name !== undefined) data.name = name;
  const addr = str(body.addr, 200); if (addr !== undefined) data.addr = addr;
  const tag = str(body.tag, 120); if (tag !== undefined) data.tag = tag;
  const units = str(body.units, 200); if (units !== undefined) data.units = units;
  const price = str(body.price, 120); if (price !== undefined) data.price = price;
  const description = str(body.description, 4000); if (description !== undefined) data.description = description;
  const amenities = strArray(body.amenities); if (amenities !== undefined) data.amenities = amenities;
  const gallery = strArray(body.gallery); if (gallery !== undefined) data.gallery = gallery;
  if (typeof body.featured === 'boolean') data.featured = body.featured;
  if (typeof body.published === 'boolean') data.published = body.published;
  if (typeof body.sortOrder === 'number') data.sortOrder = Math.trunc(body.sortOrder);
  const availability = str(body.availability, 40);
  if (availability !== undefined) {
    if (!ALLOWED_AVAILABILITY.includes(availability)) {
      return NextResponse.json({ error: 'Invalid availability value' }, { status: 400 });
    }
    data.availability = availability;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  try {
    const updated = await prisma.property.update({ where: { id }, data });
    revalidatePublic();
    return NextResponse.json({ ok: true, property: updated });
  } catch (err) {
    console.error('[API /manager/property] Update failed:', err);
    return NextResponse.json({ error: 'Update failed. That property may no longer exist.' }, { status: 500 });
  }
}
