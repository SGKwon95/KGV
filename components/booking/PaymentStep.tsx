"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, cn } from "@/lib/utils";
import { ChevronLeft, CreditCard, Smartphone } from "lucide-react";
import { useBookingStore } from "@/hooks/useBooking";
import { TICKET_TYPE_LABELS, type TicketTypeOption } from "@/types";

const PAYMENT_METHODS = [
  { id: "card", label: "신용/체크카드", icon: CreditCard },
  { id: "kakao", label: "카카오페이", icon: Smartphone },
  { id: "naver", label: "네이버페이", icon: Smartphone },
];

interface PaymentStepProps {
  screeningId: string;
  onBack: () => void;
}

export function PaymentStep({ screeningId, onBack }: PaymentStepProps) {
  const router = useRouter();
  const { selectedSeats, getTotalPrice, clearBooking, updateTicketType } = useBookingStore();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screeningId,
          seats: selectedSeats.map((s) => ({
            seatId: s.seatId,
            ticketType: s.ticketType,
            price: s.price,
          })),
          paymentMethod,
        }),
      });

      if (res.status === 401) {
        router.push("/login?redirect=/booking");
        return;
      }
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "결제에 실패했습니다.");
      }

      const { booking } = await res.json();
      clearBooking();
      router.push(`/booking/complete?bookingId=${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} /> 좌석 다시 선택
      </button>

      {/* 주문 요약 */}
      <div className="bg-kgv-gray rounded-lg p-5 mb-6">
        <h3 className="text-white font-semibold mb-4">주문 내역</h3>
        <div className="space-y-3">
          {selectedSeats.map((seat) => (
            <div key={seat.seatId} className="flex items-center justify-between gap-3">
              <span className="text-gray-300 text-sm">{seat.row}{seat.number}석</span>
              <select
                value={seat.ticketType}
                onChange={(e) => updateTicketType(seat.seatId, e.target.value as TicketTypeOption)}
                className="bg-kgv-dark text-white text-xs px-2 py-1 rounded border border-kgv-gray focus:border-kgv-red outline-none"
              >
                {Object.entries(TICKET_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <span className="text-kgv-red text-sm font-medium">{formatPrice(seat.price)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-kgv-dark mt-4 pt-4 flex justify-between">
          <span className="text-white font-semibold">총 결제금액</span>
          <span className="text-kgv-red text-xl font-bold">{formatPrice(getTotalPrice())}</span>
        </div>
      </div>

      {/* 결제 수단 */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">결제 수단</h3>
        <div className="grid grid-cols-3 gap-3">
          {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPaymentMethod(id)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors",
                paymentMethod === id
                  ? "border-kgv-red bg-kgv-red/10 text-white"
                  : "border-kgv-gray bg-kgv-gray text-gray-400 hover:border-gray-500"
              )}
            >
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded p-3 text-sm mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "결제 중..." : `${formatPrice(getTotalPrice())} 결제하기`}
      </button>
    </div>
  );
}
