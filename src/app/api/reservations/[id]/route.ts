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
    const reservation = await prisma.reservation.findUnique({
      where: {
        id,
      },
    });

    if (!reservation) {
      return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching reservation', error }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const { startTime, endTime } = await request.json();

    const updatedReservation = await prisma.reservation.update({
      where: {
        id,
      },
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating reservation', error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.reservation.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting reservation', error }, { status: 500 });
  }
}
