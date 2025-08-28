
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Limpa o cookie de autenticação
  cookies().delete('token');

  return new NextResponse(JSON.stringify({ message: 'Logout successful' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
