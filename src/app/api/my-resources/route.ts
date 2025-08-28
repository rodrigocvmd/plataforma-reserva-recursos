
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic'; // Força a renderização dinâmica

export async function GET() {
  const userId = headers().get('x-user-id');
  console.log('API /my-resources - User ID from header:', userId);

  if (!userId) {
    return new NextResponse(JSON.stringify({ message: 'User ID not found in token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const resources = await prisma.resource.findMany({
      where: { 
        authorId: userId,
      },
    });
    console.log('API /my-resources - Resources found:', resources);

    return new NextResponse(JSON.stringify(resources), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching user resources:', error);
    return new NextResponse(JSON.stringify({ message: 'Error fetching resources' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
