import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { deviceTokens } from '@/lib/device-token';

export default auth(async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get('device-token')?.value; // Cookieからdevice-tokenを取得してチェック
  const isValidDevice = token && deviceTokens.has(token);

  // device-registerページの処理
  if (pathname === '/device-register') {
    if (!token) return NextResponse.next();
    if (isValidDevice) return NextResponse.redirect(new URL('/login', origin));
    return new NextResponse('Access Denied: Invalid device', { status: 401 }); // 無効なトークンの場合はアクセス拒否
  }

  // それ以外のパスでの端末認証
  if (!isValidDevice) {
    return new NextResponse('Access Denied: Invalid device', { status: 401 });
  }

  // auth認証（トップ,ログインページは除く）
  if (!req.auth && pathname !== '/' && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', origin));
  }

  // 端末認証とauth認証済みならば、有効期限を延長して通す
  const response = NextResponse.next();
  response.cookies.set('device-token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30日
  });
  return response;
});

// ミドルウェアの適用範囲
export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
