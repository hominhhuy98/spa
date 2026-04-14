'use client';

import { useState } from 'react';

interface PrescriptionItem {
  id?: number;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  sort_order?: number;
}

export interface Prescription {
  id: string | number;
  diagnosis: string | null;
  notes: string | null;
  created_at: string;
  profiles: { full_name: string } | null;
  prescription_items: PrescriptionItem[];
}

interface Props {
  appointmentId: string | number;
  initialPrescriptions: Prescription[];
  canEdit: boolean; // true = bác sĩ, false = nhân viên (chỉ xem)
}

const EMPTY_ITEM: PrescriptionItem = { medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' };

function fmt(d: string) {
  return new Date(d).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}

export default function PrescriptionPanel({ appointmentId, initialPrescriptions, canEdit }: Props) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [open, setOpen]       = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes]         = useState('');
  const [items, setItems]         = useState<PrescriptionItem[]>([{ ...EMPTY_ITEM }]);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState('');

  function addItem() {
    setItems(prev => [...prev, { ...EMPTY_ITEM }]);
  }
  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }
  function updateItem(idx: number, field: keyof PrescriptionItem, val: string) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: val } : it));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.some(it => it.medicine_name.trim())) {
      setMsg('Vui lòng nhập ít nhất một loại thuốc'); return;
    }
    setSaving(true); setMsg('');
    const res = await fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment_id: appointmentId, diagnosis, notes, items }),
    });
    if (res.ok) {
      // Reload danh sách
      const r2 = await fetch(`/api/prescriptions?appointment_id=${appointmentId}`);
      if (r2.ok) {
        const d = await r2.json();
        setPrescriptions(d.prescriptions);
      }
      setOpen(false);
      setDiagnosis(''); setNotes('');
      setItems([{ ...EMPTY_ITEM }]);
      setMsg('Đã lưu đơn thuốc');
    } else {
      const err = await res.json();
      setMsg(err.error || 'Lỗi — thử lại');
    }
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xs text-gray-500 uppercase tracking-wide">💊 Module Thuốc</h2>
        {canEdit && (
          <button onClick={() => setOpen(o => !o)}
            className="text-xs font-bold text-[#2C5F5D] hover:underline">
            {open ? '✕ Đóng' : '+ Kê đơn mới'}
          </button>
        )}
      </div>

      {/* Form kê đơn — bác sĩ */}
      {canEdit && open && (
        <form onSubmit={handleSubmit} className="space-y-3 border border-dashed border-[#2C5F5D]/30 rounded-xl p-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Chẩn đoán</label>
            <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
              placeholder="VD: Mụn trứng cá độ II, nám da..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
          </div>

          {/* Danh sách thuốc */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-600">Danh sách thuốc</label>
              <button type="button" onClick={addItem}
                className="text-xs font-bold text-[#2C5F5D] hover:underline">+ Thêm thuốc</button>
            </div>
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-3 relative">
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-100 text-red-500 text-xs font-bold hover:bg-red-200 flex items-center justify-center">
                      ×
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2 pr-6">
                    <div className="col-span-2">
                      <p className="text-[10px] text-gray-400 font-semibold mb-1">Tên thuốc *</p>
                      <input type="text" value={it.medicine_name}
                        onChange={e => updateItem(idx, 'medicine_name', e.target.value)}
                        placeholder="VD: Tretinoin 0.025%, Doxycycline 100mg..."
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold mb-1">Liều dùng</p>
                      <input type="text" value={it.dosage}
                        onChange={e => updateItem(idx, 'dosage', e.target.value)}
                        placeholder="VD: 1 viên / lần"
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold mb-1">Tần suất</p>
                      <input type="text" value={it.frequency}
                        onChange={e => updateItem(idx, 'frequency', e.target.value)}
                        placeholder="VD: 2 lần / ngày"
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold mb-1">Thời gian dùng</p>
                      <input type="text" value={it.duration}
                        onChange={e => updateItem(idx, 'duration', e.target.value)}
                        placeholder="VD: 4 tuần"
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold mb-1">Hướng dẫn dùng</p>
                      <input type="text" value={it.instructions}
                        onChange={e => updateItem(idx, 'instructions', e.target.value)}
                        placeholder="VD: Bôi tối, tránh ánh nắng"
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú thêm</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Lưu ý khi dùng thuốc, tái khám..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30 resize-none h-16" />
          </div>

          <div className="flex items-center justify-between">
            {msg && <p className={`text-xs font-medium ${msg.includes('Lỗi') || msg.includes('nhập') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
            <button type="submit" disabled={saving}
              className="ml-auto px-5 py-2 bg-[#2C5F5D] text-white text-sm font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50">
              {saving ? 'Đang lưu...' : 'Lưu đơn thuốc'}
            </button>
          </div>
        </form>
      )}

      {/* Danh sách đơn đã kê */}
      {prescriptions.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-1">
          {canEdit ? 'Chưa có đơn thuốc nào — bấm "+ Kê đơn mới" để tạo' : 'Bác sĩ chưa kê đơn thuốc cho lượt khám này'}
        </p>
      ) : (
        <div className="space-y-3">
          {prescriptions.map(rx => (
            <div key={rx.id} className="border border-gray-100 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="bg-blue-50 px-4 py-2.5 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-black text-blue-800">
                    BS. {rx.profiles?.full_name ?? 'N/A'} — {fmt(rx.created_at)}
                  </p>
                  {rx.diagnosis && (
                    <p className="text-xs text-blue-700 mt-0.5">Chẩn đoán: {rx.diagnosis}</p>
                  )}
                </div>
                <span className="shrink-0 text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {rx.prescription_items.length} thuốc
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {rx.prescription_items
                  .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                  .map((it, idx) => (
                    <div key={it.id ?? idx} className="px-4 py-2.5 grid grid-cols-5 gap-2 text-xs">
                      <div className="col-span-2">
                        <p className="font-bold text-gray-900">{it.medicine_name}</p>
                        {it.instructions && <p className="text-gray-500 mt-0.5">{it.instructions}</p>}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold">Liều</p>
                        <p className="text-gray-700">{it.dosage || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold">Tần suất</p>
                        <p className="text-gray-700">{it.frequency || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold">Thời gian</p>
                        <p className="text-gray-700">{it.duration || '—'}</p>
                      </div>
                    </div>
                  ))}
              </div>

              {rx.notes && (
                <div className="px-4 py-2 bg-gray-50 text-xs text-gray-600 border-t border-gray-100">
                  <span className="font-semibold text-gray-500">Ghi chú: </span>{rx.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
