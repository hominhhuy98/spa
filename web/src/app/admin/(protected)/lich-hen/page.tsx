import { adminDb } from '@/lib/firebase-admin';
import AppointmentListClient from './AppointmentListClient';

export default async function LichHenPage() {
  const today = new Date().toISOString().slice(0, 10);

  // Auto hủy lịch pending quá ngày (fail-safe)
  let expiredCount = 0;
  try {
    const expiredSnapshot = await adminDb.collection('appointments')
      .where('status', '==', 'pending')
      .where('date', '<', today)
      .get();

    if (!expiredSnapshot.empty) {
      const batch = adminDb.batch();
      expiredSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { status: 'cancelled', notes: (doc.data().notes || '') + '\n[AUTO] Tự động hủy do quá ngày đặt.' });
      });
      await batch.commit();
      expiredCount = expiredSnapshot.size;
    }
  } catch { /* Index chưa sẵn sàng */ }

  // Lấy tất cả appointments
  const snapshot = await adminDb.collection('appointments').orderBy('date', 'desc').get();
  const appointments = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '',
      phone: data.phone || '',
      service: data.service || '',
      date: data.date || '',
      time: data.time || '',
      status: data.status || 'pending',
      assigned_staff: (data.assigned_staff || []).map((s: { full_name?: string }) => s.full_name || '').filter(Boolean),
    };
  });

  return <AppointmentListClient appointments={appointments} expiredCount={expiredCount} today={today} />;
}
