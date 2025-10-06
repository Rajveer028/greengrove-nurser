import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { syncUserWithDatabase } from '@/actions/user.action';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await syncUserWithDatabase();

    const { searchParams } = new URL(request.url);
    const plantId = searchParams.get('plantId') || undefined;

    const schedules = await prisma.careSchedule.findMany({
      where: {
        user: { stackUserId: user.id },
        ...(plantId ? { plantId } : {}),
      },
      orderBy: { nextDue: 'asc' },
      include: { plant: true },
    });

    return NextResponse.json({ success: true, careSchedules: schedules });
  } catch (error) {
    console.error('Error fetching care schedules:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await syncUserWithDatabase();
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const { plantId, taskType, frequency, lastPerformed, nextDue, notes } = body;

    const schedule = await prisma.careSchedule.create({
      data: {
        plantId,
        taskType,
        frequency,
        lastPerformed: lastPerformed ? new Date(lastPerformed) : null,
        nextDue: new Date(nextDue),
        isCompleted: false,
        notes,
        userId: dbUser.id,
      },
    });

    return NextResponse.json({ success: true, careSchedule: schedule }, { status: 201 });
  } catch (error) {
    console.error('Error creating care schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


