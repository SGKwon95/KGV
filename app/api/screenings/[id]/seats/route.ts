import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const screening = await prisma.screening.findUnique({
    where: { id },
    include: { hall: true },
  });

  if (!screening) {
    return NextResponse.json({ error: "상영 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  const seats = await prisma.seat.findMany({
    where: { hallId: screening.hallId },
    orderBy: [{ row: "asc" }, { number: "asc" }],
  });

  const takenSeats = await prisma.bookingSeat.findMany({
    where: {
      booking: {
        screeningId: id,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    },
    select: { seatId: true },
  });

  return NextResponse.json({ seats, takenSeats });
}
