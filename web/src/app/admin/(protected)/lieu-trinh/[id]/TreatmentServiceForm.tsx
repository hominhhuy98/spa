'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface QuyTrinhBuoc {
  buoc: string;
  thoi_gian: string;
  dinh_luong: string;
  san_pham: string;
}

interface ServiceData {
  id?: string;
  name: string;
  slug: string;
  icon: string;
  category: string;
  tong_thoi_gian: string;
  mo_ta: string;
  quy_trinh: QuyTrinhBuoc[];
  luu_y: string;
  is_active: boolean;
  sort_order: number;
}

const CATEGORIES = [
  { value: 'quy-trinh-co-dinh', label: 'Quy trình cố định' },
  { value: 'cham-soc-da', label: 'Chăm sóc da' },
  { value: 'cham-soc-da-toan-dien', label: 'Chăm sóc da toàn diện' },
  { value: 'da-mun-face', label: 'Da mụn (Face)' },
  { value: 'da-mun-body', label: 'Da mụn (Body)' },
  { value: 'da-nhay-cam', label: 'Da nhạy cảm' },
  { value: 'chemical-peel', label: 'Chemical Peel' },
];

const EMPTY: ServiceData = {
  name: '', slug: '', icon: '💆', category: 'cham-soc-da',
  tong_thoi_gian: '', mo_ta: '',
  quy_trinh: [{ buoc: '', thoi_gian: '', dinh_luong: '', san_pham: '' }],
  luu_y: '', is_active: true, sort_order: 99,
};

export default function TreatmentServiceForm({ service }: { service?: ServiceData }) {
  const isNew = !service?.id;
  const router = useRouter();

  const [form, setForm] = useState<ServiceData>(service || EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function updateField(key: keyof ServiceData, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function updateStep(idx: number, field: keyof QuyTrinhBuoc, value: string) {
    const updated = [...form.quy_trinh];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm(prev => ({ ...prev, quy_trinh: updated }));
  }

  function addStep() {
    setForm(prev => ({ ...prev, quy_trinh: [...prev.quy_trinh, { buoc: '', thoi_gian: '', dinh_luong: '', san_pham: '' }] }));
  }

  function removeStep(idx: number) {
    setForm(prev => ({ ...prev, quy_trinh: prev.quy_trinh.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug) { setError('Tên và slug là bắt buộc'); return; }

    setSaving(true); setError('');
    const payload = { ...form, quy_trinh: form.quy_trinh.filter(s => s.buoc.trim()) };

    const url = isNew ? '/api/admin/treatment-services' : `/api/admin/treatment-services/${service!.id}`;
    const method = isNew ? 'POST' : 'PATCH';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);

    if (res.ok) { router.push('/admin/lieu-trinh'); router.refresh(); }
    else { const data = await res.json(); setError(data.error || 'Có lỗi xảy ra'); }
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/lieu-trinh" className="text-gray-400 hover:text-gray-600 transition">← Quay lại</Link>
        <h1 className="text-2xl font-black text-gray-900">{isNew ? 'Thêm Liệu Trình Mới' : `Sửa: ${form.name}`}</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-black text-gray-800 text-sm uppercase tracking-wider">Thông tin cơ bản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tên liệu trình *</label>
              <input type="text" required value={form.name} onChange={e => updateField('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Slug *</label>
              <input type="text" required value={form.slug} onChange={e => updateField('slug', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nhóm</label>
              <select value={form.category} onChange={e => updateField('category', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Icon</label>
              <input type="text" value={form.icon} onChange={e => updateField('icon', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tổng thời gian</label>
              <input type="text" value={form.tong_thoi_gian} onChange={e => updateField('tong_thoi_gian', e.target.value)}
                placeholder="VD: ~75 phút"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Thứ tự</label>
              <input type="number" value={form.sort_order} onChange={e => updateField('sort_order', Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
            <textarea value={form.mo_ta} onChange={e => updateField('mo_ta', e.target.value)} rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lưu ý</label>
            <input type="text" value={form.luu_y} onChange={e => updateField('luu_y', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={form.is_active} onChange={e => updateField('is_active', e.target.checked)} className="w-4 h-4 rounded" />
            <label className="text-sm font-semibold text-gray-700">Hiển thị trên website</label>
          </div>
        </div>

        {/* Quy trình */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-gray-800 text-sm uppercase tracking-wider">Quy Trình Thực Hiện</h2>
            <button type="button" onClick={addStep} className="text-primary text-xs font-bold hover:underline">+ Thêm bước</button>
          </div>

          {form.quy_trinh.map((step, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary">Bước {idx + 1}</span>
                {form.quy_trinh.length > 1 && (
                  <button type="button" onClick={() => removeStep(idx)} className="text-red-400 text-xs hover:text-red-600">Xóa</button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Tên bước</label>
                  <input type="text" value={step.buoc} onChange={e => updateStep(idx, 'buoc', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Thời gian</label>
                  <input type="text" value={step.thoi_gian} onChange={e => updateStep(idx, 'thoi_gian', e.target.value)}
                    placeholder="VD: 5p"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Định lượng</label>
                  <input type="text" value={step.dinh_luong} onChange={e => updateStep(idx, 'dinh_luong', e.target.value)}
                    placeholder="VD: 3 ml"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sản phẩm</label>
                <input type="text" value={step.san_pham} onChange={e => updateStep(idx, 'san_pham', e.target.value)}
                  placeholder="VD: Tẩy trang Sensitive Cleansing Milk"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50">
            {saving ? 'Đang lưu...' : isNew ? 'Tạo Liệu Trình' : 'Lưu Thay Đổi'}
          </button>
          <Link href="/admin/lieu-trinh" className="border border-gray-200 text-gray-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition">Hủy</Link>
        </div>
      </form>
    </div>
  );
}
