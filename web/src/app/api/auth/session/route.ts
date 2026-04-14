import { NextResponse } from 'next/server';
import { createSessionCookie, clearSessionCookie } from '@/lib/firebase-session';

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }
    await createSessionCookie(idToken);
    return NextResponse.json({ message: 'Session created' });
  } catch (err) {
    console.error('session create error:', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ message: 'Session cleared' });
}
