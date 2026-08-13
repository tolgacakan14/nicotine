/**
 * Domain types for the NICOTINE storefront.
 *
 * Everything the site renders is derived from these shapes, so swapping the
 * hard-coded arrays in `src/data/drops.ts` for a CMS/commerce API later only
 * requires returning objects that satisfy these interfaces.
 */

/** Which layer of the scroll-film character a product maps to. */
export type GarmentLayer =
  | "whitetank"
  | "tank"
  | "blacktank"
  | "tee"
  | "longsleeve"
  | "hoodie"
  | "jacket"
  | "pant"
  | "cap"
  | "bag"
  | "scarf"
  | "needls"
  | "pinkls"
  | "shorts";

export type ProductCategory =
  | "T-SHIRT"
  | "KNIT"
  | "OUTERWEAR"
  | "BOTTOMS"
  | "HEADWEAR"
  | "BAGS"
  | "ACCESSORIES";

export interface Product {
  /** URL segment — must be unique across all drops. */
  slug: string;
  name: string;
  /** Integer price in EUR. Formatted by `formatPrice()`. */
  price: number;
  category: ProductCategory;
  /** One-line editorial caption used on cards and in the scroll film. */
  tagline: string;
  /** Two or three short paragraphs for the product detail page. */
  description: string[];
  materials: string;
  /** Spec bullets shown beside the shots — cut, hardware, fabric, origin. */
  specs?: string[];
  sizes: string[];
  colorway: string;
  /** Slug of the drop this product belongs to. Set automatically by `getDrops()`. */
  dropSlug?: string;
  /**
   * Visual controls. Set `image` to a real asset path and `ProductVisual`
   * renders the photograph instead of the generated placeholder.
   */
  image?: string;
  /** Additional shots for the PDP gallery, in order. Falls back to `image`. */
  images?: string[];
  /** Caption per shot, e.g. ["FRONT", "SIDE", "BACK"]. Defaults to numbered views. */
  imageLabels?: string[];
  /** 0–1 lightness of the generated placeholder block. */
  tone: number;
  /** Placeholder texture treatment. */
  texture: "flat" | "halftone" | "scan" | "smear";
  /** Character layer this product occupies in the scroll film (optional). */
  layer?: GarmentLayer;
  /** Marks the 3–5 pieces that carry the scroll narrative. */
  featured?: boolean;
}

export interface Drop {
  slug: string;
  /** e.g. "DROP 004" */
  code: string;
  /** e.g. "SECOND SKIN" */
  title: string;
  /** e.g. "AUG 2026" */
  season: string;
  /** ISO date — used to sort drops and to pick the current one. */
  releasedAt: string;
  /** Long-form drop concept shown on the drop page. */
  concept: string;
  /** Two-to-four word poster line used over the cover. */
  strapline: string;
  city: string;
  tone: number;
  texture: Product["texture"];
  products: Product[];
}

export interface CartLine {
  slug: string;
  name: string;
  price: number;
  size: string;
  qty: number;
  dropCode: string;
  tone: number;
  texture: Product["texture"];
}
