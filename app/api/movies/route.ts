import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "nowShowing";
  const genre = searchParams.get("genre");
  const sort = searchParams.get("sort") ?? "bookingRate";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");

  const where: Prisma.MovieWhereInput = {};
  if (type === "nowShowing") where.isNowShowing = true;
  else if (type === "comingSoon") where.isComingSoon = true;
  if (genre) where.genre = { contains: genre };

  const orderBy: Prisma.MovieOrderByWithRelationInput =
    sort === "score" ? { avgScore: "desc" }
    : sort === "release" ? { releaseDate: "desc" }
    : { bookingRate: "desc" };

  const [movies, total] = await Promise.all([
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
    items: movies,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
