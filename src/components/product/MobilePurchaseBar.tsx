"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/types";
import Price from "@/components/ui/Price";

export default function MobilePurchaseBar({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.querySelector("[data-purchase-panel]");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.08 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ground/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0"><p className="truncate font-display text-sm font-black uppercase text-mark">{product.name}</p><p className="font-mono text-[10px] text-chrome"><Price value={product.price} /></p></div>
        <button type="button" onClick={() => document.querySelector("[data-purchase-panel]")?.scrollIntoView({ behavior: "smooth", block: "center" })} className="shrink-0 border border-mark px-4 py-3 font-mono text-[10px] uppercase tracking-wide2 text-mark">SELECT SIZE / ADD →</button>
      </div>
    </div>
  );
}
