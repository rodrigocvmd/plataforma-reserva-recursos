import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const reservations = await prisma.reservation.findMany();
  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  const { startTime, endTime, userId, resourceId } = await request.json();
  const newReservation = await prisma.reservation.create({
    data: {
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      userId,
      resourceId,
    },
  });
  return NextResponse.json(newReservation, { status: 201 });
}
