import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
import { sendAppointmentComplete } from '@/lib/zalo-notify';

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['done', 'cancelled'],
};

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getServerUser();
  const role = user?.role;
  if (!user || !['admin', 'bac_si', 'nhan_vien'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { status: newStatus } = await req.json();

  // Lấy trạng thái hiện tại
  const apptRef = adminDb.collection('appointments').doc(id);
  const apptSnap = await apptRef.get();
  if (!apptSnap.exists) {
    return NextResponse.json({ error: 'Không tìm thấy lịch hẹn' }, { status: 404 });
  }
  const appt = apptSnap.data()!;

  // Admin không bị giới hạn transition
  if (role !== 'admin') {
    const allowed = ALLOWED_TRANSITIONS[appt.status] ?? [];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json({ error: 'Chuyển trạng thái không hợp lệ' }, { status: 400 });
    }
  }

  try {
    await apptRef.update({
      status: newStatus,
      updated_by: user.uid,
      updated_at: new Date(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // ── Gửi Zalo ZNS khi hoàn thành lượt khám ─────────────────────────────────
  if (newStatus === 'done') {
    (async () => {
      try {
        const fullAppt = (await apptRef.get()).data();
        if (!fullAppt?.phone) return;

        // Lấy đơn thuốc (subcollection)
        const rxSnap = await apptRef.collection('prescriptions').get();
        const rxList = rxSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Lấy phác đồ (subcollection)
        const planSnap = await apptRef.collection('treatment_plans').get();
        const plans = planSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Lấy tên bác sĩ
        let doctorName = 'YDSG';
        if (user.uid) {
          const profileSnap = await adminDb.collection('profiles').doc(user.uid).get();
          if (profileSnap.exists) {
            const profile = profileSnap.data();
            if (profile?.full_name) doctorName = profile.full_name;
          }
        }

        // Tóm tắt đơn thuốc
        const rxSummary = rxList
          .flatMap((rx: Record<string, unknown>) =>
            (Array.isArray(rx.prescription_items) ? rx.prescription_items : []).map(
              (it: { medicine_name: string; dosage?: string }) =>
                `${it.medicine_name}${it.dosage ? ' — ' + it.dosage : ''}`
            )
          ).join('; ') || undefined;

        // Tóm tắt phác đồ
        const planSummary = plans
          .map((p: Record<string, unknown>) =>
            `${p.plan_detail || 'Liệu trình'} (${p.sessions_total || 1} buổi)`)
          .join('; ') || undefined;

        // Lấy ngày tái khám từ phác đồ
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const followUp = (plans.find((p: any) => p.next_session_date) as any)?.next_session_date as string | undefined;
        const diagnosis = (rxList[0] as Record<string, unknown>)?.diagnosis as string | undefined
          || (plans[0] as Record<string, unknown>)?.diagnosis as string | undefined;

        await sendAppointmentComplete(fullAppt.phone, {
          customerName:        fullAppt.name,
          service:             fullAppt.service,
          date:                fullAppt.date,
          diagnosis:           diagnosis || undefined,
          prescriptionSummary: rxSummary,
          treatmentPlanSummary: planSummary,
          followUpDate:        followUp || undefined,
          doctorName,
        });
      } catch (err) {
        console.error('[Status→Done] Zalo notify error (non-fatal):', err);
      }
    })();
  }

  return NextResponse.json({ message: 'Đã cập nhật trạng thái' });
}
