'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'idle' | 'phone' | 'otp' | 'done';

export default function LinkPhoneBanner() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>('idle');
  const [phone,   setPhone]   = useState('');
  const [otp,     setOtp]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true); setError('');
    const res = await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    setLoading(false);
    if (res.ok) {
      setStep('otp');
    } else {
      const data = await res.json();
      setError(data.error || 'Không thể gửi OTP');
    }
  }

  async function handleVerifyAndLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth/link-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp_code: otp }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setStep('done');
      setTimeout(() => router.refresh(), 1000);
    } else {
      setError(data.error || 'Liên kết thất bại');
    }
  }

  // ── Trạng thái hoàn thành ──
  if (step === 'done') {
    return (
      <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
        <span className="text-3xl block mb-2">🎉</span>
        <p className="font-bold text-green-800 text-sm">Liên kết thành công!</p>
        <p className="text-xs text-green-600 mt-1">
          SĐT <strong>{phone}</strong> đã được liên kết. Đang tải lại lịch hẹn...
        </p>
      </div>
    );
  }

  // ── Trạng thái chưa bấm liên kết ──
  if (step === 'idle') {
    return (
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">📱</span>
          <div className="flex-1">
            <p className="font-bold text-amber-800 text-sm">Liên kết số điện thoại</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Bạn đã đăng nhập bằng Zalo/Google nhưng chưa liên kết SĐT.
              Lịch hẹn đặt qua SĐT sẽ không hiển thị cho đến khi liên kết.
            </p>
            <button
              onClick={() => setStep('phone')}
              className="mt-3 px-5 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 transition"
              style={{ backgroundColor: '#2C5F5D' }}>
              Liên kết ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form liên kết (phone → OTP) ──
  return (
    <div className="mt-4 bg-white border border-primary/20 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📱</span>
        <h3 className="font-black text-sm text-gray-800">Liên kết số điện thoại</h3>
        <button onClick={() => { setStep('idle'); setError(''); setOtp(''); }}
          className="ml-auto text-xs text-gray-400 hover:text-gray-600">✕ Đóng</button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl mb-3">
          {error}
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleRequestOTP} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Số điện thoại đã đặt lịch
            </label>
            <input
              type="tel" required
              placeholder="0901 234 567"
              value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Nhập SĐT bạn đã dùng khi đặt lịch khám — mã OTP sẽ gửi qua Zalo
            </p>
          </div>
          <button type="submit" disabled={loading}
            className="w-full text-white font-bold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm"
            style={{ backgroundColor: '#2C5F5D' }}>
            {loading ? 'Đang gửi...' : 'Nhận mã OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndLink} className="space-y-3">
          <p className="text-xs text-gray-600 text-center">
            Nhập mã OTP đã gửi đến <strong>{phone}</strong>
          </p>
          <div>
            <input
              type="text" required inputMode="numeric" maxLength={6}
              placeholder="• • • • • •"
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-xl tracking-[0.5em] font-bold outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button type="submit" disabled={loading || otp.length !== 6}
            className="w-full text-white font-bold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm"
            style={{ backgroundColor: '#2C5F5D' }}>
            {loading ? 'Đang xác thực...' : 'Xác nhận & Liên kết'}
          </button>
          <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
            className="w-full text-gray-400 text-xs hover:text-gray-600 transition py-1">
            ← Đổi số điện thoại
          </button>
        </form>
      )}
    </div>
  );
}
