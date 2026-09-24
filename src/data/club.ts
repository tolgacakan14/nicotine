/* ============================================================================
   NICOTINE CLUB — COMMITTEE
   ----------------------------------------------------------------------------
   An earn-and-redeem programme. Points come in from buying and from taking
   part; points go out as rewards. Tiers sit alongside that and pay in ACCESS,
   never in a standing discount.

   That separation is the whole design. A tier that discounts every order and
   a catalogue that hands out vouchers discount the same basket twice, and the
   cost of the second one is invisible until it lands. Here the vouchers are
   the only margin the club gives away, so its cost is whatever members
   actually redeem — a number you can read off a page.

   What tiers buy instead is time and room: getting in first, a piece held
   back, a seat at the show. On a small drop those cost almost nothing to give
   and are the reason someone stays in the committee rather than waiting for a
   sale.
   ========================================================================== */

/** One point per euro. The whole model rests on this being obvious. */
export const POINTS_PER_EURO = 1;

export type TierId = "static" | "filter" | "tar";

export interface Tier {
  id: TierId;
  name: string;
  /** Points needed to enter — equal to euros spent, by design. */
  threshold: number;
  /** How early this tier gets into a drop. */
  access: string;
  /** What this tier pays in, said in one line. */
  headline: string;
  perks: string[];
  /** Tier colour. Picked to carry a headline on paper — the house ground is
      243/243/242, so anything lighter than roughly 60% luminance disappears
      into it. */
  accent: string;
  /** Multiplies every mission and purchase payout at this tier. */
  multiplier: number;
  /** Top tier only: invitations to shows, launch nights and studio events. */
  events?: boolean;
}

export const TIERS: Tier[] = [
  {
    id: "static",
    name: "STATIC",
    threshold: 0,
    access: "24H EARLY",
    headline: "IN THE ROOM",
    accent: "#8C8880",
    multiplier: 1,
    perks: [
      "24h early access to every drop",
      "1 point per €1 spent",
      "Member-only releases",
    ],
  },
  {
    id: "filter",
    name: "FILTER",
    threshold: 500,
    access: "48H EARLY",
    headline: "AHEAD OF IT",
    accent: "#6E7681",
    multiplier: 1.25,
    perks: [
      "48h early access",
      "Free shipping, always",
      "1.25× points on everything",
      "Double points on your birthday",
    ],
  },
  {
    id: "tar",
    name: "TAR",
    threshold: 1500,
    access: "72H EARLY",
    headline: "FIRST REFUSAL",
    accent: "#B8828F",
    multiplier: 1.5,
    perks: [
      "72h early access",
      "One piece held for you each drop",
      "1.5× points on everything",
      "Invitations to NICOTINE events",
      "First refusal on archive stock",
    ],
    /** Only the top tier is invited to the room. */
    events: true,
  },
];

/* ---------------------------------------------------------------------------
   MISSIONS — the ways points come in
   ---------------------------------------------------------------------------
   `kind` decides how the UI treats each one:
     once   — claimable a single time, then it is spent
     repeat — available again every drop, or every order
     auto   — the club awards it; there is no button to press
   -------------------------------------------------------------------------*/

export type MissionKind = "once" | "repeat" | "auto";
export type MissionGroup = "SOCIAL" | "RITUAL" | "DATE";

export interface Mission {
  id: string;
  name: string;
  note: string;
  points: number;
  kind: MissionKind;
  group: MissionGroup;
  /** Where the action is actually performed, when it lives off-site. */
  href?: string;
}

export const MISSIONS: Mission[] = [
  // --- The way in -----------------------------------------------------------
  {
    id: "join",
    name: "BECOME A MEMBER",
    note: "Awarded the moment you sign up.",
    points: 100,
    kind: "auto",
    group: "SOCIAL",
  },

  // --- Social + community ---------------------------------------------------
  {
    id: "newsletter",
    name: "SUBSCRIBE TO THE NEWSLETTER",
    note: "One email per drop. Nothing in between.",
    points: 400,
    kind: "once",
    group: "SOCIAL",
  },
  {
    id: "refer",
    name: "REFER A FRIEND",
    note: "They join with your number. You both collect.",
    points: 500,
    kind: "repeat",
    group: "SOCIAL",
  },
  {
    id: "instagram",
    name: "FOLLOW US ON INSTAGRAM",
    note: "Drop dates land here first.",
    points: 50,
    kind: "once",
    group: "SOCIAL",
    href: "https://instagram.com",
  },
  {
    id: "tiktok",
    name: "FOLLOW US ON TIKTOK",
    note: "Behind the drop, in short form.",
    points: 50,
    kind: "once",
    group: "SOCIAL",
    href: "https://tiktok.com",
  },
  {
    id: "youtube",
    name: "SUBSCRIBE ON YOUTUBE",
    note: "The İstanbul studio, at length.",
    points: 50,
    kind: "once",
    group: "SOCIAL",
    href: "https://youtube.com",
  },

  // --- Drop rituals ---------------------------------------------------------
  {
    id: "first-24",
    name: "BUY IN THE FIRST 24 HOURS",
    note: "Order on a drop's opening day. Every drop.",
    points: 250,
    kind: "repeat",
    group: "RITUAL",
  },
  {
    id: "review",
    name: "REVIEW A PIECE YOU OWN",
    note: "Tell us how it fits and how it wears.",
    points: 150,
    kind: "repeat",
    group: "RITUAL",
  },
  {
    id: "lookbook",
    name: "SHARE HOW YOU WORE IT",
    note: "The best ones go in the next lookbook.",
    points: 300,
    kind: "repeat",
    group: "RITUAL",
  },

  // --- The dates ------------------------------------------------------------
  {
    id: "birthday",
    name: "BIRTHDAY GIFT",
    note: "Lands on the day. Doubled from FILTER up.",
    points: 500,
    kind: "auto",
    group: "DATE",
  },
  {
    id: "anniversary",
    name: "MEMBERSHIP ANNIVERSARY",
    note: "Every year, on the day you joined.",
    points: 250,
    kind: "auto",
    group: "DATE",
  },
];

/* ---------------------------------------------------------------------------
   REWARDS — the ways points go out
   ---------------------------------------------------------------------------
   Priced in points, paid in percentages and access rather than fixed euros.
   The storefront already runs in EUR and TRY, and a fixed "€5 OFF" needs a
   second reward table in every currency you add, kept in sync forever. A
   percentage reads correctly in all of them and costs the label proportionally
   on a small basket instead of taking a flat bite out of it.
   -------------------------------------------------------------------------*/

/**
 * `discount` and `shipping` are applied by the checkout. `access` is not a
 * price at all — a held piece, the archive, a day in the studio — so those
 * vouchers are arranged by hand and the cart refuses them by design.
 */
export type RewardKind = "discount" | "shipping" | "access";

export interface Reward {
  id: string;
  name: string;
  /** Percentage off the subtotal. Discount rewards only. */
  percent?: number;
  /** What lands in the member's account, in one line. */
  detail: string;
  cost: number;
  kind: RewardKind;
  /** Repeatable rewards can be claimed again after use. */
  repeatable?: boolean;
}

export const REWARDS: Reward[] = [
  {
    id: "ship",
    name: "FREE SHIPPING",
    detail: "On one order, anywhere we ship.",
    cost: 300,
    kind: "shipping",
    repeatable: true,
  },
  {
    id: "off-10",
    name: "10% OFF",
    percent: 10,
    detail: "One order, off the whole basket.",
    cost: 500,
    kind: "discount",
    repeatable: true,
  },
  {
    id: "off-20",
    name: "20% OFF",
    percent: 20,
    detail: "One order, off the whole basket.",
    cost: 1000,
    kind: "discount",
    repeatable: true,
  },
  {
    id: "hold",
    name: "HOLD A PIECE",
    detail: "One piece held in your size for 48 hours.",
    cost: 1500,
    kind: "access",
    repeatable: true,
  },
  {
    id: "archive",
    name: "ARCHIVE ACCESS",
    detail: "Buy from a drop that already sold out.",
    cost: 2500,
    kind: "access",
  },
  {
    id: "studio",
    name: "STUDIO DAY",
    detail: "A day in the İstanbul studio.",
    cost: 4000,
    kind: "access",
  },
];

/** The events the top tier is invited to. Access, not merchandise. */
export const CLUB_EVENTS = [
  { name: "DROP NIGHTS", note: "First look at the new drop, the night before it goes live." },
  { name: "STUDIO DAYS", note: "See the collection being cut in İstanbul." },
  { name: "RUNWAY SEATS", note: "Seats at the seasonal show." },
];

export const CLUB_FAQ: Array<{ q: string; a: string }> = [
  { q: "What does it cost?", a: "Nothing. Tiers are reached by spending and taking part, never by paying a fee." },
  { q: "How do points work?", a: "One point per €1 spent, plus whatever you collect from the missions. Points buy rewards." },
  { q: "Does redeeming drop my tier?", a: "No. Your tier is set by everything you have ever earned, so spending points never demotes you." },
  { q: "Do points expire?", a: "No. Your tier is reviewed once a year on what you earned inside it." },
  { q: "Why doesn't my tier discount every order?", a: "Because then the rewards would discount it again. Tiers pay in access — getting in first, a piece held, a seat in the room." },
  { q: "Who gets invited to events?", a: "TAR members, and anyone who redeems a studio day." },
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
