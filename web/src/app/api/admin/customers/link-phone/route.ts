import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function POST(req: Request) {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { user_id, phone } = await req.json();
  if (!user_id || !phone) {
    return NextResponse.json({ error: 'Thiếu user_id hoặc phone' }, { status: 400 });
  }

  try {
    // Tìm auth user
    const target = await adminAuth.getUser(user_id);
    const currentClaims = target.customClaims || {};
    const zaloId = currentClaims.zalo_id as string | undefined;

    // Gộp customers
    const customersRef = adminDb.collection('customers');

    const phoneSnap = await customersRef.where('phone', '==', phone).limit(1).get();
    const customerByPhone = phoneSnap.empty ? null : { id: phoneSnap.docs[0].id, ...phoneSnap.docs[0].data() } as { id: string; full_name?: string; [key: string]: unknown };

    let customerByZalo: { id: string; full_name?: string; [key: string]: unknown } | null = null;
    if (zaloId) {
      const zaloSnap = await customersRef.where('zalo_id', '==', zaloId).limit(1).get();
      customerByZalo = zaloSnap.empty ? null : { id: zaloSnap.docs[0].id, ...zaloSnap.docs[0].data() } as { id: string; full_name?: string };
    }

    if (customerByPhone && customerByZalo && customerByPhone.id !== customerByZalo.id) {
      // Merge: update phone record with zalo info, delete zalo record
      await customersRef.doc(customerByPhone.id).update({
        zalo_id: zaloId,
        full_name: customerByZalo.full_name || customerByPhone.full_name || null,
      });
      await customersRef.doc(customerByZalo.id).delete();
    } else if (customerByZalo && !customerByPhone) {
      await customersRef.doc(customerByZalo.id).update({ phone });
    } else if (customerByPhone && !customerByZalo && zaloId) {
      await customersRef.doc(customerByPhone.id).update({ zalo_id: zaloId });
    } else if (!customerByPhone && !customerByZalo) {
      await customersRef.add({
        phone,
        zalo_id: zaloId || null,
        full_name: target.displayName || null,
        created_at: new Date(),
      });
    }

    // Cập nhật custom claims
    await adminAuth.setCustomUserClaims(user_id, { ...currentClaims, phone });

    return NextResponse.json({ message: 'Đã liên kết SĐT thành công' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
