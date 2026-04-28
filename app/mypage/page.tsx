export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { BookingHistory } from "@/components/mypage/BookingHistory";
import { UserProfile } from "@/components/mypage/UserProfile";

export const metadata: Metadata = {
  title: "마이페이지",
};

export default async function MyPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/mypage");
  }

  const user = await prisma.user.findUnique({
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
  });

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: {
      screening: {
        include: {
          movie: { select: { title: true, posterUrl: true } },
          hall: {
            include: {
              theater: { select: { name: true } },
            },
          },
        },
      },
      bookingSeats: {
        include: {
          seat: { select: { row: true, number: true } },
        },
      },
    },
    orderBy: { bookedAt: "desc" },
    take: 20,
  });

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
