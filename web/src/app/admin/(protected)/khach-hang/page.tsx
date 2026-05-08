'use client';

import { useState } from 'react';
import Link from 'next/link';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-800' },
  done:      { label: 'Hoàn thành',   color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã huỷ',       color: 'bg-red-100 text-red-800' },
};

const PAGE_SIZE = 30;

interface ZaloCustomer {
  id: string;
  full_name: string;
  zalo_id: string;
  email: string;
}

export default function KhachHangPage() {
  const [searchType, setSearchType] = useState<'phone' | 'name'>('phone');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Record<string, string>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  // Zalo linking state
  const [zaloCustomers, setZaloCustomers] = useState<ZaloCustomer[]>([]);
  const [zaloLoading, setZaloLoading] = useState(false);
  const [linkPhone, setLinkPhone] = useState<Record<string, string>>({});
  const [linkMsg, setLinkMsg] = useState<Record<string, string>>({});

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    setPage(1);

    const param = searchType === 'phone'
      ? `phone=${encodeURIComponent(query)}`
      : `name=${encodeURIComponent(query)}`;

    const res = await fetch(`/api/admin/customers/history?${param}`);
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setResults(data.appointments);
    } else {
      setError('Không thể tra cứu. Vui lòng thử lại.');
    }
  }

  const totalPages = results ? Math.ceil(results.length / PAGE_SIZE) : 0;
  const paginated = results ? results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Tra Cứu Khách Hàng</h1>

      {/* Search form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          {/* Toggle search type */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            <button type="button" onClick={() => setSearchType('phone')}
              className={`px-4 py-2.5 text-xs font-bold transition ${
                searchType === 'phone' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              SĐT
            </button>
            <button type="button" onClick={() => setSearchType('name')}
              className={`px-4 py-2.5 text-xs font-bold transition ${
                searchType === 'name' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              Tên
            </button>
          </div>
          <input
            type="text" required
            placeholder={searchType === 'phone' ? 'Nhập số điện thoại...' : 'Nhập tên khách hàng...'}
            value={query} onChange={e => setQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" disabled={loading}
            className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm">
            {loading ? 'Đang tìm...' : 'Tra cứu'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {/* Results */}
      {results !== null && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              {results.length > 0
                ? `Tìm thấy ${results.length} lịch hẹn`
                : 'Không tìm thấy kết quả'}
            </p>
            {results.length > 0 && (
              <span className="text-xs text-gray-400">Trang {page}/{totalPages}</span>
            )}
          </div>
          {paginated.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Tên</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">SĐT</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Dịch vụ</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Ngày</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                    <td className="px-4 py-3 text-gray-500">{a.phone}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{a.service}</td>
                    <td className="px-4 py-3 text-gray-500">{a.date}{a.time ? ` ${a.time}` : ''}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABELS[a.status]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[a.status]?.label ?? a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/lich-hen/${a.id}`} className="text-primary text-xs font-semibold hover:underline">
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30">
                ← Trước
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page + i - 2;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                      p === page ? 'bg-primary text-white' : 'border border-gray-200 hover:bg-gray-50'
                    }`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30">
                Sau →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Khách Zalo chưa liên kết SĐT ── */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">Khách Zalo chưa liên kết SĐT</h2>
          <button
            onClick={async () => {
              setZaloLoading(true);
              const res = await fetch('/api/admin/customers/unlinked-zalo');
              if (res.ok) {
                const data = await res.json();
                setZaloCustomers(data.customers);
              }
              setZaloLoading(false);
            }}
            disabled={zaloLoading}
            className="bg-gray-800 text-white font-bold px-4 py-2 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm">
            {zaloLoading ? 'Đang tải...' : 'Tải danh sách'}
          </button>
        </div>

        {zaloCustomers.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Tên Zalo</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Zalo ID</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Liên kết SĐT</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {zaloCustomers.map(c => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{c.full_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{c.zalo_id}</td>
                    <td className="px-4 py-3">
                      <input type="tel" placeholder="0901 234 567"
                        value={linkPhone[c.id] || ''} onChange={e => setLinkPhone(prev => ({ ...prev, [c.id]: e.target.value }))}
                        className="w-40 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={async () => {
                        const p = linkPhone[c.id];
                        if (!p?.trim()) return;
                        setLinkMsg(prev => ({ ...prev, [c.id]: '...' }));
                        const res = await fetch('/api/admin/customers/link-phone', {
                          method: 'POST', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ user_id: c.id, phone: p.trim() }),
                        });
                        const data = await res.json();
                        setLinkMsg(prev => ({ ...prev, [c.id]: res.ok ? 'Đã liên kết' : data.error || 'Lỗi' }));
                        if (res.ok) setZaloCustomers(prev => prev.filter(x => x.id !== c.id));
                      }}
                        className="px-3 py-1.5 bg-[#2C5F5D] text-white text-xs font-bold rounded-lg hover:opacity-90 transition">
                        Liên kết
                      </button>
                      {linkMsg[c.id] && (
                        <span className={`ml-2 text-xs font-medium ${linkMsg[c.id] === 'Đã liên kết' ? 'text-green-600' : 'text-red-500'}`}>
                          {linkMsg[c.id]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {zaloCustomers.length === 0 && !zaloLoading && (
          <p className="text-sm text-gray-400">Nhấn "Tải danh sách" để xem khách Zalo chưa liên kết SĐT.</p>
        )}
      </div>
    </div>
  );
}
