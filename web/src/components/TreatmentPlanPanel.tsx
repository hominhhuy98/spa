'use client';

import { useState } from 'react';

export interface TreatmentPlan {
  id: string | number;
  diagnosis: string | null;
  plan_detail: string | null;
  sessions_total: number;
  sessions_done: number;
  next_session_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profiles: { full_name: string } | null;
}

interface Props {
  appointmentId: string | number;
  initialPlans: TreatmentPlan[];
  canEdit: boolean;
}

function fmt(d: string) {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function fmtDt(d: string) {
  return new Date(d).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}

export default function TreatmentPlanPanel({ appointmentId, initialPlans, canEdit }: Props) {
  const [plans, setPlans]       = useState<TreatmentPlan[]>(initialPlans);
  const [open, setOpen]         = useState(false);
  const [diagnosis, setDiagnosis]       = useState('');
  const [planDetail, setPlanDetail]     = useState('');
  const [sessionsTotal, setSessionsTotal] = useState(1);
  const [nextDate, setNextDate]         = useState('');
  const [notes, setNotes]               = useState('');
  const [saving, setSaving]             = useState(false);
  const [msg, setMsg]                   = useState('');

  // Per-plan session update state
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg('');
    const res = await fetch('/api/treatment-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointment_id:    appointmentId,
        diagnosis:         diagnosis     || null,
        plan_detail:       planDetail    || null,
        sessions_total:    sessionsTotal,
        next_session_date: nextDate      || null,
        notes:             notes         || null,
      }),
    });
    if (res.ok) {
      const r2 = await fetch(`/api/treatment-plans?appointment_id=${appointmentId}`);
      if (r2.ok) { const d = await r2.json(); setPlans(d.plans); }
      setOpen(false);
      setDiagnosis(''); setPlanDetail(''); setSessionsTotal(1); setNextDate(''); setNotes('');
      setMsg('Đã tạo phác đồ');
    } else {
      const err = await res.json(); setMsg(err.error || 'Lỗi — thử lại');
    }
    setSaving(false);
  }

  async function handleUpdateSession(plan: TreatmentPlan, delta: number) {
    const newDone = Math.min(Math.max(plan.sessions_done + delta, 0), plan.sessions_total);
    setUpdatingId(plan.id);
    const res = await fetch('/api/treatment-plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: plan.id, sessions_done: newDone }),
    });
    if (res.ok) {
      setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, sessions_done: newDone } : p));
    }
    setUpdatingId(null);
  }

  async function handleUpdateNextDate(plan: TreatmentPlan, date: string) {
    await fetch('/api/treatment-plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: plan.id, next_session_date: date || null }),
    });
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, next_session_date: date || null } : p));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-xs text-gray-500 uppercase tracking-wide">🩺 Module Điều Trị</h2>
        {canEdit && (
          <button onClick={() => setOpen(o => !o)}
            className="text-xs font-bold text-[#2C5F5D] hover:underline">
            {open ? '✕ Đóng' : '+ Tạo phác đồ'}
          </button>
        )}
      </div>

      {/* Form tạo phác đồ — bác sĩ */}
      {canEdit && open && (
        <form onSubmit={handleCreate} className="space-y-3 border border-dashed border-[#2C5F5D]/30 rounded-xl p-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Chẩn đoán</label>
            <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
              placeholder="VD: Mụn trứng cá viêm độ III, nám má hai bên..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Phác đồ điều trị</label>
            <textarea value={planDetail} onChange={e => setPlanDetail(e.target.value)}
              placeholder="Mô tả chi tiết phác đồ, liệu trình, phương pháp điều trị..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30 resize-none h-24" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tổng số buổi</label>
              <input type="number" min={1} max={100} value={sessionsTotal}
                onChange={e => setSessionsTotal(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Buổi tiếp theo</label>
              <input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Lưu ý đặc biệt, chống chỉ định, dặn dò bệnh nhân..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30 resize-none h-16" />
          </div>

          <div className="flex items-center justify-between">
            {msg && <p className={`text-xs font-medium ${msg.includes('Lỗi') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
            <button type="submit" disabled={saving}
              className="ml-auto px-5 py-2 bg-[#2C5F5D] text-white text-sm font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50">
              {saving ? 'Đang lưu...' : 'Lưu phác đồ'}
            </button>
          </div>
        </form>
      )}

      {/* Danh sách phác đồ */}
      {plans.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-1">
          {canEdit ? 'Chưa có phác đồ nào — bấm "+ Tạo phác đồ" để bắt đầu' : 'Bác sĩ chưa tạo phác đồ điều trị cho lượt khám này'}
        </p>
      ) : (
        <div className="space-y-3">
          {plans.map(plan => {
            const pct = plan.sessions_total > 0 ? Math.round((plan.sessions_done / plan.sessions_total) * 100) : 0;
            const done = plan.sessions_done >= plan.sessions_total;
            return (
              <div key={plan.id} className="border border-gray-100 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-teal-50 px-4 py-2.5 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-black text-teal-800">
                      BS. {plan.profiles?.full_name ?? 'N/A'} — {fmtDt(plan.created_at)}
                    </p>
                    {plan.diagnosis && (
                      <p className="text-xs text-teal-700 mt-0.5">Chẩn đoán: {plan.diagnosis}</p>
                    )}
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${done ? 'bg-green-100 text-green-700' : 'bg-teal-100 text-teal-700'}`}>
                    {done ? 'Hoàn thành' : 'Đang điều trị'}
                  </span>
                </div>

                <div className="px-4 py-3 space-y-3">
                  {/* Phác đồ */}
                  {plan.plan_detail && (
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Phác đồ</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{plan.plan_detail}</p>
                    </div>
                  )}

                  {/* Progress sessions */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                        Tiến độ buổi
                      </p>
                      <span className="text-xs font-black text-gray-700">
                        {plan.sessions_done}/{plan.sessions_total} buổi ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all ${done ? 'bg-green-500' : 'bg-[#2C5F5D]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {canEdit && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateSession(plan, -1)}
                          disabled={plan.sessions_done <= 0 || updatingId === plan.id}
                          className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 disabled:opacity-30 transition">
                          −
                        </button>
                        <span className="text-xs text-gray-500 flex-1 text-center">
                          {updatingId === plan.id ? 'Đang lưu...' : `Buổi ${plan.sessions_done}`}
                        </span>
                        <button
                          onClick={() => handleUpdateSession(plan, 1)}
                          disabled={plan.sessions_done >= plan.sessions_total || updatingId === plan.id}
                          className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 disabled:opacity-30 transition">
                          +
                        </button>
                      </div>
                    )}
                    {!canEdit && (
                      <p className="text-xs text-gray-500 text-center">Buổi {plan.sessions_done} / {plan.sessions_total}</p>
                    )}
                  </div>

                  {/* Buổi tiếp theo */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Buổi tiếp theo</p>
                      {canEdit ? (
                        <input type="date" defaultValue={plan.next_session_date ?? ''}
                          onBlur={e => handleUpdateNextDate(plan, e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">
                          {plan.next_session_date ? fmt(plan.next_session_date) : '—'}
                        </p>
                      )}
                    </div>
                    {plan.notes && (
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Ghi chú</p>
                        <p className="text-xs text-gray-700">{plan.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
