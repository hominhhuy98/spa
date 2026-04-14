import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getServerUser();
  const role = user?.role;
  if (!user || !['admin', 'bac_si', 'nhan_vien'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const snapshot = await adminDb
      .collection('appointments')
      .doc(id)
      .collection('treatment_notes')
      .orderBy('created_at', 'asc')
      .get();

    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ notes });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getServerUser();
  const role = user?.role;
  if (!user || !['admin', 'bac_si', 'nhan_vien'].includes(role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { note_text } = await req.json();
  if (!note_text?.trim()) return NextResponse.json({ error: 'Nội dung ghi chú trống' }, { status: 400 });

  try {
    // Get staff name from profiles
    const profileDoc = await adminDb.collection('profiles').doc(user.uid).get();
    const staffName = profileDoc.exists ? profileDoc.data()?.full_name ?? '' : '';

    const noteData = {
      appointment_id: id,
      staff_id: user.uid,
      staff_name: staffName,
      note_text,
      created_at: new Date(),
    };

    const docRef = await adminDb
      .collection('appointments')
      .doc(id)
      .collection('treatment_notes')
      .add(noteData);

    return NextResponse.json({
      note: {
        id: docRef.id,
        ...noteData,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
