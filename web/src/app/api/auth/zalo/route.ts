import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';

const APP_ID       = process.env.ZALO_APP_ID!;
const SITE_URL     = process.env.NEXT_PUBLIC_SITE_URL!;
const CALLBACK_URL = `${SITE_URL}/api/auth/zalo/callback/`;

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/** GET /api/auth/zalo
 *  Tạo PKCE code_verifier, lưu vào cookie, trả về URL redirect Zalo */
export async function GET() {
  const codeVerifier  = base64url(randomBytes(32));
  const codeChallenge = base64url(createHash('sha256').update(codeVerifier).digest());
  const state         = randomBytes(16).toString('hex');

  const zaloUrl = new URL('https://oauth.zaloapp.com/v4/permission');
  zaloUrl.searchParams.set('app_id',        APP_ID);
  zaloUrl.searchParams.set('redirect_uri',  CALLBACK_URL);
  zaloUrl.searchParams.set('code_challenge', codeChallenge);
  zaloUrl.searchParams.set('state',         state);

  const res = NextResponse.json({ url: zaloUrl.toString() });

  // Lưu code_verifier + state vào cookie (httpOnly, 10 phút)
  res.cookies.set('zalo_cv',    codeVerifier, { httpOnly: true, maxAge: 600, path: '/', sameSite: 'lax' });
  res.cookies.set('zalo_state', state,        { httpOnly: true, maxAge: 600, path: '/', sameSite: 'lax' });

  return res;
}
