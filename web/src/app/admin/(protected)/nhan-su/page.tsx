import { adminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import StaffList from './StaffList';

export default async function NhanSuPage() {
  const snapshot = await adminDb.collection('profiles').orderBy('created_at', 'desc').get();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profiles = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      full_name: data.full_name || '',
      email: data.email || '',
      role: data.role || '',
      is_active: data.is_active !== false,
      created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : (data.created_at || ''),
    };
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Nhân Sự</h1>
        <Link href="/admin/nhan-su/moi"
          className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition">
          + Thêm nhân sự
        </Link>
      </div>
      <StaffList initialStaff={profiles} />
    </div>
  );
}
