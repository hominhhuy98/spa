import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const doc = await adminDb.collection('treatment_services').doc(id).get();
  if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ service: { id: doc.id, ...doc.data() } });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = { updated_at: new Date() };

  const fields = ['name', 'slug', 'icon', 'category', 'tong_thoi_gian', 'mo_ta', 'quy_trinh', 'luu_y', 'is_active', 'sort_order', 'grade', 'icd', 'phac_do', 'cong_nghe', 'nguon'];
  for (const f of fields) {
    if (body[f] !== undefined) updates[f] = body[f];
  }

  await adminDb.collection('treatment_services').doc(id).update(updates);
  return NextResponse.json({ message: 'Đã cập nhật' });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await adminDb.collection('treatment_services').doc(id).delete();
  return NextResponse.json({ message: 'Đã xóa' });
}
