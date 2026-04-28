import { NextResponse } from "next/server";
import { MOCK_SCREENINGS, MOCK_BOOKINGS, generateSeats } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const screening = MOCK_SCREENINGS.find((s) => s.id === id);
  if (!screening) {
    return NextResponse.json({ error: "상영 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  const seats = generateSeats(screening.hallId);

  // 이미 예매된 좌석 ID 수집
  const takenSeatIds = MOCK_BOOKINGS.filter(
    (b) => b.screeningId === id && (b.status === "PENDING" || b.status === "CONFIRMED")
  )
    .flatMap((b) => b.bookingSeats.map((bs) => bs.seatId));

  return NextResponse.json({
    seats,
    takenSeats: takenSeatIds.map((seatId) => ({ seatId })),
  });
}
