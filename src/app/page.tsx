import Hero from "@/components/home/Hero";
import DropRail from "@/components/home/DropRail";
import ScrollFilm from "@/components/film/ScrollFilm";
import PastDrops from "@/components/home/PastDrops";
import Logo from "@/components/brand/Logo";

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

      {/* The mark closes the page */}
      <section className="border-t border-line py-20 sm:py-28">
        <div className="shell">
          <Logo className="mx-auto h-auto w-full max-w-3xl text-mark opacity-90" weight="thin" />
        </div>
      </section>
    </>
  );
}
