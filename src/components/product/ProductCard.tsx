import Link from "next/link";
import type { Product } from "@/data/types";
import ProductVisual from "./ProductVisual";
import HoverGallery from "./HoverGallery";
import { padIndex } from "@/lib/format";
import Price from "@/components/ui/Price";

/**
 * Editorial product card. Portrait visual, metadata underneath, index number in
 * the corner — closer to a lookbook plate than a webshop tile.
 */
export default function ProductCard({
  product,
  index,
  /** `tall` gives the hero pieces a longer crop in the drop grid. */
  tall = false,
  /** `square` is the collection grid, where every piece gets the same box. */
  square = false,
  priority = false,
}: {
  product: Product;
  index?: number;
  tall?: boolean;
  square?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus-visible:outline-offset-4"
    >
      {/* The hairline matters on a light ground: pale garments photographed on
          pale backgrounds have no edge of their own and dissolve into the page. */}
      <div
        className={`relative overflow-hidden ${
          square ? "aspect-square" : tall ? "aspect-[3/4.4]" : "aspect-[3/4]"
        }`}
      >
        {/* Photographed pieces get a scrubbable gallery on hover; anything still
            on a generated placeholder has nothing to cycle through. */}
        {product.images && product.images.length > 1 ? (
          <HoverGallery
            images={product.images}
            labels={product.imageLabels}
            alt={product.name}
            priority={priority}
          />
        ) : (
          <ProductVisual product={product} className="h-full w-full" priority={priority} />
        )}

        {/* Index badge */}
        {index !== undefined && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-wide2 text-mark mix-blend-difference">
            {padIndex(index)}
          </span>
        )}

        {/* Hover plate */}
        <div className="chrome-plate pointer-events-none absolute inset-x-0 bottom-0 translate-y-full px-4 py-3 transition-transform duration-500 ease-editorial group-hover:translate-y-0">
          <span className="font-mono text-[10px] uppercase tracking-wide2 text-ground">
            PIECE →
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-base font-black uppercase tracking-tight2 text-mark sm:text-lg">
            {product.name}
          </h3>
        </div>
        <span className="shrink-0 font-mono text-[11px] tracking-wide2 text-chrome">
          <Price value={product.price} />
        </span>
      </div>
    </Link>
  );
}
