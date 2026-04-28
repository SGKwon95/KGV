import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind 클래스 병합 유틸 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 가격 포맷 (원) */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

/** 러닝타임 포맷 (분 → 시간:분) */
export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

/** 날짜 포맷 */
export function formatDate(date: Date | string, format = "yyyy.MM.dd"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  return format
    .replace("yyyy", String(yyyy))
    .replace("MM", MM)
    .replace("dd", dd)
    .replace("HH", HH)
    .replace("mm", mm);
}

/** 상영 등급 한국어 변환 */
export function formatMovieRating(rating: string): string {
  const map: Record<string, string> = {
    ALL: "전체관람가",
    TWELVE: "12세이상",
    FIFTEEN: "15세이상",
    ADULT: "청소년관람불가",
  };
  return map[rating] ?? rating;
}

/** 상영 등급 색상 */
export function getMovieRatingColor(rating: string): string {
  const map: Record<string, string> = {
    ALL: "bg-green-500",
    TWELVE: "bg-blue-500",
    FIFTEEN: "bg-yellow-500",
    ADULT: "bg-red-600",
  };
  return map[rating] ?? "bg-gray-500";
}

/** 랜덤 예매번호 생성 */
export function generateBookingNumber(): string {
  const date = new Date();
  const prefix = `KGV${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}
