import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const hash = await bcrypt.hash("password123", 12);

  await prisma.user.updateMany({
    where: { email: { in: ["hong@kgv.com", "test@kgv.com"] } },
    data: { password: hash },
  });

  return NextResponse.json({ ok: true, message: "비밀번호 재설정 완료" });
}
