import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
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
  const [serviceGroups, user] = await Promise.all([
    getServiceGroups(),
    getServerUser(),
  ]);

  // Chỉ pre-fill cho khách hàng (role = customer)
  const userInfo = user && user.role === 'customer' ? {
    name: (user.name as string) || '',
    phone: (user.phone as string) || '',
    isLoggedIn: true,
  } : { name: '', phone: '', isLoggedIn: false };

  return (
    <Suspense>
      <DatLichForm serviceGroups={serviceGroups} userInfo={userInfo} />
    </Suspense>
  );
}
