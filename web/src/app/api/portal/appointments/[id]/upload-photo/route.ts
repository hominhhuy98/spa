import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getServerUser();
  const role = user?.role;
  if (!user || !['admin', 'bac_si', 'nhan_vien'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const type = form.get('type') as 'before' | 'after' | null;

  if (!file || !type) {
    return NextResponse.json({ error: 'Thiếu file hoặc type' }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Chỉ chấp nhận file ảnh' }, { status: 400 });
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File tối đa 5MB' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const filename = `appt-${id}/${type}-${Date.now()}.${ext}`;

  try {
    const bucket = adminStorage.bucket();
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileRef = bucket.file(`appointment-photos/${filename}`);

    await fileRef.save(buffer, { contentType: file.type });
    await fileRef.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/appointment-photos/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
