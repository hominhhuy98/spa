import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import StaffAppointmentClient from '@/app/bac-si/[id]/StaffAppointmentClient';

export default async function NhanVienAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getServerUser();
  if (!user) redirect('/login');

  const appointmentDoc = await adminDb.collection('appointments').doc(id).get();
  if (!appointmentDoc.exists) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appointment = { id: appointmentDoc.id, ...appointmentDoc.data() } as any;

  const [historySnap, notesSnap, prescriptionsSnap, plansSnap, profilesSnap] = await Promise.all([
    adminDb.collection('appointments')
      .where('phone', '==', appointment.phone)
      .orderBy('date', 'desc')
      .get(),
    adminDb.collection('appointments').doc(id).collection('treatment_notes')
      .orderBy('created_at')
      .get(),
    adminDb.collection('appointments').doc(id).collection('prescriptions')
      .orderBy('created_at', 'desc')
      .get(),
    adminDb.collection('appointments').doc(id).collection('treatment_plans')
      .orderBy('created_at', 'desc')
      .get(),
    adminDb.collection('profiles').get(),
  ]);

  const history = historySnap.docs.map(doc => {
    const d = doc.data();
    return { id: doc.id, name: d.name, phone: d.phone, service: d.service, date: d.date, time: d.time, status: d.status, notes: d.notes };
  });

  const profileMap: Record<string, string> = {};
  const allProfiles = profilesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Record<string, unknown>));
  allProfiles.forEach(p => { profileMap[p.id as string] = (p.full_name as string) || ''; });

  const treatNotes = notesSnap.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      note_text: d.note_text || '',
      created_at: d.created_at?.toDate?.()?.toISOString?.() || '',
      profiles: { full_name: d.staff_name || profileMap[d.staff_id] || '' },
    };
  });

  const prescriptions = prescriptionsSnap.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      diagnosis: d.diagnosis || null,
      notes: d.notes || null,
      created_at: d.created_at?.toDate?.()?.toISOString?.() || '',
      profiles: { full_name: d.doctor_name || profileMap[d.prescribed_by] || '' },
      prescription_items: d.items || [],
    };
  });

  const treatmentPlans = plansSnap.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      diagnosis: d.diagnosis || null,
      plan_detail: d.plan_detail || null,
      sessions_total: d.sessions_total || 1,
      sessions_done: d.sessions_done || 0,
      next_session_date: d.next_session_date || null,
      notes: d.notes || null,
      created_at: d.created_at?.toDate?.()?.toISOString?.() || '',
      updated_at: d.updated_at?.toDate?.()?.toISOString?.() || '',
      profiles: { full_name: d.doctor_name || profileMap[d.prescribed_by] || '' },
    };
  });

  const staffList = allProfiles
    .filter(p => p.role === 'nhan_vien')
    .map(p => ({ id: p.id as string, full_name: (p.full_name as string) || '' }));

  const doctorList = allProfiles
    .filter(p => p.role === 'bac_si')
    .map(p => ({ id: p.id as string, full_name: (p.full_name as string) || '' }));

  return (
    <StaffAppointmentClient
      appointment={appointment}
      notes={treatNotes}
      staffId={user.uid}
      backHref="/nhan-vien"
      patientHistory={history}
      staffRole="nhan_vien"
      staffList={staffList}
      doctorList={doctorList}
      prescriptions={prescriptions}
      treatmentPlans={treatmentPlans}
    />
  );
}
