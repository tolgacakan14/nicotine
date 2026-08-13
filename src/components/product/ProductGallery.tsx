import type { Product } from "@/data/types";
import ProductVisual from "./ProductVisual";
import ZoomImage from "./ZoomImage";
import { catalogImage } from "@/lib/catalog-image";

/**
 * PDP gallery — one column of shots you scroll down through, centred between
 * the sticky info and buy rails.
 *
 * Deliberately not a grid or a thumbnail carousel: the photography is supplied
 * as cut-outs on transparent grounds, so stacking them full width lets each
 * piece be looked at properly, and the page's own scroll is the only control
 * anyone has to learn. Each shot magnifies on hover.
 */
export default function ProductGallery({ product }: { product: Product }) {
  if (product.images?.length) {
    const labels = product.imageLabels ?? [];
    return (
      <div className="flex flex-col gap-2">
        {product.images.map((src, i) => (
          <figure key={src} className="relative">
            <ZoomImage
              src={catalogImage(src)}
              alt={`${product.name} — ${labels[i] ?? `view ${i + 1}`}`}
              priority={i === 0}
              className="aspect-[4/5] w-full"
            />
            <figcaption className="eyebrow absolute left-0 top-0">
              {String(i + 1).padStart(2, "0")}
              {labels[i] ? ` — ${labels[i]}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  // Products still on generated placeholders have no alternate views to derive.
  return (
    <div className="aspect-[4/5] w-full">
      <ProductVisual product={product} className="h-full w-full" priority />
    </div>
  );
}
