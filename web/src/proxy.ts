import { NextRequest, NextResponse } from 'next/server';
import { decodeSessionCookie } from '@/lib/firebase-session';

// Route prefix → roles được phép truy cập
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin':     ['admin'],
  '/bac-si':    ['admin', 'bac_si'],
  '/nhan-vien': ['admin', 'nhan_vien'],
  '/portal':    ['customer'],
};

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('__session')?.value;
  const user = sessionCookie ? decodeSessionCookie(sessionCookie) : null;

  const { pathname } = request.nextUrl;

  // Tìm route protected khớp với pathname hiện tại
  const matchedPrefix = Object.keys(PROTECTED_ROUTES).find(prefix =>
    pathname.startsWith(prefix)
  );

  // Route công khai — cho qua
  if (!matchedPrefix) return NextResponse.next();

  // Chưa đăng nhập → redirect đến trang login chung
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  const allowedRoles = PROTECTED_ROUTES[matchedPrefix];

  // Portal khách hàng — staff/admin không được vào, redirect về dashboard của họ
  if (matchedPrefix === '/portal') {
    const role = user.role;
    if (role === 'admin' || role === 'bac_si' || role === 'nhan_vien') {
      const dashboard = role === 'admin' ? '/admin' : role === 'bac_si' ? '/bac-si' : '/nhan-vien';
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
    return NextResponse.next();
  }

  // Admin / Bác sĩ / Nhân viên — kiểm tra role
  if (!user.role || !allowedRoles.includes(user.role)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/bac-si/:path*',
    '/nhan-vien/:path*',
    '/portal',
    '/portal/((?!verify).*)',
  ],
};
