import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
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
    });
    if (!screening) {
      return NextResponse.json({ error: "상영 정보를 찾을 수 없습니다." }, { status: 404 });
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

    const totalPrice = data.seats.reduce((sum, s) => sum + s.price, 0);
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
          create: data.seats.map((s) => ({
            seatId: s.seatId,
            ticketType: s.ticketType,
            price: s.price,
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
