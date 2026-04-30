import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const generalHash = await bcrypt.hash("password123", 12);
  const adminHash = await bcrypt.hash("admin1234", 12);

  await prisma.user.updateMany({
    where: { email: { in: ["hong@kgv.com", "test@kgv.com"] } },
    data: { password: generalHash },
  });

  await prisma.user.update({
    where: { email: "admin@kgv.com" },
    data: { password: adminHash },
  });

  return NextResponse.json({ ok: true, message: "비밀번호 재설정 완료" });
}
