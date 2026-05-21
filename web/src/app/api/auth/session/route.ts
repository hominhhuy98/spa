import { NextResponse } from 'next/server';
import { createSessionCookie, clearSessionCookie } from '@/lib/firebase-session';

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    // Validate format JWT (header.payload.signature) + giới hạn độ dài chống DoS
    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }
    if (idToken.length > 8000 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(idToken)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // createSessionCookie sẽ verify token qua Firebase Admin (reject token giả)
    await createSessionCookie(idToken);
    return NextResponse.json({ message: 'Session created' });
  } catch (err) {
    console.error('session create error:', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}

export async function DELETE() {
  // Xoá session của chính người gọi — an toàn, không cần auth thêm
  await clearSessionCookie();
  return NextResponse.json({ message: 'Session cleared' });
}
