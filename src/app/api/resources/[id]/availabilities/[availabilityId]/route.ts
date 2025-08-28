import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    id: string; // resourceId
    availabilityId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id, availabilityId } = params;
    const availability = await prisma.availability.findUnique({
      where: {
        id: availabilityId,
        resourceId: id,
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
    const { id, availabilityId } = params;
    const { startTime, endTime } = await request.json();

    const updatedAvailability = await prisma.availability.update({
      where: {
        id: availabilityId,
        resourceId: id,
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
    const { id, availabilityId } = params;
    await prisma.availability.delete({
      where: {
        id: availabilityId,
        resourceId: id,
      },
    });

    return NextResponse.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting availability', error }, { status: 500 });
  }
}
