"use client";

import { useState } from "react";
import { Save, RotateCcw, Info } from "lucide-react";

// ─── 타입 ───────────────────────────────────────────────
type TicketPolicy = {
  type: string;
  label: string;
  price: number;
};

type HallPolicy = {
  type: string;
  label: string;
  surcharge: number; // 기본가 대비 추가 금액
};

type TimePolicy = {
  id: string;
  label: string;
  description: string;
  surcharge: number;
};

type DayPolicy = {
  id: string;
  label: string;
  surcharge: number;
};

// ─── 초기 데이터 ────────────────────────────────────────
const INITIAL_TICKETS: TicketPolicy[] = [
  { type: "ADULT", label: "성인", price: 15000 },
  { type: "TEEN", label: "청소년", price: 12000 },
  { type: "CHILD", label: "어린이", price: 9000 },
  { type: "SENIOR", label: "경로", price: 9000 },
  { type: "DISABLED", label: "장애인", price: 7000 },
];

const INITIAL_HALLS: HallPolicy[] = [
  { type: "STANDARD", label: "일반관", surcharge: 0 },
  { type: "IMAX", label: "IMAX", surcharge: 5000 },
  { type: "FOUR_DX", label: "4DX", surcharge: 6000 },
  { type: "SCREEN_X", label: "ScreenX", surcharge: 4000 },
  { type: "PREMIUM", label: "프리미엄", surcharge: 3000 },
];

const INITIAL_TIMES: TimePolicy[] = [
  {
    id: "morning",
    label: "조조",
    description: "첫 회차 (오전 11시 이전 시작)",
    surcharge: -2000,
  },
  {
    id: "regular",
    label: "일반",
    description: "11:00 ~ 17:59 시작",
    surcharge: 0,
  },
  {
    id: "evening",
    label: "저녁",
    description: "18:00 ~ 21:59 시작",
    surcharge: 1000,
  },
  {
    id: "night",
    label: "심야",
    description: "22:00 이후 시작",
    surcharge: 2000,
  },
];

const INITIAL_DAYS: DayPolicy[] = [
  { id: "weekday", label: "평일 (월~목)", surcharge: 0 },
  { id: "friday", label: "금요일", surcharge: 1000 },
  { id: "weekend", label: "주말 (토~일)", surcharge: 2000 },
  { id: "holiday", label: "공휴일", surcharge: 2000 },
];

// ─── 유틸 ────────────────────────────────────────────────
function formatPrice(n: number) {
  if (n === 0) return "0원";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString()}원`;
}

function PriceInput({
  value,
  onChange,
  signed = false,
}: {
  value: number;
  onChange: (v: number) => void;
  signed?: boolean;
}) {
  return (
    <div className="relative">
      {signed && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none pointer-events-none">
          {value >= 0 ? "+" : ""}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step={500}
        className={`w-32 bg-[#0d0d0d] border border-kgv-gray rounded px-3 py-2 text-white text-sm text-right focus:outline-none focus:border-kgv-red transition-colors ${
          signed ? "pl-7" : ""
        }`}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">
        원
      </span>
    </div>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────────────
export default function PricePolicyPage() {
  const [tickets, setTickets] = useState<TicketPolicy[]>(INITIAL_TICKETS);
  const [halls, setHalls] = useState<HallPolicy[]>(INITIAL_HALLS);
  const [times, setTimes] = useState<TimePolicy[]>(INITIAL_TIMES);
  const [days, setDays] = useState<DayPolicy[]>(INITIAL_DAYS);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  function markDirty() {
    setSaved(false);
    setDirty(true);
  }

  function handleSave() {
    // TODO: DB 연동 시 API 호출
    setSaved(true);
    setDirty(false);
  }

  function handleReset() {
    setTickets(INITIAL_TICKETS);
    setHalls(INITIAL_HALLS);
    setTimes(INITIAL_TIMES);
    setDays(INITIAL_DAYS);
    setSaved(false);
    setDirty(false);
  }

  function updateTicket(type: string, price: number) {
    setTickets((prev) =>
      prev.map((t) => (t.type === type ? { ...t, price } : t))
    );
    markDirty();
  }

  function updateHall(type: string, surcharge: number) {
    setHalls((prev) =>
      prev.map((h) => (h.type === type ? { ...h, surcharge } : h))
    );
    markDirty();
  }

  function updateTime(id: string, surcharge: number) {
    setTimes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, surcharge } : t))
    );
    markDirty();
  }

  function updateDay(id: string, surcharge: number) {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, surcharge } : d))
    );
    markDirty();
  }

  // 예시 계산: 성인 + IMAX + 금요일 저녁
  const adultPrice = tickets.find((t) => t.type === "ADULT")?.price ?? 15000;
  const imaxSurcharge = halls.find((h) => h.type === "IMAX")?.surcharge ?? 5000;
  const eveningSurcharge = times.find((t) => t.id === "evening")?.surcharge ?? 1000;
  const fridaySurcharge = days.find((d) => d.id === "friday")?.surcharge ?? 1000;
  const exampleTotal = adultPrice + imaxSurcharge + eveningSurcharge + fridaySurcharge;

  return (
    <div className="max-w-4xl">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">가격 정책</h1>
          <p className="text-gray-400 text-sm">
            티켓 유형·상영관·시간대·요일별 요금을 설정합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-kgv-gray hover:border-gray-500 rounded transition-colors"
          >
            <RotateCcw size={14} />
            초기화
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded transition-colors ${
              dirty
                ? "bg-kgv-red hover:bg-kgv-red-dark text-white"
                : saved
                ? "bg-green-700 text-white cursor-default"
                : "bg-kgv-gray text-gray-500 cursor-default"
            }`}
          >
            <Save size={14} />
            {saved ? "저장됨" : "저장"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* ── 1. 기본 티켓 가격 ── */}
        <Section
          title="기본 티켓 가격"
          description="관람객 유형별 기준 가격입니다. 모든 추가 요금은 이 금액을 기준으로 합산됩니다."
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-kgv-gray">
                <th className="pb-3 font-medium">유형</th>
                <th className="pb-3 font-medium text-right">기본 가격</th>
                <th className="pb-3 font-medium text-right text-gray-700 pr-1">성인 대비</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kgv-gray/50">
              {tickets.map((t) => (
                <tr key={t.type} className="group">
                  <td className="py-3.5">
                    <span className="text-white text-sm font-medium">{t.label}</span>
                    {t.type === "ADULT" && (
                      <span className="ml-2 text-xs text-kgv-red bg-kgv-red/10 px-1.5 py-0.5 rounded">
                        기준
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <PriceInput
                      value={t.price}
                      onChange={(v) => updateTicket(t.type, v)}
                    />
                  </td>
                  <td className="py-3.5 text-right pr-1">
                    <span className={`text-xs ${t.price < adultPrice ? "text-blue-400" : t.price === adultPrice ? "text-gray-600" : "text-gray-400"}`}>
                      {t.type === "ADULT"
                        ? "—"
                        : formatPrice(t.price - adultPrice)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* ── 2. 상영관 유형 할증 ── */}
        <Section
          title="상영관 유형 할증"
          description="일반관 외 특수 상영관에 적용되는 추가 금액입니다."
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-kgv-gray">
                <th className="pb-3 font-medium">상영관</th>
                <th className="pb-3 font-medium text-right">추가 금액</th>
                <th className="pb-3 font-medium text-right text-gray-700 pr-1">성인 기준 합계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kgv-gray/50">
              {halls.map((h) => (
                <tr key={h.type}>
                  <td className="py-3.5">
                    <span className="text-white text-sm font-medium">{h.label}</span>
                    {h.type === "STANDARD" && (
                      <span className="ml-2 text-xs text-gray-600 bg-kgv-gray/50 px-1.5 py-0.5 rounded">
                        기준
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <PriceInput
                      value={h.surcharge}
                      onChange={(v) => updateHall(h.type, v)}
                      signed
                    />
                  </td>
                  <td className="py-3.5 text-right pr-1">
                    <span className="text-xs text-gray-500">
                      {(adultPrice + h.surcharge).toLocaleString()}원
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* ── 3. 시간대 할증 ── */}
        <Section
          title="시간대별 할증"
          description="상영 시작 시간에 따라 적용되는 조조 할인 및 저녁·심야 할증입니다."
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-kgv-gray">
                <th className="pb-3 font-medium">시간대</th>
                <th className="pb-3 font-medium text-gray-600">기준</th>
                <th className="pb-3 font-medium text-right">추가 금액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kgv-gray/50">
              {times.map((t) => (
                <tr key={t.id}>
                  <td className="py-3.5">
                    <span className="text-white text-sm font-medium">{t.label}</span>
                  </td>
                  <td className="py-3.5 text-xs text-gray-500">{t.description}</td>
                  <td className="py-3.5 text-right">
                    <PriceInput
                      value={t.surcharge}
                      onChange={(v) => updateTime(t.id, v)}
                      signed
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* ── 4. 요일 할증 ── */}
        <Section
          title="요일별 할증"
          description="평일 대비 주말 및 공휴일에 적용되는 추가 금액입니다."
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-kgv-gray">
                <th className="pb-3 font-medium">요일</th>
                <th className="pb-3 font-medium text-right">추가 금액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kgv-gray/50">
              {days.map((d) => (
                <tr key={d.id}>
                  <td className="py-3.5">
                    <span className="text-white text-sm font-medium">{d.label}</span>
                    {d.id === "weekday" && (
                      <span className="ml-2 text-xs text-gray-600 bg-kgv-gray/50 px-1.5 py-0.5 rounded">
                        기준
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <PriceInput
                      value={d.surcharge}
                      onChange={(v) => updateDay(d.id, v)}
                      signed
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* ── 요금 계산 예시 ── */}
        <div className="bg-kgv-gray/40 border border-kgv-gray rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Info size={15} className="text-kgv-red" />
            <span className="text-sm font-semibold text-white">요금 계산 예시</span>
            <span className="text-xs text-gray-500 ml-1">
              (성인 · IMAX · 금요일 저녁)
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>성인 기본가</span>
              <span>{adultPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>IMAX 할증</span>
              <span>+{imaxSurcharge.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>저녁 할증</span>
              <span>+{eveningSurcharge.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>금요일 할증</span>
              <span>+{fridaySurcharge.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-white font-bold border-t border-kgv-gray pt-2 mt-2">
              <span>합계</span>
              <span className="text-kgv-red">{exampleTotal.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 섹션 래퍼 ──────────────────────────────────────────
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-kgv-gray rounded-lg p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-white mb-1">{title}</h2>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
}
