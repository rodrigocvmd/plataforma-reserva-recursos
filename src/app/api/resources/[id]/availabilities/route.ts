import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    id: string; // resourceId
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const availabilities = await prisma.availability.findMany({
      where: {
        resourceId: id,
      },
    });
    return NextResponse.json(availabilities);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching availabilities', error }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const { startTime, endTime } = await request.json();

    const newAvailability = await prisma.availability.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        resourceId: id,
      },
    });
    return NextResponse.json(newAvailability, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating availability', error }, { status: 500 });
  }
}
