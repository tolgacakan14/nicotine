"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { CURRENT_DROP } from "@/data/drops";

/* ============================================================================
   DROP RAIL — the slogan, then the drop as a horizontal rail.
   ----------------------------------------------------------------------------
   Three pieces are in view at a time and the rail carries six. It is a real
   overflow-scroll container with scroll-snap, not a transform carousel: that
   keeps native trackpad and touch swiping working, keeps the cards in the tab
   order, and means the arrows only have to nudge `scrollLeft`.
   ========================================================================== */

const VISIBLE = 3;
const TOTAL = 6;

export default function DropRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const publishedProducts = CURRENT_DROP.products.filter((product) => Boolean(product.image));
  const products = publishedProducts.slice(0, TOTAL);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  /** Moves by one full card, measured from the rail rather than hard-coded. */
  const nudge = (direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth / VISIBLE;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <section className="relative border-t border-line py-20 sm:py-28">
      <div className="shell">
        {/* ---- Slogan ---- */}
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <p className="eyebrow">(01)</p>
          </div>
          <div className="lg:col-span-10">
            <h2 className="font-display text-huge font-black uppercase leading-[0.86] text-mark">
              NEW FORMS.
              <br />
              <span className="type-chrome">EVERY TWO MONTHS.</span>
            </h2>
          </div>
        </div>

        {/* ---- Rail header ---- */}
        <div className="mt-16 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
          <p className="eyebrow">
            {CURRENT_DROP.code} — {CURRENT_DROP.title}
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/drop"
              className="link-wipe font-mono text-[11px] uppercase tracking-wide2 text-ash hover:text-mark"
            >
              ALL {String(publishedProducts.length).padStart(2, "0")} →
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => nudge(-1)}
                disabled={atStart}
                aria-label="Previous pieces"
                className="flex h-9 w-9 items-center justify-center border border-line font-mono text-xs text-mark transition-colors hover:border-mark disabled:opacity-30 disabled:hover:border-line"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                disabled={atEnd}
                aria-label="Next pieces"
                className="flex h-9 w-9 items-center justify-center border border-line font-mono text-xs text-mark transition-colors hover:border-mark disabled:opacity-30 disabled:hover:border-line"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---- The rail. Full-bleed so cards can run off the right edge, which
              is what signals there is more to scroll to. ---- */}
      <div
        ref={railRef}
        className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, i) => (
          <div
            key={product.slug}
            data-card
            className="w-[74vw] shrink-0 snap-start sm:w-[44vw] lg:w-[calc((100%-3rem)/3)]"
          >
            <ProductCard product={product} index={i} tall priority={i < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}
