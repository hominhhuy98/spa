import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { rateLimit, getClientIp, tooManyRequests } from '@/lib/rate-limit';
import { isValidVNPhone, isValidDate, isValidTime, isLenOk, cleanText } from '@/lib/validate';
import nodemailer from 'nodemailer';

// Chuyển SĐT Việt Nam sang định dạng Zalo: 0912... → 84912...
function toZaloPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? '84' + digits.slice(1) : digits;
}

// YYYY-MM-DD → DD/MM/YYYY (định dạng ngày ZNS yêu cầu)
function formatDateVN(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

// Tạo mã khách hàng từ 4 số cuối SĐT: mh-0001
function genMaKhach(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return 'mh-' + digits.slice(-4);
}

async function sendZaloNotification(params: {
  phone: string; name: string; service: string; date: string; time?: string;
}) {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  const templateId  = process.env.ZALO_TEMPLATE_ID;
  if (!accessToken || !templateId ||
      accessToken === 'your_oa_access_token_here' ||
      templateId  === 'your_template_id_here') return;

  const zaloPhone = toZaloPhone(params.phone);

  const body = {
    phone: zaloPhone,
    template_id: Number(templateId),
    template_data: {
      ten_khach_hang: params.name,
      dia_chi_co_so:  '405-407 Đỗ Xuân Hợp, Phước Long, Thành Phố Hồ Chí Minh',
      gio_kham:       params.time ? `${params.time}:00` : '00:00:00',
      ngay_kham:      formatDateVN(params.date),
      dich_vu:        params.service,
      ma_khach_hang:  genMaKhach(params.phone),
    },
  };

  console.log('[Zalo ZNS] Sending to:', zaloPhone, '| body:', JSON.stringify(body));
  const res = await fetch('https://business.openapi.zalo.me/message/template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', access_token: accessToken },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  console.log('[Zalo ZNS] Response:', JSON.stringify(json));
  if (json.error !== 0) throw new Error(`Zalo error ${json.error}: ${json.message}`);
}

export async function POST(req: Request) {
  try {
    // ── Rate limit: 5 lịch / 10 phút / IP + 20 lịch / ngày / SĐT ──
    const ip = getClientIp(req);
    const ipLimit = await rateLimit(`book:ip:${ip}`, 5, 10 * 60 * 1000);
    if (!ipLimit.allowed) return tooManyRequests(ipLimit.retryAfterSec, 'Bạn đã đặt quá nhiều lịch. Vui lòng thử lại sau.');

    const data = await req.json();
    const rawName = data?.name, rawPhone = data?.phone, rawService = data?.service;
    const date = data?.date, time = data?.time;

    if (!rawName || !rawPhone || !rawService || !date) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // ── Validate & sanitize ──
    const name = cleanText(rawName, 100);
    const phone = cleanText(rawPhone, 20);
    const service = cleanText(rawService, 150);
    const notes = cleanText(data?.notes, 1000);

    if (!isLenOk(name, 1, 100)) return NextResponse.json({ error: 'Tên không hợp lệ' }, { status: 400 });
    if (!isValidVNPhone(phone)) return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });
    if (!isLenOk(service, 1, 150)) return NextResponse.json({ error: 'Dịch vụ không hợp lệ' }, { status: 400 });
    if (!isValidDate(date)) return NextResponse.json({ error: 'Ngày không hợp lệ' }, { status: 400 });
    if (!isValidTime(time || '')) return NextResponse.json({ error: 'Giờ không hợp lệ' }, { status: 400 });

    // Rate limit theo SĐT (chống 1 người spam nhiều IP)
    const phoneLimit = await rateLimit(`book:phone:${phone.replace(/\D/g, '')}`, 20, 24 * 60 * 60 * 1000);
    if (!phoneLimit.allowed) return tooManyRequests(phoneLimit.retryAfterSec, 'Số điện thoại này đã đặt quá nhiều lịch hôm nay.');

    // Kiểm tra ngày đã qua
    const today = new Date().toISOString().slice(0, 10);
    if (date < today) {
      return NextResponse.json({ error: 'Ngày hoặc giờ đã chọn đã qua, vui lòng chọn lại.' }, { status: 422 });
    }

    // Lưu vào Firestore
    try {
      await adminDb.collection('appointments').add({
        name,
        phone,
        service,
        date,
        time: time || null,
        notes: notes || null,
        status: 'pending',
        appointment_type: null,
        updated_by: null,
        assigned_staff: [],
        created_at: new Date(),
      });
    } catch (dbError) {
      console.error('Firestore insert error:', dbError);
      return NextResponse.json({ error: 'Không thể lưu lịch hẹn' }, { status: 500 });
    }

    // Gửi Zalo ZBS cho khách hàng (fail silent)
    sendZaloNotification({ phone, name, service, date, time })
      .catch(err => console.error('Zalo notification error (non-fatal):', err));

    // Gửi email thông báo (không bắt buộc — fail silent)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: '"Hệ thống Đặt lịch YDSG" <no-reply@ydsg.vn>',
        to: process.env.ADMIN_EMAIL || 'admin@ydsg.vn',
        subject: `[Đặt lịch mới] ${name} — ${service}`,
        html: `
          <h3>Khách hàng mới đặt lịch khám</h3>
          <table cellpadding="6" style="border-collapse:collapse">
            <tr><td><strong>Họ tên</strong></td><td>${name}</td></tr>
            <tr><td><strong>Số điện thoại</strong></td><td>${phone}</td></tr>
            <tr><td><strong>Dịch vụ</strong></td><td>${service}</td></tr>
            <tr><td><strong>Ngày dự kiến</strong></td><td>${date}</td></tr>
            <tr><td><strong>Giờ mong muốn</strong></td><td>${time || '—'}</td></tr>
            <tr><td><strong>Ghi chú</strong></td><td>${notes || '—'}</td></tr>
          </table>
        `,
      });
    } catch (emailErr) {
      console.error('Email error (non-fatal):', emailErr);
    }

    return NextResponse.json({ message: 'Đặt lịch thành công!' }, { status: 200 });
  } catch (error) {
    console.error('Book appointment error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
