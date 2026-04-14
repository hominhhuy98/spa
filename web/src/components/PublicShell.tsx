'use client';

import { usePathname } from 'next/navigation';
import NavbarClient from '@/components/NavbarClient';

const STAFF_PREFIXES = ['/bac-si', '/nhan-vien', '/admin'];

interface Props {
  isLoggedIn: boolean;
  displayName: string;
  children: React.ReactNode;
}

export default function PublicShell({ isLoggedIn, displayName, children }: Props) {
  const pathname = usePathname();
  const isStaff  = STAFF_PREFIXES.some(p => pathname.startsWith(p));

  if (isStaff) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Topbar */}
      <div className="bg-primary-dark text-sky-100 text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center gap-4">
          <span>📍 405-407 Đỗ Xuân Hợp, Phước Long, TP.HCM</span>
          <span>
            ☎ <a href="tel:02862852727" className="text-white font-semibold hover:underline">028 6285 2727</a>
            &nbsp;–&nbsp;
            <a href="tel:02862852929" className="text-white font-semibold hover:underline">028 6285 2929</a>
            &nbsp;|&nbsp; T2–CN: 8:00–11:30 &nbsp;/&nbsp; 13:30–17:00
          </span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-sm w-full sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex justify-between h-16 items-center">
            <a href="/" className="flex items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="Logo CTCP BV Y Dược Sài Gòn"
                fetchPriority="high"
                style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              />
              <div className="border-l-2 border-primary pl-3 hidden md:block">
                <div className="font-black text-[11px] text-primary-dark uppercase leading-tight tracking-wide">CTCP BỆNH VIỆN Y DƯỢC SÀI GÒN</div>
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-0.5">Chuyên Khoa Da Liễu</div>
              </div>
            </a>
            <NavbarClient isLoggedIn={isLoggedIn} displayName={displayName} />
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="min-h-screen">{children}</main>

      {/* Floating CTA mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 px-4 pb-4 pt-2 bg-gradient-to-t from-white/95 to-transparent pointer-events-none">
        <a href="/dat-lich"
          className="pointer-events-auto block bg-secondary text-white text-center font-bold py-3.5 rounded-2xl shadow-lg text-sm hover:opacity-90 transition">
          📅 Đặt Lịch Khám Ngay
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-700">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src="/assets/logo.png" alt="Logo" style={{ height: '32px', width: 'auto' }} />
                <div>
                  <div className="font-black text-white text-sm uppercase">CTCP BV Y Dược Sài Gòn</div>
                  <div className="text-xs text-secondary uppercase tracking-wider">Chuyên Khoa Da Liễu</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Phòng khám Da liễu & Spa trực thuộc CTCP Bệnh Viện Y Dược Sài Gòn. Phác đồ điều trị theo hướng dẫn Bộ Y Tế Việt Nam.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Dịch Vụ</h4>
              <ul className="space-y-1.5 text-sm">
                {['Điều Trị Mụn Trứng Cá','Trị Nám & Tàn Nhang','Viêm Da Cơ Địa','Vảy Nến','Rụng Tóc','Thẩm Mỹ Spa'].map(s => (
                  <li key={s}><a href="/dich-vu-da-lieu" className="hover:text-white transition-colors">{s}</a></li>
                ))}
                <li><a href="/khuyen-mai" className="text-secondary font-semibold hover:text-white transition-colors">🎁 Ưu Đãi Khách Hàng Mới</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Liên Hệ</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-secondary shrink-0 mt-0.5">📍</span>
                  <span>405-407 Đỗ Xuân Hợp, Phước Long, TP.HCM</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary shrink-0">☎</span>
                  <span>
                    <a href="tel:02862852727" className="hover:text-white transition-colors font-medium">028 6285 2727</a>
                    {' – '}
                    <a href="tel:02862852929" className="hover:text-white transition-colors font-medium">028 6285 2929</a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary shrink-0 mt-0.5">🕐</span>
                  <span>T2 – CN: 8:00–11:30 &amp; 13:30–17:00</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <p>&copy; 2026 CTCP Bệnh Viện Y Dược Sài Gòn.</p>
            <p>Thông tin mang tính tham khảo, không thay thế tư vấn y khoa trực tiếp.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
