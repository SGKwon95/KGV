"use client";

import Image from "next/image";
import { formatMovieRating, formatRuntime, cn } from "@/lib/utils";

interface Movie {
  id: string;
  title: string;
  rating: string;
  runtime?: number | null;
  posterUrl?: string | null;
}

interface MovieStepProps {
  movies: Movie[];
  selectedMovieId: string;
  onSelect: (id: string) => void;
}

export function MovieStep({ movies, selectedMovieId, onSelect }: MovieStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">영화를 선택해주세요</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {movies.map((movie) => (
          <button
            key={movie.id}
            onClick={() => onSelect(movie.id)}
            className={cn(
              "relative rounded-lg overflow-hidden text-left transition-all",
              selectedMovieId === movie.id
                ? "ring-2 ring-kgv-red scale-105"
                : "hover:scale-102 opacity-80 hover:opacity-100"
            )}
          >
            <div className="aspect-[2/3] relative bg-kgv-gray">
              {movie.posterUrl ? (
                <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" sizes="150px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl">🎬</div>
              )}
            </div>
            <div className="p-2 bg-kgv-dark">
              <p className="text-xs text-white font-medium truncate">{movie.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatMovieRating(movie.rating)}
                {movie.runtime && ` · ${formatRuntime(movie.runtime)}`}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
