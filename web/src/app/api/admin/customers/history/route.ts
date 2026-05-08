import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  const name = searchParams.get('name');

  if (!phone && !name) {
    return NextResponse.json({ error: 'Thiếu số điện thoại hoặc tên' }, { status: 400 });
  }

  const user = await getServerUser();
  const role = user?.role;
  if (!user || !['admin', 'bac_si', 'nhan_vien'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    let snapshot;

    if (phone) {
      // Tìm chính xác theo SĐT
      snapshot = await adminDb.collection('appointments')
        .where('phone', '==', phone)
        .orderBy('date', 'desc')
        .get();
    } else {
      // Tìm theo tên — Firestore không hỗ trợ LIKE, nên lấy tất cả rồi filter
      const allSnapshot = await adminDb.collection('appointments')
        .orderBy('date', 'desc')
        .get();

      const q = name!.toLowerCase();
      const filtered = allSnapshot.docs.filter(doc => {
        const data = doc.data();
        return (data.name || '').toLowerCase().includes(q);
      });

      const appointments = filtered.map(doc => {
        const data = doc.data();
        return { id: doc.id, name: data.name, phone: data.phone, service: data.service, date: data.date, time: data.time || '', status: data.status };
      });

      return NextResponse.json({ appointments });
    }

    const appointments = snapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, name: data.name, phone: data.phone, service: data.service, date: data.date, time: data.time || '', status: data.status };
    });

    return NextResponse.json({ appointments });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
