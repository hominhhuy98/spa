'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  currentName: string;
  currentPhone: string;
  currentEmail: string;
}

export default function EditProfileModal({ currentName, currentPhone, currentEmail }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(currentName);
  const [phone, setPhone] = useState(currentPhone);
  const [email, setEmail] = useState(currentEmail);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const res = await fetch('/api/auth/update-profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setMsg('success');
      setTimeout(() => { setOpen(false); router.refresh(); }, 1000);
    } else {
      const data = await res.json();
      setMsg(data.error || 'Có lỗi xảy ra');
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="text-xs text-gray-400 hover:text-primary font-semibold transition flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Chỉnh sửa
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-gray-900">Thông tin cá nhân</h2>
                <button onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Cập nhật thông tin liên hệ của bạn</p>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {msg === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-3 py-2 rounded-xl">
                  Đã cập nhật thành công!
                </div>
              )}
              {msg && msg !== 'success' && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl">
                  {msg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Họ và tên</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Số điện thoại</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="0901 234 567"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition" />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700">
                  <strong>Lưu ý:</strong> Bạn chỉ có thể chỉnh sửa thông tin cá nhân. Lịch sử điều trị và ghi chú của bác sĩ không thể thay đổi.
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition">
                  Hủy
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition disabled:opacity-50"
                  style={{ backgroundColor: '#2C5F5D' }}>
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
