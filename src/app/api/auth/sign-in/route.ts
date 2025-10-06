import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "gg_session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const sessionPayload = Buffer.from(
      JSON.stringify({ id: user.stackUserId, displayName: user.displayName, email: user.email, profileImageUrl: user.profileImageUrl || undefined, role: user.role })
    ).toString("base64");

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, sessionPayload, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("Sign-in error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


