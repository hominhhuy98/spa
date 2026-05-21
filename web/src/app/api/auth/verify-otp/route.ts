import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { rateLimit, getClientIp, tooManyRequests } from '@/lib/rate-limit';
import { isValidVNPhone, cleanText } from '@/lib/validate';

export async function POST(req: Request) {
  try {
    const { phone, otp_code, full_name } = await req.json();
    if (!phone || !otp_code) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
    }
    if (!isValidVNPhone(phone)) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });
    }
    // OTP phải là 6 chữ số
    if (!/^\d{6}$/.test(String(otp_code))) {
      return NextResponse.json({ error: 'Mã OTP không hợp lệ' }, { status: 400 });
    }

    const phoneDigits = phone.replace(/\D/g, '');

    // ── Chống brute-force: tối đa 5 lần thử / 15 phút / SĐT + 30 / giờ / IP ──
    const phoneAttempts = await rateLimit(`otp:verify:phone:${phoneDigits}`, 5, 15 * 60 * 1000);
    if (!phoneAttempts.allowed) {
      return tooManyRequests(phoneAttempts.retryAfterSec, 'Bạn đã nhập sai OTP quá nhiều lần. Vui lòng thử lại sau.');
    }
    const ipAttempts = await rateLimit(`otp:verify:ip:${getClientIp(req)}`, 30, 60 * 60 * 1000);
    if (!ipAttempts.allowed) {
      return tooManyRequests(ipAttempts.retryAfterSec, 'Quá nhiều lần thử từ thiết bị này.');
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

    const cleanName = full_name ? cleanText(full_name, 100) : null;

    // Upsert bản ghi khách hàng
    const customerQuery = await adminDb.collection('customers')
      .where('phone', '==', phone).limit(1).get();
    if (customerQuery.empty) {
      await adminDb.collection('customers').add({
        phone,
        zalo_id: null,
        full_name: cleanName,
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
        displayName: cleanName || undefined,
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
