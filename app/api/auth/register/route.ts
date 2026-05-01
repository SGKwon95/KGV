import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  loginId:  z.string().min(4).max(20).regex(/^[a-z0-9_]+$/),
  name:     z.string().min(2, "이름은 2자 이상이어야 합니다."),
  email:    z.string().email("올바른 이메일을 입력해주세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  phone:    z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const [existingId, existingEmail] = await Promise.all([
      prisma.user.findUnique({ where: { loginId: data.loginId } }),
      prisma.user.findUnique({ where: { email: data.email } }),
    ]);

    if (existingId) {
      return NextResponse.json({ error: "이미 사용 중인 아이디입니다." }, { status: 409 });
    }
    if (existingEmail) {
      return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        loginId:  data.loginId,
        name:     data.name,
        email:    data.email,
        password: hashedPassword,
        phone:    data.phone,
      },
      select: { id: true, loginId: true, name: true, email: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "회원가입에 실패했습니다." }, { status: 500 });
  }
}
