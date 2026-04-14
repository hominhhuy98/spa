import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { createSessionCookie } from '@/lib/firebase-session';
import { cookies } from 'next/headers';

const APP_ID       = process.env.ZALO_APP_ID!;
const APP_SECRET   = process.env.ZALO_APP_SECRET!;
const SITE_URL     = process.env.NEXT_PUBLIC_SITE_URL!;
const CALLBACK_URL = `${SITE_URL}/api/auth/zalo/callback/`;

interface ZaloTokenRes {
  access_token?: string;
  error?:        number;
  message?:      string;
}

interface ZaloUserInfo {
  id:      string;
  name:    string;
  picture: { data: { url: string } };
}

/** GET /api/auth/zalo/callback?code=...&state=... */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const origin = SITE_URL; // Dùng SITE_URL thay vì origin từ request (Cloud Run trả về 0.0.0.0:8080)
  const code  = searchParams.get('code');
  const state = searchParams.get('state');

  // Zalo domain verification: trả về HTML với meta tag khi không có code
  if (!code) {
    return new NextResponse(
      `<!DOCTYPE html><html><head><meta name="zalo-platform-site-verification" content="JFg16QRMDmTatvyAcQiBFXEdq17_qGLECp8r" /></head><body>Zalo verification</body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  const cookieStore = await cookies();
  const savedVerifier = cookieStore.get('zalo_cv')?.value;
  const savedState    = cookieStore.get('zalo_state')?.value;

  if (!savedVerifier || state !== savedState) {
    return NextResponse.redirect(`${origin}/portal/login?error=zalo_invalid`);
  }

  try {
    // 1. Đổi code lấy access_token
    const tokenRes = await fetch('https://oauth.zaloapp.com/v4/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        secret_key: APP_SECRET,
      },
      body: new URLSearchParams({
        app_id:        APP_ID,
        grant_type:    'authorization_code',
        code,
        redirect_uri:  CALLBACK_URL,
        code_verifier: savedVerifier,
      }),
    });
    const tokenData: ZaloTokenRes = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error('[Zalo OAuth] token error:', tokenData);
      return NextResponse.redirect(`${origin}/portal/login?error=zalo_token`);
    }

    // 2. Lấy thông tin người dùng Zalo
    // Thử lấy từ Graph API trước
    let zaloUser: ZaloUserInfo | null = null;
    try {
      const userRes = await fetch(
        'https://graph.zalo.me/v2.0/me?fields=id,name,picture',
        { headers: { access_token: tokenData.access_token } }
      );
      const zaloUserRaw = await userRes.json();
      console.log('[Zalo OAuth] user info response:', JSON.stringify(zaloUserRaw));

      const candidate = zaloUserRaw.data || zaloUserRaw;
      if (candidate?.id) {
        zaloUser = candidate;
      }
    } catch (err) {
      console.error('[Zalo OAuth] graph API error:', err);
    }

    // Fallback: nếu Graph API bị chặn (IP ngoài VN), decode access_token JWT
    if (!zaloUser) {
      try {
        // Zalo access_token có thể là JWT chứa user_id
        const parts = tokenData.access_token!.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          console.log('[Zalo OAuth] JWT payload:', JSON.stringify(payload));
          if (payload.user_id || payload.sub) {
            zaloUser = {
              id: String(payload.user_id || payload.sub),
              name: payload.name || 'Khách hàng Zalo',
              picture: { data: { url: '' } },
            };
          }
        }
      } catch { /* not a JWT */ }
    }

    // Fallback 2: tạo user với hash từ access_token
    if (!zaloUser) {
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update(tokenData.access_token!).digest('hex').slice(0, 16);
      zaloUser = {
        id: `zalo_${hash}`,
        name: 'Khách hàng Zalo',
        picture: { data: { url: '' } },
      };
      console.log('[Zalo OAuth] using fallback user id:', zaloUser.id);
    }

    // 3. Tìm hoặc tạo Firebase Auth user
    const deterministicEmail = `zalo_${zaloUser.id}@zalo.ydsg.vn`;
    let uid: string;

    try {
      const existing = await adminAuth.getUserByEmail(deterministicEmail);
      uid = existing.uid;
      // Cập nhật thông tin nếu cần
      await adminAuth.updateUser(uid, {
        displayName: zaloUser.name,
        photoURL: zaloUser.picture?.data?.url ?? undefined,
      });
    } catch {
      // Tạo user mới
      const newUser = await adminAuth.createUser({
        email: deterministicEmail,
        emailVerified: true,
        displayName: zaloUser.name,
        photoURL: zaloUser.picture?.data?.url ?? undefined,
      });
      uid = newUser.uid;
    }

    // Set custom claims
    await adminAuth.setCustomUserClaims(uid, { role: 'customer', zalo_id: zaloUser.id });

    // Upsert bảng customers theo zalo_id
    const customerQuery = await adminDb.collection('customers')
      .where('zalo_id', '==', zaloUser.id).limit(1).get();
    if (customerQuery.empty) {
      await adminDb.collection('customers').add({
        zalo_id: zaloUser.id,
        full_name: zaloUser.name,
        phone: null,
        created_at: new Date(),
      });
    } else {
      await customerQuery.docs[0].ref.update({ full_name: zaloUser.name });
    }

    // 4. Tạo custom token → ID token → session cookie
    const customToken = await adminAuth.createCustomToken(uid);

    // Server-side: dùng REST API để exchange custom token → ID token
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
    const signInRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: customToken, returnSecureToken: true }),
      }
    );
    const signInData = await signInRes.json();

    if (!signInData.idToken) {
      console.error('[Zalo OAuth] signIn error:', signInData);
      return NextResponse.redirect(`${origin}/portal/login?error=zalo_session`);
    }

    // Tạo session cookie
    await createSessionCookie(signInData.idToken);

    // Xoá PKCE cookies và redirect
    const redirectRes = NextResponse.redirect(`${origin}/portal`);
    redirectRes.cookies.delete('zalo_cv');
    redirectRes.cookies.delete('zalo_state');
    return redirectRes;

  } catch (err) {
    console.error('[Zalo OAuth] unexpected error:', err);
    return NextResponse.redirect(`${origin}/portal/login?error=zalo_unknown`);
  }
}
