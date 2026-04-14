import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
import { sendTreatmentPlanNotify } from '@/lib/zalo-notify';

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
      .collection('treatment_plans')
      .orderBy('created_at', 'desc')
      .get();

    const plans = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ plans });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getServerUser();
  if (!user || user.role !== 'bac_si') {
    return NextResponse.json({ error: 'Chỉ bác sĩ mới có thể tạo phác đồ điều trị' }, { status: 403 });
  }

  const { appointment_id, diagnosis, plan_detail, sessions_total, next_session_date, notes } = await req.json();
  if (!appointment_id) return NextResponse.json({ error: 'Thiếu appointment_id' }, { status: 400 });

  try {
    // Lấy tên bác sĩ từ profiles
    const profileSnap = await adminDb.collection('profiles').doc(user.uid).get();
    const doctorName = profileSnap.exists ? profileSnap.data()?.full_name || null : null;

    const planRef = await adminDb
      .collection('appointments')
      .doc(appointment_id)
      .collection('treatment_plans')
      .add({
        appointment_id,
        prescribed_by:     user.uid,
        doctor_name:       doctorName,
        diagnosis:         diagnosis        || null,
        plan_detail:       plan_detail      || null,
        sessions_total:    sessions_total   ?? 1,
        sessions_done:     0,
        next_session_date: next_session_date || null,
        notes:             notes            || null,
        created_at:        new Date(),
      });

    const planData = {
      id: planRef.id,
      appointment_id,
      prescribed_by: user.uid,
      doctor_name: doctorName,
      diagnosis: diagnosis || null,
      plan_detail: plan_detail || null,
      sessions_total: sessions_total ?? 1,
      sessions_done: 0,
      next_session_date: next_session_date || null,
      notes: notes || null,
    };

    // ── Gửi Zalo ZNS thông báo phác đồ ──────────────────────────────────────
    (async () => {
      try {
        const apptSnap = await adminDb.collection('appointments').doc(appointment_id).get();
        if (!apptSnap.exists) return;
        const appt = apptSnap.data()!;
        if (!appt.phone) return;

        await sendTreatmentPlanNotify(appt.phone, {
          customerName:    appt.name,
          diagnosis:       diagnosis || undefined,
          planDetail:      plan_detail || appt.service,
          sessionsTotal:   sessions_total ?? 1,
          nextSessionDate: next_session_date || undefined,
          doctorName:      doctorName || undefined,
        });
      } catch (err) {
        console.error('[TreatmentPlan] Zalo notify error (non-fatal):', err);
      }
    })();

    return NextResponse.json({ plan: planData }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const user = await getServerUser();
  if (!user || user.role !== 'bac_si') {
    return NextResponse.json({ error: 'Chỉ bác sĩ mới có thể cập nhật phác đồ' }, { status: 403 });
  }

  const { id, appointment_id, sessions_done, next_session_date, notes } = await req.json();
  if (!id || !appointment_id) return NextResponse.json({ error: 'Thiếu id hoặc appointment_id' }, { status: 400 });

  try {
    const updates: Record<string, unknown> = { updated_at: new Date() };
    if (sessions_done    !== undefined) updates.sessions_done     = sessions_done;
    if (next_session_date !== undefined) updates.next_session_date = next_session_date || null;
    if (notes            !== undefined) updates.notes             = notes;

    await adminDb
      .collection('appointments')
      .doc(appointment_id)
      .collection('treatment_plans')
      .doc(id)
      .update(updates);

    return NextResponse.json({ message: 'Đã cập nhật' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
