'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AppointmentActions({ id }: { id: string }) {
  const [loading, setLoading] = useState('');
  const router = useRouter();

  async function handleAction(status: string) {
    if (status === 'cancelled' && !confirm('Xác nhận hủy lịch hẹn này?')) return;
    setLoading(status);
    await fetch(`/api/admin/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading('');
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleAction('confirmed')}
        disabled={!!loading}
        className="text-xs font-bold text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded-lg transition disabled:opacity-50">
        {loading === 'confirmed' ? '...' : 'Xác nhận'}
      </button>
      <button
        onClick={() => handleAction('cancelled')}
        disabled={!!loading}
        className="text-xs font-semibold text-red-500 hover:text-red-700 px-1.5 py-1 transition disabled:opacity-50">
        {loading === 'cancelled' ? '...' : 'Hủy'}
      </button>
    </div>
  );
}
