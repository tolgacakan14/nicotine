"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import type { Drop, Product } from "@/data/types";

/* ============================================================================
   ARCHIVE GRID
   ----------------------------------------------------------------------------
   Every piece the label has released, in one uniform grid — four across on
   desktop, running down for as many rows as there are products. No hero tile,
   no "1 big + 4 small": on a collection page an editorial hierarchy fights the
   shopper, because the whole point is scanning everything at the same weight.

   The drop filter is a client-side slice of an already-loaded array. There is
   no fetching here, so switching is instant.
   ========================================================================== */

export default function ArchiveGrid({ drops }: { drops: Drop[] }) {
  const [active, setActive] = useState<string>("all");

  /** Flattened, newest drop first, each product tagged with its drop code. */
  const products = useMemo(() => {
    const flat: Array<Product & { dropCode: string; dropTitle: string }> = [];
    for (const drop of drops) {
      for (const p of drop.products) {
        flat.push({ ...p, dropCode: drop.code, dropTitle: drop.title });
      }
    }
    return flat;
  }, [drops]);

  const shown = active === "all" ? products : products.filter((p) => p.dropSlug === active);

  return (
    <>
      {/* ---- Filter rail ---- */}
      <div className="sticky top-[var(--nav-h)] z-30 -mx-5 mb-10 bg-ground/90 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => setActive("all")}
              aria-pressed={active === "all"}
              className={`font-mono text-[11px] uppercase tracking-wide2 transition-colors ${
                active === "all" ? "text-mark" : "text-ash hover:text-haze"
              }`}
            >
              ALL ({products.length})
            </button>
            {drops.map((drop) => (
              <button
                key={drop.slug}
                type="button"
                onClick={() => setActive(drop.slug)}
                aria-pressed={active === drop.slug}
                className={`font-mono text-[11px] uppercase tracking-wide2 transition-colors ${
                  active === drop.slug ? "text-mark" : "text-ash hover:text-haze"
                }`}
              >
                {drop.code}
              </button>
            ))}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wide2 text-ash">
            {shown.length} {shown.length === 1 ? "PIECE" : "PIECES"}
          </span>
        </div>
      </div>

      {/* ---- The grid: 2 across on phones, 4 from lg up ---- */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
        {shown.map((product) => (
          <div key={product.slug}>
            <ProductCard product={product} />
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide2 text-ash">
              {product.dropCode} — {product.dropTitle}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
