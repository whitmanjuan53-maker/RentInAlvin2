import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isManagerRequest } from '@/lib/manager-auth';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export async function POST(req: NextRequest) {
  if (!isManagerRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Photo storage is not set up yet. Create a Blob store in Vercel (Storage → Create → Blob).' },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get('file');
    const slug = (form.get('slug') as string | null)?.replace(/[^a-z0-9-]/gi, '') || 'property';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WebP, or AVIF images are allowed.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image is too large (max 10 MB).' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const key = `properties/${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(key, file, { access: 'public', contentType: file.type });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    console.error('[API /manager/upload] Upload failed:', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
