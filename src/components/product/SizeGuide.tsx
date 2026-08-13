"use client";

import { useState } from "react";
import type { Product } from "@/data/types";

export default function SizeGuide({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="link-wipe font-mono text-[10px] uppercase tracking-wide2 text-haze hover:text-mark">
        SIZE GUIDE →
      </button>
      <div aria-hidden onClick={() => setOpen(false)} className={`fixed inset-0 z-[75] bg-tar/60 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside role="dialog" aria-modal="true" aria-label="Size guide" className={`fixed right-0 top-0 z-[76] flex h-dvh w-full max-w-xl flex-col border-l border-line bg-ground transition-transform duration-500 ease-editorial ${open ? "translate-x-0" : "translate-x-full"}`}>
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <p className="eyebrow">SIZE GUIDE — {product.name}</p>
          <button type="button" onClick={() => setOpen(false)} className="link-wipe font-mono text-[10px] uppercase tracking-wide2 text-mark">CLOSE</button>
        </header>
        <div className="overflow-y-auto px-6 py-10 sm:px-10">
          <div className="grid grid-cols-[1fr_repeat(4,1fr)] border-y border-line py-3 font-mono text-[9px] uppercase tracking-wide2 text-ash">
            <span>SIZE</span><span>CHEST</span><span>LENGTH</span><span>SHOULDER</span><span>SLEEVE</span>
          </div>
          {product.sizes.map((size) => (
            <div key={size} className="grid grid-cols-[1fr_repeat(4,1fr)] border-b border-line py-4 font-mono text-[11px] uppercase tracking-wide2 text-mark">
              <span>{size}</span><span>—</span><span>—</span><span>—</span><span>—</span>
            </div>
          ))}
          <p className="mt-4 text-xs leading-relaxed text-ash">Product measurements will be added after final production grading.</p>

          <div className="mt-14 border-t border-line pt-8">
            <p className="eyebrow">HOW TO MEASURE</p>
            <dl className="mt-6 space-y-5 text-sm leading-relaxed text-haze">
              <div><dt className="font-mono text-[10px] uppercase tracking-wide2 text-mark">CHEST</dt><dd>Measure straight across the garment, pit to pit.</dd></div>
              <div><dt className="font-mono text-[10px] uppercase tracking-wide2 text-mark">LENGTH</dt><dd>Measure from the highest shoulder point to the hem.</dd></div>
              <div><dt className="font-mono text-[10px] uppercase tracking-wide2 text-mark">SHOULDER</dt><dd>Measure seam to seam across the back.</dd></div>
              <div><dt className="font-mono text-[10px] uppercase tracking-wide2 text-mark">SLEEVE</dt><dd>Measure from the shoulder seam to the cuff.</dd></div>
            </dl>
          </div>
        </div>
      </aside>
    </>
  );
}
