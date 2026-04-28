export const dynamic = "force-dynamic";

import { HeroBanner } from "@/components/home/HeroBanner";
import { NowShowingSection } from "@/components/home/NowShowingSection";
import { ComingSoonSection } from "@/components/home/ComingSoonSection";
import { QuickBooking } from "@/components/home/QuickBooking";
import { prisma } from "@/lib/db";

async function getNowShowingMovies() {
  return prisma.movie.findMany({
    where: { isNowShowing: true },
    orderBy: { bookingRate: "desc" },
    take: 8,
    include: { _count: { select: { reviews: true } } },
  });
}

async function getComingSoonMovies() {
  return prisma.movie.findMany({
    where: { isComingSoon: true },
    orderBy: { releaseDate: "asc" },
    take: 6,
    include: { _count: { select: { reviews: true } } },
  });
}

export default async function HomePage() {
  const [nowShowingMovies, comingSoonMovies] = await Promise.all([
    getNowShowingMovies(),
    getComingSoonMovies(),
  ]);

  return (
    <>
      <HeroBanner movies={nowShowingMovies.slice(0, 3)} />
      <div className="container-main py-12 space-y-16">
        <QuickBooking />
        <NowShowingSection movies={nowShowingMovies} />
        <ComingSoonSection movies={comingSoonMovies} />
      </div>
    </>
  );
}
