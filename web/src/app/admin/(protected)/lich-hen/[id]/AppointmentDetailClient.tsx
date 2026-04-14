'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'Chờ xác nhận', icon: '⏳', color: 'bg-yellow-50 border-yellow-300 text-yellow-800' },
  { value: 'confirmed', label: 'Đã xác nhận',  icon: '✅', color: 'bg-blue-50 border-blue-300 text-blue-800' },
  { value: 'done',      label: 'Hoàn thành',   icon: '🎉', color: 'bg-green-50 border-green-300 text-green-800' },
  { value: 'cancelled', label: 'Đã huỷ',       icon: '❌', color: 'bg-red-50 border-red-300 text-red-800' },
];

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  bac_si:    { label: 'Bác sĩ',    color: 'bg-blue-100 text-blue-700' },
  nhan_vien: { label: 'Nhân viên', color: 'bg-green-100 text-green-700' },
  admin:     { label: 'Admin',     color: 'bg-purple-100 text-purple-700' },
};

interface NoteItem {
  id: string | number;
  note_text: string;
  created_at: string;
  profiles: { full_name: string };
}

export default function AppointmentDetailClient({
  appointment,
  staff,
  assignedIds,
  notes: initialNotes,
}: {
  appointment: Record<string, string>;
  staff: Array<{ id: string; full_name: string; role: string }>;
  assignedIds: string[];
  notes: NoteItem[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(appointment.status);
  const [selected, setSelected] = useState<string[]>(assignedIds);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Ghi chú
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const currentStatus = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];

  async function handleSave() {
    setSaving(true);
    setMsg('');
    const res = await fetch(`/api/admin/appointments/${appointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, staff_ids: selected }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg('success');
      router.refresh();
      setTimeout(() => setMsg(''), 3000);
    } else {
      setMsg('error');
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;
    setAddingNote(true);
    const res = await fetch(`/api/portal/appointments/${appointment.id}/notes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note_text: newNote }),
    });
    const data = await res.json();
    setAddingNote(false);
    if (res.ok && data.note) {
      setNotes(prev => [...prev, {
        id: data.note.id,
        note_text: data.note.note_text,
        created_at: data.note.created_at || new Date().toISOString(),
        profiles: { full_name: data.note.staff_name || 'Admin' },
      }]);
      setNewNote('');
    }
  }

  function formatDate(d: string) {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  function formatDateTime(iso: string) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  }

  const cleanNotes = (appointment.notes || '')
    .replace(/\[TAIKHAM:[^\]]*\]/g, '')
    .replace(/\[PHOTOS:[^\]]*\]/g, '')
    .replace(/\[THUOC:[^\]]*\]/g, '')
    .replace(/\[WALKIN\]/g, '')
    .replace(/\[AUTO\][^\n]*/g, '')
    .trim();

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/lich-hen" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900">Chi tiết lịch hẹn</h1>
            <p className="text-xs text-gray-400 mt-0.5">#{appointment.id.slice(0, 8)}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full border text-sm font-bold ${currentStatus.color}`}>
          {currentStatus.icon} {currentStatus.label}
        </div>
      </div>

      {/* Success/Error toast */}
      {msg === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-xl mb-5">
          Đã lưu thay đổi thành công!
        </div>
      )}
      {msg === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl mb-5">
          Có lỗi xảy ra, vui lòng thử lại.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Cột trái */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card thông tin */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
              <h2 className="font-black text-primary text-sm uppercase tracking-wider">Thông Tin Khách Hàng</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Họ tên</p>
                  <p className="text-gray-900 font-bold text-base">{appointment.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Số điện thoại</p>
                  <a href={`tel:${appointment.phone}`} className="text-primary font-bold text-base hover:underline">{appointment.phone}</a>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Dịch vụ</p>
                  <p className="text-gray-900 font-semibold">{appointment.service}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Ngày hẹn</p>
                  <p className="text-gray-900 font-bold text-lg">{formatDate(appointment.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Giờ</p>
                  <p className="text-gray-900 font-bold text-lg">{appointment.time ? appointment.time.slice(0, 5) : '—'}</p>
                </div>
              </div>

              {cleanNotes && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Ghi chú khách hàng</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-4">{cleanNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ghi chú điều trị + form thêm */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-sm uppercase tracking-wider">Nhật Ký Điều Trị</h2>
              <span className="text-xs text-gray-400">{notes.length} ghi chú</span>
            </div>
            <div className="p-6">
              {/* Timeline ghi chú */}
              {notes.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {notes.map(n => (
                    <div key={n.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="shrink-0 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center">
                          <span className="text-xs font-black">
                            {n.profiles?.full_name?.split(' ').pop()?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="w-px flex-1 bg-gray-200 mt-2" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{n.profiles?.full_name || 'Nhân viên'}</span>
                          <span className="text-xs text-gray-400">{formatDateTime(n.created_at)}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{n.note_text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 mb-4">
                  <p className="text-gray-400 text-sm">Chưa có ghi chú nào</p>
                </div>
              )}

              {/* Form thêm ghi chú mới */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Thêm ghi chú mới</p>
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  rows={3}
                  placeholder="Nhập ghi chú điều trị, tình trạng bệnh nhân, chỉ định..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">Ghi chú sẽ lưu kèm tên người viết và thời gian</p>
                  <button
                    onClick={handleAddNote}
                    disabled={addingNote || !newNote.trim()}
                    className="bg-primary text-white text-xs font-bold px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                    {addingNote ? 'Đang lưu...' : 'Thêm ghi chú'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className="space-y-5">
          {/* Trạng thái */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm uppercase tracking-wider">Trạng Thái</h2>
            </div>
            <div className="p-4 space-y-1.5">
              {STATUS_OPTIONS.map(o => (
                <label key={o.value}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer border transition ${
                    status === o.value ? o.color + ' border' : 'border-transparent hover:bg-gray-50'
                  }`}>
                  <input type="radio" name="status" value={o.value} checked={status === o.value}
                    onChange={() => setStatus(o.value)} className="hidden" />
                  <span className="text-base">{o.icon}</span>
                  <span className="text-sm font-semibold">{o.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Phân công */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm uppercase tracking-wider">Phân Công</h2>
            </div>
            <div className="p-4 space-y-1.5 max-h-60 overflow-y-auto">
              {staff.map(s => {
                const role = ROLE_LABELS[s.role] || { label: s.role, color: 'bg-gray-100 text-gray-600' };
                const isChecked = selected.includes(s.id);
                return (
                  <label key={s.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer border transition ${
                      isChecked ? 'bg-primary/5 border-primary/20' : 'border-transparent hover:bg-gray-50'
                    }`}>
                    <input type="checkbox" checked={isChecked}
                      onChange={e => setSelected(e.target.checked ? [...selected, s.id] : selected.filter(id => id !== s.id))}
                      className="rounded border-gray-300" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{s.full_name}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${role.color}`}>{role.label}</span>
                  </label>
                );
              })}
              {!staff.length && <p className="text-xs text-gray-400 text-center py-3">Chưa có nhân sự</p>}
            </div>
          </div>

          {/* Nút lưu */}
          <button onClick={handleSave} disabled={saving}
            className="w-full bg-primary text-white font-black py-3.5 rounded-2xl hover:opacity-90 transition disabled:opacity-50 text-sm tracking-wide">
            {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}
