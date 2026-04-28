"use client";

import { useState, useEffect } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useBookingStore } from "@/hooks/useBooking";
import { TICKET_PRICES, TICKET_TYPE_LABELS, type TicketTypeOption } from "@/types";

interface SeatData {
  id: string;
  row: string;
  number: number;
  seatType: string;
}

interface BookingSeatData {
  seatId: string;
}

interface SeatStepProps {
  screeningId: string;
  onNext: () => void;
  onBack: () => void;
}

export function SeatStep({ screeningId, onNext, onBack }: SeatStepProps) {
  const { selectedSeats, addSeat, removeSeat, setScreeningId, getTotalPrice } = useBookingStore();
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [takenSeatIds, setTakenSeatIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setScreeningId(screeningId);
    fetch(`/api/screenings/${screeningId}/seats`)
      .then((r) => r.json())
      .then((data) => {
        setSeats(data.seats ?? []);
        setTakenSeatIds(new Set((data.takenSeats ?? []).map((s: BookingSeatData) => s.seatId)));
      })
      .finally(() => setLoading(false));
  }, [screeningId, setScreeningId]);

  const rows = [...new Set(seats.map((s) => s.row))].sort();
  const selectedIds = new Set(selectedSeats.map((s) => s.seatId));

  const toggleSeat = (seat: SeatData) => {
    if (takenSeatIds.has(seat.id)) return;
    if (selectedIds.has(seat.id)) {
      removeSeat(seat.id);
    } else {
      addSeat({
        seatId: seat.id,
        row: seat.row,
        number: seat.number,
        seatType: seat.seatType,
        ticketType: "ADULT",
        price: TICKET_PRICES.ADULT,
      });
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">좌석 정보 불러오는 중...</div>;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4 transition-colors">
        <ChevronLeft size={16} /> 시간 다시 선택
      </button>

      {/* 스크린 */}
      <div className="text-center mb-8">
        <div className="inline-block bg-white/10 rounded px-16 py-2 text-xs text-gray-400 mb-2">SCREEN</div>
      </div>

      {/* 좌석 그리드 */}
      <div className="overflow-x-auto mb-8">
        <div className="inline-block min-w-full">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-1 mb-1 justify-center">
              <span className="text-xs text-gray-500 w-5 text-center">{row}</span>
              {seats
                .filter((s) => s.row === row)
                .sort((a, b) => a.number - b.number)
                .map((seat) => {
                  const taken = takenSeatIds.has(seat.id);
                  const selected = selectedIds.has(seat.id);
                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      disabled={taken}
                      className={cn(
                        "w-7 h-7 rounded-t-lg text-xs font-medium transition-colors",
                        taken
                          ? "bg-gray-700 text-gray-600 cursor-not-allowed"
                          : selected
                            ? "bg-kgv-red text-white"
                            : "bg-kgv-gray hover:bg-kgv-red/40 text-gray-300"
                      )}
                    >
                      {seat.number}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex gap-6 justify-center mb-8 text-xs text-gray-400">
        {[
          { color: "bg-kgv-gray", label: "선택가능" },
          { color: "bg-kgv-red", label: "선택됨" },
          { color: "bg-gray-700", label: "매진" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className={cn("w-4 h-4 rounded-sm", color)} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* 선택한 좌석 & 총 금액 */}
      {selectedSeats.length > 0 && (
        <div className="bg-kgv-gray rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm text-gray-400">선택한 좌석</p>
              <p className="text-white mt-1">
                {selectedSeats.map((s) => `${s.row}${s.number}`).join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">합계</p>
              <p className="text-kgv-red font-bold text-lg">{formatPrice(getTotalPrice())}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={selectedSeats.length === 0}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        결제하기 ({selectedSeats.length}석)
      </button>
    </div>
  );
}
