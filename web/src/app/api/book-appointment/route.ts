import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Lưu thông tin đặt lịch vào database mock
    const filePath = path.join(process.cwd(), 'src/data/appointments.json');
    let appointments = [];
    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      appointments = JSON.parse(fileContents);
    } catch(err) {
      appointments = [];
    }

    appointments.push({
      ...data,
      createdAt: new Date().toISOString()
    });

    await fs.writeFile(filePath, JSON.stringify(appointments, null, 2));

    // Gửi email thông báo qua SMTP
    try {
      // Mock configuration (thực tế nên lấy từ process.env)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
          pass: process.env.SMTP_PASS || 'ethereal_password'
        }
      });

      await transporter.sendMail({
        from: '"Hệ thống Đặt lịch" <no-reply@ydsg.vn>',
        to: process.env.ADMIN_EMAIL || 'admin@ydsg.vn',
        subject: `[Thông báo] Khách hàng mới đặt lịch: ${data.service}`,
        html: `
          <h3>Thông tin khách hàng đặt lịch</h3>
          <ul>
            <li><strong>Họ tên:</strong> ${data.name}</li>
            <li><strong>Số điện thoại:</strong> ${data.phone}</li>
            <li><strong>Dịch vụ quan tâm:</strong> ${data.service}</li>
            <li><strong>Ngày dự kiến:</strong> ${data.date}</li>
            <li><strong>Ghi chú:</strong> ${data.notes || 'Không có'}</li>
          </ul>
        `
      });
      console.log("Đã gửi email thông báo thành công!");
    } catch (emailError) {
      console.error("Không thể gửi email (lỗi SMTP):", emailError);
      // Không ném lỗi ra ngoài để luồng đặt lịch vẫn thành công với khách hàng
    }

    return NextResponse.json({ message: 'Đặt lịch thành công!' }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi đặt lịch:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
