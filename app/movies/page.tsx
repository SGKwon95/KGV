export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { MovieCard } from "@/components/movie/MovieCard";
import { MovieFilter } from "@/components/movie/MovieFilter";

export const metadata: Metadata = {
  title: "영화",
  description: "현재 상영 중인 영화와 개봉 예정 영화를 확인하세요.",
};

interface PageProps {
  searchParams: Promise<{ type?: string; genre?: string; sort?: string }>;
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const type = params.type ?? "nowShowing";
  const genre = params.genre;
  const sort = params.sort ?? "bookingRate";

  const where: Prisma.MovieWhereInput = {};
  if (type === "nowShowing") where.isNowShowing = true;
  else if (type === "comingSoon") where.isComingSoon = true;
  if (genre) where.genre = { contains: genre };

  const orderBy: Prisma.MovieOrderByWithRelationInput =
    sort === "score" ? { avgScore: "desc" }
    : sort === "release" ? { releaseDate: "desc" }
    : { bookingRate: "desc" };

  const movies = await prisma.movie.findMany({
    where,
    orderBy,
    include: { _count: { select: { reviews: true } } },
  });

  return (
    <div className="container-main py-10">
      <h1 className="section-title">영화</h1>
      <MovieFilter currentType={type} currentGenre={genre} currentSort={sort} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        {movies.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-20">
            해당 조건의 영화가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
