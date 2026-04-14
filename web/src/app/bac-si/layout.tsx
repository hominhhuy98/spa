import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/firebase-session';
import { adminDb } from '@/lib/firebase-admin';
import StaffLayout from '@/components/StaffLayout';

export default async function BacSiLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user || !['admin', 'bac_si'].includes(user.role as string)) redirect('/login');

  const profileDoc = await adminDb.collection('profiles').doc(user.uid).get();
  const fullName = profileDoc.exists ? profileDoc.data()?.full_name : user.email;

  return (
    <StaffLayout role="bac_si" fullName={fullName ?? 'Bác sĩ'}>
      {children}
    </StaffLayout>
  );
}
