'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export function SignOutButton({
  redirectTo = '/',
  className = '',
  children,
}: {
  redirectTo?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const router   = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    // Xóa session cookie trên server
    await fetch('/api/auth/signout', { method: 'POST' });
    // Đăng xuất Firebase client
    await signOut(auth);
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children ?? 'Đăng Xuất'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-80 mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <span className="text-2xl">🚪</span>
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-1">Đăng xuất?</h3>
              <p className="text-sm text-gray-500">Bạn sẽ được chuyển về trang đăng nhập.</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
                Huỷ
              </button>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50">
                {loading ? 'Đang xuất...' : 'Đăng xuất'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
