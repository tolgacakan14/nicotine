import type { Metadata } from "next";
import Image from "next/image";
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
  // The live shop only publishes pieces with approved photography. Placeholder
  // concepts stay in the drop data for the Dressroom storyboard, but never
  // render as empty product boxes in the storefront grid.
  const products = CURRENT_DROP.products.filter((product) => Boolean(product.image));

  return (
    <>
      {/* ---------- Masthead ---------- */}
      <header className="relative flex min-h-[82dvh] flex-col justify-end overflow-hidden bg-[#25272a] pb-14 pt-[calc(var(--nav-h)+5rem)]">
        <Image
          src="/editorial/drop-001-banner.jpg"
          alt=""
          fill
          priority
          aria-hidden
          className="object-cover object-center opacity-[0.88] saturate-[1.08] contrast-[1.06] transition-transform duration-[1800ms] ease-editorial motion-safe:scale-[1.018]"
          sizes="100vw"
        />
        {/* A dark glass layer keeps the campaign artwork vivid while giving the
            mercury headline enough separation to read as polished metal. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,22,0.28)_0%,rgba(27,27,30,0.12)_38%,rgba(18,18,20,0.48)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_70%_at_70%_15%,rgba(255,117,175,0.12)_0%,transparent_68%)]"
        />
        <div className="shell relative">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="eyebrow text-white/80">{CURRENT_DROP.code} — NOW LIVE</p>
            <p className="eyebrow text-white/80">
              {CURRENT_DROP.season} — {String(products.length).padStart(2, "0")} PIECES
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
            <h1 className="type-mercury max-w-[12ch] font-display text-mega font-black uppercase leading-[0.78] drop-shadow-[0_4px_18px_rgba(0,0,0,0.48)]">
              {CURRENT_DROP.title}
            </h1>
            <Logo className="hidden h-16 w-auto text-chrome-hi opacity-90 drop-shadow-[0_3px_12px_rgba(0,0,0,0.5)] lg:block" weight="thin" />
          </div>
          <div className="mt-8 h-px bg-white/35" />
          <p className="type-mercury mt-8 font-display text-xl font-black uppercase leading-tight tracking-tight2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] lg:text-2xl">
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
