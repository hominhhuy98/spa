'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TreatmentService {
  id: string;
  name: string;
  slug: string;
  icon: string;
  category: string;
  tong_thoi_gian: string;
  is_active: boolean;
  sort_order: number;
  quy_trinh: Array<{ buoc: string; thoi_gian: string; dinh_luong: string; san_pham: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  'quy-trinh-co-dinh': 'Quy trình cố định',
  'cham-soc-da': 'Chăm sóc da',
  'cham-soc-da-toan-dien': 'CSD Toàn diện',
  'da-mun-face': 'Da mụn (Face)',
  'da-mun-body': 'Da mụn (Body)',
  'da-nhay-cam': 'Da nhạy cảm',
  'chemical-peel': 'Chemical Peel',
};

export default function TreatmentServiceList({ initialServices }: { initialServices: TreatmentService[] }) {
  const [services, setServices] = useState(initialServices);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm('Bạn chắc chắn muốn xóa liệu trình này?')) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/treatment-services/${id}`, { method: 'DELETE' });
    if (res.ok) setServices(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
    router.refresh();
  }

  async function handleToggle(id: string, currentActive: boolean) {
    await fetch(`/api/admin/treatment-services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !currentActive }),
    });
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentActive } : s));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left">
            <th className="px-4 py-3 font-semibold text-gray-600 w-10">#</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Liệu trình</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Nhóm</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Thời gian</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Bước</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {services.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 text-gray-400">{s.sort_order}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <p className="font-semibold text-gray-900">{s.name}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{CATEGORY_LABELS[s.category] || s.category}</span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">{s.tong_thoi_gian}</td>
              <td className="px-4 py-3 text-gray-600 text-xs">{s.quy_trinh?.length || 0} bước</td>
              <td className="px-4 py-3">
                <button onClick={() => handleToggle(s.id, s.is_active)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer ${
                    s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                  {s.is_active ? 'Hiện' : 'Ẩn'}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/lieu-trinh/${s.id}`} className="text-primary text-xs font-semibold hover:underline">Sửa</Link>
                  <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                    className="text-red-500 text-xs font-semibold hover:underline disabled:opacity-50">
                    {deleting === s.id ? '...' : 'Xóa'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {services.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-10">Chưa có liệu trình nào</p>
      )}
    </div>
  );
}
