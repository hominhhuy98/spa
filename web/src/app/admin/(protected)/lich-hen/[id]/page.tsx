import { adminDb } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';
import AppointmentDetailClient from './AppointmentDetailClient';

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [appointmentDoc, staffSnap, notesSnap] = await Promise.all([
    adminDb.collection('appointments').doc(id).get(),
    adminDb.collection('profiles').where('is_active', '==', true).get(),
    adminDb.collection('appointments').doc(id).collection('treatment_notes').orderBy('created_at').get(),
  ]);

  if (!appointmentDoc.exists) notFound();

  const data = appointmentDoc.data()!;
  const appointment: Record<string, string> = {
    id: appointmentDoc.id,
    name: data.name || '',
    phone: data.phone || '',
    service: data.service || '',
    date: data.date || '',
    time: data.time || '',
    status: data.status || 'pending',
    notes: data.notes || '',
    appointment_type: data.appointment_type || '',
  };

  const staff = staffSnap.docs.map(doc => {
    const d = doc.data();
    return { id: doc.id, full_name: d.full_name || '', role: d.role || '' };
  });

  const assignedStaff = data.assigned_staff as Array<{ staff_id: string }> | undefined;
  const assignedIds = assignedStaff?.map(s => s.staff_id) ?? [];

  const notes = notesSnap.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      note_text: d.note_text || '',
      created_at: d.created_at?.toDate?.()?.toISOString?.() || '',
      profiles: { full_name: d.staff_name || '' },
    };
  });

  return (
    <AppointmentDetailClient
      appointment={appointment}
      staff={staff}
      assignedIds={assignedIds}
      notes={notes}
    />
  );
}
