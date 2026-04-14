import { adminDb } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import TreatmentServiceForm from './TreatmentServiceForm';

export default async function EditTreatmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // "moi" = tạo mới
  if (id === 'moi') {
    return <TreatmentServiceForm />;
  }

  const doc = await adminDb.collection('treatment_services').doc(id).get();
  if (!doc.exists) notFound();

  const data = doc.data()!;
  const service = {
    id: doc.id,
    name: data.name || '',
    slug: data.slug || '',
    icon: data.icon || '',
    category: data.category || 'cham-soc-da',
    tong_thoi_gian: data.tong_thoi_gian || '',
    mo_ta: data.mo_ta || '',
    quy_trinh: data.quy_trinh || [],
    luu_y: data.luu_y || '',
    is_active: data.is_active !== false,
    sort_order: data.sort_order || 99,
  };

  return <TreatmentServiceForm service={service} />;
}
