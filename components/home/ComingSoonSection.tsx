import Link from "next/link";
import { MovieCard } from "@/components/movie/MovieCard";
import { ChevronRight } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  posterUrl?: string | null;
  rating: string;
  avgScore: number;
  bookingRate: number;
  isNowShowing: boolean;
  releaseDate?: Date | null;
  _count: { reviews: number };
}

export function ComingSoonSection({ movies }: { movies: Movie[] }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title mb-0">개봉예정</h2>
        <Link
          href="/movies?type=comingSoon"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          전체보기 <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} showBookingRate={false} />
        ))}
      </div>
    </section>
  );
}
