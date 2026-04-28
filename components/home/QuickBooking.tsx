"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Film } from "lucide-react";

export function QuickBooking() {
  const router = useRouter();
  const [region, setRegion] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    if (date) params.set("date", date);
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <section className="bg-kgv-gray rounded-xl p-6">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Film size={20} className="text-kgv-red" />
        빠른 예매
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-kgv-dark text-white pl-9 pr-4 py-3 rounded border border-kgv-gray focus:border-kgv-red outline-none appearance-none text-sm"
          >
            <option value="">지역 선택</option>
            {["서울", "경기", "인천", "부산", "대구", "광주", "대전"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 relative">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-kgv-dark text-white pl-9 pr-4 py-3 rounded border border-kgv-gray focus:border-kgv-red outline-none text-sm"
          />
        </div>

        <button type="submit" className="btn-primary whitespace-nowrap">
          예매하기
        </button>
      </form>
    </section>
  );
}
