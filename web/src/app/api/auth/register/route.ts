import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { rateLimit, getClientIp, tooManyRequests } from '@/lib/rate-limit';
import { isValidVNPhone, isValidEmail, isValidPassword, isLenOk, cleanText } from '@/lib/validate';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(req: Request) {
  try {
    // ── Rate limit: 5 tài khoản / giờ / IP ──
    const ipLimit = await rateLimit(`register:ip:${getClientIp(req)}`, 5, 60 * 60 * 1000);
    if (!ipLimit.allowed) return tooManyRequests(ipLimit.retryAfterSec, 'Quá nhiều tài khoản được tạo. Vui lòng thử lại sau.');

    const body = await req.json();
    const phone = body?.phone, email = body?.email, password = body?.password;
    const full_name = cleanText(body?.full_name, 100);

    // reCAPTCHA v3 (chống bot đăng ký hàng loạt)
    const recaptchaOk = await verifyRecaptcha(body?.recaptchaToken, 'register');
    if (!recaptchaOk) {
      return NextResponse.json({ error: 'Xác minh chống bot thất bại. Vui lòng thử lại.' }, { status: 403 });
    }

    if (!full_name || !phone || !password) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }
    if (!isLenOk(full_name, 1, 100)) {
      return NextResponse.json({ error: 'Tên không hợp lệ' }, { status: 400 });
    }
    if (!isValidVNPhone(phone)) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
    }
    if (!isValidPassword(password)) {
      return NextResponse.json({ error: 'Mật khẩu phải có 6–128 ký tự' }, { status: 400 });
    }

    // Email: dùng email thật nếu có, hoặc tạo email giả từ SĐT
    const phoneDigits = phone.replace(/\D/g, '');
    const userEmail = (email?.trim()) || `customer_${phoneDigits}@portal.ydsg.vn`;

    // Kiểm tra user đã tồn tại chưa
    try {
      await adminAuth.getUserByEmail(userEmail);
      // Không tiết lộ email/SĐT đã tồn tại → message chung chung
      return NextResponse.json({ error: 'Không thể tạo tài khoản với thông tin này. Vui lòng kiểm tra lại hoặc đăng nhập.' }, { status: 409 });
    } catch {
      // Chưa tồn tại → tiếp tục tạo
    }

    // Tạo Firebase Auth user
    const newUser = await adminAuth.createUser({
      email: userEmail,
      emailVerified: true,
      password,
      displayName: full_name,
    });

    // Set custom claims
    await adminAuth.setCustomUserClaims(newUser.uid, { role: 'customer', phone: phoneDigits });

    // Tạo customer record
    await adminDb.collection('customers').add({
      phone,
      zalo_id: null,
      full_name,
      created_at: new Date(),
    });

    // Tạo custom token để client đăng nhập
    const customToken = await adminAuth.createCustomToken(newUser.uid);

    return NextResponse.json({ customToken }, { status: 201 });
  } catch (err) {
    console.error('register error:', err);
    // Không trả message nội bộ ra client
    return NextResponse.json({ error: 'Không thể tạo tài khoản. Vui lòng thử lại sau.' }, { status: 500 });
  }
}
