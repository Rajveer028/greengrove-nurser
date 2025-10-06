import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { syncUserWithDatabase } from '@/actions/user.action';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sync user with database
    await syncUserWithDatabase();

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');

    const whereClause: any = {
      user: {
        stackUserId: user.id
      }
    };

    if (searchTerm) {
      whereClause.name = {
        contains: searchTerm,
        mode: 'insensitive',
      };
    }

    const plants = await prisma.plants.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, plants });
  } catch (error) {
    console.error('Error fetching plants:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const plant = await prisma.plants.create({
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

    return NextResponse.json({ success: true, plant }, { status: 201 });
  } catch (error) {
    console.error('Error creating plant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

