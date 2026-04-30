export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatRuntime, formatDate, formatMovieRating, getMovieRatingColor, cn } from "@/lib/utils";
import { ReviewSection } from "@/components/movie/ReviewSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) return { title: "영화를 찾을 수 없습니다" };
  return { title: movie.title, description: movie.synopsis ?? undefined };
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [movie, reviews] = await Promise.all([
    prisma.movie.findUnique({
      where: { id },
      include: { _count: { select: { reviews: true } } },
    }),
    prisma.review.findMany({
      where: { movieId: id },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!movie) notFound();

  return (
    <div>
      {/* 백드롭 */}
      <div className="relative h-[400px] w-full">
        {movie.backdropUrl ? (
          <Image
            src={movie.backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-kgv-gray" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* 영화 정보 */}
      <div className="container-main -mt-32 relative z-10 pb-12">
        <div className="flex gap-8">
          {/* 포스터 */}
          <div className="hidden md:block flex-shrink-0 w-48">
            {movie.posterUrl ? (
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                width={192}
                height={272}
                className="rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-48 h-72 bg-kgv-gray rounded-lg" />
            )}
          </div>

          {/* 정보 */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={cn(
                  "text-xs text-white px-2 py-0.5 rounded",
                  getMovieRatingColor(movie.rating)
                )}
              >
                {formatMovieRating(movie.rating)}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
            {movie.titleEn && (
              <p className="text-gray-400 mt-1">{movie.titleEn}</p>
            )}

            <div className="flex items-center gap-4 mt-4 text-sm text-gray-300">
              {movie.releaseDate && (
                <span>{formatDate(movie.releaseDate)} 개봉</span>
              )}
              {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
              {movie.genre && <span>{movie.genre.replace(/,/g, " · ")}</span>}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className="text-kgv-gold text-2xl font-bold">
                ★ {movie.avgScore.toFixed(1)}
              </span>
              <span className="text-gray-400 text-sm">
                ({movie._count.reviews.toLocaleString()}명 평가)
              </span>
            </div>

            <p className="text-gray-300 mt-6 leading-relaxed max-w-2xl">
              {movie.synopsis}
            </p>

            <div className="mt-8 flex gap-4">
              {movie.isNowShowing && (
                <Link href={`/booking?movieId=${movie.id}`} className="btn-primary">
                  예매하기
                </Link>
              )}
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  예고편 보기
                </a>
              )}
            </div>
          </div>
        </div>

        <ReviewSection movieId={movie.id} reviews={reviews} />
      </div>
    </div>
  );
}
