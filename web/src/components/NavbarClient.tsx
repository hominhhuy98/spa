'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/',              label: 'Trang Chủ' },
  { href: '/goi-dich-vu',  label: 'Liệu Trình' },
  { href: '/bang-gia',     label: 'Bảng Giá' },
  { href: '/may-moc',      label: 'Thiết Bị' },
  { href: '/tin-tuc',      label: 'Kiến Thức' },
];

interface Props {
  isLoggedIn: boolean;
  displayName?: string;
}

export default function NavbarClient({ isLoggedIn, displayName }: Props) {
  const [open, setOpen] = useState(false);

  const initials = displayName
    ? displayName.split(' ').filter(Boolean).slice(-2).map(w => w[0]).join('').toUpperCase()
    : 'KH';

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(link => (
          <a key={link.href} href={link.href}
            className="text-gray-600 hover:text-gray-900 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors hover:bg-gray-50">
            {link.label}
          </a>
        ))}

        {/* ── Lịch hẹn button ── */}
        <div className="ml-2 relative">
          <Link href={isLoggedIn ? '/portal' : '/login'}
            className="flex items-center gap-2.5 px-4 py-2 rounded-2xl border-[1.5px] transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#2563EB',
              boxShadow: '0 4px 16px #2563EB22',
            }}>
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-black"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1E3A5F)' }}>
              {isLoggedIn ? initials : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </div>
            {/* Text */}
            <div className="flex flex-col leading-tight">
              <span className="text-[12px] font-black" style={{ color: '#1E3A5F' }}>
                {isLoggedIn ? 'Lịch hẹn của tôi' : 'Lịch hẹn'}
              </span>
              <span className="text-[10px] font-semibold" style={{ color: '#2563EB' }}>
                {isLoggedIn ? 'Xem lịch sử' : 'Đăng nhập để xem'}
              </span>
            </div>
            {/* Chevron */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7A9A80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </Link>

          {/* Notification badge + pulse */}
          {isLoggedIn && (
            <>
              {/* Pulse ring */}
              <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full animate-ping"
                style={{ backgroundColor: '#EF444430' }} />
              {/* Dot */}
              <span className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 rounded-full border-[1.5px] border-white"
                style={{ backgroundColor: '#EF4444' }} />
            </>
          )}
        </div>

        {/* ── CTA Đặt lịch ── */}
        <a href="/dat-lich"
          className="ml-1 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-[13px] font-bold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F, #2563EB)',
            boxShadow: '0 4px 14px #1E3A5F40',
          }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/>
          </svg>
          Đặt Lịch Khám
        </a>
      </div>

      {/* Mobile */}
      <div className="flex items-center gap-2 md:hidden">
        {/* Mobile lịch hẹn icon */}
        <Link href={isLoggedIn ? '/portal' : '/login'}
          className="relative p-2 rounded-xl border-[1.5px] transition-colors"
          style={{ borderColor: '#2563EB', backgroundColor: '#EFF6FF' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B3A28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {isLoggedIn && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white"
              style={{ backgroundColor: '#EF4444' }} />
          )}
        </Link>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)}
          className="p-2 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-50">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors">
                {link.label}
              </a>
            ))}
            <div className="pt-3 pb-1 border-t border-gray-100 space-y-2">
              <Link href={isLoggedIn ? '/portal' : '/login'} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl border-[1.5px] transition-colors"
                style={{ borderColor: '#2563EB', backgroundColor: '#EFF6FF' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #1E3A5F)' }}>
                  {isLoggedIn ? initials : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#1E3A5F' }}>
                    {isLoggedIn ? 'Lịch hẹn của tôi' : 'Đăng nhập xem lịch'}
                  </p>
                  <p className="text-xs" style={{ color: '#3B82F6' }}>
                    {isLoggedIn ? displayName : 'Xem lịch sử điều trị'}
                  </p>
                </div>
              </Link>
              <a href="/dat-lich"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #2563EB, #1E3A5F)' }}>
                📅 Đặt Lịch Khám Ngay
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
