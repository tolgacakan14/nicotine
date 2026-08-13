import type { Product } from "@/data/types";
import GarmentGlyph from "./GarmentGlyph";

/* ============================================================================
   PRODUCT VISUAL
   ----------------------------------------------------------------------------
   Every product image on the site goes through this component. Today it renders
   a generated editorial placeholder built from the product's `tone` (0–1
   lightness) and `texture`. The moment a product gets a real `image` path in
   `drops.ts`, this component renders that photograph instead — no other file
   needs to change.
   ========================================================================== */

/** Maps a 0–1 tone to a pair of greys plus a readable ink colour. */
function toneToPalette(tone: number) {
  const base = Math.round(24 + tone * 176);
  const lift = Math.min(255, base + 26);
  const drop = Math.max(0, base - 34);
  return {
    from: `rgb(${lift},${lift},${lift})`,
    to: `rgb(${drop},${drop},${drop})`,
    ink: tone > 0.55 ? "#0A0A0A" : "#F4F2EE",
  };
}

export default function ProductVisual({
  product,
  className = "",
  compact = false,
  priority = false,
}: {
  product: Product;
  className?: string;
  /** Drops the caption overlays — used for small thumbnails. */
  compact?: boolean;
  priority?: boolean;
}) {
  // Real photography path — plug this in later via `product.image`.
  if (product.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image}
        alt={product.name}
        loading={priority ? "eager" : "lazy"}
        className={`h-full w-full object-contain p-[6%] ${className}`}
      />
    );
  }

  const { from, to, ink } = toneToPalette(product.tone);

  return (
    <div
      className={`relative isolate overflow-hidden bg-shade ${className}`}
      style={{
        backgroundImage: `linear-gradient(155deg, ${from} 0%, ${to} 100%)`,
        color: ink, // the glyph and captions inherit this
      }}
      role="img"
      aria-label={`${product.name} — editorial placeholder`}
    >
      {/* --- Texture treatment --- */}
      {product.texture === "halftone" && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.3] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(0,0,0,0.9) 1.1px, transparent 1.2px)",
            backgroundSize: "7px 7px",
          }}
        />
      )}
      {product.texture === "scan" && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.22] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(38deg, rgba(0,0,0,0.85) 0 2px, transparent 2px 7px)",
          }}
        />
      )}
      {product.texture === "smear" && (
        <div
          aria-hidden
          className="absolute -inset-10 opacity-40 blur-2xl"
          style={{
            backgroundImage:
              "linear-gradient(105deg, transparent 18%, rgba(255,255,255,0.55) 44%, transparent 64%)",
          }}
        />
      )}

      {/* --- Garment silhouette --- */}
      <div className="absolute inset-0 flex items-center justify-center">
        <GarmentGlyph
          category={product.category}
          className={`${
            compact ? "h-[76%]" : "h-[62%]"
          } w-auto opacity-[0.85] transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.05]`}
        />
      </div>

      {/* One ghost word, as texture. The category and colourway labels that used
          to sit on top of every image are gone — that information belongs under
          the picture, not printed across it. */}
      {!compact && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden p-4">
          <span className="block font-display text-[56px] font-black uppercase leading-[0.8] tracking-tight2 opacity-[0.1] sm:text-[72px]">
            {product.name.split(" ")[0]}
          </span>
        </div>
      )}

      {/* --- Film grain --- */}
      <div aria-hidden className="grain-layer pointer-events-none absolute inset-0 opacity-[0.14]" />
    </div>
  );
}
