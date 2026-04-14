import { SignOutButton } from '@/components/SignOutButton';
import Link from 'next/link';

interface NavItem { href: string; icon: string; label: string }

interface Props {
  role: 'bac_si' | 'nhan_vien' | 'admin';
  fullName: string;
  children: React.ReactNode;
}

const NAV: Record<string, NavItem[]> = {
  bac_si: [
    { href: '/bac-si',         icon: '📅', label: 'Lịch hôm nay' },
    { href: '/bac-si/benh-nhan', icon: '👥', label: 'Danh sách bệnh nhân' },
  ],
  nhan_vien: [
    { href: '/nhan-vien',      icon: '📅', label: 'Lịch hôm nay' },
  ],
  admin: [
    { href: '/admin',          icon: '📊', label: 'Tổng quan' },
    { href: '/admin/lich-hen', icon: '📅', label: 'Lịch hẹn' },
    { href: '/admin/khach-hang', icon: '👥', label: 'Khách hàng' },
    { href: '/admin/nhan-su',  icon: '🏥', label: 'Nhân sự' },
  ],
};

const ROLE_LABEL: Record<string, { title: string; color: string }> = {
  bac_si:    { title: 'Cổng Bác Sĩ',    color: '#1a6b5c' },
  nhan_vien: { title: 'Cổng Nhân Viên', color: '#1a4a7a' },
  admin:     { title: 'Quản Trị',        color: '#1e293b' },
};

export default function StaffLayout({ role, fullName, children }: Props) {
  const nav   = NAV[role] ?? [];
  const info  = ROLE_LABEL[role] ?? ROLE_LABEL.admin;
  const initials = fullName.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col shrink-0 border-r border-gray-200 bg-white">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: info.color }}>
              <span className="text-white text-xs font-black">BV</span>
            </div>
            <div>
              <p className="font-black text-gray-900 text-xs leading-tight">CTCP BV Y Dược SG</p>
              <p className="text-[10px] font-semibold" style={{ color: info.color }}>{info.title}</p>
            </div>
          </div>
          {/* Profile */}
          <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-black"
              style={{ backgroundColor: info.color }}>{initials}</div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{fullName}</p>
              <p className="text-[10px] text-gray-400 capitalize">{role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600
                hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          <SignOutButton redirectTo="/login"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold
              text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <span>🚪</span><span>Đăng xuất</span>
          </SignOutButton>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
