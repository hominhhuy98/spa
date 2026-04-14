import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import WalkInModal from '@/components/WalkInModal';

const STATUS: Record<string, { label: string; dot: string; badge: string }> = {
  pending:   { label: 'Chờ xác nhận', dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700'  },
  confirmed: { label: 'Đã xác nhận',  dot: 'bg-blue-500',   badge: 'bg-blue-50 text-blue-700'      },
  done:      { label: 'Hoàn thành',   dot: 'bg-green-500',  badge: 'bg-green-50 text-green-700'    },
  cancelled: { label: 'Đã huỷ',       dot: 'bg-red-400',    badge: 'bg-red-50 text-red-500'        },
};

function fmt(d: string) {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export default async function BacSiDashboard() {
  const user = await getServerUser();
  if (!user) redirect('/login');

  const today = new Date().toISOString().slice(0, 10);

  const profileDoc = await adminDb.collection('profiles').doc(user.uid).get();
  const profile = profileDoc.exists ? profileDoc.data() : null;
  const displayName = profile?.full_name ?? user.email ?? 'Bác sĩ';

  // Lịch hôm nay + lịch do BS này phụ trách
  const [todaySnap, mySnap] = await Promise.all([
    adminDb.collection('appointments')
      .where('date', '==', today)
      .where('status', 'in', ['pending', 'confirmed'])
      .orderBy('time', 'asc')
      .get(),
    adminDb.collection('appointments')
      .where('updated_by', '==', user.uid)
      .orderBy('date', 'desc')
      .get(),
  ]);

  const todayList = todaySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Record<string, string>));
  const myList    = mySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Record<string, string>));

  // Nhóm lịch theo bệnh nhân (phone) — dùng để hiện lịch sử
  const patientMap = new Map<string, typeof myList>();
  myList.forEach(a => {
    if (!patientMap.has(a.phone)) patientMap.set(a.phone, []);
    patientMap.get(a.phone)!.push(a);
  });
  const patients = Array.from(patientMap.entries());

  const stats = {
    today:     todayList.length,
    my:        myList.length,
    done:      myList.filter(a => a.status === 'done').length,
    patients:  patients.length,
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Xin chào, BS. {displayName} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Hôm nay {fmt(today)} — {todayList.length} bệnh nhân đang chờ</p>
        </div>
        <WalkInModal backHref="/bac-si" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Lịch hôm nay',    value: stats.today,    color: 'text-[#2C5F5D]', bg: 'bg-teal-50'   },
          { label: 'Bệnh nhân của tôi', value: stats.patients, color: 'text-blue-600',  bg: 'bg-blue-50'   },
          { label: 'Đã điều trị',      value: stats.done,     color: 'text-green-600', bg: 'bg-green-50'  },
          { label: 'Tổng lịch hẹn',    value: stats.my,       color: 'text-purple-600',bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lịch hôm nay */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-900 flex items-center gap-2">
            📅 Lịch khám hôm nay
            <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2.5 py-1 rounded-full">{todayList.length} ca</span>
          </h2>
        </div>
        {todayList.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {todayList.map((a: Record<string, string>) => {
              const st = STATUS[a.status] ?? STATUS.pending;
              return (
                <div key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {/* Giờ */}
                  <div className="w-14 text-center shrink-0">
                    <p className="font-black text-gray-900 text-base">{a.time?.slice(0,5) ?? '—'}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                  {/* Bệnh nhân */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-500 truncate">{a.service}</p>
                  </div>
                  <p className="text-xs text-gray-400">{a.phone}</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.badge}`}>{st.label}</span>
                  <Link href={`/bac-si/${a.id}`}
                    className="text-xs font-bold text-[#2C5F5D] hover:underline shrink-0">
                    Xem hồ sơ →
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-10">Không có lịch khám nào hôm nay</p>
        )}
      </div>

      {/* Danh sách bệnh nhân + lịch sử */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900 flex items-center gap-2">
            👥 Bệnh nhân của tôi — Lịch sử điều trị
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">{patients.length} người</span>
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {patients.map(([phone, appts]) => {
            const latest = appts[0];
            const done   = appts.filter(a => a.status === 'done').length;
            const initials = latest.name.split(' ').slice(-2).map((w: string) => w[0]).join('').toUpperCase();
            return (
              <div key={phone} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#2C5F5D] flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-black">{initials}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-bold text-gray-900">{latest.name}</p>
                      <p className="text-xs text-gray-400">{phone}</p>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        {appts.length} lần khám · {done} hoàn thành
                      </span>
                    </div>
                    {/* Timeline mini */}
                    <div className="mt-2 space-y-1">
                      {appts.slice(0, 3).map((a: Record<string, string>) => {
                        const st = STATUS[a.status] ?? STATUS.pending;
                        return (
                          <div key={a.id} className="flex items-center gap-2 text-xs text-gray-500">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
                            <span className="text-gray-400 w-20 shrink-0">{fmt(a.date)}</span>
                            <span className="truncate text-gray-700">{a.service}</span>
                            <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold ${st.badge}`}>{st.label}</span>
                          </div>
                        );
                      })}
                      {appts.length > 3 && (
                        <p className="text-xs text-gray-400 pl-3.5">+{appts.length - 3} lần khám trước</p>
                      )}
                    </div>
                  </div>
                  {/* Action */}
                  <Link href={`/bac-si/${latest.id}`}
                    className="shrink-0 text-xs font-bold text-[#2C5F5D] border border-[#2C5F5D]/30 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors">
                    Hồ sơ →
                  </Link>
                </div>
              </div>
            );
          })}
          {patients.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">Chưa có bệnh nhân nào</p>
          )}
        </div>
      </div>

    </div>
  );
}
