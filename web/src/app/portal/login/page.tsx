'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithPopup, signInWithCustomToken, GoogleAuthProvider } from 'firebase/auth';
import { getDashboardByRole } from '@/lib/redirect-by-role';
import { Suspense } from 'react';

// ── Icons ────────────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function ZaloIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill="#0068FF"/>
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
        fill="white" fontWeight="800" fontSize="18" fontFamily="Arial, sans-serif">
        Z
      </text>
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
type AuthMode = 'login' | 'register';
type PhoneStep = 'phone' | 'otp';

async function createSession(idToken: string) {
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
}

// ── Main Component ────────────────────────────────────────────────────────────
function PortalLoginContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [mode,     setMode]     = useState<AuthMode>('login');
  const [step,     setStep]     = useState<PhoneStep>('phone');
  const [fullName, setFullName] = useState('');
  const [phone,    setPhone]    = useState('');
  const [otp,      setOtp]      = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [info,     setInfo]     = useState('');

  // Xử lý error param từ callback (Google/Zalo fail)
  useEffect(() => {
    const err = params.get('error');
    if (err) setError(
      err === 'auth_failed'    ? 'Đăng nhập thất bại. Vui lòng thử lại.' :
      err === 'zalo_invalid'   ? 'Phiên Zalo không hợp lệ. Vui lòng thử lại.' :
      err === 'zalo_token'     ? 'Không thể lấy thông tin từ Zalo. Thử lại.' :
      err === 'zalo_userinfo'  ? 'Không lấy được thông tin tài khoản Zalo.' :
      err === 'zalo_session'   ? 'Không thể tạo phiên đăng nhập Zalo.' :
      'Đã có lỗi xảy ra. Vui lòng thử lại.'
    );
  }, [params]);

  function resetPhone() {
    setStep('phone'); setOtp(''); setError('');
  }
  function switchMode(m: AuthMode) {
    setMode(m); setError(''); setInfo(''); setStep('phone');
    setPhone(''); setOtp(''); setFullName('');
  }

  // ── Google OAuth ───────────────────────────────────────────────────────────
  async function handleGoogle() {
    setLoading(true); setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await createSession(idToken);
      const tokenResult = await result.user.getIdTokenResult(true);
      const role = tokenResult.claims.role as string | undefined;
      router.push(getDashboardByRole(role));
      router.refresh();
    } catch {
      setError('Không thể kết nối Google. Vui lòng thử lại.');
      setLoading(false);
    }
  }

  // ── Zalo OAuth ─────────────────────────────────────────────────────────────
  async function handleZalo() {
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/auth/zalo');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Không thể kết nối Zalo. Vui lòng thử lại.');
        setLoading(false);
      }
    } catch {
      setError('Không thể kết nối Zalo. Vui lòng thử lại.');
      setLoading(false);
    }
  }

  // ── SĐT → OTP ─────────────────────────────────────────────────────────────
  async function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'register' && !fullName.trim()) {
      setError('Vui lòng nhập họ tên của bạn'); return;
    }
    setLoading(true); setError('');
    const res = await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    setLoading(false);
    if (res.ok) {
      setStep('otp');
      setInfo('Mã OTP đã được gửi qua Zalo');
    } else {
      const data = await res.json();
      setError(data.error || 'Không thể gửi OTP. Thử lại.');
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        otp_code:  otp,
        full_name: fullName.trim() || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Mã OTP không đúng hoặc đã hết hạn.'); setLoading(false); return; }

    try {
      // Đăng nhập bằng custom token
      const cred = await signInWithCustomToken(auth, data.customToken);
      const idToken = await cred.user.getIdToken();
      await createSession(idToken);
      router.push('/portal');
      router.refresh();
    } catch {
      setError('Không thể tạo phiên đăng nhập. Vui lòng thử lại.');
      setLoading(false);
    }
  }

  const isRegister = mode === 'register';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Logo & title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
            style={{ background: 'linear-gradient(135deg, #1A8DC4, #0D6FA3)' }}>
            <span className="text-white text-2xl">🏥</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Cổng Khách Hàng</h1>
          <p className="text-sm text-gray-500 mt-1">CTCP BV Y Dược Sài Gòn</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Mode tabs */}
          <div className="flex border-b border-gray-100">
            {(['login', 'register'] as AuthMode[]).map(m => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                  mode === m
                    ? 'text-primary border-b-2 border-primary bg-blue-50/50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}>
                {m === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">

            {/* Error / Info */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            {info && !error && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                {info}
              </div>
            )}

            {/* ── Social buttons ── */}
            <div className="space-y-2.5">
              <button onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-50">
                <GoogleIcon />
                {isRegister ? 'Đăng ký bằng Google' : 'Tiếp tục bằng Google'}
              </button>

              <button onClick={handleZalo} disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-2xl py-3 text-sm font-bold text-white transition disabled:opacity-50 hover:opacity-90"
                style={{ backgroundColor: '#0068FF' }}>
                <ZaloIcon />
                {isRegister ? 'Đăng ký bằng Zalo' : 'Tiếp tục bằng Zalo'}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">hoặc dùng số điện thoại</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* ── Phone / OTP flow ── */}
            {step === 'phone' ? (
              <form onSubmit={handleRequestOTP} className="space-y-3">
                {/* Tên — chỉ hiện khi đăng ký */}
                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Họ và tên <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" required={isRegister}
                      placeholder="Nguyễn Văn A"
                      value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Số điện thoại <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel" required
                    placeholder="0901 234 567"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    Mã OTP sẽ gửi qua Zalo đến số này
                  </p>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full text-white font-bold py-3 rounded-2xl hover:opacity-90 transition disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #1A8DC4, #0D6FA3)' }}>
                  {loading ? 'Đang gửi...' : 'Nhận mã OTP qua Zalo'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Nhập mã OTP đã gửi qua Zalo đến
                  </p>
                  <p className="font-bold text-gray-900">{phone}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 text-center">
                    Mã OTP (6 số)
                  </label>
                  <input
                    type="text" required inputMode="numeric" maxLength={6}
                    placeholder="• • • • • •"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-[0.5em] font-bold outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>

                <button type="submit" disabled={loading || otp.length !== 6}
                  className="w-full text-white font-bold py-3 rounded-2xl hover:opacity-90 transition disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #1A8DC4, #0D6FA3)' }}>
                  {loading ? 'Đang xác thực...' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
                </button>

                <button type="button" onClick={resetPhone}
                  className="w-full text-gray-400 text-sm hover:text-gray-600 transition py-1">
                  ← Đổi số điện thoại
                </button>
              </form>
            )}

            {/* Footer note */}
            {isRegister ? (
              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                Khi tạo tài khoản, bạn đồng ý với{' '}
                <span className="text-primary font-medium">Điều khoản dịch vụ</span> và{' '}
                <span className="text-primary font-medium">Chính sách bảo mật</span> của chúng tôi.
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 text-center">
                Chưa có tài khoản?{' '}
                <button onClick={() => switchMode('register')}
                  className="text-primary font-semibold hover:underline">
                  Tạo tài khoản
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Đăng ký + Đặt lịch */}
        <a href="/dang-ky"
          className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold text-white transition bg-white/50 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB)' }}>
          Đăng ký tài khoản mới
        </a>
        <a href="/dat-lich"
          className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-700 border border-dashed border-gray-200 hover:border-gray-300 transition bg-white/50">
          <span>📅</span>
          <span>Đặt lịch không cần tài khoản</span>
        </a>
      </div>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense>
      <PortalLoginContent />
    </Suspense>
  );
}
