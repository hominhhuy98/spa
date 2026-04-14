'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Staff {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  bac_si: 'Bác sĩ',
  nhan_vien: 'Nhân viên',
};

export default function StaffList({ initialStaff }: { initialStaff: Staff[] }) {
  const [staff, setStaff] = useState(initialStaff);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ full_name: '', role: '', password: '' });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function startEdit(s: Staff) {
    setEditingId(s.id);
    setEditForm({ full_name: s.full_name, role: s.role, password: '' });
  }

  async function handleSave(id: string) {
    setSaving(true);
    const body: Record<string, unknown> = {
      full_name: editForm.full_name,
      role: editForm.role,
    };
    if (editForm.password) body.password = editForm.password;

    const res = await fetch(`/api/admin/staff/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setStaff(prev => prev.map(s => s.id === id ? { ...s, full_name: editForm.full_name, role: editForm.role } : s));
      setEditingId(null);
      router.refresh();
    }
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    await fetch(`/api/admin/staff/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !currentActive }),
    });
    setStaff(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentActive } : s));
  }

  async function handleDelete(id: string) {
    if (!confirm('Vô hiệu hóa nhân viên này?')) return;
    const res = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setStaff(prev => prev.map(s => s.id === id ? { ...s, is_active: false } : s));
      router.refresh();
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left">
            <th className="px-4 py-3 font-semibold text-gray-600">Họ tên</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Vai trò</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {staff.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                {editingId === s.id ? (
                  <input type="text" value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm" />
                ) : (
                  <span className="font-medium text-gray-900">{s.full_name}</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-500">{s.email}</td>
              <td className="px-4 py-3">
                {editingId === s.id ? (
                  <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                    className="px-2 py-1 border border-gray-200 rounded text-xs">
                    <option value="admin">Admin</option>
                    <option value="bac_si">Bác sĩ</option>
                    <option value="nhan_vien">Nhân viên</option>
                  </select>
                ) : (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    s.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    s.role === 'bac_si' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {ROLE_LABELS[s.role] ?? s.role}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <button onClick={() => handleToggleActive(s.id, s.is_active)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer ${
                    s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                  {s.is_active ? 'Hoạt động' : 'Vô hiệu'}
                </button>
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">
                {s.created_at ? new Date(s.created_at).toLocaleDateString('vi-VN') : '—'}
              </td>
              <td className="px-4 py-3">
                {editingId === s.id ? (
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="Mật khẩu mới (tùy chọn)"
                      value={editForm.password} onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                      className="w-28 px-2 py-1 border border-gray-200 rounded text-xs" />
                    <button onClick={() => handleSave(s.id)} disabled={saving}
                      className="text-xs font-bold text-white bg-primary px-2 py-1 rounded hover:opacity-90 disabled:opacity-50">
                      {saving ? '...' : 'Lưu'}
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:text-gray-600">Hủy</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(s)} className="text-primary text-xs font-semibold hover:underline">Sửa</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 text-xs font-semibold hover:underline">Vô hiệu</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {staff.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-10">Chưa có nhân sự nào</p>
      )}
    </div>
  );
}
