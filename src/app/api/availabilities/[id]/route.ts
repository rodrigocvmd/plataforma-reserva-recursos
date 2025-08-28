import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const availability = await prisma.availability.findUnique({
      where: {
        id,
      },
    });

    if (!availability) {
      return NextResponse.json({ message: 'Availability not found' }, { status: 404 });
    }

    return NextResponse.json(availability);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching availability', error }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const { startTime, endTime } = await request.json();

    const updatedAvailability = await prisma.availability.update({
      where: {
        id,
      },
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json(updatedAvailability);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating availability', error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.availability.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting availability', error }, { status: 500 });
  }
}
