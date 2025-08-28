import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface UserJwtPayload {
  userId: string;
  role: 'ADMIN' | 'USER';
  iat: number;
  exp: number;
}

const PUBLIC_ROUTES = {
  '/api/auth/login': ['POST'],
  '/api/users': ['POST'], // Permitir o registro de novos usuários
};

function isPublicRoute(request: NextRequest): boolean {
  const path = request.nextUrl.pathname;
  const method = request.method.toUpperCase();
  
  if (PUBLIC_ROUTES[path] && PUBLIC_ROUTES[path].includes(method)) {
    return true;
  }
  
  return false;
}

export async function middleware(request: NextRequest) {
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return new NextResponse(
      JSON.stringify({ message: 'Authentication token is missing' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-secret');
    const { payload } = await jwtVerify(token, secret) as { payload: UserJwtPayload };

    const { method, nextUrl } = request;
    const isAdmin = payload.role === 'ADMIN';

    if (nextUrl.pathname.startsWith('/api/users') && (method === 'DELETE' || method === 'PUT')) {
      if (!isAdmin) {
        return new NextResponse(
          JSON.stringify({ message: 'Administrator access required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or expired token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: [
    '/api/resources/:path*',
    '/api/availabilities/:path*',
    '/api/reservations/:path*',
    '/api/users/:path*',
    '/api/auth/me',
    '/api/my-resources',
  ],
};
