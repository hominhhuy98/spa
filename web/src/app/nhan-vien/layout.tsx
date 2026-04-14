import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/firebase-session';
import { adminDb } from '@/lib/firebase-admin';
import StaffLayout from '@/components/StaffLayout';

export default async function NhanVienLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user || !['admin', 'nhan_vien'].includes(user.role as string)) redirect('/login');

  const profileDoc = await adminDb.collection('profiles').doc(user.uid).get();
  const fullName = profileDoc.exists ? profileDoc.data()?.full_name : user.email;

  return (
    <StaffLayout role="nhan_vien" fullName={fullName ?? 'Nhân viên'}>
      {children}
    </StaffLayout>
  );
}
