export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { BookingHistory } from "@/components/mypage/BookingHistory";
import { UserProfile } from "@/components/mypage/UserProfile";

export const metadata: Metadata = {
  title: "마이페이지",
};

export default async function MyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, bookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        nickname: true,
        phone: true,
        image: true,
        point: true,
        createdAt: true,
      },
    }),
    prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        screening: {
          include: {
            movie: { select: { title: true, posterUrl: true } },
            hall: { include: { theater: true } },
          },
        },
        bookingSeats: {
          include: { seat: { select: { row: true, number: true } } },
        },
      },
      orderBy: { bookedAt: "desc" },
    }),
  ]);

  if (!user) redirect("/login");

  return (
    <div className="container-main py-10">
      <h1 className="section-title">마이페이지</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <UserProfile user={user} />
        </div>
        <div className="lg:col-span-2">
          <BookingHistory bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
