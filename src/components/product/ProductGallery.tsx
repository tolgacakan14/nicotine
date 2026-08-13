import type { Product } from "@/data/types";
import ProductVisual from "./ProductVisual";

/**
 * PDP gallery. A product with real photography (`images[]`) shows those shots
 * in order. Anything still on placeholders derives three views from the same
 * product by varying tone and texture — a look, a detail and a flat.
 */
export default function ProductGallery({ product }: { product: Product }) {
  if (product.images?.length) {
    const labels = product.imageLabels ?? [];
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {product.images.map((src, i) => (
          <figure key={src}>
            <div className="aspect-[4/5] overflow-hidden border border-line bg-shade">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${product.name} — ${labels[i] ?? `view ${i + 1}`}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-contain"
              />
            </div>
            <figcaption className="eyebrow mt-2">
              {String(i + 1).padStart(2, "0")} — {labels[i] ?? "VIEW"}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  const shots: Array<{ label: string; product: Product; ratio: string }> = [
    { label: "LOOK", product, ratio: "aspect-[4/5]" },
    {
      label: "DETAIL",
      product: { ...product, tone: Math.min(0.95, product.tone + 0.16), texture: "halftone" },
      ratio: "aspect-square",
    },
    {
      label: "FLAT",
      product: { ...product, tone: Math.max(0.06, product.tone - 0.14), texture: "scan" },
      ratio: "aspect-square",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {shots.map((shot, i) => (
        <figure
          key={shot.label}
          className={`group relative ${i === 0 ? "sm:col-span-2 xl:col-span-2" : ""}`}
        >
          <div className={shot.ratio}>
            <ProductVisual
              product={shot.product}
              className="h-full w-full"
              priority={i === 0}
              compact={i > 0}
            />
          </div>
          <figcaption className="eyebrow mt-2">
            {String(i + 1).padStart(2, "0")} — {shot.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
