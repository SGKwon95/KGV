import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { calculateBookingPrice } from "@/lib/pricing";

const bookingSchema = z.object({
  screeningId: z.string(),
  seats: z.array(
    z.object({
      seatId:     z.string(),
      ticketType: z.enum(["ADULT", "TEEN", "CHILD", "SENIOR", "DISABLED"]),
    })
  ),
  paymentMethod: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const body = await request.json();
    const data = bookingSchema.parse(body);

    const screening = await prisma.screening.findUnique({
      where: { id: data.screeningId },
      include: { hall: true },
    });
    if (!screening) {
      return NextResponse.json({ error: "상영 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 비활성 좌석 확인
    const inactiveSeat = await prisma.seat.findFirst({
      where: {
        id: { in: data.seats.map((s) => s.seatId) },
        isActive: false,
      },
    });
    if (inactiveSeat) {
      return NextResponse.json(
        { error: "예매할 수 없는 좌석이 포함되어 있습니다." },
        { status: 400 }
      );
    }

    // 이미 예약된 좌석 확인
    const conflicting = await prisma.bookingSeat.findFirst({
      where: {
        booking: {
          screeningId: data.screeningId,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        seatId: { in: data.seats.map((s) => s.seatId) },
      },
    });
    if (conflicting) {
      return NextResponse.json(
        { error: "이미 예약된 좌석이 포함되어 있습니다." },
        { status: 409 }
      );
    }

    // 서버 사이드 가격 계산 (클라이언트 값 신뢰 안 함)
    const seatRecords = await prisma.seat.findMany({
      where: { id: { in: data.seats.map((s) => s.seatId) } },
      select: { id: true, seatType: true },
    });
    const seatTypeMap = Object.fromEntries(seatRecords.map((s) => [s.id, s.seatType]));
    const seatsWithType = data.seats.map((s) => ({ ...s, seatType: seatTypeMap[s.seatId] }));

    const { seats: pricedSeats, totalPrice } = await calculateBookingPrice(
      seatsWithType,
      screening.hall.hallType,
      screening.startTime
    );

    const now = new Date();
    const bookingNumber = `KGV${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId: session.user.id,
        screeningId: data.screeningId,
        totalPrice,
        status: "CONFIRMED",
        paymentMethod: data.paymentMethod,
        bookingSeats: {
          create: pricedSeats.map((s) => ({
            seatId:     s.seatId,
            ticketType: s.ticketType,
            price:      s.price,
          })),
        },
      },
      include: {
        screening: {
          include: {
            movie: true,
            hall: { include: { theater: true } },
          },
        },
        bookingSeats: {
          include: { seat: true },
        },
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "예매에 실패했습니다." }, { status: 500 });
  }
}
