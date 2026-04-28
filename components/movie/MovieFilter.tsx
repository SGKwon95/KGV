"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TYPES = [
  { value: "nowShowing", label: "현재상영" },
  { value: "comingSoon", label: "개봉예정" },
  { value: "all", label: "전체" },
];

const GENRES = ["액션", "드라마", "SF", "코미디", "공포", "로맨스", "애니메이션", "다큐"];

const SORTS = [
  { value: "bookingRate", label: "예매율순" },
  { value: "score", label: "평점순" },
  { value: "release", label: "개봉일순" },
];

interface MovieFilterProps {
  currentType: string;
  currentGenre?: string;
  currentSort: string;
}

export function MovieFilter({ currentType, currentGenre, currentSort }: MovieFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams({
      type: currentType,
      sort: currentSort,
      ...(currentGenre && { genre: currentGenre }),
    });

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* 타입 탭 */}
      <div className="flex gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => updateParams({ type: t.value })}
            className={cn(
              "px-4 py-2 rounded text-sm font-medium transition-colors",
              currentType === t.value
                ? "bg-kgv-red text-white"
                : "bg-kgv-gray text-gray-400 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 장르 + 정렬 */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-500">장르:</span>
        <button
          onClick={() => updateParams({ genre: undefined })}
          className={cn(
            "px-3 py-1 rounded-full text-xs transition-colors",
            !currentGenre
              ? "bg-white text-black"
              : "border border-gray-600 text-gray-400 hover:border-white hover:text-white"
          )}
        >
          전체
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => updateParams({ genre: currentGenre === g ? undefined : g })}
            className={cn(
              "px-3 py-1 rounded-full text-xs transition-colors",
              currentGenre === g
                ? "bg-white text-black"
                : "border border-gray-600 text-gray-400 hover:border-white hover:text-white"
            )}
          >
            {g}
          </button>
        ))}

        <span className="text-sm text-gray-500 ml-4">정렬:</span>
        {SORTS.map((s) => (
          <button
            key={s.value}
            onClick={() => updateParams({ sort: s.value })}
            className={cn(
              "px-3 py-1 rounded text-xs transition-colors",
              currentSort === s.value
                ? "text-kgv-red border-b border-kgv-red"
                : "text-gray-400 hover:text-white"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
