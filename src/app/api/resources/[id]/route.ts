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
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    const resource = await prisma.resource.findUnique({
      where: {
        id,
      },
    });

    if (!resource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    // Authorization check
    if (userRole !== 'ADMIN' && resource.ownerId !== userId) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching resource', error }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    const { name, description } = await request.json();

    const existingResource = await prisma.resource.findUnique({
      where: {
        id,
      },
    });

    if (!existingResource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    // Authorization check
    if (userRole !== 'ADMIN' && existingResource.ownerId !== userId) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    const updatedResource = await prisma.resource.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedResource);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating resource', error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    const existingResource = await prisma.resource.findUnique({
      where: {
        id,
      },
    });

    if (!existingResource) {
      return NextResponse.json({ message: 'Resource not found' }, { status: 404 });
    }

    // Authorization check
    if (userRole !== 'ADMIN' && existingResource.ownerId !== userId) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    await prisma.resource.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting resource', error }, { status: 500 });
  }
}
