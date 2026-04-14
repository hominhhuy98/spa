import { adminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import TreatmentServiceList from './TreatmentServiceList';

export default async function LieuTrinhPage() {
  const snapshot = await adminDb.collection('treatment_services')
    .orderBy('sort_order', 'asc')
    .get();

  const services = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '',
      slug: data.slug || '',
      icon: data.icon || '',
      category: data.category || '',
      tong_thoi_gian: data.tong_thoi_gian || '',
      is_active: data.is_active !== false,
      sort_order: data.sort_order || 0,
      quy_trinh: data.quy_trinh || [],
    };
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Liệu Trình & Phác Đồ</h1>
        <Link href="/admin/lieu-trinh/moi"
          className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition">
          + Thêm liệu trình
        </Link>
      </div>

      <TreatmentServiceList initialServices={services} />
    </div>
  );
}
