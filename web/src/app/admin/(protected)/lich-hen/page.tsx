import { adminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import AppointmentActions from './AppointmentActions';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-800' },
  done:      { label: 'Hoàn thành',   color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã huỷ',       color: 'bg-red-100 text-red-800' },
  expired:   { label: 'Quá hạn',      color: 'bg-gray-100 text-gray-500' },
};

export default async function LichHenPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || 'all';
  const typeFilter   = params.type   || 'all';

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
  } catch {
    // Index chưa sẵn sàng — bỏ qua auto-cancel
  }

  let query: FirebaseFirestore.Query = adminDb.collection('appointments').orderBy('date', 'desc');

  if (statusFilter !== 'all') query = query.where('status', '==', statusFilter);
  if (typeFilter   !== 'all') query = query.where('appointment_type', '==', typeFilter);

  const snapshot = await query.get();
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
      assigned_staff: data.assigned_staff || [],
    };
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Lịch Hẹn</h1>
        {expiredCount > 0 && (
          <span className="text-xs text-gray-400">Đã tự động hủy {expiredCount} lịch quá hạn</span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['all', 'pending', 'confirmed', 'done', 'cancelled'].map(s => (
          <Link key={s} href={`/admin/lich-hen?status=${s}&type=${typeFilter}`}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              statusFilter === s
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {s === 'all' ? 'Tất cả' : STATUS_LABELS[s]?.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-600">Khách hàng</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Dịch vụ</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Ngày / Giờ</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Phụ trách</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appointments.map((a) => {
              const staffNames = a.assigned_staff?.map((x: { full_name: string }) => x.full_name).filter(Boolean).join(', ') || '—';
              const isPast = a.date < today;
              return (
                <tr key={a.id} className={`hover:bg-gray-50 transition ${isPast && a.status === 'pending' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{a.service}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <p className={isPast && a.status === 'pending' ? 'text-red-500' : ''}>{a.date}</p>
                    {a.time ? <p className="text-xs text-gray-400">{a.time}</p> : null}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{staffNames}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABELS[a.status]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[a.status]?.label ?? a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {a.status === 'pending' && (
                        <AppointmentActions id={a.id} />
                      )}
                      <Link href={`/admin/lich-hen/${a.id}`}
                        className="text-primary text-xs font-semibold hover:underline">
                        Chi tiết
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!appointments.length && (
          <p className="text-center text-gray-400 text-sm py-10">Không có lịch hẹn nào</p>
        )}
      </div>
    </div>
  );
}
