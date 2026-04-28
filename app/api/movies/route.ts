import { NextResponse } from "next/server";
import { MOCK_MOVIES } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "nowShowing";
  const genre = searchParams.get("genre");
  const sort = searchParams.get("sort") ?? "bookingRate";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");

  let movies = MOCK_MOVIES.filter((m) => {
    if (type === "nowShowing") return m.isNowShowing;
    if (type === "comingSoon") return m.isComingSoon;
    return true;
  });

  if (genre) {
    movies = movies.filter((m) => m.genre?.includes(genre));
  }

  movies = [...movies].sort((a, b) => {
    if (sort === "score") return b.avgScore - a.avgScore;
    if (sort === "release")
      return (b.releaseDate?.getTime() ?? 0) - (a.releaseDate?.getTime() ?? 0);
    return b.bookingRate - a.bookingRate;
  });

  const total = movies.length;
  const items = movies.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
