import { NextResponse } from "next/server";
import { MOCK_BOOKINGS, MOCK_SCREENINGS, generateSeats } from "@/lib/mock-data";
import { z } from "zod";

const bookingSchema = z.object({
  screeningId: z.string(),
  seats: z.array(
    z.object({
      seatId: z.string(),
      ticketType: z.enum(["ADULT", "TEEN", "CHILD", "SENIOR", "DISABLED"]),
      price: z.number(),
    })
  ),
  paymentMethod: z.string().optional(),
});

// Mock 유저 (로그인 없이 사용)
const MOCK_USER_ID = "user-01";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    const screening = MOCK_SCREENINGS.find((s) => s.id === data.screeningId);
    if (!screening) {
      return NextResponse.json({ error: "상영 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 이미 예약된 좌석 확인
    const takenSeatIds = new Set(
      MOCK_BOOKINGS.filter(
        (b) =>
          b.screeningId === data.screeningId &&
          (b.status === "PENDING" || b.status === "CONFIRMED")
      ).flatMap((b) => b.bookingSeats.map((bs) => bs.seatId))
    );

    const conflict = data.seats.some((s) => takenSeatIds.has(s.seatId));
    if (conflict) {
      return NextResponse.json(
        { error: "이미 예약된 좌석이 포함되어 있습니다." },
        { status: 409 }
      );
    }

    const allSeats = generateSeats(screening.hallId);
    const totalPrice = data.seats.reduce((sum, s) => sum + s.price, 0);

    const now = new Date();
    const bookingId = `booking-${Date.now()}`;
    const bookingNumber = `KGV${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const booking = {
      id: bookingId,
      bookingNumber,
      userId: MOCK_USER_ID,
      screeningId: data.screeningId,
      totalPrice,
      status: "CONFIRMED",
      paymentMethod: data.paymentMethod,
      bookedAt: now,
      updatedAt: now,
      screening,
      bookingSeats: data.seats.map((s, i) => {
        const seatInfo = allSeats.find((seat) => seat.id === s.seatId);
        return {
          id: `bs-${bookingId}-${i}`,
          bookingId,
          seatId: s.seatId,
          ticketType: s.ticketType,
          price: s.price,
          seat: {
            row: seatInfo?.row ?? "?",
            number: seatInfo?.number ?? 0,
            seatType: seatInfo?.seatType ?? "STANDARD",
          },
        };
      }),
    };

    MOCK_BOOKINGS.push(booking);

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "예매에 실패했습니다." }, { status: 500 });
  }
}
