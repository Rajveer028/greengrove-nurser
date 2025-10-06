import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { displayName, email, password, role } = body as {
      displayName: string;
      email: string;
      password: string;
      role?: 'OWNER' | 'CUSTOMER';
    };

    if (!displayName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        stackUserId: crypto.randomUUID(),
        displayName,
        email,
        passwordHash,
        role: (role === 'CUSTOMER' ? Role.CUSTOMER : Role.OWNER),
      },
    });

    // Return success; client should sign in next
    return NextResponse.json({ success: true, user: { id: user.id, displayName: user.displayName, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error("Sign-up error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


