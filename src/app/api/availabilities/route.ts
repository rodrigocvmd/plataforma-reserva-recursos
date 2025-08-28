import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const availabilities = await prisma.availability.findMany();
  return NextResponse.json(availabilities);
}

export async function POST(request: Request) {
  const { startTime, endTime, resourceId } = await request.json();
  const newAvailability = await prisma.availability.create({
    data: {
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      resourceId,
    },
  });
  return NextResponse.json(newAvailability, { status: 201 });
}
