import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { full_name, phone, email, password } = await req.json();

    if (!full_name || !phone || !password) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 });
    }

    // Email: dùng email thật nếu có, hoặc tạo email giả từ SĐT
    const phoneDigits = phone.replace(/\D/g, '');
    const userEmail = email?.trim() || `customer_${phoneDigits}@portal.ydsg.vn`;

    // Kiểm tra user đã tồn tại chưa
    try {
      await adminAuth.getUserByEmail(userEmail);
      return NextResponse.json({ error: 'Email hoặc số điện thoại đã được đăng ký' }, { status: 409 });
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
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
