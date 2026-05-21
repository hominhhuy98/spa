import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { isValidVNPhone, isValidEmail, isLenOk, cleanText } from '@/lib/validate';

export async function PATCH(req: Request) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Rate limit: 10 lần cập nhật / giờ / user
  const limit = await rateLimit(`profile:${user.uid}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) return tooManyRequests(limit.retryAfterSec, 'Quá nhiều lần cập nhật. Vui lòng thử lại sau.');

  const body = await req.json();
  const full_name = body?.full_name ? cleanText(body.full_name, 100) : undefined;
  const phone = body?.phone as string | undefined;
  const email = body?.email as string | undefined;

  // ── Validate ──
  if (full_name !== undefined && !isLenOk(full_name, 1, 100)) {
    return NextResponse.json({ error: 'Tên không hợp lệ' }, { status: 400 });
  }
  if (phone && !isValidVNPhone(phone)) {
    return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
  }

  try {
    // Kiểm tra phone mới không trùng người khác
    if (phone && phone !== user.phone) {
      const dup = await adminDb.collection('customers').where('phone', '==', phone).limit(1).get();
      if (!dup.empty) {
        return NextResponse.json({ error: 'Số điện thoại đã được sử dụng bởi tài khoản khác.' }, { status: 409 });
      }
    }

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

    // Update customer record (tìm theo phone hiện tại của chính user)
    const currentPhone = (user.phone as string) || '';
    if (currentPhone) {
      const customerQuery = await adminDb.collection('customers')
        .where('phone', '==', currentPhone).limit(1).get();
      if (!customerQuery.empty) {
        const updateData: Record<string, string> = {};
        if (full_name) updateData.full_name = full_name;
        if (phone) updateData.phone = phone;
        if (Object.keys(updateData).length > 0) {
          await customerQuery.docs[0].ref.update(updateData);
        }
      }
    }

    return NextResponse.json({ message: 'Đã cập nhật thông tin' });
  } catch (err) {
    console.error('update-profile error:', err);
    return NextResponse.json({ error: 'Không thể cập nhật. Vui lòng thử lại.' }, { status: 500 });
  }
}
