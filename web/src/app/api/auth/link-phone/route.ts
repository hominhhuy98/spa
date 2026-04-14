import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function POST(req: Request) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    // Nếu đã có phone → đã liên kết rồi
    if (user.phone) {
      return NextResponse.json({ message: 'Số điện thoại đã được liên kết', phone: user.phone });
    }

    const { phone, otp_code } = await req.json();
    if (!phone || !otp_code) {
      return NextResponse.json({ error: 'Thiếu số điện thoại hoặc mã OTP' }, { status: 400 });
    }

    // ── 1. Xác thực OTP ──────────────────────────────────────────────────────
    const now = new Date();
    const otpSnapshot = await adminDb.collection('otp_verifications')
      .where('phone', '==', phone)
      .where('otp_code', '==', otp_code)
      .where('used', '==', false)
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();

    if (otpSnapshot.empty) {
      return NextResponse.json({ error: 'Mã OTP không hợp lệ hoặc đã hết hạn' }, { status: 401 });
    }

    const otpDoc = otpSnapshot.docs[0];
    const otpData = otpDoc.data();
    const expiresAt = otpData.expires_at.toDate ? otpData.expires_at.toDate() : new Date(otpData.expires_at);
    if (expiresAt < now) {
      return NextResponse.json({ error: 'Mã OTP không hợp lệ hoặc đã hết hạn' }, { status: 401 });
    }

    await otpDoc.ref.update({ used: true });

    // ── 2. Gộp bản ghi customers ─────────────────────────────────────────────
    const zaloId = user.zalo_id as string | undefined;

    const phoneQuery = await adminDb.collection('customers')
      .where('phone', '==', phone).limit(1).get();
    const customerByPhone = phoneQuery.empty ? null : phoneQuery.docs[0];

    let customerByZalo = null;
    if (zaloId) {
      const zaloQuery = await adminDb.collection('customers')
        .where('zalo_id', '==', zaloId).limit(1).get();
      customerByZalo = zaloQuery.empty ? null : zaloQuery.docs[0];
    }

    if (customerByPhone && customerByZalo) {
      if (customerByPhone.id !== customerByZalo.id) {
        // 2 row khác nhau → gộp zalo_id vào phone-row, xoá zalo-row
        await customerByPhone.ref.update({
          zalo_id: zaloId,
          full_name: customerByZalo.data().full_name || customerByPhone.data().full_name,
        });
        await customerByZalo.ref.delete();
      }
    } else if (customerByZalo && !customerByPhone) {
      await customerByZalo.ref.update({ phone });
    } else if (customerByPhone && !customerByZalo) {
      if (zaloId) {
        await customerByPhone.ref.update({ zalo_id: zaloId });
      }
    } else {
      await adminDb.collection('customers').add({
        phone,
        zalo_id: zaloId || null,
        full_name: user.name || null,
        created_at: new Date(),
      });
    }

    // ── 3. Cập nhật custom claims cho auth user ───────────────────────────────
    const currentClaims = (await adminAuth.getUser(user.uid)).customClaims || {};
    await adminAuth.setCustomUserClaims(user.uid, { ...currentClaims, phone });

    return NextResponse.json({ message: 'Liên kết số điện thoại thành công', phone });
  } catch (err) {
    console.error('link-phone error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
