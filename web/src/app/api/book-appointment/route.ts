import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

    // Ở đây ta có thể giả lập việc gửi email hoặc đẩy CRM
    console.log("CRM: Có người đặt lịch khám mới:", data);

    return NextResponse.json({ message: 'Đặt lịch thành công!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
