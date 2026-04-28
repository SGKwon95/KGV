import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "nowShowing";
  const genre = searchParams.get("genre");
  const sort = searchParams.get("sort") ?? "bookingRate";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");

  const where = {
    ...(type === "nowShowing" && { isNowShowing: true }),
    ...(type === "comingSoon" && { isComingSoon: true }),
    ...(genre && { genre: { contains: genre } }),
  };

  const orderBy =
    sort === "score"
      ? { avgScore: "desc" as const }
      : sort === "release"
        ? { releaseDate: "desc" as const }
        : { bookingRate: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.movie.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { reviews: true } } },
    }),
    prisma.movie.count({ where }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
