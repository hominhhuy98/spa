import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { phone, otp_code, full_name } = await req.json();
    if (!phone || !otp_code) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
    }

    // Xác thực OTP
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

    // Check expiry
    const expiresAt = otpData.expires_at.toDate ? otpData.expires_at.toDate() : new Date(otpData.expires_at);
    if (expiresAt < now) {
      return NextResponse.json({ error: 'Mã OTP không hợp lệ hoặc đã hết hạn' }, { status: 401 });
    }

    // Đánh dấu OTP đã dùng
    await otpDoc.ref.update({ used: true });

    // Upsert bản ghi khách hàng
    const customerQuery = await adminDb.collection('customers')
      .where('phone', '==', phone).limit(1).get();
    if (customerQuery.empty) {
      await adminDb.collection('customers').add({
        phone,
        zalo_id: null,
        full_name: full_name || null,
        created_at: new Date(),
      });
    }

    // Email giả dùng cho Firebase Auth
    const deterministicEmail = `customer_${phone.replace(/\D/g, '')}@portal.ydsg.vn`;

    // Tìm hoặc tạo Firebase Auth user
    let uid: string;
    try {
      const existing = await adminAuth.getUserByEmail(deterministicEmail);
      uid = existing.uid;
    } catch {
      // User chưa tồn tại → tạo mới
      const newUser = await adminAuth.createUser({
        email: deterministicEmail,
        emailVerified: true,
        displayName: full_name || undefined,
        phoneNumber: phone.startsWith('+') ? phone : `+84${phone.replace(/\D/g, '').replace(/^0/, '')}`,
      });
      uid = newUser.uid;
    }

    // Set custom claims (role)
    await adminAuth.setCustomUserClaims(uid, { role: 'customer', phone });

    // Tạo custom token để client đăng nhập
    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({ customToken });
  } catch (err) {
    console.error('verify-otp error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
