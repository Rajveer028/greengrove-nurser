import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;

    const owners = await prisma.user.findMany({
      where: {
        role: 'OWNER',
        ...(q ? { OR: [
          { displayName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ] } : {}),
      },
      select: {
        id: true,
        stackUserId: true,
        displayName: true,
        email: true,
        profileImageUrl: true,
        _count: { select: { plants: true } },
      },
      orderBy: { displayName: 'asc' },
    });

    return NextResponse.json({ success: true, owners });
  } catch (error) {
    console.error('Error fetching nurseries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


