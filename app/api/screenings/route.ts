import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

  const screenings = await prisma.screening.findMany({
    where: {
      movieId,
      startTime: { gte: startOfDay, lte: endOfDay },
      ...(theaterId ? { hall: { theaterId } } : {}),
    },
    include: {
      movie: true,
      hall: {
        include: { theater: true },
      },
      _count: { select: { bookings: true } },
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(screenings);
}
