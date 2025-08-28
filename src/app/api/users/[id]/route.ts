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
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching user', error }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const { email, name, password, role } = await request.json();

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        name,
        password, // Reminder: Hash password in a real app
        role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating user', error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 });
  }
}
