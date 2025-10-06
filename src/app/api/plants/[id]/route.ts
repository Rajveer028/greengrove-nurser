import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { syncUserWithDatabase } from '@/actions/user.action';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sync user with database
    await syncUserWithDatabase();

    const plant = await prisma.plants.findFirst({
      where: {
        id: params.id,
        user: {
          stackUserId: user.id
        }
      }
    });

    if (!plant) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, plant });
  } catch (error) {
    console.error('Error fetching plant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sync user with database
    const dbUser = await syncUserWithDatabase();
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      stock,
      price,
      imageUrl,
      scientificName,
      careInstructions,
      wateringFrequency,
      sunlightRequirement,
      soilType,
      matureSize,
      bloomTime,
      isIndoor,
      isToxicToPets,
      difficultyLevel
    } = body;

    const plant = await prisma.plants.update({
      where: { id: params.id },
      data: {
        name,
        description,
        category,
        stock: parseInt(stock),
        price: parseFloat(price),
        imageUrl,
        scientificName,
        careInstructions,
        wateringFrequency,
        sunlightRequirement,
        soilType,
        matureSize,
        bloomTime,
        isIndoor: isIndoor ?? true,
        isToxicToPets: isToxicToPets ?? false,
        difficultyLevel,
        userId: dbUser.id
      }
    });

    return NextResponse.json({ success: true, plant });
  } catch (error) {
    console.error('Error updating plant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sync user with database
    await syncUserWithDatabase();

    const plant = await prisma.plants.findFirst({
      where: {
        id: params.id,
        user: {
          stackUserId: user.id
        }
      }
    });

    if (!plant) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }

    await prisma.plants.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Error deleting plant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

