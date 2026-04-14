import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getServerUser } from '@/lib/firebase-session';

export async function GET() {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Iterate all Firebase Auth users, filter those with zalo_id but no phone
    const unlinked: { id: string; full_name: string; zalo_id: string; email: string }[] = [];
    let nextPageToken: string | undefined;

    do {
      const listResult = await adminAuth.listUsers(1000, nextPageToken);
      for (const u of listResult.users) {
        const claims = u.customClaims || {};
        if (claims.zalo_id && !claims.phone) {
          unlinked.push({
            id: u.uid,
            full_name: u.displayName || claims.full_name || '',
            zalo_id: claims.zalo_id,
            email: u.email || '',
          });
        }
      }
      nextPageToken = listResult.pageToken;
    } while (nextPageToken);

    return NextResponse.json({ customers: unlinked });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
