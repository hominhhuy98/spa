import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function GET() {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const snapshot = await adminDb.collection('treatment_services')
    .orderBy('sort_order', 'asc')
    .get();

  const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { name, slug } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: 'Thiếu tên hoặc slug' }, { status: 400 });
  }

  const ref = await adminDb.collection('treatment_services').add({
    name,
    slug,
    icon: body.icon || '💆',
    category: body.category || 'cham-soc-da',
    tong_thoi_gian: body.tong_thoi_gian || '',
    mo_ta: body.mo_ta || '',
    quy_trinh: body.quy_trinh || [],
    luu_y: body.luu_y || '',
    is_active: body.is_active !== false,
    sort_order: body.sort_order || 99,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return NextResponse.json({ id: ref.id }, { status: 201 });
}
