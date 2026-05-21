import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { rateLimit, getClientIp, tooManyRequests } from '@/lib/rate-limit';
import { isValidVNPhone } from '@/lib/validate';
import { randomInt } from 'crypto';

function generateOTP(): string {
  // Dùng crypto.randomInt (CSPRNG) thay Math.random — chống đoán
  return randomInt(100000, 1000000).toString();
}

function toZaloPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? '84' + digits.slice(1) : digits;
}

async function sendOTPViaZalo(phone: string, otp: string) {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  const templateId  = process.env.ZALO_OTP_TEMPLATE_ID;
  if (!accessToken || !templateId || templateId === 'your_otp_template_id_here') {
    console.log(`[DEV] OTP cho ${phone}: ${otp}`);
    return;
  }

  const res = await fetch('https://business.openapi.zalo.me/message/template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', access_token: accessToken },
    body: JSON.stringify({
      phone: toZaloPhone(phone),
      template_id: templateId,
      template_data: { otp_code: otp, expires_in: '10 phút' },
    }),
  });
  const json = await res.json();
  if (json.error !== 0) throw new Error(`Zalo error ${json.error}: ${json.message}`);
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: 'Thiếu số điện thoại' }, { status: 400 });
    if (!isValidVNPhone(phone)) return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });

    const phoneDigits = phone.replace(/\D/g, '');

    // ── Rate limit: 1 OTP / 60 giây / SĐT + 5 OTP / ngày / SĐT + 20 / giờ / IP ──
    const cooldown = await rateLimit(`otp:req:cooldown:${phoneDigits}`, 1, 60 * 1000);
    if (!cooldown.allowed) return tooManyRequests(cooldown.retryAfterSec, `Vui lòng đợi ${cooldown.retryAfterSec}s trước khi gửi lại OTP.`);

    const dailyLimit = await rateLimit(`otp:req:daily:${phoneDigits}`, 5, 24 * 60 * 60 * 1000);
    if (!dailyLimit.allowed) return tooManyRequests(dailyLimit.retryAfterSec, 'Số điện thoại này đã yêu cầu OTP quá nhiều lần hôm nay.');

    const ipLimit = await rateLimit(`otp:req:ip:${getClientIp(req)}`, 20, 60 * 60 * 1000);
    if (!ipLimit.allowed) return tooManyRequests(ipLimit.retryAfterSec, 'Quá nhiều yêu cầu OTP từ thiết bị này.');

    const otp = generateOTP();

    // Xóa OTP cũ chưa dùng của số này
    const oldOtps = await adminDb.collection('otp_verifications')
      .where('phone', '==', phone)
      .where('used', '==', false)
      .get();
    const batch = adminDb.batch();
    oldOtps.docs.forEach(doc => batch.delete(doc.ref));
    if (!oldOtps.empty) await batch.commit();

    // Tạo OTP mới
    await adminDb.collection('otp_verifications').add({
      phone,
      otp_code: otp,
      used: false,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
      created_at: new Date(),
    });

    await sendOTPViaZalo(phone, otp);

    return NextResponse.json({ message: 'OTP đã được gửi qua Zalo' });
  } catch (err) {
    console.error('request-otp error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
