import Hero from "@/components/home/Hero";
import DropRail from "@/components/home/DropRail";
import ScrollFilm from "@/components/film/ScrollFilm";
import PastDrops from "@/components/home/PastDrops";

/**
 * HOME — four beats and a signature, nothing else:
 *   hero → the drop as a rail → the dressroom film → past drops → the mark.
 *
 * The club block used to sit at the bottom; it now lives only at /club, so the
 * home page ends on the brand rather than on a sign-up.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <DropRail />
      <ScrollFilm />
      <PastDrops />
    </>
  );
}
