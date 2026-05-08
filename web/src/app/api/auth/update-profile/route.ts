import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function PATCH(req: Request) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { full_name, phone, email } = await req.json();

  try {
    // Update Firebase Auth
    const updates: Record<string, string> = {};
    if (full_name) updates.displayName = full_name;
    if (email) updates.email = email;

    if (Object.keys(updates).length > 0) {
      await adminAuth.updateUser(user.uid, updates);
    }

    // Update custom claims nếu phone thay đổi
    if (phone) {
      const currentClaims = (await adminAuth.getUser(user.uid)).customClaims || {};
      await adminAuth.setCustomUserClaims(user.uid, { ...currentClaims, phone: phone.replace(/\D/g, '') });
    }

    // Update customer record trong Firestore
    const customerQuery = await adminDb.collection('customers')
      .where('phone', '==', user.phone || '')
      .limit(1)
      .get();

    if (!customerQuery.empty) {
      const updateData: Record<string, string> = {};
      if (full_name) updateData.full_name = full_name;
      if (phone) updateData.phone = phone;
      await customerQuery.docs[0].ref.update(updateData);
    }

    return NextResponse.json({ message: 'Đã cập nhật thông tin' });
  } catch (err) {
    console.error('update-profile error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
