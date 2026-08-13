import type { Metadata } from "next";
import Link from "next/link";
import ArchiveGrid from "@/components/archive/ArchiveGrid";
import Logo from "@/components/brand/Logo";
import { ALL_PRODUCTS, CURRENT_DROP, DROPS } from "@/data/drops";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Every piece NICOTINE has released, from DROP 001 onward. Nothing here is restocked.",
};

/**
 * ARCHIVE — the full catalogue as one flat grid, filterable by drop.
 * The per-drop editorial blocks that used to live here have moved aside: this
 * page's job is letting someone see everything at once.
 */
export default function ArchivePage() {
  return (
    <>
      {/* ---------- Masthead ---------- */}
      <header className="shell pb-10 pt-[calc(var(--nav-h)+5rem)]">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="eyebrow">EVERYTHING RELEASED</p>
          <p className="eyebrow">{ALL_PRODUCTS.length} PIECES — {DROPS.length} DROPS</p>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <h1 className="font-display text-mega font-black uppercase leading-[0.8] text-mark">
            ARCHIVE
          </h1>
          {/* The mark, used as a stamp rather than a headline */}
          <Logo className="hidden h-16 w-auto text-mark opacity-30 lg:block" weight="thin" />
        </div>

        <div className="rule mt-8" />
      </header>

      {/* ---------- Current-drop pointer ---------- */}
      <section className="border-y border-line bg-mark py-4 text-ground">
        <div className="shell flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-wide2">
            {CURRENT_DROP.code} — {CURRENT_DROP.title} IS LIVE
          </p>
          <Link href="/drop" className="link-wipe font-mono text-[11px] uppercase tracking-wide2">
            SHOP IT →
          </Link>
        </div>
      </section>

      {/* ---------- The grid ---------- */}
      <section className="shell py-10 pb-28">
        <ArchiveGrid drops={DROPS} />
      </section>
    </>
  );
}
