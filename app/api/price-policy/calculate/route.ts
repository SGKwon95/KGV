import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateTicketPrice } from "@/lib/pricing";
import type { TicketTypeOption } from "@/types";

const TICKET_TYPES = ["ADULT", "TEEN", "CHILD", "SENIOR", "DISABLED"];

// GET /api/price-policy/calculate?ticketType=ADULT&screeningId=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticketType  = searchParams.get("ticketType");
  const screeningId = searchParams.get("screeningId");

  if (!ticketType || !screeningId) {
    return NextResponse.json({ error: "ticketType, screeningId는 필수입니다." }, { status: 400 });
  }
  if (!TICKET_TYPES.includes(ticketType)) {
    return NextResponse.json({ error: "유효하지 않은 ticketType입니다." }, { status: 400 });
  }

  const screening = await prisma.screening.findUnique({
    where: { id: screeningId },
    include: { hall: true },
  });
  if (!screening) {
    return NextResponse.json({ error: "상영 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  const breakdown = await calculateTicketPrice(
    ticketType as TicketTypeOption,
    screening.hall.hallType,
    screening.startTime
  );

  return NextResponse.json({ success: true, data: breakdown });
}
