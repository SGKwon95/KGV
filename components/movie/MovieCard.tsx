import Image from "next/image";
import Link from "next/link";
import { formatMovieRating, getMovieRatingColor, cn } from "@/lib/utils";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    posterUrl?: string | null;
    rating: string;
    avgScore: number;
    bookingRate: number;
    isNowShowing: boolean;
    _count?: { reviews: number };
  };
  showBookingRate?: boolean;
}

export function MovieCard({ movie, showBookingRate = true }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-kgv-gray">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <span className="text-4xl">🎬</span>
          </div>
        )}

        {/* 등급 뱃지 */}
        <span
          className={cn(
            "absolute top-2 left-2 text-xs text-white px-1.5 py-0.5 rounded",
            getMovieRatingColor(movie.rating)
          )}
        >
          {formatMovieRating(movie.rating)}
        </span>

        {/* 예매율 오버레이 */}
        {showBookingRate && movie.isNowShowing && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-center py-1">
            <span className="text-kgv-red text-sm font-bold">
              예매율 {movie.bookingRate.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-kgv-red transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-kgv-gold text-xs">★</span>
          <span className="text-xs text-gray-400">{movie.avgScore.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
