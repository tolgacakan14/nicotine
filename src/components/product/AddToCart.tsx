"use client";

import { useState } from "react";
import type { Product } from "@/data/types";
import QtyStepper from "@/components/cart/QtyStepper";
import { useCart } from "@/lib/cart";
import Price from "@/components/ui/Price";

/**
 * Size + quantity + add. The only interactive block on the product page, so it
 * is the only part that ships as a client component.
 */
export default function AddToCart({
  product,
  dropCode,
}: {
  product: Product;
  dropCode: string;
}) {
  const oneSize = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(oneSize ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const { add } = useCart();

  function handleAdd() {
    if (!size) {
      setError(true);
      return;
    }
    add(product, size, qty, dropCode);
  }

  return (
    <div className="space-y-8">
      {/* ---- Size ---- */}
      <fieldset>
        <legend className="eyebrow mb-4 flex w-full items-center justify-between">
          <span>SIZE {oneSize && "— ONE SIZE"}</span>
          {!oneSize && <span className="text-line">FITS BOXY</span>}
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => {
            const active = s === size;
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setError(false);
                }}
                aria-pressed={active}
                className={`h-12 min-w-[3.5rem] border px-4 font-mono text-[11px] uppercase tracking-wide2 transition-colors duration-300 ${
                  active
                    ? "border-mark bg-mark text-ground"
                    : "border-line text-haze hover:border-mark hover:text-mark"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        {error && (
          <p role="alert" className="mt-3 font-mono text-[11px] uppercase tracking-wide2 text-mark">
            SELECT A SIZE FIRST
          </p>
        )}
      </fieldset>

      {/* ---- Quantity + add ---- */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <p className="eyebrow mb-3">QUANTITY</p>
          <QtyStepper value={qty} onChange={setQty} />
        </div>
        <div className="flex-1">
          {/* Spacer keeping the button's top edge level with the stepper's */}
          <div className="mb-3 h-[15px]" aria-hidden />
          <button type="button" onClick={handleAdd} className="btn-solid w-full">
            ADD TO CART — <Price value={product.price * qty} />
          </button>
        </div>
      </div>

    </div>
  );
}
