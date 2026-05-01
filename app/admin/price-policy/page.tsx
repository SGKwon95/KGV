"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw, Info } from "lucide-react";
import type { PricePolicy } from "@/types";

// ─── 타입 ───────────────────────────────────────────────
type TicketPolicy = {
  id?: string;
  type: string;
  label: string;
  price: number;
};

type HallPolicy = {
  id?: string;
  type: string;
  label: string;
  surcharge: number;
};

type TimePolicy = {
  id?: string;
  id_code: string;
  label: string;
  description: string;
  surcharge: number;
};

type DayPolicy = {
  id?: string;
  id_code: string;
  label: string;
  surcharge: number;
};

// ─── 초기 기본값 (DB 로드 전 placeholder) ────────────────
const DEFAULT_TICKETS: TicketPolicy[] = [
  { type: "ADULT",    label: "성인",              price: 15000 },
  { type: "TEEN",     label: "청소년",            price: 12000 },
  { type: "CHILD",    label: "어린이",            price: 8000  },
  { type: "SENIOR",   label: "경로",              price: 9000  },
  { type: "DISABLED", label: "장애인/국가유공자", price: 7000  },
];

const DEFAULT_HALLS: HallPolicy[] = [
  { type: "STANDARD", label: "일반관",   surcharge: 0    },
  { type: "IMAX",     label: "IMAX",     surcharge: 5000 },
  { type: "FOUR_DX",  label: "4DX",      surcharge: 6000 },
  { type: "SCREEN_X", label: "ScreenX",  surcharge: 4000 },
  { type: "PREMIUM",  label: "프리미엄", surcharge: 3000 },
];

const DEFAULT_TIMES: TimePolicy[] = [
  { id_code: "morning", label: "조조", description: "오전 11시 이전 시작", surcharge: -2000 },
  { id_code: "regular", label: "일반", description: "11:00 ~ 17:59 시작",  surcharge: 0     },
  { id_code: "evening", label: "저녁", description: "18:00 ~ 21:59 시작", surcharge: 1000  },
  { id_code: "night",   label: "심야", description: "22:00 이후 시작",    surcharge: 2000  },
];

const DEFAULT_DAYS: DayPolicy[] = [
  { id_code: "weekday", label: "평일 (월~목)", surcharge: 0    },
  { id_code: "friday",  label: "금요일",        surcharge: 1000 },
  { id_code: "weekend", label: "주말 (토~일)", surcharge: 2000 },
  { id_code: "holiday", label: "공휴일",        surcharge: 2000 },
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

// ─── DB 응답 → 로컬 state 변환 ───────────────────────────
function mapPolicies(policies: PricePolicy[]) {
  const tickets: TicketPolicy[] = DEFAULT_TICKETS.map((d) => {
    const p = policies.find((x) => x.policyGroup === "TICKET" && x.code === d.type);
    return p ? { id: p.id, type: p.code, label: p.label, price: p.value } : d;
  });
  const halls: HallPolicy[] = DEFAULT_HALLS.map((d) => {
    const p = policies.find((x) => x.policyGroup === "HALL" && x.code === d.type);
    return p ? { id: p.id, type: p.code, label: p.label, surcharge: p.value } : d;
  });
  const times: TimePolicy[] = DEFAULT_TIMES.map((d) => {
    const p = policies.find((x) => x.policyGroup === "TIME" && x.code === d.id_code);
    return p ? { id: p.id, id_code: p.code, label: p.label, description: p.description ?? d.description, surcharge: p.value } : d;
  });
  const days: DayPolicy[] = DEFAULT_DAYS.map((d) => {
    const p = policies.find((x) => x.policyGroup === "DAY" && x.code === d.id_code);
    return p ? { id: p.id, id_code: p.code, label: p.label, surcharge: p.value } : d;
  });
  return { tickets, halls, times, days };
}

// ─── 메인 컴포넌트 ──────────────────────────────────────
export default function PricePolicyPage() {
  const [tickets, setTickets] = useState<TicketPolicy[]>(DEFAULT_TICKETS);
  const [halls,   setHalls]   = useState<HallPolicy[]>(DEFAULT_HALLS);
  const [times,   setTimes]   = useState<TimePolicy[]>(DEFAULT_TIMES);
  const [days,    setDays]    = useState<DayPolicy[]>(DEFAULT_DAYS);

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [dirty,   setDirty]   = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // DB에서 현재 정책 로드
  useEffect(() => {
    fetch("/api/price-policy")
      .then((r) => r.json())
      .then(({ data }: { data: PricePolicy[] }) => {
        if (!data?.length) return;
        // startAt 없는 영구 정책만 관리자 UI에 표시 (기간 한정 정책은 별도)
        const base = data.filter((p) => p.startAt === null);
        const mapped = mapPolicies(base);
        setTickets(mapped.tickets);
        setHalls(mapped.halls);
        setTimes(mapped.times);
        setDays(mapped.days);
      })
      .finally(() => setLoading(false));
  }, []);

  function markDirty() {
    setSaved(false);
    setDirty(true);
    setError(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const policies = [
        ...tickets.map((t, i) => ({
          id: t.id, policyGroup: "TICKET" as const, code: t.type,
          label: t.label, value: t.price, sortOrder: i,
        })),
        ...halls.map((h, i) => ({
          id: h.id, policyGroup: "HALL" as const, code: h.type,
          label: h.label, value: h.surcharge, sortOrder: i,
        })),
        ...times.map((t, i) => ({
          id: t.id, policyGroup: "TIME" as const, code: t.id_code,
          label: t.label, description: t.description, value: t.surcharge, sortOrder: i,
        })),
        ...days.map((d, i) => ({
          id: d.id, policyGroup: "DAY" as const, code: d.id_code,
          label: d.label, value: d.surcharge, sortOrder: i,
        })),
      ];

      const res = await fetch("/api/price-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policies }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "저장 실패");
      }
      setSaved(true);
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setTickets(DEFAULT_TICKETS);
    setHalls(DEFAULT_HALLS);
    setTimes(DEFAULT_TIMES);
    setDays(DEFAULT_DAYS);
    setSaved(false);
    setDirty(false);
    setError(null);
  }

  function updateTicket(type: string, price: number) {
    setTickets((prev) => prev.map((t) => (t.type === type ? { ...t, price } : t)));
    markDirty();
  }
  function updateHall(type: string, surcharge: number) {
    setHalls((prev) => prev.map((h) => (h.type === type ? { ...h, surcharge } : h)));
    markDirty();
  }
  function updateTime(id_code: string, surcharge: number) {
    setTimes((prev) => prev.map((t) => (t.id_code === id_code ? { ...t, surcharge } : t)));
    markDirty();
  }
  function updateDay(id_code: string, surcharge: number) {
    setDays((prev) => prev.map((d) => (d.id_code === id_code ? { ...d, surcharge } : d)));
    markDirty();
  }

  // 예시 계산: 성인 + IMAX + 금요일 저녁
  const adultPrice       = tickets.find((t) => t.type === "ADULT")?.price ?? 15000;
  const imaxSurcharge    = halls.find((h) => h.type === "IMAX")?.surcharge ?? 5000;
  const eveningSurcharge = times.find((t) => t.id_code === "evening")?.surcharge ?? 1000;
  const fridaySurcharge  = days.find((d) => d.id_code === "friday")?.surcharge ?? 1000;
  const exampleTotal     = adultPrice + imaxSurcharge + eveningSurcharge + fridaySurcharge;

  if (loading) {
    return <div className="text-center py-12 text-gray-400">정책 불러오는 중...</div>;
  }

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
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-kgv-gray hover:border-gray-500 rounded transition-colors disabled:opacity-50"
          >
            <RotateCcw size={14} />
            초기화
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded transition-colors ${
              saving
                ? "bg-kgv-gray text-gray-400 cursor-default"
                : dirty
                ? "bg-kgv-red hover:bg-kgv-red-dark text-white"
                : saved
                ? "bg-green-700 text-white cursor-default"
                : "bg-kgv-gray text-gray-500 cursor-default"
            }`}
          >
            <Save size={14} />
            {saving ? "저장 중..." : saved ? "저장됨" : "저장"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded p-3 text-sm mb-6">
          {error}
        </div>
      )}

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
                    <PriceInput value={t.price} onChange={(v) => updateTicket(t.type, v)} />
                  </td>
                  <td className="py-3.5 text-right pr-1">
                    <span className={`text-xs ${t.price < adultPrice ? "text-blue-400" : t.price === adultPrice ? "text-gray-600" : "text-gray-400"}`}>
                      {t.type === "ADULT" ? "—" : formatPrice(t.price - adultPrice)}
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
                    <PriceInput value={h.surcharge} onChange={(v) => updateHall(h.type, v)} signed />
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
                <tr key={t.id_code}>
                  <td className="py-3.5">
                    <span className="text-white text-sm font-medium">{t.label}</span>
                  </td>
                  <td className="py-3.5 text-xs text-gray-500">{t.description}</td>
                  <td className="py-3.5 text-right">
                    <PriceInput value={t.surcharge} onChange={(v) => updateTime(t.id_code, v)} signed />
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
                <tr key={d.id_code}>
                  <td className="py-3.5">
                    <span className="text-white text-sm font-medium">{d.label}</span>
                    {d.id_code === "weekday" && (
                      <span className="ml-2 text-xs text-gray-600 bg-kgv-gray/50 px-1.5 py-0.5 rounded">
                        기준
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <PriceInput value={d.surcharge} onChange={(v) => updateDay(d.id_code, v)} signed />
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
            <span className="text-xs text-gray-500 ml-1">(성인 · IMAX · 금요일 저녁)</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>성인 기본가</span><span>{adultPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>IMAX 할증</span><span>+{imaxSurcharge.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>저녁 할증</span><span>+{eveningSurcharge.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>금요일 할증</span><span>+{fridaySurcharge.toLocaleString()}원</span>
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

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
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
