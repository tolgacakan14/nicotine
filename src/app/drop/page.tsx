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
  const [a, b, c, d, e, f, g, h] = products;

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

      {/* ---------- Piece 01 / 02 : two-up ---------- */}
      <section className="shell grid gap-x-4 gap-y-14 py-20 sm:gap-x-6 sm:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <ProductCard product={a} index={0} tall priority />
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8 lg:self-end lg:pb-16">
          <ProductCard product={b} index={1} />
        </Reveal>
      </section>

      {/* ---------- Pieces 03 – 05 : three-up ---------- */}
      <section className="shell grid grid-cols-2 gap-x-4 gap-y-14 py-20 sm:gap-x-6 sm:py-28 lg:grid-cols-3">
        {[c, d, e].map((product, i) => (
          <Reveal
            key={product.slug}
            delay={0.06 * i}
            className={i === 2 ? "col-span-2 lg:col-span-1" : ""}
          >
            <ProductCard product={product} index={i + 2} />
          </Reveal>
        ))}
      </section>

      {/* ---------- Piece 06 : offset feature ---------- */}
      <section className="shell grid items-center gap-10 py-20 sm:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <ProductCard product={f} index={5} tall />
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9">
          <p className="eyebrow">PIECE 06</p>
          <h2 className="mt-4 font-display text-big font-black uppercase leading-none text-mark">
            {f.name}
          </h2>
          <p className="mt-5 font-mono text-[11px] tracking-wide2 text-chrome">
            <Price value={f.price} /> — {f.colorway}
          </p>
          <Link href={`/product/${f.slug}`} className="btn-ghost mt-8 inline-block">
            <span>VIEW PIECE</span>
          </Link>
        </Reveal>
      </section>

      {/* ---------- Pieces 07 / 08 ---------- */}
      <section className="shell grid grid-cols-2 gap-x-4 gap-y-14 pb-24 sm:gap-x-6 sm:pb-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <ProductCard product={g} index={6} />
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-7">
          <ProductCard product={h} index={7} />
        </Reveal>
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
