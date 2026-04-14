import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function POST(req: Request) {
  try {
    // Xác thực user — chỉ staff/admin mới được dùng
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = user.role as string | undefined;
    if (!['admin', 'bac_si', 'nhan_vien'].includes(role ?? '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, phone, service, time, notes } = body;

    if (!name?.trim() || !phone?.trim() || !service?.trim()) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc: tên, SĐT, dịch vụ' }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const now   = time || new Date().toTimeString().slice(0, 5); // HH:MM

    // Ghi chú walk-in + tên nhân viên tiếp nhận
    const profileSnap = await adminDb.collection('profiles').doc(user.uid).get();
    const staffName = profileSnap.exists
      ? profileSnap.data()?.full_name || user.email || user.uid
      : user.email || user.uid;

    const walkinNote = `[WALKIN] Khách đến trực tiếp. Nhân viên tiếp nhận: ${staffName}.${notes ? ' ' + notes : ''}`;

    // Tạo lịch hẹn trong Firestore
    const apptRef = await adminDb.collection('appointments').add({
      name:       name.trim(),
      phone:      phone.trim(),
      service:    service.trim(),
      date:       today,
      time:       now,
      status:     'confirmed',
      notes:      walkinNote,
      appointment_type: 'walk_in',
      updated_by: user.uid,
      assigned_staff: [],
      created_at: new Date(),
    });

    // ── Tự động tạo hồ sơ khách hàng (upsert by phone) ────────────────────
    const trimmedPhone = phone.trim();
    const customerQuery = await adminDb
      .collection('customers')
      .where('phone', '==', trimmedPhone)
      .limit(1)
      .get();

    if (customerQuery.empty) {
      await adminDb.collection('customers').add({
        phone: trimmedPhone,
        full_name: name.trim(),
        created_at: new Date(),
      });
    }

    return NextResponse.json({ id: apptRef.id }, { status: 201 });
  } catch (err) {
    console.error('[walk-in] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
