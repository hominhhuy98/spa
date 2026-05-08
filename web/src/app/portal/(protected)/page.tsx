import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PortalTabs from '@/components/PortalTabs';
import LinkPhoneBanner from '@/components/LinkPhoneBanner';

export default async function CustomerPortalPage() {
  const user = await getServerUser();
  if (!user) redirect('/portal/login');

  const phone = user.phone || '';
  const email = user.email || '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let list: any[] = [];

  if (phone) {
    try {
    const snapshot = await adminDb.collection('appointments')
      .where('phone', '==', phone)
      .orderBy('date', 'desc')
      .get();
    list = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name || '',
        phone: d.phone || '',
        service: d.service || '',
        date: d.date || '',
        time: d.time || '',
        status: d.status || 'pending',
        notes: d.notes || '',
        appointment_type: d.appointment_type || '',
        updated_by: d.updated_by || null,
        assigned_staff: d.assigned_staff || [],
        created_at: d.created_at?.toDate ? d.created_at.toDate().toISOString() : '',
      };
    });

    // Resolve doctor names from updated_by
    const updatedByIds = Array.from(new Set(list.map(a => a.updated_by).filter(Boolean))) as string[];
    if (updatedByIds.length > 0) {
      const profileDocs = await Promise.all(
        updatedByIds.map(uid => adminDb.collection('profiles').doc(uid).get())
      );
      const profileMap: Record<string, string> = {};
      profileDocs.forEach(doc => {
        if (doc.exists) profileMap[doc.id] = doc.data()?.full_name || '';
      });
      list = list.map(a => ({
        ...a,
        bac_si: a.updated_by ? { full_name: profileMap[String(a.updated_by)] || null } : null,
      }));
    }
    } catch (err) {
      console.error('Portal query error (index may not be ready):', err);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-16">

      {/* Banner liên kết SĐT (cho user Zalo/Google chưa có phone) */}
      {!phone && <LinkPhoneBanner />}

      {/* CTA */}
      <Link href="/dat-lich"
        style={{ backgroundColor: '#2C5F5D' }}
        className="mt-4 flex items-center justify-center gap-2 w-full text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition text-sm shadow-sm">
        <span className="text-lg leading-none">+</span> Đặt Lịch Mới
      </Link>

      {/* Tabs: Đang chờ | Đã hoàn thành */}
      {list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
          <div className="text-4xl mb-3">🗓️</div>
          <p className="text-gray-500 font-medium mb-1">Chưa có lịch hẹn nào</p>
          <p className="text-xs text-gray-400 mb-5">Đặt lịch để bắt đầu hành trình chăm sóc sắc đẹp</p>
          <Link href="/dat-lich"
            style={{ backgroundColor: '#2C5F5D' }}
            className="text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition inline-block">
            Đặt lịch ngay
          </Link>
        </div>
      ) : (
        <PortalTabs appointments={list} />
      )}
    </div>
  );
}
