import { adminDb } from '@/lib/firebase-admin';
import DatLichForm from './DatLichForm';
import { Suspense } from 'react';

const CATEGORY_LABELS: Record<string, string> = {
  'quy-trinh-co-dinh': '🧴 Quy Trình Cố Định',
  'cham-soc-da': '💆 Chăm Sóc Da',
  'cham-soc-da-toan-dien': '✨ Chăm Sóc Da Toàn Diện',
  'da-mun-face': '🔬 Da Mụn (Face)',
  'da-mun-body': '🔬 Da Mụn (Body)',
  'da-nhay-cam': '🛡️ Da Nhạy Cảm',
  'chemical-peel': '🧪 Chemical Peel',
};

async function getServiceGroups() {
  const snapshot = await adminDb.collection('treatment_services')
    .where('is_active', '==', true)
    .orderBy('sort_order', 'asc')
    .get();

  const grouped = new Map<string, string[]>();
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const cat = data.category || 'other';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(data.name);
  });

  return Array.from(grouped.entries()).map(([cat, items]) => ({
    group: CATEGORY_LABELS[cat] || cat,
    items,
  }));
}

export default async function DatLich() {
  const serviceGroups = await getServiceGroups();
  return (
    <Suspense>
      <DatLichForm serviceGroups={serviceGroups} />
    </Suspense>
  );
}
