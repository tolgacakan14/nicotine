"use client";

import { useEffect, useRef, useState } from "react";
import { catalogImage } from "@/lib/catalog-image";

/* ============================================================================
   HOVER GALLERY
   ----------------------------------------------------------------------------
   Scrubs a product's views as the pointer crosses the card. The card is divided
   into as many invisible vertical zones as there are images, so moving left to
   right walks front → back → detail. This is the pattern every serious fashion
   retailer uses, and it beats auto-advancing on a timer: the shopper controls
   the pace, and a flick across a grid previews a whole row.

   Every image is mounted and cross-faded rather than swapped in `src`, so there
   is no decode flash on the first hover. `loading="lazy"` on the non-primary
   views keeps that from costing anything on first paint.

   Guarded by `(hover: hover)`: on touch there is no pointer to scrub with, and
   a stray `mousemove` from a tap would swap the image out from under a shopper
   who is trying to follow the link.
   ========================================================================== */

export default function HoverGallery({
  images,
  labels,
  alt,
  priority = false,
}: {
  images: string[];
  labels?: string[];
  alt: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [canHover, setCanHover] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || images.length < 2) return;
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    const ratio = (e.clientX - box.left) / box.width;
    const next = Math.min(images.length - 1, Math.max(0, Math.floor(ratio * images.length)));
    setIndex((current) => (current === next ? current : next));
  };

  return (
    <div
      ref={frameRef}
      className="absolute inset-0"
      onMouseMove={onMove}
      onMouseLeave={() => setIndex(0)}
    >
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={catalogImage(src)}
          alt={i === 0 ? alt : `${alt} — ${labels?.[i] ?? `view ${i + 1}`}`}
          loading={i === 0 && priority ? "eager" : "lazy"}
          aria-hidden={i !== index}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ease-editorial ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Progress ticks — only meaningful while a pointer is present */}
      {canHover && images.length > 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-3 flex justify-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          {images.map((src, i) => (
            <span
              key={src}
              className={`h-[2px] w-5 transition-colors duration-200 ${
                i === index ? "bg-mark" : "bg-mark/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
