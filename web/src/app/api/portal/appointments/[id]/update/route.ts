import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export interface MedItem {
  name: string;
  dose: string;
  instruction: string;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getServerUser();
  const role = user?.role;
  if (!user || !['admin', 'bac_si', 'nhan_vien'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { staffName, doctorName, followUpDate, followUpNote, beforePhotos, afterPhotos, medications } = body as {
    staffName?: string;
    doctorName?: string;
    followUpDate?: string;
    followUpNote?: string;
    beforePhotos?: string[];
    afterPhotos?: string[];
    medications?: MedItem[];
  };

  const apptDoc = await adminDb.collection('appointments').doc(id).get();
  if (!apptDoc.exists) return NextResponse.json({ error: 'Không tìm thấy lịch hẹn' }, { status: 404 });

  const appt = apptDoc.data()!;

  // Strip tất cả các block cũ, giữ lại plaintext gốc
  const base = (appt.notes ?? '')
    .replace(/Nhân viên tiếp nhận:\s*[^\n.[|\]]+\.?\s*/g, '')
    .replace(/Bác sĩ phụ trách:\s*[^\n.[|\]]+\.?\s*/g, '')
    .replace(/\[TAІКHAM:[^\]]+\]/g, '')
    .replace(/\[PHOTOS:[^\]]+\]/g, '')
    .replace(/\[THUOC:[^\]]+\]/g, '')
    .trim();

  const parts: string[] = [];
  if (base) parts.push(base);
  if (staffName?.trim())  parts.push(`Nhân viên tiếp nhận: ${staffName.trim()}.`);
  if (doctorName?.trim()) parts.push(`Bác sĩ phụ trách: ${doctorName.trim()}.`);
  if (followUpDate) {
    parts.push(`[TAІКHAM:${followUpDate}|${followUpNote?.trim() || 'Tái khám định kỳ'}]`);
  }
  if (beforePhotos?.length || afterPhotos?.length) {
    const b = (beforePhotos ?? []).join(',');
    const a = (afterPhotos ?? []).join(',');
    parts.push(`[PHOTOS:before=${b}|after=${a}]`);
  }
  if (medications && medications.length > 0) {
    // Format: [THUOC:TenThuoc1|LieuDung1|HuongDan1;TenThuoc2|LieuDung2|HuongDan2]
    const medStr = medications
      .filter(m => m.name.trim())
      .map(m => `${m.name.trim()}|${m.dose.trim()}|${m.instruction.trim()}`)
      .join(';');
    if (medStr) parts.push(`[THUOC:${medStr}]`);
  }

  const newNotes = parts.join('\n');

  try {
    await adminDb.collection('appointments').doc(id).update({
      notes: newNotes,
      updated_by: user.uid,
      updated_at: new Date(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ notes: newNotes });
}
