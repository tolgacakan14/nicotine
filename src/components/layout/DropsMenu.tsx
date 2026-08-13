"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { CURRENT_DROP, DROPS } from "@/data/drops";

/* ============================================================================
   DROPS MENU
   ----------------------------------------------------------------------------
   Replaces the old "CURRENT DROP" link. Hovering reveals every published drop;
   the live one sits at the top and is the only one that links to /drop — past
   collections go to their anchor in the archive.

   Hover alone would strand keyboard and touch users, so the panel also opens on
   focus and on click, and closes on Escape or on a click outside. The trigger
   itself is a real link, so tapping it still goes straight to the live drop.
   ========================================================================== */
export default function DropsMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<number | null>(null);
  const panelId = useId();

  /** A small close delay stops the panel flickering as the pointer crosses the gap. */
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href="/drop"
        aria-expanded={open}
        aria-controls={panelId}
        className="link-wipe font-mono text-[11px] uppercase tracking-wide2 text-haze transition-colors hover:text-mark"
      >
        DROPS
      </Link>

      {/* The panel sits directly under the trigger with no gap, so the pointer
          never crosses dead space on its way down. */}
      <div
        id={panelId}
        className={`absolute left-1/2 top-full z-50 w-[280px] -translate-x-1/2 pt-4 transition-all duration-300 ease-editorial ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="border border-line bg-ground/95 backdrop-blur-md">
          {DROPS.map((drop) => {
            const live = drop.slug === CURRENT_DROP.slug;
            return (
              <Link
                key={drop.slug}
                href={live ? "/drop" : `/archive#${drop.slug}`}
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between gap-4 border-b border-line px-4 py-3 last:border-b-0 hover:bg-shade"
              >
                <span className="min-w-0">
                  <span className="block font-display text-base font-black uppercase leading-none tracking-tight2 text-mark">
                    {drop.title}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-wide2 text-ash">
                    {drop.code} — {drop.season}
                  </span>
                </span>
                <span
                  className={`shrink-0 font-mono text-[9px] uppercase tracking-wide2 ${
                    live ? "text-mark" : "text-ash"
                  }`}
                >
                  {live ? "LIVE" : "ARCHIVE"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </li>
  );
}
