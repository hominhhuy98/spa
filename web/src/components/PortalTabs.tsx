'use client';

import { useState, useMemo } from 'react';
import AppointmentCard from './AppointmentCard';
import Link from 'next/link';

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

type Tab = 'tomorrow' | 'active' | 'done';

function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function PortalTabs({ appointments }: { appointments: Appointment[] }) {
  const tomorrow = useMemo(getTomorrow, []);
  const today    = useMemo(getToday, []);

  // Phân loại lịch hẹn
  const tomorrowList = useMemo(() =>
    appointments.filter(a =>
      a.date === tomorrow &&
      (a.status === 'pending' || a.status === 'confirmed')
    ), [appointments, tomorrow]);

  const activeList = useMemo(() =>
    appointments.filter(a =>
      a.date !== tomorrow &&
      a.date >= today &&
      (a.status === 'pending' || a.status === 'confirmed')
    ), [appointments, tomorrow, today]);

  const doneList = useMemo(() =>
    appointments.filter(a =>
      a.status === 'done' || a.status === 'cancelled' ||
      // Lịch đã qua ngày mà chưa cập nhật status
      (a.date < today && a.status !== 'done' && a.status !== 'cancelled'
        ? false : a.status === 'done' || a.status === 'cancelled')
    ), [appointments, today]);

  // Mặc định vào tab "ngày mai" nếu có, không thì "đang chờ"
  const [tab, setTab] = useState<Tab>(tomorrowList.length > 0 ? 'tomorrow' : 'active');

  const tabs: { key: Tab; label: string; icon: string; list: Appointment[]; urgent?: boolean }[] = [
    {
      key: 'tomorrow',
      label: 'Ngày mai',
      icon: '🔔',
      list: tomorrowList,
      urgent: tomorrowList.length > 0,
    },
    {
      key: 'active',
      label: 'Đang chờ',
      icon: '🕐',
      list: activeList,
    },
    {
      key: 'done',
      label: 'Hoàn thành',
      icon: '✅',
      list: doneList,
    },
  ];

  const currentList = tabs.find(t => t.key === tab)?.list ?? [];

  return (
    <>
      {/* Banner nhắc lịch ngày mai */}
      {tomorrowList.length > 0 && (
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl animate-bounce">🔔</span>
          <div>
            <p className="font-bold text-amber-800 text-sm">Nhắc lịch — Ngày mai bạn có {tomorrowList.length} liệu trình!</p>
            <p className="text-xs text-amber-700 font-semibold mt-0.5">
              📅 {(() => { const [y,m,d] = tomorrow.split('-'); const dow = ['CN','T2','T3','T4','T5','T6','T7'][new Date(tomorrow).getDay()]; return `${dow}, ${d}/${m}/${y}`; })()}
            </p>
            <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
              {tomorrowList.map(a => `${a.service}${a.time ? ' lúc ' + a.time.slice(0,5) : ''}`).join(' · ')}
            </p>
            <p className="text-xs text-amber-500 mt-1">📍 405-407 Đỗ Xuân Hợp, Phước Long, TP.HCM</p>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex rounded-2xl border border-gray-200 bg-white p-1 mt-5 shadow-sm">
        {tabs.map(t => {
          const isActive = tab === t.key;
          const hasItems = t.list.length > 0;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 relative ${
                isActive
                  ? 'bg-[#2C5F5D] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {/* Dot nhắc nhở nếu tab ngày mai có dữ liệu */}
              {t.urgent && !isActive && (
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              )}
              <span className="text-base leading-none">{t.icon}</span>
              <span>{t.label}</span>
              {hasItems && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black leading-none ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : t.key === 'tomorrow'
                      ? 'bg-amber-100 text-amber-700'
                      : t.key === 'active'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                }`}>
                  {t.list.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Label */}
      <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-5 mb-3">
        {tab === 'tomorrow' ? 'Lịch hẹn ngày mai' : tab === 'active' ? 'Lịch hẹn sắp tới' : 'Lịch sử điều trị'}
      </p>

      {/* Danh sách */}
      {currentList.length === 0 ? (
        <div className="text-center py-14 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {tab === 'tomorrow' ? (
            <>
              <div className="text-4xl mb-3">😊</div>
              <p className="text-gray-500 font-medium mb-1">Ngày mai không có lịch hẹn</p>
              <p className="text-xs text-gray-400">Bạn có thể nghỉ ngơi thoải mái!</p>
            </>
          ) : tab === 'active' ? (
            <>
              <div className="text-4xl mb-3">🗓️</div>
              <p className="text-gray-500 font-medium mb-1">Không có lịch hẹn nào đang chờ</p>
              <p className="text-xs text-gray-400 mb-5">Đặt lịch mới để tiếp tục liệu trình</p>
              <Link href="/dat-lich"
                style={{ backgroundColor: '#2C5F5D' }}
                className="text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition inline-block">
                Đặt lịch ngay
              </Link>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-500 font-medium mb-1">Chưa có liệu trình nào hoàn thành</p>
              <p className="text-xs text-gray-400">Lịch sử điều trị sẽ hiển thị tại đây</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map(a => <AppointmentCard key={a.id} a={a} />)}
        </div>
      )}
    </>
  );
}
