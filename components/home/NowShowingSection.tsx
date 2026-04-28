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
  _count: { reviews: number };
}

export function NowShowingSection({ movies }: { movies: Movie[] }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title mb-0">현재상영</h2>
        <Link
          href="/movies?type=nowShowing"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          전체보기 <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
