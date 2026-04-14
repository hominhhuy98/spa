import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { status, staff_ids } = await req.json();
  const apptRef = adminDb.collection('appointments').doc(id);

  try {
    // Cập nhật status
    if (status) {
      await apptRef.update({
        status,
        updated_by: user.uid,
        updated_at: new Date(),
      });
    }

    // Cập nhật phân công nhân sự (denormalized array)
    if (Array.isArray(staff_ids)) {
      if (staff_ids.length === 0) {
        await apptRef.update({ assigned_staff: [] });
      } else {
        // Lấy thông tin profile cho từng staff_id
        const staffProfiles = await Promise.all(
          staff_ids.map(async (sid: string) => {
            const profileSnap = await adminDb.collection('profiles').doc(sid).get();
            const profileData = profileSnap.exists ? profileSnap.data() : null;
            return {
              staff_id:  sid,
              full_name: profileData?.full_name || null,
              role:      profileData?.role || null,
            };
          })
        );
        await apptRef.update({ assigned_staff: staffProfiles });
      }
    }

    return NextResponse.json({ message: 'Đã cập nhật' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
