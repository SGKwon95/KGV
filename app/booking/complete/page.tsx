export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "예매 완료" };

interface PageProps {
  searchParams: Promise<{ bookingId?: string }>;
}

export default async function BookingCompletePage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { bookingId } = await searchParams;
  if (!bookingId) notFound();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId, userId: session.user.id },
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

  if (!booking) notFound();

  const { screening, bookingSeats } = booking;

  return (
    <div className="container-main py-16 max-w-lg mx-auto text-center">
      <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-white mb-2">예매 완료!</h1>
      <p className="text-gray-400 mb-8">예매가 성공적으로 완료되었습니다.</p>

      <div className="bg-kgv-gray rounded-xl p-6 text-left space-y-4 mb-8">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">예매번호</span>
          <span className="text-white text-sm font-mono">{booking.bookingNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">영화</span>
          <span className="text-white text-sm">{screening.movie.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">극장</span>
          <span className="text-white text-sm">{screening.hall.theater.name} {screening.hall.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">일시</span>
          <span className="text-white text-sm">{formatDate(screening.startTime, "yyyy.MM.dd HH:mm")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">좌석</span>
          <span className="text-white text-sm">
            {bookingSeats.map((bs) => `${bs.seat.row}${bs.seat.number}`).join(", ")}
          </span>
        </div>
        <div className="border-t border-kgv-dark pt-4 flex justify-between">
          <span className="text-white font-semibold">결제금액</span>
          <span className="text-kgv-red font-bold">{formatPrice(booking.totalPrice)}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/mypage" className="flex-1 btn-secondary text-center">
          예매 내역 보기
        </Link>
        <Link href="/movies" className="flex-1 btn-primary text-center">
          영화 더보기
        </Link>
      </div>
    </div>
  );
}
