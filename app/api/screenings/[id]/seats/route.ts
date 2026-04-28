import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const screening = await prisma.screening.findUnique({
    where: { id },
    include: {
      hall: {
        include: {
          seats: { orderBy: [{ row: "asc" }, { number: "asc" }] },
        },
      },
      bookings: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
        include: {
          bookingSeats: { select: { seatId: true } },
        },
      },
    },
  });

  if (!screening) {
    return NextResponse.json({ error: "상영 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  const takenSeatIds = screening.bookings.flatMap((b) =>
    b.bookingSeats.map((bs) => bs.seatId)
  );

  return NextResponse.json({
    seats: screening.hall.seats,
    takenSeats: takenSeatIds.map((seatId) => ({ seatId })),
  });
}
