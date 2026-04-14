'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ServiceGroup {
  group: string;
  items: string[];
}

interface Props {
  backHref: string;
}

export default function WalkInModal({ backHref }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([]);

  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [service, setService] = useState('');
  const [custom,  setCustom]  = useState('');
  const [time,    setTime]    = useState('');
  const [notes,   setNotes]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // Fetch danh sách dịch vụ từ Firestore khi modal mở
  useEffect(() => {
    if (open) {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);

      if (serviceGroups.length === 0) {
        fetch('/api/admin/treatment-services')
          .then(r => r.json())
          .then(data => {
            if (data.services) {
              const grouped = new Map<string, string[]>();
              const CAT_LABELS: Record<string, string> = {
                'cham-soc-da': '💆 Chăm Sóc Da',
                'cham-soc-da-toan-dien': '✨ CSD Toàn Diện',
                'da-mun-face': '🔬 Mụn Face',
                'da-mun-body': '🔬 Mụn Body',
                'da-nhay-cam': '🛡️ Da Nhạy Cảm',
                'chemical-peel': '🧪 Chemical Peel',
              };
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data.services.forEach((s: any) => {
                if (s.category === 'quy-trinh-co-dinh') return;
                const cat = CAT_LABELS[s.category] || s.category;
                if (!grouped.has(cat)) grouped.set(cat, []);
                grouped.get(cat)!.push(s.name);
              });
              setServiceGroups(Array.from(grouped.entries()).map(([group, items]) => ({ group, items })));
            }
          })
          .catch(() => {});
      }
    }
  }, [open, serviceGroups.length]);

  function reset() {
    setName(''); setPhone(''); setService(''); setCustom('');
    setNotes(''); setError(''); setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const finalService = service === 'Khác' ? custom.trim() : service;
    if (!finalService) { setError('Vui lòng chọn hoặc nhập dịch vụ.'); return; }

    setLoading(true);
    const res = await fetch('/api/staff/walk-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, service: finalService, time, notes }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? 'Có lỗi xảy ra.');
      return;
    }

    reset();
    setOpen(false);
    router.push(`${backHref}/${json.id}`);
    router.refresh();
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB)', boxShadow: '0 4px 14px #1E3A5F33' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
        Tiếp nhận khách walk-in
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) { setOpen(false); reset(); } }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Header */}
            <div className="px-7 pt-7 pb-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Tiếp nhận khách đến trực tiếp</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Lịch hẹn sẽ được xác nhận ngay hôm nay</p>
                </div>
                <button
                  onClick={() => { setOpen(false); reset(); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">

              {error && (
                <div className="text-sm px-4 py-3 rounded-xl border"
                  style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}>
                  {error}
                </div>
              )}

              {/* Tên + SĐT */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{ border: '1.5px solid #BFDBFE', backgroundColor: '#FAFAF8' }}
                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                    onBlur={e => e.target.style.borderColor = '#BFDBFE'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    required value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="0912 345 678" type="tel"
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{ border: '1.5px solid #BFDBFE', backgroundColor: '#FAFAF8' }}
                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                    onBlur={e => e.target.style.borderColor = '#BFDBFE'}
                  />
                </div>
              </div>

              {/* Dịch vụ */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Dịch vụ <span className="text-red-500">*</span>
                </label>
                <select
                  value={service} onChange={e => setService(e.target.value)} required
                  className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                  style={{ border: '1.5px solid #BFDBFE', backgroundColor: '#FAFAF8' }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#BFDBFE'}
                >
                  <option value="">— Chọn dịch vụ —</option>
                  {serviceGroups.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.items.map(item => <option key={item} value={item}>{item}</option>)}
                    </optgroup>
                  ))}
                  <option value="Khác">Khác (nhập tay)</option>
                </select>
              </div>

              {/* Dịch vụ khác */}
              {service === 'Khác' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nhập tên dịch vụ</label>
                  <input
                    value={custom} onChange={e => setCustom(e.target.value)}
                    placeholder="Nhập tên dịch vụ cụ thể..."
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{ border: '1.5px solid #BFDBFE', backgroundColor: '#FAFAF8' }}
                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                    onBlur={e => e.target.style.borderColor = '#BFDBFE'}
                  />
                </div>
              )}

              {/* Giờ tiếp nhận */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Giờ tiếp nhận</label>
                <input
                  type="time" value={time} onChange={e => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                  style={{ border: '1.5px solid #BFDBFE', backgroundColor: '#FAFAF8' }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#BFDBFE'}
                />
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ghi chú ban đầu</label>
                <textarea
                  value={notes} onChange={e => setNotes(e.target.value)}
                  rows={2} placeholder="Triệu chứng, lý do đến khám..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all resize-none"
                  style={{ border: '1.5px solid #BFDBFE', backgroundColor: '#FAFAF8' }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#BFDBFE'}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setOpen(false); reset(); }}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Huỷ
                </button>
                <button
                  type="submit" disabled={loading}
                  className="flex-1 py-3 rounded-2xl text-white text-sm font-bold transition-all disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB)' }}
                >
                  {loading ? 'Đang tạo...' : 'Tiếp nhận ngay →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
