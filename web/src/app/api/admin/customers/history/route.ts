import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';

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

  // Rate limit chống cào dữ liệu: 60 lượt tra cứu / phút / nhân viên
  const limit = await rateLimit(`history:${user.uid}`, 60, 60 * 1000);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSec, 'Quá nhiều lượt tra cứu. Vui lòng chậm lại.');

  try {
    if (phone) {
      // Tìm chính xác theo SĐT — giới hạn 100 kết quả
      const snapshot = await adminDb.collection('appointments')
        .where('phone', '==', phone)
        .orderBy('date', 'desc')
        .limit(100)
        .get();

      const appointments = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, name: data.name, phone: data.phone, service: data.service, date: data.date, time: data.time || '', status: data.status };
      });
      return NextResponse.json({ appointments });
    }

    // Tìm theo tên — Firestore không hỗ trợ LIKE.
    // Giới hạn quét tối đa 500 record gần nhất, kết quả tối đa 100 (chống OOM + scraping).
    const q = name!.trim().toLowerCase();
    if (q.length < 2) {
      return NextResponse.json({ error: 'Vui lòng nhập ít nhất 2 ký tự' }, { status: 400 });
    }

    const allSnapshot = await adminDb.collection('appointments')
      .orderBy('date', 'desc')
      .limit(500)
      .get();

    const appointments = allSnapshot.docs
      .filter(doc => (doc.data().name || '').toLowerCase().includes(q))
      .slice(0, 100)
      .map(doc => {
        const data = doc.data();
        return { id: doc.id, name: data.name, phone: data.phone, service: data.service, date: data.date, time: data.time || '', status: data.status };
      });

    return NextResponse.json({ appointments });
  } catch (err: unknown) {
    console.error('history error:', err);
    return NextResponse.json({ error: 'Lỗi truy vấn dữ liệu' }, { status: 500 });
  }
}
