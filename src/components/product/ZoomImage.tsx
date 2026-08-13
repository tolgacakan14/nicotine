"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   ZOOM IMAGE
   ----------------------------------------------------------------------------
   A magnifier that follows the pointer across a product shot. The lens is a
   second copy of the image, scaled up and offset so the point under the cursor
   stays under the cursor — what a loupe does on a contact sheet.

   Three decisions worth keeping:
   • The lens is a `background-image` on a circle, not a second <img>. The
     browser already has the bitmap decoded, so opening the lens costs nothing
     and never flashes.
   • The maths run against the PAINTED box, not the frame. These shots are
     `object-contain` on transparent backgrounds, so the painted area is almost
     always smaller than its frame; magnifying against the frame would slide
     the magnified point away from the cursor the further out you moved.
   • `(hover: hover)` gates it. On touch there is no cursor to track, and a lens
     under a fingertip hides the very thing it is meant to reveal — pinch-zoom
     is already the right gesture there.
   ========================================================================== */

const LENS = 210; // px across
const SCALE = 2.6;

export default function ZoomImage({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [canHover, setCanHover] = useState(false);
  const [lens, setLens] = useState<{
    x: number;
    y: number;
    size: string;
    position: string;
  } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!canHover || !frame || !img?.naturalWidth) return;

    const box = frame.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;

    // Reconstruct the object-contain painted box.
    const fit = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight);
    const paintedW = img.naturalWidth * fit;
    const paintedH = img.naturalHeight * fit;
    const offsetX = (box.width - paintedW) / 2;
    const offsetY = (box.height - paintedH) / 2;

    // Where the cursor sits within the painted image, 0–1.
    const rx = Math.min(1, Math.max(0, (x - offsetX) / paintedW));
    const ry = Math.min(1, Math.max(0, (y - offsetY) / paintedH));

    const zoomW = paintedW * SCALE;
    const zoomH = paintedH * SCALE;

    setLens({
      x,
      y,
      size: `${zoomW}px ${zoomH}px`,
      // Pull the magnified copy so the sampled point lands at the lens centre.
      position: `${LENS / 2 - rx * zoomW}px ${LENS / 2 - ry * zoomH}px`,
    });
  };

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden ${canHover ? "cursor-zoom-in" : ""} ${className}`}
      onMouseMove={onMove}
      onMouseLeave={() => setLens(null)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-contain"
      />

      {lens && (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full border border-line"
          style={{
            width: LENS,
            height: LENS,
            left: lens.x - LENS / 2,
            top: lens.y - LENS / 2,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: lens.size,
            backgroundPosition: lens.position,
            backgroundColor: "rgb(var(--c-ground))",
            boxShadow: "0 10px 44px rgb(var(--c-mark) / 0.18)",
          }}
        />
      )}
    </div>
  );
}
