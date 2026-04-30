import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "hong@kgv.com" },
      select: { id: true, email: true, name: true },
    });
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
