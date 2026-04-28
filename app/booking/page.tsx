export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { MOCK_MOVIES, MOCK_THEATERS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "영화 예매",
};

interface PageProps {
  searchParams: Promise<{ movieId?: string; screeningId?: string }>;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const movies = MOCK_MOVIES.filter((m) => m.isNowShowing).map((m) => ({
    id: m.id,
    title: m.title,
    rating: m.rating,
    runtime: m.runtime,
    posterUrl: m.posterUrl,
  }));

  const theaters = MOCK_THEATERS.map((t) => ({
    id: t.id,
    name: t.name,
    region: t.region,
  }));

  return (
    <div className="container-main py-10">
      <h1 className="section-title">영화 예매</h1>
      <BookingFlow
        movies={movies}
        theaters={theaters}
        initialMovieId={params.movieId}
        initialScreeningId={params.screeningId}
      />
    </div>
  );
}
