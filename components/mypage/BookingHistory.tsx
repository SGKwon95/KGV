import Image from "next/image";
import { formatDate, formatPrice } from "@/lib/utils";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingHistoryProps {
  bookings: {
    id: string;
    bookingNumber: string;
    totalPrice: number;
    status: string;
    bookedAt: Date;
    screening: {
      startTime: Date;
      movie: { title: string; posterUrl?: string | null };
      hall: {
        name: string;
        theater: { name: string };
      };
    };
    bookingSeats: {
      seat: { row: string; number: number };
    }[];
  }[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  CONFIRMED: { label: "예매완료", color: "text-green-400" },
  PENDING: { label: "결제대기", color: "text-yellow-400" },
  CANCELLED: { label: "취소됨", color: "text-gray-500" },
  REFUNDED: { label: "환불완료", color: "text-gray-500" },
};

export function BookingHistory({ bookings }: BookingHistoryProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Ticket size={20} className="text-kgv-red" />
        예매 내역
      </h2>

      {bookings.length === 0 ? (
        <div className="bg-kgv-gray rounded-xl p-12 text-center text-gray-400">
          예매 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const { screening } = booking;
            const status = STATUS_LABELS[booking.status] ?? { label: booking.status, color: "text-gray-400" };
            const seats = booking.bookingSeats.map((bs) => `${bs.seat.row}${bs.seat.number}`).join(", ");
            const isPast = new Date(screening.startTime) < new Date();

            return (
              <div
                key={booking.id}
                className={cn(
                  "bg-kgv-gray rounded-xl p-4 flex gap-4",
                  (booking.status === "CANCELLED" || isPast) && "opacity-60"
                )}
              >
                {/* 포스터 */}
                <div className="flex-shrink-0 w-16 h-24 relative rounded overflow-hidden bg-kgv-dark">
                  {screening.movie.posterUrl ? (
                    <Image
                      src={screening.movie.posterUrl}
                      alt={screening.movie.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">🎬</div>
                  )}
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-white font-semibold truncate">{screening.movie.title}</h3>
                    <span className={cn("text-xs flex-shrink-0", status.color)}>{status.label}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {screening.hall.theater.name} · {screening.hall.name}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    {formatDate(screening.startTime, "yyyy.MM.dd HH:mm")}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">좌석: {seats}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 font-mono">{booking.bookingNumber}</span>
                    <span className="text-kgv-red text-sm font-bold">{formatPrice(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
