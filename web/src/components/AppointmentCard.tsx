'use client';

import { useState } from 'react';

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; bar: string; icon: string }> = {
  pending:   { label: 'Chờ xác nhận', bg: 'bg-yellow-50',  text: 'text-yellow-700',  bar: 'bg-yellow-400', icon: '🕐' },
  confirmed: { label: 'Đã xác nhận',  bg: 'bg-blue-50',    text: 'text-blue-700',    bar: 'bg-blue-500',   icon: '✅' },
  done:      { label: 'Hoàn thành',   bg: 'bg-green-50',   text: 'text-green-700',   bar: 'bg-green-500',  icon: '✔️' },
  cancelled: { label: 'Đã huỷ',       bg: 'bg-red-50',     text: 'text-red-600',     bar: 'bg-red-400',    icon: '✕' },
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  const days = ['CN','T2','T3','T4','T5','T6','T7'];
  const dow = days[new Date(`${y}-${m}-${d}`).getDay()];
  return `${dow}, ${d}/${m}/${y}`;
}

interface MedItem { name: string; dose: string; instruction: string; }

function parseNotes(notes: string | null) {
  if (!notes) return { staff: null, doctor: null, detail: null, followUpDate: null, followUpNote: null, photosBefore: [], photosAfter: [], medications: [] as MedItem[] };

  const staffMatch  = notes.match(/Nhân viên tiếp nhận:\s*([^.[|\n\]]+)/);
  const doctorMatch = notes.match(/Bác sĩ phụ trách:\s*([^.[|\n\]]+)/);
  const thuocMatch  = notes.match(/\[THUOC:([^\]]+)\]/);
  const staff  = staffMatch  ? staffMatch[1].trim().replace(/\.$/, '')  : null;
  const doctor = doctorMatch ? doctorMatch[1].trim().replace(/\.$/, '') : null;
  const medications: MedItem[] = thuocMatch
    ? thuocMatch[1].split(';').map(s => {
        const [name = '', dose = '', instruction = ''] = s.split('|');
        return { name, dose, instruction };
      }).filter(m => m.name.trim())
    : [];

  const followUpMatch = notes.match(/\[TAІКHAM:(\d{4}-\d{2}-\d{2})\|([^\]]+)\]/);
  const followUpDate = followUpMatch ? followUpMatch[1] : null;
  const followUpNote = followUpMatch ? followUpMatch[2].trim() : null;

  // Parse ảnh: [PHOTOS:before=url1,url2|after=url3,url4]
  const photosMatch = notes.match(/\[PHOTOS:before=([^|]*)\|after=([^\]]*)\]/);
  const photosBefore = photosMatch ? photosMatch[1].split(',').filter(Boolean) : [];
  const photosAfter  = photosMatch ? photosMatch[2].split(',').filter(Boolean) : [];

  const detail = notes
    .replace(/Nhân viên tiếp nhận:\s*[^\n.[|\]]+\.?\s*/g, '')
    .replace(/Bác sĩ phụ trách:\s*[^\n.[|\]]+\.?\s*/g, '')
    .replace(/\[TAІКHAM:[^\]]+\]/g, '')
    .replace(/\[PHOTOS:[^\]]+\]/g, '')
    .replace(/\[THUOC:[^\]]+\]/g, '')
    .trim() || null;

  return { staff, doctor, detail, followUpDate, followUpNote, photosBefore, photosAfter, medications };
}

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(dateStr); target.setHours(0,0,0,0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function formatDateVN(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  const days = ['CN','T2','T3','T4','T5','T6','T7'];
  const dow = days[new Date(`${y}-${m}-${d}`).getDay()];
  return `${dow}, ${d}/${m}/${y}`;
}

interface Appointment {
  id: number;
  service: string;
  date: string;
  time?: string | null;
  status: string;
  notes?: string | null;
  appointment_type?: string | null;
  created_at: string;
  bac_si?: { full_name: string } | null;
}

export default function AppointmentCard({ a }: { a: Appointment }) {
  const [open, setOpen] = useState(false);
  const st = STATUS_MAP[a.status] ?? STATUS_MAP['pending'];
  const time = a.time ? a.time.slice(0, 5) : null;
  const { staff, doctor, detail, followUpDate, followUpNote, photosBefore, photosAfter, medications } = parseNotes(a.notes ?? null);
  const hasPhotos = photosBefore.length > 0 || photosAfter.length > 0;
  const [photoTab, setPhotoTab] = useState<'before'|'after'>('before');
  const doctorName = a.bac_si?.full_name ?? doctor ?? null;

  const days = followUpDate ? daysUntil(followUpDate) : null;
  const followUpLabel = days === null ? null
    : days < 0  ? `Đã qua ${Math.abs(days)} ngày`
    : days === 0 ? 'Hôm nay!'
    : days === 1 ? 'Ngày mai!'
    : `Còn ${days} ngày`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Thanh màu status */}
      <div className={`h-1 w-full ${st.bar}`} />

      {/* Card header — luôn hiện */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 pt-4 pb-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-[15px] leading-snug">{a.service}</p>
            <p className="text-sm text-gray-500 mt-1">
              📅 {formatDate(a.date)}{time && <span className="text-gray-400"> lúc {time}</span>}
            </p>
            {/* Preview bác sĩ + nhân viên */}
            {(doctorName || staff) && (
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                {doctorName && (
                  <span className="text-xs text-gray-500">
                    👨‍⚕️ <span className="font-medium text-gray-700">{doctorName}</span>
                  </span>
                )}
                {staff && (
                  <span className="text-xs text-gray-500">
                    🙋 <span className="font-medium text-gray-700">{staff}</span>
                  </span>
                )}
              </div>
            )}

            {/* Preview tái khám */}
            {followUpDate && a.status === 'done' && (
              <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold
                ${days !== null && days <= 3 && days >= 0 ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'}`}>
                <span>🔁</span>
                <span>Tái khám {formatDateVN(followUpDate)}</span>
                {followUpLabel && <span className="opacity-70">· {followUpLabel}</span>}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
              {st.icon} {st.label}
            </span>
            <span className="text-xs text-gray-400">{open ? '▲ Thu gọn' : '▼ Chi tiết'}</span>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-5 border-t border-gray-50">
          <div className="pt-4 space-y-3">

            {/* Bác sĩ phụ trách */}
            {doctorName && (
              <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-3">
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-black">
                    {doctorName.replace('BS.','').trim().split(' ').slice(-1)[0][0]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide">Bác sĩ phụ trách</p>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">{doctorName}</p>
                  <p className="text-xs text-gray-500">Chuyên khoa Da liễu</p>
                </div>
              </div>
            )}

            {/* Nhân viên tiếp nhận */}
            {staff && (
              <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-3">
                <div className="w-9 h-9 rounded-full bg-purple-400 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-black">
                    {staff.split(' ').slice(-1)[0][0]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-purple-500 font-semibold uppercase tracking-wide">Nhân viên tiếp nhận</p>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">{staff}</p>
                  <p className="text-xs text-gray-500">Chăm sóc khách hàng</p>
                </div>
              </div>
            )}

            {/* Đơn thuốc */}
            {medications.length > 0 && (
              <div className="rounded-xl border border-purple-100 overflow-hidden">
                <div className="bg-purple-50 px-3 py-2 flex items-center gap-2">
                  <span className="text-base">💊</span>
                  <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">Đơn thuốc</p>
                  <span className="text-[10px] text-purple-500 bg-purple-100 px-1.5 py-0.5 rounded-full font-semibold ml-auto">
                    {medications.length} loại
                  </span>
                </div>
                <div className="divide-y divide-purple-50">
                  {medications.map((med, i) => (
                    <div key={i} className="px-3 py-2.5 flex items-start gap-3 bg-white">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{med.name}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                          {med.dose && (
                            <span className="text-xs text-gray-500">
                              🕐 <span className="text-gray-700 font-medium">{med.dose}</span>
                            </span>
                          )}
                          {med.instruction && (
                            <span className="text-xs text-gray-500">
                              📌 <span className="text-gray-700">{med.instruction}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lịch tái khám */}
            {followUpDate && (
              <div className={`rounded-xl p-3 border ${
                days !== null && days <= 3 && days >= 0
                  ? 'bg-red-50 border-red-200'
                  : 'bg-teal-50 border-teal-200'
              }`}>
                <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${
                  days !== null && days <= 3 && days >= 0 ? 'text-red-500' : 'text-teal-600'
                }`}>🔁 Lịch tái khám</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{formatDateVN(followUpDate)}</p>
                    {followUpNote && <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{followUpNote}</p>}
                  </div>
                  {followUpLabel && (
                    <span className={`text-xs font-black px-2 py-1 rounded-full shrink-0 ml-2 ${
                      days !== null && days <= 3 && days >= 0
                        ? 'bg-red-100 text-red-600'
                        : 'bg-teal-100 text-teal-700'
                    }`}>{followUpLabel}</span>
                  )}
                </div>
              </div>
            )}

            {/* Hình ảnh trước/sau điều trị — chỉ xem, do nhân viên/bác sĩ cập nhật */}
            {hasPhotos && (
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <div className="flex">
                  {(['before','after'] as const).map(t => (
                    <button key={t} onClick={() => setPhotoTab(t)}
                      className={`flex-1 py-2 text-xs font-bold transition-all ${
                        photoTab === t
                          ? t === 'before' ? 'bg-orange-500 text-white' : 'bg-[#2C5F5D] text-white'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}>
                      {t === 'before' ? '📸 Trước điều trị' : '✨ Sau điều trị'}
                      <span className="ml-1 opacity-70">({t === 'before' ? photosBefore.length : photosAfter.length})</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50">
                  {(photoTab === 'before' ? photosBefore : photosAfter).map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="aspect-square overflow-hidden rounded-lg bg-gray-200 block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`${photoTab === 'before' ? 'Trước' : 'Sau'} điều trị ${i+1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </a>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 text-center py-1.5 bg-gray-50">
                  🔒 Hình ảnh do nhân viên / bác sĩ cập nhật · Bấm để xem to
                </p>
              </div>
            )}

            {/* Ghi chú / nhật ký điều trị */}
            {detail && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1.5">📋 Nhật ký điều trị</p>
                <p className="text-sm text-gray-700 leading-relaxed">{detail}</p>
              </div>
            )}

            {/* Thông tin kỹ thuật */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              {a.appointment_type && (
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-gray-400 mb-0.5">Loại</p>
                  <p className="font-semibold text-gray-700">{a.appointment_type === 'medical' ? 'Khám / Điều trị' : a.appointment_type}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-2.5">
                <p className="text-gray-400 mb-0.5">Đặt lịch lúc</p>
                <p className="font-semibold text-gray-700">
                  {new Date(a.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
