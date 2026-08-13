import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/product/ProductCard";
import Marquee from "@/components/ui/Marquee";
import Logo from "@/components/brand/Logo";
import { CURRENT_DROP } from "@/data/drops";
import Price from "@/components/ui/Price";

export const metadata: Metadata = {
  title: `${CURRENT_DROP.code} — ${CURRENT_DROP.title}`,
  description: CURRENT_DROP.concept,
};

/**
 * CURRENT DROP — an editorial index of the live collection.
 * The grid alternates rhythm (2-up / 3-up / full-bleed statement) so it reads
 * like a lookbook rather than a search-results page.
 */
export default function DropPage() {
  const products = CURRENT_DROP.products;

  return (
    <>
      {/* ---------- Masthead ---------- */}
      <header className="relative flex min-h-[78dvh] flex-col justify-end overflow-hidden pb-14 pt-[calc(var(--nav-h)+5rem)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_78%_0%,rgba(244,242,238,0.12)_0%,transparent_60%)]"
        />
        <div className="shell relative">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="eyebrow">{CURRENT_DROP.code} — NOW LIVE</p>
            <p className="eyebrow">
              {CURRENT_DROP.season} — {String(products.length).padStart(2, "0")} PIECES
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
            <h1 className="font-display text-mega font-black uppercase leading-[0.8] text-mark">
              {CURRENT_DROP.title}
            </h1>
            <Logo className="hidden h-16 w-auto text-mark opacity-30 lg:block" weight="thin" />
          </div>
          <div className="rule mt-8" />
          <p className="mt-8 font-display text-xl font-black uppercase leading-tight tracking-tight2 type-chrome lg:text-2xl">
            {CURRENT_DROP.strapline}
          </p>
        </div>
      </header>

      <Marquee
        items={[`${CURRENT_DROP.code}`, "NEVER RESTOCKED"]}
      />

      {/* ---------- The drop: every piece the same size ----------
          A uniform square grid, not an editorial rhythm of feature tiles. On a
          collection page a hierarchy fights the shopper — the job here is
          comparing pieces, and equal squares are what make that possible. */}
      <section className="shell py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={0.04 * (i % 4)}>
              <ProductCard product={product} index={i} square priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Foot ---------- */}
      <section className="border-t border-line py-20 sm:py-28">
        <div className="shell flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">NEXT</p>
            <h2 className="mt-4 font-display text-huge font-black uppercase leading-none text-mark">
              THE ARCHIVE
            </h2>
          </div>
          <Link href="/archive" className="btn-ghost">
            <span>VIEW PAST DROPS</span>
          </Link>
        </div>
      </section>
    </>
  );
}
