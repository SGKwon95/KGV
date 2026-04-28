import { NextResponse } from "next/server";
import { MOCK_SCREENINGS } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");
  const theaterId = searchParams.get("theaterId");
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!movieId) {
    return NextResponse.json({ error: "movieId가 필요합니다." }, { status: 400 });
  }

  const targetDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const screenings = MOCK_SCREENINGS.filter((s) => {
    if (s.movieId !== movieId) return false;
    if (s.startTime < startOfDay || s.startTime > endOfDay) return false;
    if (theaterId && s.hall.theater.id !== theaterId) return false;
    return true;
  });

  return NextResponse.json(screenings);
}
