import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { syncUserWithDatabase } from '@/actions/user.action';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await syncUserWithDatabase();
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Owners see orders where they are seller; customers see orders where they are buyer
    const where = user.role === 'CUSTOMER'
      ? { buyerUserId: dbUser.id }
      : { userId: dbUser.id };

    const orders = await prisma.order.findMany({
      where,
      orderBy: { orderDate: 'desc' },
      include: { customer: true, orderItems: { include: { plant: true } } },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
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
    const { customerId, status, orderItems, notes, deliveryDate, sellerUserId, shippingAddress, shippingCity, shippingState, shippingZip } = body as any;

    const totalAmount = (orderItems as Array<{ price: number; quantity: number }>).
      reduce((sum: number, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const created = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        status,
        totalAmount,
        orderDate: new Date(),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        notes,
        userId: sellerUserId || dbUser.id,
        buyerUserId: dbUser.id,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
        orderItems: {
          create: (orderItems as Array<{ plantId: string; quantity: number; price: number }>).
            map((i: { plantId: string; quantity: number; price: number }) => ({
              plantId: i.plantId,
              quantity: Number(i.quantity),
              price: Number(i.price),
              userId: dbUser.id,
            })),
        },
      },
      include: { customer: true, orderItems: { include: { plant: true } } },
    });

    return NextResponse.json({ success: true, order: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


