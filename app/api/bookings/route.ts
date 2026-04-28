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
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    // 이미 예약된 좌석인지 확인
    const existingBookings = await prisma.bookingSeat.findMany({
      where: {
        seatId: { in: data.seats.map((s) => s.seatId) },
        booking: { screeningId: data.screeningId, status: { in: ["PENDING", "CONFIRMED"] } },
      },
    });

    if (existingBookings.length > 0) {
      return NextResponse.json(
        { error: "이미 예약된 좌석이 포함되어 있습니다." },
        { status: 409 }
      );
    }

    const totalPrice = data.seats.reduce((sum, s) => sum + s.price, 0);

    const booking = await prisma.booking.create({
      data: {
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
        bookingSeats: { include: { seat: true } },
        screening: {
          include: {
            movie: true,
            hall: { include: { theater: true } },
          },
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
