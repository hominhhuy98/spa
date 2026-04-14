'use client';

import { useState } from 'react';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-800' },
  done:      { label: 'Hoàn thành',   color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã huỷ',       color: 'bg-red-100 text-red-800' },
};

interface ZaloCustomer {
  id: string;
  full_name: string;
  zalo_id: string;
  email: string;
}

export default function KhachHangPage() {
  const [phone, setPhone] = useState('');
  const [results, setResults] = useState<Record<string, string>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Zalo linking state
  const [zaloCustomers, setZaloCustomers] = useState<ZaloCustomer[]>([]);
  const [zaloLoading, setZaloLoading] = useState(false);
  const [linkPhone, setLinkPhone] = useState<Record<string, string>>({});
  const [linkMsg, setLinkMsg] = useState<Record<string, string>>({});

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);
    const res = await fetch(`/api/admin/customers/history?phone=${encodeURIComponent(phone)}`);
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setResults(data.appointments);
    } else {
      setError('Không thể tra cứu. Vui lòng thử lại.');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Tra Cứu Khách Hàng</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6 max-w-md">
        <input
          type="tel" required placeholder="Nhập số điện thoại..."
          value={phone} onChange={e => setPhone(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" disabled={loading}
          className="bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm">
          {loading ? 'Đang tìm...' : 'Tra cứu'}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {results !== null && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-700">
              {results.length > 0
                ? `Tìm thấy ${results.length} lịch hẹn cho SĐT ${phone}`
                : `Không có lịch hẹn nào cho SĐT ${phone}`}
            </p>
          </div>
          {results.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Tên</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Dịch vụ</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Ngày</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map(a => (
                  <tr key={a.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{a.service}</td>
                    <td className="px-4 py-3 text-gray-500">{a.date}{a.time ? ` ${a.time}` : ''}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABELS[a.status]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[a.status]?.label ?? a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {/* ── Khách Zalo chưa liên kết SĐT ──────────────────────────────── */}
      <div className="mt-8">
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
                      <input
                        type="tel" placeholder="0901 234 567"
                        value={linkPhone[c.id] || ''}
                        onChange={e => setLinkPhone(prev => ({ ...prev, [c.id]: e.target.value }))}
                        className="w-40 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={async () => {
                          const p = linkPhone[c.id];
                          if (!p?.trim()) return;
                          setLinkMsg(prev => ({ ...prev, [c.id]: 'Đang liên kết...' }));
                          const res = await fetch('/api/admin/customers/link-phone', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: c.id, phone: p.trim() }),
                          });
                          const data = await res.json();
                          setLinkMsg(prev => ({
                            ...prev,
                            [c.id]: res.ok ? '✓ Đã liên kết' : data.error || 'Lỗi',
                          }));
                          if (res.ok) {
                            setZaloCustomers(prev => prev.filter(x => x.id !== c.id));
                          }
                        }}
                        className="px-3 py-1.5 bg-[#2C5F5D] text-white text-xs font-bold rounded-lg hover:opacity-90 transition">
                        Liên kết
                      </button>
                      {linkMsg[c.id] && (
                        <span className={`ml-2 text-xs font-medium ${linkMsg[c.id].includes('✓') ? 'text-green-600' : 'text-red-500'}`}>
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
