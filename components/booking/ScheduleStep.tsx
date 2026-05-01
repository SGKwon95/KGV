"use client";

import { useState, useEffect } from "react";
import { formatDate, formatPrice, cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface Theater {
  id: string;
  name: string;
  region: string;
}

interface Screening {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  hall: {
    name: string;
    hallType: string;
    totalSeats: number;
    theater: { id: string; name: string; region: string };
  };
  _count: { bookings: number };
}

interface ScheduleStepProps {
  movieId: string;
  theaters: Theater[];
  onSelect: (screeningId: string) => void;
  onBack: () => void;
}

// 오늘 기준 7일치 날짜
function getDateRange() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function ScheduleStep({ movieId, theaters, onSelect, onBack }: ScheduleStepProps) {
  const dates = getDateRange();
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(false);

  const regions = [...new Set(theaters.map((t) => t.region))];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ movieId, date: selectedDate });
    fetch(`/api/screenings?${params}`)
      .then((r) => r.json())
      .then((data) => setScreenings(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [movieId, selectedDate]);

  const filtered = selectedRegion
    ? screenings.filter((s) => s.hall.theater.region === selectedRegion)
    : screenings;

  // 극장별로 그룹핑
  const grouped = filtered.reduce<Record<string, Screening[]>>((acc, s) => {
    const key = s.hall.theater.name;
    acc[key] = [...(acc[key] ?? []), s];
    return acc;
  }, {});

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4 transition-colors">
        <ChevronLeft size={16} /> 영화 다시 선택
      </button>

      {/* 날짜 선택 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {dates.map((date) => {
          const d = new Date(date);
          const day = d.getDay();
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-lg transition-colors min-w-[60px]",
                selectedDate === date
                  ? "bg-kgv-red text-white"
                  : "bg-kgv-gray text-gray-300 hover:bg-kgv-gray/80"
              )}
            >
              <span className="text-xs">{DAYS[day]}</span>
              <span className="text-lg font-bold">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* 지역 필터 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedRegion("")}
          className={cn("px-3 py-1 rounded text-sm transition-colors", !selectedRegion ? "bg-kgv-red text-white" : "bg-kgv-gray text-gray-400")}
        >
          전체
        </button>
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRegion(r)}
            className={cn("px-3 py-1 rounded text-sm transition-colors", selectedRegion === r ? "bg-kgv-red text-white" : "bg-kgv-gray text-gray-400")}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 상영 시간표 */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">불러오는 중...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 text-gray-400">해당 날짜에 상영 일정이 없습니다.</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([theaterName, items]) => (
            <div key={theaterName} className="bg-kgv-gray rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">{theaterName}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => {
                  const start = new Date(s.startTime);
                  const remaining = s.hall.totalSeats - s._count.bookings;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelect(s.id)}
                      className="bg-kgv-dark hover:bg-kgv-red/20 border border-kgv-gray hover:border-kgv-red rounded p-3 text-left transition-colors min-w-[100px]"
                    >
                      <p className="text-white font-bold text-sm">
                        {formatDate(start, "HH:mm")}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.hall.name}</p>
                      <p className="text-xs text-gray-400">잔여 {remaining}석</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
