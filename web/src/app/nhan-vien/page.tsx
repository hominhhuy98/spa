import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import WalkInModal from '@/components/WalkInModal';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-800' },
  done:      { label: 'Hoàn thành',   color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã huỷ',       color: 'bg-red-100 text-red-800' },
};

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export default async function NhanVienDashboard() {
  const user = await getServerUser();
  if (!user) redirect('/login');

  const today = new Date().toISOString().slice(0, 10);

  const [mySnap, todaySnap] = await Promise.all([
    adminDb.collection('appointments')
      .where('updated_by', '==', user.uid)
      .orderBy('date', 'asc')
      .get(),
    adminDb.collection('appointments')
      .where('date', '==', today)
      .where('status', 'in', ['pending', 'confirmed'])
      .orderBy('time', 'asc')
      .get(),
  ]);

  const myList    = mySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Record<string, string>));
  const todayList = todaySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Record<string, string>));

  const stats = {
    today:     todayList.length,
    pending:   myList.filter(a => a.status === 'pending').length,
    confirmed: myList.filter(a => a.status === 'confirmed').length,
    done:      myList.filter(a => a.status === 'done').length,
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header + Walk-in */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard Nhân viên</h1>
          <p className="text-sm text-gray-500 mt-0.5">Hôm nay {today.split('-').reverse().join('/')} — {todayList.length} lịch đang chờ</p>
        </div>
        <WalkInModal backHref="/nhan-vien" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Lịch hôm nay', value: stats.today,     color: 'text-blue-600',   bg: 'bg-blue-50'   },
          { label: 'Chờ xác nhận', value: stats.pending,   color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Đã xác nhận',  value: stats.confirmed, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Hoàn thành',   value: stats.done,      color: 'text-green-600',  bg: 'bg-green-50'  },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lịch hôm nay */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-900">📅 Lịch hẹn hôm nay — {formatDate(today)}</h2>
          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">{todayList.length} lịch</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Giờ</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Khách hàng</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Dịch vụ</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Trạng thái</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {todayList.map((a: Record<string, string>) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {a.time ? a.time.slice(0,5) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{a.service}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABELS[a.status]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[a.status]?.label ?? a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/nhan-vien/${a.id}`} className="text-blue-600 text-xs font-semibold hover:underline">
                      Xử lý →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!todayList.length && (
            <p className="text-center text-gray-400 text-sm py-10">Không có lịch hẹn nào hôm nay</p>
          )}
        </div>
      </div>

      {/* Tất cả lịch được phân công */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-900">📋 Lịch hẹn phân công cho tôi</h2>
          <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full">{myList.length} lịch</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Ngày</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Khách hàng</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Dịch vụ</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Trạng thái</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myList.map((a: Record<string, string>) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{formatDate(a.date)}</p>
                    {a.time && <p className="text-xs text-gray-400">{a.time.slice(0,5)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{a.service}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABELS[a.status]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[a.status]?.label ?? a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/nhan-vien/${a.id}`} className="text-blue-600 text-xs font-semibold hover:underline">
                      Xem →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!myList.length && (
            <p className="text-center text-gray-400 text-sm py-10">Chưa có lịch hẹn nào được phân công</p>
          )}
        </div>
      </div>

    </div>
  );
}
