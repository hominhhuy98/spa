import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
import Link from 'next/link';
import { SignOutButton } from '@/components/SignOutButton';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/lich-hen', label: 'Lịch Hẹn', icon: '📅' },
  { href: '/admin/nhan-su', label: 'Nhân Sự', icon: '👥' },
  { href: '/admin/lieu-trinh', label: 'Liệu Trình', icon: '💊' },
  { href: '/admin/khach-hang', label: 'Khách Hàng', icon: '🔍' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const profileDoc = await adminDb.collection('profiles').doc(user.uid).get();
  const profile = profileDoc.exists ? profileDoc.data() : null;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0D6FA3] text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-blue-600">
          <p className="font-black text-base">YDSG Admin</p>
          <p className="text-xs text-blue-200 mt-0.5 truncate">{profile?.full_name || user.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-blue-600">
          <SignOutButton
            redirectTo="/login"
            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium text-blue-100">
            🚪 Đăng Xuất
          </SignOutButton>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
