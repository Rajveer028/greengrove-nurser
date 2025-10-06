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
    const dbUser = await syncUserWithDatabase();
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get dashboard statistics
    const [
      totalPlants,
      totalCustomers,
      totalOrders,
      lowStockPlants,
      pendingOrders,
      upcomingCareTasks,
      completedCareTasks,
      totalRevenue
    ] = await Promise.all([
      // Total plants
      prisma.plants.count({
        where: { userId: dbUser.id }
      }),
      // Total customers
      prisma.customer.count({
        where: { userId: dbUser.id }
      }),
      // Total orders
      prisma.order.count({
        where: { userId: dbUser.id }
      }),
      // Low stock plants (stock < 10)
      prisma.plants.count({
        where: {
          userId: dbUser.id,
          stock: { lt: 10 }
        }
      }),
      // Pending orders
      prisma.order.count({
        where: {
          userId: dbUser.id,
          status: { in: ['Pending', 'Processing'] }
        }
      }),
      // Upcoming care tasks (next 7 days)
      prisma.careSchedule.count({
        where: {
          userId: dbUser.id,
          nextDue: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          isCompleted: false
        }
      }),
      // Completed care tasks (last 30 days)
      prisma.careSchedule.count({
        where: {
          userId: dbUser.id,
          isCompleted: true,
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Total revenue from completed orders
      prisma.order.aggregate({
        where: {
          userId: dbUser.id,
          status: 'Delivered'
        },
        _sum: {
          totalAmount: true
        }
      })
    ]);

    const stats = {
      totalPlants,
      totalCustomers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      lowStockPlants,
      pendingOrders,
      upcomingCareTasks,
      completedCareTasks
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

