'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';

async function createSession(idToken: string) {
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
}

export default function DangKyPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, phone, email: email || undefined, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Có lỗi xảy ra');
        setLoading(false);
        return;
      }

      // Đăng nhập bằng custom token
      const cred = await signInWithCustomToken(auth, data.customToken);
      const idToken = await cred.user.getIdToken();
      await createSession(idToken);

      router.push('/portal');
      router.refresh();
    } catch {
      setError('Không thể tạo tài khoản. Vui lòng thử lại.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
            style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB)' }}>
            <span className="text-white text-2xl font-black">BV</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Tạo Tài Khoản</h1>
          <p className="text-sm text-gray-500 mt-1">CTCP BV Y Dược Sài Gòn</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text" required
                placeholder="Nguyễn Văn A"
                value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel" required
                placeholder="0901 234 567"
                value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              <p className="text-[11px] text-gray-400 mt-1">Dùng để đăng nhập và nhận thông báo</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password" required minLength={6}
                placeholder="Ít nhất 6 ký tự"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password" required minLength={6}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full text-white font-bold py-3 rounded-2xl hover:opacity-90 transition disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB)' }}>
              {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">hoặc</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Login link */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              Đã có tài khoản?{' '}
              <Link href="/portal/login" className="text-primary font-bold hover:underline">
                Đăng nhập
              </Link>
            </p>
            <Link href="/dat-lich"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 border border-dashed border-gray-200 hover:border-gray-300 transition">
              <span>📅</span> Đặt lịch không cần tài khoản
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
