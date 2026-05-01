"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, RefreshCw, Info } from "lucide-react";
import type { PricePolicy } from "@/types";

// ─── 그룹별 표시 메타 ──────────────────────────────────────
const GROUP_META: Record<string, { title: string; description: string; signed: boolean }> = {
  TICKET:    { title: "기본 티켓 가격",   description: "관람객 유형별 기준 가격입니다. 모든 추가 요금은 이 금액을 기준으로 합산됩니다.", signed: false },
  HALL:      { title: "상영관 유형 할증", description: "일반관 외 특수 상영관에 적용되는 추가 금액입니다.",                              signed: true  },
  TIME:      { title: "시간대별 할증",   description: "상영 시작 시간에 따라 적용되는 조조 할인 및 저녁·심야 할증입니다.",               signed: true  },
  DAY:       { title: "요일별 할증",     description: "평일 대비 주말 및 공휴일에 적용되는 추가 금액입니다.",                           signed: true  },
  SEAT:      { title: "좌석 유형 할증",  description: "좌석 유형에 따라 적용되는 추가 금액입니다.",                                     signed: true  },
};

const GROUP_ORDER = ["TICKET", "HALL", "TIME", "DAY", "SEAT"];

function getGroupMeta(group: string) {
  return GROUP_META[group] ?? { title: group, description: "", signed: true };
}

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

// ─── DB 응답 → 그룹별 state 변환 ─────────────────────────
function groupPolicies(policies: PricePolicy[]): Record<string, PricePolicy[]> {
  const grouped: Record<string, PricePolicy[]> = {};
  for (const p of policies) {
    if (!p.isActive) continue;
    if (!grouped[p.policyGroup]) grouped[p.policyGroup] = [];
    grouped[p.policyGroup].push(p);
  }
  return grouped;
}

// ─── 그룹 섹션 컴포넌트 ──────────────────────────────────
function PolicySection({
  group,
  items,
  adultPrice,
  onUpdate,
}: {
  group: string;
  items: PricePolicy[];
  adultPrice: number;
  onUpdate: (id: string, value: number) => void;
}) {
  const { title, description, signed } = getGroupMeta(group);
  const hasDescription = items.some((p) => p.description);

  return (
    <div className="bg-kgv-gray rounded-lg p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-white mb-1">{title}</h2>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b border-kgv-gray">
            <th className="pb-3 font-medium">항목</th>
            {hasDescription && <th className="pb-3 font-medium text-gray-600">기준</th>}
            <th className="pb-3 font-medium text-right">{signed ? "추가 금액" : "기본 가격"}</th>
            {!signed && (
              <th className="pb-3 font-medium text-right text-gray-700 pr-1">성인 대비</th>
            )}
            {signed && group !== "TICKET" && (
              <th className="pb-3 font-medium text-right text-gray-700 pr-1">성인 기준 합계</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-kgv-gray/50">
          {items.map((p) => (
            <tr key={p.id}>
              <td className="py-3.5">
                <span className="text-white text-sm font-medium">{p.label}</span>
                {group === "TICKET" && p.code === "ADULT" && (
                  <span className="ml-2 text-xs text-kgv-red bg-kgv-red/10 px-1.5 py-0.5 rounded">기준</span>
                )}
                {group === "HALL" && p.code === "STANDARD" && (
                  <span className="ml-2 text-xs text-gray-600 bg-kgv-gray/50 px-1.5 py-0.5 rounded">기준</span>
                )}
                {group === "DAY" && p.code === "weekday" && (
                  <span className="ml-2 text-xs text-gray-600 bg-kgv-gray/50 px-1.5 py-0.5 rounded">기준</span>
                )}
              </td>
              {hasDescription && (
                <td className="py-3.5 text-xs text-gray-500">{p.description ?? ""}</td>
              )}
              <td className="py-3.5 text-right">
                <PriceInput
                  value={p.value}
                  onChange={(v) => onUpdate(p.id, v)}
                  signed={signed}
                />
              </td>
              {!signed && (
                <td className="py-3.5 text-right pr-1">
                  <span className={`text-xs ${
                    p.value < adultPrice ? "text-blue-400"
                    : p.value === adultPrice ? "text-gray-600"
                    : "text-gray-400"
                  }`}>
                    {p.code === "ADULT" ? "—" : formatPrice(p.value - adultPrice)}
                  </span>
                </td>
              )}
              {signed && group !== "TICKET" && (
                <td className="py-3.5 text-right pr-1">
                  <span className="text-xs text-gray-500">
                    {(adultPrice + p.value).toLocaleString()}원
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────────────
export default function PricePolicyPage() {
  const [groups,  setGroups]  = useState<Record<string, PricePolicy[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [dirty,   setDirty]   = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const loadPolicies = useCallback(() => {
    setLoading(true);
    fetch("/api/price-policy")
      .then((r) => r.json())
      .then(({ data }: { data: PricePolicy[] }) => {
        if (!data?.length) return;
        const base = data.filter((p) => p.startAt === null);
        setGroups(groupPolicies(base));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadPolicies(); }, [loadPolicies]);

  function markDirty() {
    setSaved(false);
    setDirty(true);
    setError(null);
  }

  function handleUpdate(id: string, value: number) {
    setGroups((prev) => {
      const next = { ...prev };
      for (const group of Object.keys(next)) {
        next[group] = next[group].map((p) => p.id === id ? { ...p, value } : p);
      }
      return next;
    });
    markDirty();
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const policies = Object.entries(groups).flatMap(([group, items]) =>
        items.map((p, i) => ({
          id:          p.id,
          policyGroup: group,
          code:        p.code,
          label:       p.label,
          value:       p.value,
          description: p.description ?? null,
          sortOrder:   i,
        }))
      );

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
    loadPolicies();
    setSaved(false);
    setDirty(false);
    setError(null);
  }

  const adultPrice = groups["TICKET"]?.find((p) => p.code === "ADULT")?.value ?? 15000;

  // 예시 계산용
  const imaxSurcharge    = groups["HALL"]?.find((p) => p.code === "IMAX")?.value ?? 0;
  const eveningSurcharge = groups["TIME"]?.find((p) => p.code === "evening")?.value ?? 0;
  const fridaySurcharge  = groups["DAY"]?.find((p) => p.code === "friday")?.value ?? 0;
  const exampleTotal     = adultPrice + imaxSurcharge + eveningSurcharge + fridaySurcharge;

  // 정렬: GROUP_ORDER 기준, 나머지는 뒤에
  const sortedGroups = [
    ...GROUP_ORDER.filter((g) => groups[g]),
    ...Object.keys(groups).filter((g) => !GROUP_ORDER.includes(g)),
  ];

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
            DB에 등록된 활성 정책 그룹을 표시합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-kgv-gray hover:border-gray-500 rounded transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} />
            새로고침
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

      {sortedGroups.length === 0 ? (
        <div className="text-center py-12 text-gray-500">등록된 활성 정책이 없습니다.</div>
      ) : (
        <div className="space-y-6">
          {sortedGroups.map((group) => (
            <PolicySection
              key={group}
              group={group}
              items={groups[group]}
              adultPrice={adultPrice}
              onUpdate={handleUpdate}
            />
          ))}

          {/* 요금 계산 예시 */}
          {groups["TICKET"] && groups["HALL"] && (
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
                  <span>IMAX 할증</span><span>{formatPrice(imaxSurcharge)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>저녁 할증</span><span>{formatPrice(eveningSurcharge)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>금요일 할증</span><span>{formatPrice(fridaySurcharge)}</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-kgv-gray pt-2 mt-2">
                  <span>합계</span>
                  <span className="text-kgv-red">{exampleTotal.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
