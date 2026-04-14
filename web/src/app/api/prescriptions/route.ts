import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
import { sendPrescriptionNotify } from '@/lib/zalo-notify';

const ALLOWED_ROLES = ['bac_si', 'nhan_vien', 'admin'];

export async function GET(req: Request) {
  const user = await getServerUser();
  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const appointmentId = searchParams.get('appointment_id');
  if (!appointmentId) return NextResponse.json({ error: 'Thiếu appointment_id' }, { status: 400 });

  try {
    const snapshot = await adminDb
      .collection('appointments')
      .doc(appointmentId)
      .collection('prescriptions')
      .orderBy('created_at', 'desc')
      .get();

    const prescriptions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ prescriptions });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getServerUser();
  if (!user || user.role !== 'bac_si') {
    return NextResponse.json({ error: 'Chỉ bác sĩ mới có thể kê đơn thuốc' }, { status: 403 });
  }

  const { appointment_id, diagnosis, notes, items } = await req.json();
  if (!appointment_id) return NextResponse.json({ error: 'Thiếu appointment_id' }, { status: 400 });

  try {
    // Lấy tên bác sĩ từ profiles
    const profileSnap = await adminDb.collection('profiles').doc(user.uid).get();
    const doctorName = profileSnap.exists ? profileSnap.data()?.full_name || null : null;

    // Chuẩn bị items nhúng
    const embeddedItems = Array.isArray(items)
      ? items
          .filter((it: { medicine_name?: string }) => it.medicine_name?.trim())
          .map((it: { medicine_name: string; dosage?: string; frequency?: string; duration?: string; instructions?: string }, idx: number) => ({
            medicine_name: it.medicine_name,
            dosage:        it.dosage        || null,
            frequency:     it.frequency     || null,
            duration:      it.duration      || null,
            instructions:  it.instructions  || null,
            sort_order:    idx,
          }))
      : [];

    const rxRef = await adminDb
      .collection('appointments')
      .doc(appointment_id)
      .collection('prescriptions')
      .add({
        appointment_id,
        prescribed_by: user.uid,
        doctor_name: doctorName,
        diagnosis: diagnosis || null,
        notes: notes || null,
        items: embeddedItems,
        created_at: new Date(),
      });

    // ── Gửi Zalo ZNS thông báo đơn thuốc ──────────────────────────────────
    (async () => {
      try {
        const apptSnap = await adminDb.collection('appointments').doc(appointment_id).get();
        if (!apptSnap.exists) return;
        const appt = apptSnap.data()!;
        if (!appt.phone) return;

        const medList = embeddedItems
          .map((it: { medicine_name: string; dosage?: string | null }) =>
            `${it.medicine_name}${it.dosage ? ' — ' + it.dosage : ''}`)
          .join('; ');

        await sendPrescriptionNotify(appt.phone, {
          customerName: appt.name,
          service:      appt.service,
          diagnosis:    diagnosis || undefined,
          medications:  medList || 'Xem chi tiết tại portal',
          notes:        notes || undefined,
          doctorName:   doctorName || undefined,
        });
      } catch (err) {
        console.error('[Prescription] Zalo notify error (non-fatal):', err);
      }
    })();

    return NextResponse.json({ prescription_id: rxRef.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
