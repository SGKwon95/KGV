import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

// GET /api/price-policy — 정책 조회 (?group=TICKET&active=true 등 필터 가능)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const group  = searchParams.get("group");
  const active = searchParams.get("active");

  const policies = await prisma.pricePolicy.findMany({
    where: {
      ...(group  ? { policyGroup: group }  : {}),
      ...(active === "true" ? { isActive: true } : {}),
    },
    orderBy: [{ policyGroup: "asc" }, { sortOrder: "asc" }, { startAt: "desc" }],
  });
  return NextResponse.json({ success: true, data: policies });
}

// POST /api/price-policy — 정책 일괄 저장 (ADMIN 전용)
const policyItemSchema = z.object({
  id:          z.string().optional(),
  policyGroup: z.enum(["TICKET", "HALL", "TIME", "DAY"]),
  code:        z.string().min(1),
  label:       z.string().min(1),
  value:       z.number(),
  description: z.string().optional().nullable(),
  startAt:     z.string().datetime().optional().nullable(),
  endAt:       z.string().datetime().optional().nullable(),
  sortOrder:   z.number().int().optional(),
  isActive:    z.boolean().optional(),
});

const bodySchema = z.object({
  policies: z.array(policyItemSchema),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
    }

    const body = await request.json();
    const { policies } = bodySchema.parse(body);

    await prisma.$transaction(
      policies.map((p) => {
        const data = {
          policyGroup: p.policyGroup,
          code:        p.code,
          label:       p.label,
          value:       p.value,
          description: p.description ?? null,
          startAt:     p.startAt ? new Date(p.startAt) : null,
          endAt:       p.endAt   ? new Date(p.endAt)   : null,
          sortOrder:   p.sortOrder ?? 0,
          isActive:    p.isActive ?? true,
        };
        if (p.id) {
          return prisma.pricePolicy.update({ where: { id: p.id }, data });
        }
        return prisma.pricePolicy.create({ data });
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "저장에 실패했습니다." }, { status: 500 });
  }
}
