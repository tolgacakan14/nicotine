import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import ProductVisual from "@/components/product/ProductVisual";
import { ARCHIVE_DROPS } from "@/data/drops";

/* ============================================================================
   PAST DROPS — the two most recent past collections, cover and title only.
   ----------------------------------------------------------------------------
   No concept text, no piece counts, no prices: the whole tile is the link, and
   anything else here would compete with the live drop above it.
   ========================================================================== */
export default function PastDrops() {
  const drops = ARCHIVE_DROPS.slice(0, 1);

  return (
    <section className="relative border-t border-line py-20 sm:py-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="eyebrow">(03) — PAST DROPS</p>
          <Link
            href="/archive"
            className="link-wipe font-mono text-[11px] uppercase tracking-wide2 text-ash hover:text-mark"
          >
            FULL ARCHIVE →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8">
          <Reveal>
            <Link href="/drop" className="group block">
              <div className="relative flex aspect-[4/3] overflow-hidden bg-[#434441]">
                {[0, 1].map((copy) => (
                  <div key={copy} className="relative h-full w-1/2 overflow-hidden">
                    <Image
                      src="/editorial/drop-001-cover.jpg"
                      alt={copy === 0 ? "WE HAVE A STORY — DROP 001 artwork" : ""}
                      fill
                      sizes="(min-width: 640px) 25vw, 50vw"
                      aria-hidden={copy === 1}
                      className="object-cover object-center transition-transform duration-[1100ms] ease-editorial group-hover:scale-[1.035]"
                    />
                  </div>
                ))}
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)]" />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-big font-black uppercase leading-none text-mark">
                  WE HAVE A STORY
                </h3>
                <span aria-hidden className="font-mono text-[11px] text-ash transition-transform duration-500 group-hover:translate-x-1">→</span>
              </div>
            </Link>
          </Reveal>
          {drops.map((drop, i) => {
            // The cover borrows a product silhouette but takes the drop's own
            // tone and texture, so each block has its own signature.
            const cover = drop.products[1] ?? drop.products[0];
            return (
              <Reveal key={drop.slug} delay={0.08 * (i + 1)}>
                <Link href={`/archive#${drop.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ProductVisual
                      product={{ ...cover, tone: drop.tone, texture: drop.texture }}
                      className="h-full w-full transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03]"
                      compact
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-big font-black uppercase leading-none text-mark">
                      {drop.title}
                    </h3>
                    <span
                      aria-hidden
                      className="font-mono text-[11px] text-ash transition-transform duration-500 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
