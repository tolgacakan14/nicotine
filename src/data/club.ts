/* ============================================================================
   NICOTINE CLUB — COMMITTEE
   ----------------------------------------------------------------------------
   Deliberately simple, for two reasons:

   1. A shopper should be able to explain the whole scheme in one sentence:
      "1 point per €1, and points buy money off." No conversion tables, no
      category multipliers, no expiring balances to argue about.
   2. It must not put the brand on the hook. Every tier perk here is ACCESS —
      early windows, a held piece, free shipping — which costs a small label
      almost nothing and needs no extra stock. The only hard cost is the reward
      vouchers, capped at a predictable 5% of spend.

   Deliberately NOT included: free product per year, made-to-measure, names
   printed in care labels. Those read well on a slide and are punishing to
   operate on a 7-piece drop.
   ========================================================================== */

/** One point per euro. The whole model rests on this being obvious. */
export const POINTS_PER_EURO = 1;

/* Rewards are percentage discounts, not fixed euro amounts. Two reasons:
   they read the same in every currency (no separate TRY reward table to keep
   in sync), and the cost to the label scales with the order instead of being a
   fixed hit on a small basket. */

export type TierId = "static" | "filter" | "tar";

export interface Tier {
  id: TierId;
  name: string;
  /** Points needed to enter — equal to euros spent, by design. */
  threshold: number;
  /** How early this tier gets into a drop. */
  access: string;
  /** The standing discount, as a percentage of every order. */
  discount: number;
  perks: string[];
  accent: string;
  /** Top tier only: invitations to shows, launch nights and studio events. */
  events?: boolean;
}

export const TIERS: Tier[] = [
  {
    id: "static",
    name: "STATIC",
    threshold: 0,
    access: "24H EARLY",
    /** The standing discount this tier carries on every order. */
    discount: 10,
    accent: "#8C8880",
    perks: [
      "10% off every order",
      "1 point per €1",
      "24h early access to every drop",
    ],
  },
  {
    id: "filter",
    name: "FILTER",
    threshold: 500,
    access: "48H EARLY",
    discount: 15,
    accent: "#B9BEC5",
    perks: [
      "15% off every order",
      "48h early access",
      "Free shipping, always",
    ],
  },
  {
    id: "tar",
    name: "TAR",
    threshold: 1500,
    access: "72H EARLY",
    discount: 20,
    accent: "#D8A9B4",
    perks: [
      "20% off every order",
      "72h early access",
      "One piece held for you each drop",
      "Invitations to NICOTINE events",
    ],
    /** Only the top tier is invited to the room. */
    events: true,
  },
];

export interface EarnRule {
  action: string;
  points: string;
}

/** Three ways in. Anything more and nobody reads the list. */
export const EARN_RULES: EarnRule[] = [
  { action: "SPEND €1", points: "+1" },
  { action: "JOIN", points: "+100" },
  { action: "BIRTHDAY", points: "+100" },
];

/** The events the top tier is invited to. Access, not merchandise. */
export const CLUB_EVENTS = [
  { name: "DROP NIGHTS", note: "First look at the new drop, the night before it goes live." },
  { name: "STUDIO DAYS", note: "See the collection being cut in İstanbul." },
  { name: "RUNWAY SEATS", note: "Seats at the seasonal show." },
];

export const CLUB_FAQ: Array<{ q: string; a: string }> = [
  { q: "What does it cost?", a: "Nothing. Tiers are reached by spending, not by paying a fee." },
  { q: "How does the discount work?", a: "It is your tier. 10% from the start, 15% at 500 points, 20% at 1,500." },
  { q: "Do points expire?", a: "No. Your tier is reviewed once a year on what you spent in it." },
  { q: "Who gets invited to events?", a: "TAR members. Drop nights, studio days and seats at the show." },
];

/** Resolves a point balance to its tier plus the next one up. */
export function resolveTier(points: number) {
  const sorted = [...TIERS].sort((a, b) => a.threshold - b.threshold);
  let current = sorted[0];
  for (const tier of sorted) if (points >= tier.threshold) current = tier;
  const next = sorted.find((t) => t.threshold > current.threshold);
  const span = next ? next.threshold - current.threshold : 1;
  const progress = next ? Math.min(1, (points - current.threshold) / span) : 1;
  return { current, next, progress, toNext: next ? Math.max(0, next.threshold - points) : 0 };
}
