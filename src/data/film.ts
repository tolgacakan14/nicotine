import type { GarmentLayer } from "./types";

/**
 * THE SCROLL FILM SCRIPT
 * ----------------------------------------------------------------------------
 * This array *is* the storyboard. `ScrollFilm.tsx` walks it act by act and
 * builds one GSAP timeline segment per entry — so re-ordering the narrative,
 * adding a beat, or swapping which garment appears when is a data edit, not a
 * code edit.
 *
 *  add    → garment layers that appear during this act
 *  remove → garment layers that detach and float away during this act
 *  slug   → links the act to a product in `drops.ts` (drives the plate + link)
 *
 * Keep `add`/`remove` values in sync with the `data-layer` attributes in
 * `components/film/Figure.tsx`.
 */
export interface FilmAct {
  id: string;
  /** Product slug in the current drop — omit for pure narrative beats. */
  slug?: string;
  headline: string;
  caption: string;
  /** Vertical text in the right rail. */
  note: string;
  add: GarmentLayer[];
  remove: GarmentLayer[];
  /** Special direction handled explicitly by the timeline. */
  gesture?: "toHand" | "dissolve";
}

export const FILM_ACTS: FilmAct[] = [
  {
    id: "figure",
    headline: "THE FIGURE",
    caption:
      "An unlit room in İstanbul. Nothing on yet.",
    note: "ACT 01 — BEFORE",
    add: [],
    remove: [],
  },
  {
    id: "pure-base",
    slug: "pure-rib-tank",
    headline: "PURE RIB TANK",
    caption: "White rib. The first skin over red.",
    note: "ACT 02 — PURE LAYER",
    add: ["whitetank"],
    remove: [],
  },
  {
    id: "pale-shorts",
    slug: "pale-signal-shorts",
    headline: "PALE SIGNAL SHORTS",
    caption: "The red disappears under pale tailoring.",
    note: "ACT 03 — FIRST GROUND",
    add: ["shorts"],
    remove: [],
  },
  {
    id: "base",
    slug: "rib-tank",
    headline: "RIB TANK",
    caption: "The base. Everything goes over this.",
    note: "ACT 04 — ESPRESSO LAYER",
    add: ["tank"],
    remove: [],
  },
  {
    id: "black-base",
    slug: "black-rib-tank",
    headline: "BLACK RIB TANK",
    caption: "Black rib. Cut closer over the first skin.",
    note: "ACT 05 — BLACK LAYER",
    add: ["blacktank"],
    remove: [],
  },
  {
    id: "first-piece",
    slug: "i-need-nicotine-longsleeve",
    headline: "I NEED NICOTINE LONGSLEEVE",
    caption: "The first one we ever made. Oval on the chest.",
    note: "ACT 06 — THE FIRST PIECE",
    add: ["needls"],
    remove: [],
  },
  {
    id: "sugar-static",
    slug: "sugar-static-longsleeve",
    headline: "SUGAR STATIC LONGSLEEVE",
    caption: "Pink signal. Custard lines across the frame.",
    note: "ACT 07 — SUGAR SIGNAL",
    add: ["pinkls"],
    remove: [],
  },
  {
    id: "tee",
    slug: "eyes-on-cat-tee",
    headline: "EYES ON CAT TEE",
    caption: "Black, boxed. The story is on the back.",
    note: "ACT 08 — WEIGHT",
    add: ["tee"],
    remove: [],
  },
  {
    id: "pant",
    slug: "static-cargo-pant",
    headline: "STATIC CARGO PANT",
    caption: "Wide leg. Weight in the hem.",
    note: "ACT 09 — GROUND",
    add: ["pant"],
    remove: [],
  },
  {
    id: "hoodie",
    slug: "washed-hoodie",
    headline: "WASHED HOODIE",
    caption: "Overdyed past black, then broken.",
    note: "ACT 10 — VOLUME",
    add: ["hoodie"],
    remove: [],
  },
  {
    id: "cap",
    slug: "we-have-a-story-cap",
    headline: "WE HAVE A STORY CAP",
    caption: "The line you can't read from here.",
    note: "ACT 11 — COVER",
    add: ["cap"],
    remove: [],
  },
  {
    id: "bag",
    slug: "soft-armor-bag",
    headline: "SOFT ARMOR BAG",
    caption: "In the hand, then across the chest.",
    note: "ACT 12 — CARRY",
    add: ["bag"],
    remove: [],
    gesture: "toHand",
  },
  {
    id: "jacket",
    slug: "armor-jacket",
    headline: "ARMOR JACKET",
    caption: "The last layer. The only green in the drop.",
    note: "ACT 13 — FULL LOOK",
    add: ["jacket"],
    remove: [],
  },
  {
    id: "dissolve",
    headline: "SECOND SKIN",
    caption: "It comes apart. The base stays.",
    note: "ACT 14 — AFTER",
    add: [],
    remove: ["jacket", "bag", "cap", "hoodie", "tee", "pant", "shorts", "pinkls", "needls", "blacktank", "tank", "whitetank"],
    gesture: "dissolve",
  },
];
