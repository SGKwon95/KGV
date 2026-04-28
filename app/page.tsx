export const dynamic = "force-dynamic";

import { HeroBanner } from "@/components/home/HeroBanner";
import { NowShowingSection } from "@/components/home/NowShowingSection";
import { ComingSoonSection } from "@/components/home/ComingSoonSection";
import { QuickBooking } from "@/components/home/QuickBooking";
import { MOCK_MOVIES } from "@/lib/mock-data";

export default function HomePage() {
  const nowShowingMovies = MOCK_MOVIES.filter((m) => m.isNowShowing).slice(0, 8);
  const comingSoonMovies = MOCK_MOVIES.filter((m) => m.isComingSoon).slice(0, 6);

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
