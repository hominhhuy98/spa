'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoUploader from '@/components/PhotoUploader';
import PrescriptionPanel, { type Prescription } from '@/components/PrescriptionPanel';
import TreatmentPlanPanel, { type TreatmentPlan } from '@/components/TreatmentPlanPanel';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AppointmentRow {
  id: string | number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time?: string | null;
  status: string;
  notes?: string | null;
}

interface NoteRow {
  id: string | number;
  note_text: string;
  created_at: string;
  profiles?: { full_name: string } | null;
}

interface StaffProfile {
  id: string;
  full_name: string;
}

interface Props {
  appointment: AppointmentRow;
  notes: NoteRow[];
  staffId: string;
  backHref: string;
  patientHistory?: AppointmentRow[];
  staffRole?: 'bac_si' | 'nhan_vien' | 'admin';
  staffList?: StaffProfile[];
  doctorList?: StaffProfile[];
  prescriptions?: Prescription[];
  treatmentPlans?: TreatmentPlan[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TRANSITIONS: Record<string, string[]> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['done', 'cancelled'],
};

const STATUS: Record<string, { label: string; dot: string; badge: string }> = {
  pending:   { label: 'Chờ xác nhận', dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700' },
  confirmed: { label: 'Đã xác nhận',  dot: 'bg-blue-500',   badge: 'bg-blue-50 text-blue-700'    },
  done:      { label: 'Hoàn thành',   dot: 'bg-green-500',  badge: 'bg-green-50 text-green-700'  },
  cancelled: { label: 'Đã huỷ',       dot: 'bg-red-400',    badge: 'bg-red-50 text-red-500'      },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(d: string) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

interface MedItem { name: string; dose: string; instruction: string; }

function parseNotes(notes: string | null | undefined) {
  if (!notes) return {
    staffName: '', doctorName: '', followUpDate: '', followUpNote: '',
    beforePhotos: [] as string[], afterPhotos: [] as string[],
    medications: [] as MedItem[], plainText: '',
  };

  const staffMatch    = notes.match(/Nhân viên tiếp nhận:\s*([^.[|\n\]]+)/);
  const doctorMatch   = notes.match(/Bác sĩ phụ trách:\s*([^.[|\n\]]+)/);
  const followUpMatch = notes.match(/\[TAІКHAM:(\d{4}-\d{2}-\d{2})\|([^\]]+)\]/);
  const photosMatch   = notes.match(/\[PHOTOS:before=([^|]*)\|after=([^\]]*)\]/);
  const thuocMatch    = notes.match(/\[THUOC:([^\]]+)\]/);

  const medications: MedItem[] = thuocMatch
    ? thuocMatch[1].split(';').map(s => {
        const [name = '', dose = '', instruction = ''] = s.split('|');
        return { name, dose, instruction };
      }).filter(m => m.name.trim())
    : [];

  const plain = notes
    .replace(/Nhân viên tiếp nhận:\s*[^\n.[|\]]+\.?\s*/g, '')
    .replace(/Bác sĩ phụ trách:\s*[^\n.[|\]]+\.?\s*/g, '')
    .replace(/\[TAІКHAM:[^\]]+\]/g, '')
    .replace(/\[PHOTOS:[^\]]+\]/g, '')
    .replace(/\[THUOC:[^\]]+\]/g, '')
    .trim();

  return {
    staffName:    staffMatch    ? staffMatch[1].trim().replace(/\.$/, '')  : '',
    doctorName:   doctorMatch   ? doctorMatch[1].trim().replace(/\.$/, '') : '',
    followUpDate: followUpMatch ? followUpMatch[1]        : '',
    followUpNote: followUpMatch ? followUpMatch[2].trim() : '',
    beforePhotos: photosMatch   ? photosMatch[1].split(',').filter(Boolean) : [],
    afterPhotos:  photosMatch   ? photosMatch[2].split(',').filter(Boolean) : [],
    medications,
    plainText: plain,
  };
}

function getMissing(appt: AppointmentRow) {
  const p = parseNotes(appt.notes);
  const items: string[] = [];
  if (!p.staffName)  items.push('Nhân viên tiếp nhận');
  if (!p.doctorName) items.push('Bác sĩ phụ trách');
  if (appt.status === 'done') {
    if (!p.followUpDate)        items.push('Ngày tái khám');
    if (!p.medications.length)  items.push('Đơn thuốc');
    if (!p.beforePhotos.length) items.push('Ảnh trước điều trị');
    if (!p.afterPhotos.length)  items.push('Ảnh sau điều trị');
    if (!p.plainText)           items.push('Ghi chú điều trị');
  }
  return items;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function StaffAppointmentClient({
  appointment,
  notes,
  staffId,
  backHref,
  patientHistory = [],
  staffRole = 'nhan_vien',
  staffList = [],
  doctorList = [],
  prescriptions = [],
  treatmentPlans = [],
}: Props) {
  const router  = useRouter();
  const parsed  = parseNotes(appointment.notes);

  // Status
  const [status,       setStatus]       = useState(appointment.status);
  const [statusMsg,    setStatusMsg]    = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  // Structured fields
  const [staffName,    setStaffName]    = useState(parsed.staffName);
  const [doctorName,   setDoctorName]   = useState(parsed.doctorName);
  const [followUpDate, setFollowUpDate] = useState(parsed.followUpDate);
  const [followUpNote, setFollowUpNote] = useState(parsed.followUpNote);
  const [beforePhotos, setBeforePhotos] = useState<string[]>(parsed.beforePhotos);
  const [afterPhotos,  setAfterPhotos]  = useState<string[]>(parsed.afterPhotos);
  const [medications,  setMedications]  = useState<MedItem[]>(
    parsed.medications.length > 0 ? parsed.medications : []
  );
  const [savingFields, setSavingFields] = useState(false);
  const [fieldsMsg,    setFieldsMsg]    = useState('');

  // Treatment note
  const [newNote,    setNewNote]    = useState('');
  const [localNotes, setLocalNotes] = useState(notes);
  const [addingNote, setAddingNote] = useState(false);

  // Track missing using current status (may change)
  const currentAppt = { ...appointment, status, notes: appointment.notes };
  const missing = getMissing(currentAppt);

  // ── Status change ──────────────────────────────────────────────────────────
  async function handleStatusChange(newStatus: string) {
    setSavingStatus(true); setStatusMsg('');
    const res = await fetch(`/api/portal/appointments/${appointment.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setSavingStatus(false);
    if (res.ok) { setStatus(newStatus); setStatusMsg('Đã cập nhật'); router.refresh(); }
    else setStatusMsg('Lỗi — thử lại');
  }

  // ── Save structured fields ─────────────────────────────────────────────────
  async function handleSaveFields(e: React.FormEvent) {
    e.preventDefault();
    setSavingFields(true); setFieldsMsg('');
    const res = await fetch(`/api/portal/appointments/${appointment.id}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        staffName:    staffName.trim()    || undefined,
        doctorName:   doctorName.trim()   || undefined,
        followUpDate: followUpDate        || undefined,
        followUpNote: followUpNote.trim() || undefined,
        beforePhotos,
        afterPhotos,
        medications: medications.filter(m => m.name.trim()),
      }),
    });
    setSavingFields(false);
    if (res.ok) { setFieldsMsg('Đã lưu thành công'); router.refresh(); }
    else setFieldsMsg('Lỗi — thử lại');
  }

  // ── Add treatment note ─────────────────────────────────────────────────────
  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;
    setAddingNote(true);
    const res = await fetch(`/api/portal/appointments/${appointment.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note_text: newNote }),
    });
    setAddingNote(false);
    if (res.ok) {
      const data = await res.json();
      setLocalNotes(prev => [...prev, data.note]);
      setNewNote('');
    }
  }

  const allowedNext    = TRANSITIONS[status] ?? [];
  const st             = STATUS[status] ?? STATUS.pending;
  const historyOther   = patientHistory.filter(a => a.id !== appointment.id);

  return (
    <div className="p-6 max-w-5xl">
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push(backHref)}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Quay lại</button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-gray-900 truncate">{appointment.service}</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {appointment.name} · {appointment.phone} · {fmt(appointment.date)}
          </p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${st.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── LEFT: Patient profile + history ─────────────────────────── */}
        <div className="xl:col-span-1 space-y-4">

          {/* Patient card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#2C5F5D] flex items-center justify-center shrink-0">
                <span className="text-white font-black text-base">
                  {appointment.name.split(' ').slice(-2).map((w: string) => w[0]).join('').toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-black text-gray-900">{appointment.name}</p>
                <p className="text-xs text-gray-500">{appointment.phone}</p>
              </div>
            </div>
            <dl className="space-y-1.5 text-sm">
              {[
                ['Dịch vụ', appointment.service],
                ['Ngày',    fmt(appointment.date)],
                ['Giờ',     appointment.time?.slice(0,5) ?? '—'],
              ].map(([l, v]) => (
                <div key={l} className="flex gap-2">
                  <dt className="text-gray-400 w-16 shrink-0 text-xs pt-0.5">{l}</dt>
                  <dd className="font-medium text-gray-800 flex-1 text-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Missing checklist */}
          {missing.length > 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                ⚠ Còn thiếu ({missing.length})
              </p>
              <ul className="space-y-1.5">
                {missing.map(m => (
                  <li key={m} className="flex items-center gap-2 text-xs text-amber-800">
                    <span className="w-3 h-3 rounded-full border border-amber-400 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-green-700">✓ Hồ sơ đầy đủ thông tin</p>
            </div>
          )}

          {/* Patient history */}
          {historyOther.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-xs font-black text-gray-700 uppercase tracking-wide">
                  Lịch sử — {patientHistory.length} lần khám
                </p>
              </div>
              <div className="divide-y divide-gray-50">
                {historyOther.map(a => {
                  const s = STATUS[a.status] ?? STATUS.pending;
                  return (
                    <a key={a.id} href={`${backHref}/${a.id}`}
                      className="flex items-start gap-2.5 px-4 py-3 hover:bg-gray-50 transition-colors group">
                      <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${s.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-[#2C5F5D]">
                          {a.service}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{fmt(a.date)}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${s.badge}`}>
                        {s.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Editor ────────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-4">

          {/* Status update */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-black text-xs text-gray-500 uppercase tracking-wide mb-3">Cập nhật trạng thái</h2>
            <div className="flex flex-wrap gap-2">
              {allowedNext.map(s => (
                <button key={s} onClick={() => handleStatusChange(s)} disabled={savingStatus}
                  className="px-4 py-2 bg-[#2C5F5D] text-white text-sm font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50">
                  {STATUS[s]?.label}
                </button>
              ))}
              {allowedNext.length === 0 && (
                <p className="text-xs text-gray-400">Không thể thay đổi trạng thái này</p>
              )}
            </div>
            {statusMsg && (
              <p className={`mt-2 text-xs font-medium ${statusMsg.includes('Lỗi') ? 'text-red-500' : 'text-green-600'}`}>
                {statusMsg}
              </p>
            )}
          </div>

          {/* Structured info editor */}
          <form onSubmit={handleSaveFields} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h2 className="font-black text-xs text-gray-500 uppercase tracking-wide">Thông tin hồ sơ</h2>

            {/* Staff + Doctor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">🙋 Nhân viên tiếp nhận</label>
                {staffList.length > 0 ? (
                  <select value={staffName} onChange={e => setStaffName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30 bg-white">
                    <option value="">— Chọn nhân viên —</option>
                    {staffList.map(s => (
                      <option key={s.id} value={s.full_name}>{s.full_name}</option>
                    ))}
                  </select>
                ) : (
                  <input type="text" value={staffName} onChange={e => setStaffName(e.target.value)}
                    placeholder="VD: Trần Minh Tú"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">👨‍⚕️ Bác sĩ phụ trách</label>
                {doctorList.length > 0 ? (
                  <select value={doctorName} onChange={e => setDoctorName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30 bg-white">
                    <option value="">— Chọn bác sĩ —</option>
                    {doctorList.map(d => (
                      <option key={d.id} value={d.full_name}>{d.full_name}</option>
                    ))}
                  </select>
                ) : (
                  <input type="text" value={doctorName} onChange={e => setDoctorName(e.target.value)}
                    placeholder="VD: BS. Nguyễn Thị Lan"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
                )}
              </div>
            </div>

            {/* Follow-up */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">🔁 Ngày tái khám</label>
                <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú tái khám</label>
                <input type="text" value={followUpNote} onChange={e => setFollowUpNote(e.target.value)}
                  placeholder="VD: Kiểm tra sau điều trị"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30" />
              </div>
            </div>

            {/* Đơn thuốc */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-600">💊 Đơn thuốc</label>
                <button type="button"
                  onClick={() => setMedications(prev => [...prev, { name: '', dose: '', instruction: '' }])}
                  className="text-xs font-bold text-[#2C5F5D] hover:underline">
                  + Thêm thuốc
                </button>
              </div>

              {medications.length === 0 && (
                <p className="text-xs text-gray-400 italic py-2">Chưa có thuốc nào — bấm "+ Thêm thuốc" để kê đơn</p>
              )}

              <div className="space-y-2">
                {medications.map((med, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-3 relative">
                    <button type="button" onClick={() => setMedications(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-100 text-red-500 text-xs font-bold hover:bg-red-200 transition-colors flex items-center justify-center">
                      ×
                    </button>
                    <div className="grid grid-cols-3 gap-2 pr-6">
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold mb-1">Tên thuốc *</p>
                        <input
                          type="text"
                          value={med.name}
                          placeholder="VD: Tretinoin 0.025%"
                          onChange={e => setMedications(prev => prev.map((m, i) => i === idx ? { ...m, name: e.target.value } : m))}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2C5F5D]/30"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold mb-1">Liều dùng</p>
                        <input
                          type="text"
                          value={med.dose}
                          placeholder="VD: 1 lần / ngày"
                          onChange={e => setMedications(prev => prev.map((m, i) => i === idx ? { ...m, dose: e.target.value } : m))}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2C5F5D]/30"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold mb-1">Hướng dẫn</p>
                        <input
                          type="text"
                          value={med.instruction}
                          placeholder="VD: Bôi tối, tránh nắng"
                          onChange={e => setMedications(prev => prev.map((m, i) => i === idx ? { ...m, instruction: e.target.value } : m))}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#2C5F5D]/30"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="grid grid-cols-2 gap-3">
              <PhotoUploader
                appointmentId={appointment.id}
                type="before"
                initialUrls={beforePhotos}
                onUrlsChange={setBeforePhotos}
                label="📸 Ảnh trước điều trị"
                colorClass="border-orange-300 text-orange-600 hover:bg-orange-50"
              />
              <PhotoUploader
                appointmentId={appointment.id}
                type="after"
                initialUrls={afterPhotos}
                onUrlsChange={setAfterPhotos}
                label="✨ Ảnh sau điều trị"
                colorClass="border-teal-300 text-teal-600 hover:bg-teal-50"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {fieldsMsg ? (
                <p className={`text-xs font-medium ${fieldsMsg.includes('Lỗi') ? 'text-red-500' : 'text-green-600'}`}>
                  {fieldsMsg}
                </p>
              ) : <span />}
              <button type="submit" disabled={savingFields}
                className="px-5 py-2 bg-[#2C5F5D] text-white text-sm font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50">
                {savingFields ? 'Đang lưu...' : 'Lưu hồ sơ'}
              </button>
            </div>
          </form>

          {/* Module Thuốc */}
          <PrescriptionPanel
            appointmentId={appointment.id}
            initialPrescriptions={prescriptions}
            canEdit={staffRole === 'bac_si'}
          />

          {/* Module Điều Trị */}
          <TreatmentPlanPanel
            appointmentId={appointment.id}
            initialPlans={treatmentPlans}
            canEdit={staffRole === 'bac_si'}
          />

          {/* Treatment notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-black text-xs text-gray-500 uppercase tracking-wide mb-3">📋 Ghi chú điều trị</h2>
            <div className="space-y-2 mb-4">
              {localNotes.map(n => (
                <div key={n.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#2C5F5D]">{n.profiles?.full_name ?? 'Nhân viên'}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(n.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{n.note_text}</p>
                </div>
              ))}
              {!localNotes.length && <p className="text-xs text-gray-400 py-1">Chưa có ghi chú nào</p>}
            </div>
            <form onSubmit={handleAddNote} className="flex gap-2">
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                placeholder="Thêm ghi chú điều trị..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2C5F5D]/30 resize-none h-16" />
              <button type="submit" disabled={addingNote || !newNote.trim()}
                className="px-4 bg-gray-800 text-white text-sm font-bold rounded-xl hover:opacity-90 transition disabled:opacity-40 self-end py-2">
                {addingNote ? '...' : 'Thêm'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
