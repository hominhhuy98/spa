'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AppointmentActions from './AppointmentActions';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
  assigned_staff: string[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-800' },
  done:      { label: 'Hoàn thành',   color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã huỷ',       color: 'bg-red-100 text-red-800' },
};

const PAGE_SIZE = 30;

export default function AppointmentListClient({
  appointments,
  expiredCount,
  today,
}: {
  appointments: Appointment[];
  expiredCount: number;
  today: string;
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = appointments;

    // Filter status
    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter);
    }

    // Filter search (tên hoặc SĐT)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.service.toLowerCase().includes(q)
      );
    }

    // Filter date range
    if (dateFrom) {
      result = result.filter(a => a.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter(a => a.date <= dateTo);
    }

    return result;
  }, [appointments, statusFilter, search, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page khi filter thay đổi
  function updateFilter(fn: () => void) {
    fn();
    setPage(1);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-black text-gray-900">Lịch Hẹn</h1>
        <div className="flex items-center gap-3">
          {expiredCount > 0 && (
            <span className="text-xs text-gray-400">Đã tự động hủy {expiredCount} lịch quá hạn</span>
          )}
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
            {filtered.length} kết quả
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 space-y-3">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'done', 'cancelled'].map(s => (
            <button key={s} onClick={() => updateFilter(() => setStatusFilter(s))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                statusFilter === s
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}>
              {s === 'all' ? `Tất cả (${appointments.length})` : `${STATUS_LABELS[s]?.label} (${appointments.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Search + Date filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, dịch vụ..."
              value={search}
              onChange={e => updateFilter(() => setSearch(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="date"
              value={dateFrom}
              onChange={e => updateFilter(() => setDateFrom(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              title="Từ ngày"
            />
          </div>
          <div>
            <input
              type="date"
              value={dateTo}
              onChange={e => updateFilter(() => setDateTo(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              title="Đến ngày"
            />
          </div>
        </div>

        {/* Clear filters */}
        {(search || dateFrom || dateTo || statusFilter !== 'all') && (
          <button onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); setStatusFilter('all'); setPage(1); }}
            className="text-xs text-primary font-semibold hover:underline">
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-600">Khách hàng</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Dịch vụ</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Ngày / Giờ</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Phụ trách</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map((a) => {
              const isPast = a.date < today;
              return (
                <tr key={a.id} className={`hover:bg-gray-50 transition ${isPast && a.status === 'pending' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{a.service}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <p className={isPast && a.status === 'pending' ? 'text-red-500' : ''}>{a.date}</p>
                    {a.time ? <p className="text-xs text-gray-400">{a.time.slice(0, 5)}</p> : null}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{a.assigned_staff.join(', ') || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABELS[a.status]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[a.status]?.label ?? a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {a.status === 'pending' && <AppointmentActions id={a.id} />}
                      <Link href={`/admin/lich-hen/${a.id}`} className="text-primary text-xs font-semibold hover:underline">
                        Chi tiết
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">Không có lịch hẹn nào</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">
            Trang {page}/{totalPages} — Hiện {paginated.length}/{filtered.length} lịch hẹn
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition">
              ← Trước
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2;
              if (p < 1 || p > totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                    p === page ? 'bg-primary text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition">
              Sau →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
