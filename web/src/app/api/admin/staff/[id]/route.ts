import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.full_name !== undefined) updates.full_name = body.full_name;
  if (body.role !== undefined) updates.role = body.role;
  if (body.is_active !== undefined) updates.is_active = body.is_active;

  try {
    // Update profile doc
    if (Object.keys(updates).length > 0) {
      await adminDb.collection('profiles').doc(id).update(updates);
    }

    // Update Firebase Auth custom claims if role changed
    if (body.role !== undefined) {
      const currentClaims = (await adminAuth.getUser(id)).customClaims || {};
      await adminAuth.setCustomUserClaims(id, { ...currentClaims, role: body.role });
    }

    // Update password if provided
    if (body.password) {
      await adminAuth.updateUser(id, { password: body.password });
    }

    // Disable/enable auth user
    if (body.is_active !== undefined) {
      await adminAuth.updateUser(id, { disabled: !body.is_active });
    }

    return NextResponse.json({ message: 'Đã cập nhật' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Disable auth user (không xóa hẳn để giữ data)
    await adminAuth.updateUser(id, { disabled: true });
    // Mark profile as inactive
    await adminDb.collection('profiles').doc(id).update({ is_active: false });
    return NextResponse.json({ message: 'Đã vô hiệu hóa' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
