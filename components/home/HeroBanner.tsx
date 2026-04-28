"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Movie {
  id: string;
  title: string;
  backdropUrl?: string | null;
  posterUrl?: string | null;
  synopsis?: string | null;
  genre?: string | null;
  bookingRate: number;
}

export function HeroBanner({ movies }: { movies: Movie[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) return null;

  const movie = movies[current];

  return (
    <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
      {/* 배경 이미지 */}
      {movie.backdropUrl ? (
        <Image
          src={movie.backdropUrl}
          alt={movie.title}
          fill
          className="object-cover transition-opacity duration-1000"
          priority
        />
      ) : (
        <div className="w-full h-full bg-kgv-gray" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* 콘텐츠 */}
      <div className="absolute inset-0 flex items-center">
        <div className="container-main">
          <div className="max-w-lg">
            <p className="text-kgv-red text-sm font-semibold mb-2">
              예매율 {movie.bookingRate.toFixed(1)}%
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              {movie.title}
            </h2>
            {movie.genre && (
              <p className="text-gray-300 text-sm mb-4">
                {movie.genre.replace(/,/g, " · ")}
              </p>
            )}
            <p className="text-gray-300 text-sm mb-8 line-clamp-2">
              {movie.synopsis}
            </p>
            <div className="flex gap-4">
              <Link href={`/booking?movieId=${movie.id}`} className="btn-primary">
                예매하기
              </Link>
              <Link href={`/movies/${movie.id}`} className="btn-secondary">
                상세보기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 이전/다음 버튼 */}
      {movies.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + movies.length) % movies.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % movies.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          {/* 인디케이터 */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {movies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === current ? "bg-kgv-red w-6" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
