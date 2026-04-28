export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "영화 예매",
};

interface PageProps {
  searchParams: Promise<{ movieId?: string; screeningId?: string }>;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/login?callbackUrl=/booking");
  }

  const params = await searchParams;

  const movies = await prisma.movie.findMany({
    where: { isNowShowing: true },
    select: { id: true, title: true, rating: true, runtime: true, posterUrl: true },
    orderBy: { bookingRate: "desc" },
  });

  const theaters = await prisma.theater.findMany({
    select: { id: true, name: true, region: true },
    orderBy: { name: "asc" },
  });

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
