import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function GET() {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const snapshot = await adminDb.collection('profiles').orderBy('created_at', 'desc').get();
    const staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ staff });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { full_name, email, password, role } = await req.json();
  if (!full_name || !email || !password || !role) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
  }

  try {
    // Tạo Firebase Auth user
    const authUser = await adminAuth.createUser({
      email,
      password,
      emailVerified: true,
    });

    // Set custom claims (role)
    await adminAuth.setCustomUserClaims(authUser.uid, { role });

    // Tạo profile doc
    await adminDb.collection('profiles').doc(authUser.uid).set({
      role,
      full_name,
      email,
      is_active: true,
      created_at: new Date(),
    });

    return NextResponse.json({ message: 'Đã tạo tài khoản thành công' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
