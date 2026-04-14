import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/firebase-session';
import { SignOutButton } from '@/components/SignOutButton';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  if (!user) redirect('/portal/login');

  const displayName = user.name || '';
  const phone = user.phone || '';
  const email = user.email || '';
  const identity = phone || email;

  // Tạo initials từ tên
  const initials = displayName
    ? displayName.split(' ').slice(-2).map((w: string) => w[0]).join('').toUpperCase()
    : identity[0]?.toUpperCase() || 'K';

  // Mã khách hàng từ 4 số cuối SĐT hoặc 4 ký tự đầu UUID
  const maKhach = phone
    ? 'mh-' + phone.replace(/\D/g, '').slice(-4)
    : 'mh-' + user.uid.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header style={{ backgroundColor: '#2C5F5D' }} className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">BV</span>
          </div>
          <p className="font-bold text-white text-base">Lịch Sử Điều Trị</p>
        </div>
        <SignOutButton redirectTo="/portal/login"
          className="text-xs text-white/80 hover:text-white border border-white/30 px-3 py-1.5 rounded-full transition">
          Đăng xuất
        </SignOutButton>
      </header>

      {/* Customer Info Card */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div style={{ backgroundColor: '#2C5F5D' }} className="h-1.5 w-full" />
        <div className="p-5 flex items-center gap-4">
          <div style={{ backgroundColor: '#2C5F5D' }}
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xl font-black">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-black text-gray-900 text-base">
                {displayName || identity}
              </p>
              <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">
                ⭐ Khách hàng
              </span>
            </div>
            {displayName && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">{identity}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">Mã KH: <span className="font-semibold text-gray-600">{maKhach}</span></p>
            {!phone && (
              <p className="text-xs text-amber-600 font-semibold mt-1">
                ⚠ Chưa liên kết SĐT — liên kết bên dưới để xem lịch hẹn
              </p>
            )}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
