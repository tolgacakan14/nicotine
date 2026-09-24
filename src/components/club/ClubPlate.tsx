"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   CLUB PLATES
   ----------------------------------------------------------------------------
   One drawing per mission and per reward, in the house language: flat, 120²,
   stroked rather than filled, `currentColor` so every plate inherits whatever
   the card is doing on hover and follows the light/dark theme for free.

   Stroked, not filled, for a specific reason: a stroke can draw itself. Each
   path carries `pathLength="1"`, so a single dash rule animates every plate
   the same way no matter how long its real geometry is — the line arrives as
   if someone were drawing it, which suits a brand built on technical flats.

   Nothing here is photography and nothing pretends to be. The reference for
   this page leans on a cast of teddy bears; NICOTINE's equivalent of that
   warmth is severity, so these are drawn like pattern pieces.
   ========================================================================== */

export type PlateMotif =
  | "join" | "newsletter" | "refer" | "instagram" | "tiktok" | "youtube"
  | "first-24" | "review" | "lookbook" | "birthday" | "anniversary"
  | "ship" | "off-10" | "off-20" | "hold" | "archive" | "studio";

/** Each motif is a list of subpaths, drawn in order. */
const MOTIFS: Record<PlateMotif, string[]> = {
  // --- Missions -------------------------------------------------------------
  join: [
    "M44 34 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0",  // the bow
    "M54 45 L96 88",                                        // the shaft
    "M82 74 L92 64", "M90 82 L100 72",                      // the teeth
  ],
  newsletter: [
    "M22 36 H98 V86 H22 Z",
    "M22 36 L60 64 L98 36",
  ],
  refer: [
    "M50 60 m-28 0 a28 15 0 1 0 56 0 a28 15 0 1 0 -56 0",   // one oval
    "M70 60 m-28 0 a28 15 0 1 0 56 0 a28 15 0 1 0 -56 0",   // and another
  ],
  instagram: [
    "M44 28 H76 A16 16 0 0 1 92 44 V76 A16 16 0 0 1 76 92 H44 A16 16 0 0 1 28 76 V44 A16 16 0 0 1 44 28 Z",
    "M60 60 m-17 0 a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0",
    "M78 40 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0",
  ],
  tiktok: [
    "M52 84 V30 L88 22 V66",
    "M52 84 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0",
    "M88 66 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0",
  ],
  youtube: [
    "M20 34 H100 V86 H20 Z",
    "M52 48 L76 60 L52 72 Z",
  ],
  "first-24": [
    "M60 60 m-32 0 a32 32 0 1 0 64 0 a32 32 0 1 0 -64 0",
    "M60 60 V36", "M60 60 L79 70",
  ],
  review: [
    "M60 18 L82 62 L60 102 L38 62 Z",   // the nib
    "M60 50 V88",                       // its slit
  ],
  lookbook: [
    "M20 40 H100 V94 H20 Z",
    "M42 40 L48 28 H72 L78 40",
    "M60 66 m-16 0 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0",
  ],
  birthday: [
    "M26 64 H94 V94 H26 Z",
    "M26 74 C38 66 46 82 60 74 C74 66 82 82 94 74",  // the icing
    "M60 64 V44",                                    // the candle
    "M60 44 C54 38 60 30 60 28 C60 30 66 38 60 44",  // its flame
  ],
  anniversary: [
    "M24 32 H96 V94 H24 Z",
    "M24 50 H96",
    "M42 32 V22", "M78 32 V22",
    "M60 72 m-11 0 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0",
  ],

  // --- Rewards --------------------------------------------------------------
  ship: [
    "M16 62 L104 24 L70 100 L56 70 Z",
    "M56 70 L104 24",
  ],
  "off-10": [
    "M62 18 H98 V54 L50 102 L14 66 Z",           // the tag
    "M84 32 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0",
  ],
  "off-20": [
    // Sized to the same bounding box as `off-10`, so the pair reads as one
    // escalating idea rather than two drawings at different scales.
    "M56 22 H86 V52 L48 92 L18 62 Z",            // one tag
    "M74 36 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0",
    "M70 34 H100 V64 L62 104",                   // and a second behind it
  ],
  hold: [
    "M60 36 C60 27 70 27 70 34",                 // the hook
    "M60 36 L18 74 H102 Z",                      // the hanger
  ],
  archive: [
    "M14 28 H106 V46 H14 Z",
    "M22 46 H98 V96 H22 Z",
    "M48 64 H72",
  ],
  studio: [
    "M30 92 m-11 0 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0",   // the bows
    "M90 92 m-11 0 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0",
    "M36 84 L88 20", "M84 84 L32 20",                        // the blades
  ],
};

export default function ClubPlate({
  motif,
  className = "",
}: {
  motif: PlateMotif;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paths = MOTIFS[motif];

  return (
    <svg
      ref={ref}
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {paths.map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            // Subpaths draw in sequence, so the shape assembles rather than
            // materialising all at once.
            transition: `stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1) ${0.12 * i + 0.1}s`,
          }}
        />
      ))}
    </svg>
  );
}
