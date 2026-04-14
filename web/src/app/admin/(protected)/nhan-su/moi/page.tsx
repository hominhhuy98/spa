'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TaoNhanSuPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'bac_si' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin/nhan-su');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Có lỗi xảy ra');
    }
  }

  return (
    <div className="p-6 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 text-sm">← Quay lại</button>
        <h1 className="text-2xl font-black text-gray-900">Thêm Nhân Sự</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Họ và tên', key: 'full_name', type: 'text', placeholder: 'BS. Nguyễn Văn A' },
            { label: 'Email đăng nhập', key: 'email', type: 'email', placeholder: 'bacsi@ydsg.vn' },
            { label: 'Mật khẩu tạm', key: 'password', type: 'password', placeholder: 'Ít nhất 8 ký tự' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
              <input
                type={field.type} required placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vai trò</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary bg-white">
              <option value="bac_si">Bác sĩ</option>
              <option value="nhan_vien">Nhân viên da liễu</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white font-bold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50">
            {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
          </button>
        </form>
      </div>
    </div>
  );
}
