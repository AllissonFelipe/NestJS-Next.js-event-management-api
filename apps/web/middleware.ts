import { NextRequest, NextResponse } from 'next/server';

// HELPERS
function isPublicGetRoute(pathname: string, method: string) {
  // ROTA '/auth' SEMPRE PÚBLICO
  if (pathname.startsWith('/auth')) return true;
  // GET ['/events, '/events/:id] PÚBLICO
  if (method === 'GET' && pathname.startsWith('/events')) return true;

  return false;
}

// MIDDLEWARE
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const method = req.method;

  const token = req.cookies.get('accessToken')?.value;

  const isLoginRoute = pathname.startsWith('/auth/login');
  const isLogoutRoute = pathname.startsWith('/auth/logout');
  const isPublic = isPublicGetRoute(pathname, method);

  const loginUrl = new URL('/auth/login', req.url);

  // tudo protegido, exceto GET [/events, /events/:id] público
  if (!isPublic && !token) {
    loginUrl.searchParams.set('redirect', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // evita login quando já está logado
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/events', req.url));
  }
  // evita logout quando já esta sem logar
  if (isLogoutRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

// MATCHER
export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};
