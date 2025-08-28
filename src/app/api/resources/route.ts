import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');

  let whereClause = {};

  if (userRole !== 'ADMIN') {
    // Se não for ADMIN, só pode ver os próprios recursos
    whereClause = { ownerId: userId };
  }

  const resources = await prisma.resource.findMany({
    where: whereClause,
  });
  return NextResponse.json(resources);
}

export async function POST(request: Request) {
  const { name, description, ownerId } = await request.json();
  const newResource = await prisma.resource.create({
    data: {
      name,
      description,
      ownerId,
    },
  });
  return NextResponse.json(newResource, { status: 201 });
}
