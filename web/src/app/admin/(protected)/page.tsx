import { adminDb } from '@/lib/firebase-admin';
import WalkInModal from '@/components/WalkInModal';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-800' },
  done:      { label: 'Hoàn thành',   color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã huỷ',       color: 'bg-red-100 text-red-800' },
};

export default async function AdminDashboard() {
  const snapshot = await adminDb.collection('appointments').orderBy('created_at', 'desc').get();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appointments = snapshot.docs.map(doc => {
    const data = doc.data();
    // Convert Firestore Timestamp to ISO string
    const created_at = data.created_at?.toDate ? data.created_at.toDate().toISOString() : (data.created_at || '');
    return { id: doc.id, ...data, created_at } as Record<string, string>;
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = appointments.filter(a => typeof a.created_at === 'string' && a.created_at.startsWith(today)).length;

  const counts = Object.fromEntries(
    Object.keys(STATUS_LABELS).map(s => [
      s,
      appointments.filter(a => a.status === s).length,
    ])
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <WalkInModal backHref="/admin" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Hôm nay</p>
          <p className="text-3xl font-black text-primary">{todayCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">lịch hẹn mới</p>
        </div>
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
              {STATUS_LABELS[status].label}
            </p>
            <p className="text-3xl font-black text-gray-900">{count}</p>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Lịch hẹn gần đây</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {appointments.slice(0, 10).map((a: Record<string, string>) => (
            <div key={a.id} className="px-6 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                <p className="text-xs text-gray-500">{a.phone} · {a.service}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{a.date}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABELS[a.status]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                  {STATUS_LABELS[a.status]?.label ?? a.status}
                </span>
              </div>
            </div>
          ))}
          {!appointments.length && (
            <p className="px-6 py-8 text-center text-gray-400 text-sm">Chưa có lịch hẹn nào</p>
          )}
        </div>
      </div>
    </div>
  );
}
