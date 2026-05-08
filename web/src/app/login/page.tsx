'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getDashboardByRole } from '@/lib/redirect-by-role';

const BENEFITS = [
  { icon: '📅', title: 'Quản lý lịch hẹn', desc: 'Xem và theo dõi lịch khám của bạn' },
  { icon: '🧴', title: 'Lịch sử điều trị',  desc: 'Theo dõi tiến trình chăm sóc da' },
  { icon: '📋', title: 'Hồ sơ bác sĩ & đơn thuốc', desc: 'Xem thông tin điều trị chi tiết' },
];

async function createSession(idToken: string) {
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || null;

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleGoogleLogin() {
    setLoading(true); setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await createSession(idToken);
      // Lấy claims để redirect theo role
      const tokenResult = await result.user.getIdTokenResult(true);
      const role = tokenResult.claims.role as string | undefined;
      router.push(redirectTo ?? getDashboardByRole(role));
      router.refresh();
    } catch {
      setError('Không thể kết nối Google.');
      setLoading(false);
    }
  }

  async function handleZaloLogin() {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/zalo');
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { setError('Không thể kết nối Zalo.'); setLoading(false); }
    } catch { setError('Không thể kết nối Zalo.'); setLoading(false); }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      await createSession(idToken);
      const tokenResult = await cred.user.getIdTokenResult(true);
      const role = tokenResult.claims.role as string | undefined;
      router.push(redirectTo ?? getDashboardByRole(role));
      router.refresh();
    } catch {
      setError('Email hoặc mật khẩu không đúng.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#EFF6FF' }}>

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col w-[420px] xl:w-[480px] shrink-0 relative overflow-hidden"
        style={{ backgroundColor: '#1E3A5F' }}>

        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #2563EB, #3B82F6)' }} />

        {/* Brand */}
        <div className="px-10 pt-10 pb-0">
          <div className="flex items-center gap-3.5 mb-10">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#2563EB' }}>
              <span className="text-white font-black text-base">BV</span>
            </div>
            <div>
              <p className="text-white font-bold text-[13px] leading-tight">CTCP BV Y Dược Sài Gòn</p>
              <p className="text-[11px] font-medium" style={{ color: '#93C5FD' }}>Chuyên Khoa Da Liễu</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="mb-8">
            <h1 className="text-white font-bold leading-[1.2] mb-4"
              style={{ fontSize: '40px', fontFamily: 'var(--font-playfair)' }}>
              Chào mừng<br />bạn trở lại
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#BFDBFE' }}>
              Đăng nhập để xem lịch hẹn, lịch sử điều trị và hồ sơ sức khoẻ của bạn.
            </p>
          </div>

          {/* Divider */}
          <div className="w-12 h-0.5 rounded-full mb-8" style={{ backgroundColor: '#2563EB' }} />

          {/* Benefits */}
          <div className="space-y-5">
            {BENEFITS.map(b => (
              <div key={b.title} className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[15px]"
                  style={{ backgroundColor: '#2563EB' }}>
                  {b.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-[13px]">{b.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#93C5FD' }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="px-10 pb-8">
          <p className="text-xs" style={{ color: '#3B82F6' }}>© 2026 CTCP Bệnh Viện Y Dược Sài Gòn</p>
        </div>

        {/* Background image overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.15,
          }} />
        <div className="absolute bottom-0 left-0 right-0 h-72 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #1E3A5F 40%, transparent)' }} />
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: '#1E3A5F' }}>
              <span className="text-white font-black text-lg">BV</span>
            </div>
            <p className="font-black text-gray-900">CTCP BV Y Dược Sài Gòn</p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-3xl p-10"
            style={{ boxShadow: '0 8px 32px #0000001a' }}>

            <h2 className="font-bold text-gray-900 mb-1.5"
              style={{ fontSize: '28px', fontFamily: 'var(--font-playfair)' }}>
              Đăng nhập
            </h2>
            <p className="text-sm mb-7" style={{ color: '#93C5FD' }}>
              Nhập thông tin tài khoản của bạn
            </p>

            {error && (
              <div className="text-sm px-4 py-3 rounded-xl mb-5 border"
                style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-800 mb-2">Email</label>
                <input
                  type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="example@ydsg.vn"
                  className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
                  style={{
                    backgroundColor: '#FAFAF8',
                    border: '1.5px solid #BFDBFE',
                    boxShadow: 'inset 0 1px 3px #00000008',
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#BFDBFE'}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-800 mb-2">Mật khẩu</label>
                <input
                  type="password" required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
                  style={{
                    backgroundColor: '#FAFAF8',
                    border: '1.5px solid #BFDBFE',
                    boxShadow: 'inset 0 1px 3px #00000008',
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#BFDBFE'}
                />
              </div>

              {/* Login button */}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white text-sm font-bold transition-opacity disabled:opacity-60 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB)' }}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ backgroundColor: '#BFDBFE' }} />
              <span className="text-xs" style={{ color: '#93C5FD' }}>hoặc đăng nhập bằng</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#BFDBFE' }} />
            </div>

            {/* Social login */}
            <div className="space-y-2.5">
              <button onClick={handleGoogleLogin} disabled={loading}
                className="w-full flex items-center justify-center gap-3 border rounded-2xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                style={{ borderColor: '#BFDBFE' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button onClick={handleZaloLogin} disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-2xl py-3 text-sm font-bold text-white transition disabled:opacity-50 hover:opacity-90"
                style={{ backgroundColor: '#0068FF' }}>
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="10" fill="#0068FF"/>
                  <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
                    fill="white" fontWeight="800" fontSize="18" fontFamily="Arial, sans-serif">Z</text>
                </svg>
                Zalo
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mt-5 mb-3">
              <div className="flex-1 h-px" style={{ backgroundColor: '#BFDBFE' }} />
              <span className="text-xs" style={{ color: '#93C5FD' }}>khác</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#BFDBFE' }} />
            </div>

            {/* Đăng ký */}
            <a href="/dang-ky"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-colors hover:opacity-80 border"
              style={{ borderColor: '#BFDBFE', color: '#3B82F6', backgroundColor: '#FFFFFF' }}>
              <span>📝</span>
              <span>Đăng ký tài khoản mới</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
