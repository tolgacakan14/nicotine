"use client";

import { useState } from "react";
import Link from "next/link";
import QtyStepper from "./QtyStepper";
import { lineKey, useCart, SHIPPING_THRESHOLD } from "@/lib/cart";
import { getProduct } from "@/data/drops";
import { scrollToTop } from "@/lib/scroll";
import ProductVisual from "@/components/product/ProductVisual";
import Price from "@/components/ui/Price";

/**
 * Full cart page — the drawer's roomier sibling, plus a mock checkout step so
 * the flow has an ending. Wire `handleCheckout` to Stripe / your PSP later.
 */
export default function CartView() {
  const { lines, subtotal, shipping, remove, setQty, clear, count } = useCart();
  const [placed, setPlaced] = useState(false);

  function handleCheckout() {
    // PROTOTYPE: no payment provider is connected. Replace with a call that
    // creates a checkout session and redirects to it.
    setPlaced(true);
    clear();
    scrollToTop();
  }

  if (placed) {
    return (
      <div className="shell flex min-h-[70dvh] flex-col items-center justify-center py-32 text-center">
        <p className="eyebrow">ORDER NO. {Math.floor(100000 + Math.random() * 899999)}</p>
        <h1 className="mt-6 font-display text-huge font-black uppercase leading-none text-mark">
          THAT&apos;S YOURS NOW
        </h1>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-wide2 text-haze">
          PROTOTYPE — NOTHING WAS CHARGED
        </p>
        <Link href="/drop" className="btn-ghost mt-10">
          <span>BACK TO THE DROP</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="shell pb-24 pt-[calc(var(--nav-h)+4rem)]">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p className="eyebrow">YOUR BAG</p>
        <p className="eyebrow">{String(count).padStart(2, "0")} ITEMS</p>
      </div>
      <h1 className="mt-6 font-display text-mega font-black uppercase leading-[0.8] text-mark">
        CART
      </h1>
      <div className="rule mt-8" />

      {lines.length === 0 ? (
        <div className="flex flex-col items-start gap-6 py-24">
          <p className="font-display text-big font-black uppercase leading-none text-mark">
            EMPTY.
          </p>

          <Link href="/drop" className="btn-ghost">
            <span>SHOP THE DROP</span>
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-14 lg:grid-cols-12">
          {/* ---------- Lines ---------- */}
          <ul className="lg:col-span-7">
            {lines.map((line) => {
              const key = lineKey(line);
              const product = getProduct(line.slug);
              return (
                <li
                  key={key}
                  className="flex flex-col gap-5 border-b border-line py-8 sm:flex-row sm:gap-8"
                >
                  <Link
                    href={`/product/${line.slug}`}
                    className="block aspect-[3/4] w-full shrink-0 sm:w-36"
                  >
                    {product ? (
                      <ProductVisual product={product} className="h-full w-full" compact />
                    ) : (
                      <span className="block h-full w-full bg-shade" />
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-6">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/product/${line.slug}`}
                            className="link-wipe font-display text-xl font-black uppercase tracking-tight2 text-mark"
                          >
                            {line.name}
                          </Link>
                          <p className="eyebrow mt-2">
                            {line.dropCode} — SIZE {line.size}
                          </p>
                        </div>
                        <span className="font-mono text-sm tracking-wide2 text-mark">
                          <Price value={line.price * line.qty} />
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <QtyStepper value={line.qty} min={0} onChange={(q) => setQty(key, q)} />
                      <button
                        type="button"
                        onClick={() => remove(key)}
                        className="link-wipe font-mono text-[11px] uppercase tracking-wide2 text-ash hover:text-mark"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* ---------- Summary ---------- */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
              <p className="eyebrow border-b border-line pb-4">SUMMARY</p>
              <dl className="mt-6 space-y-3 font-mono text-[11px] uppercase tracking-wide2">
                <div className="flex justify-between text-ash">
                  <dt>SUBTOTAL</dt>
                  <dd className="text-mark"><Price value={subtotal} /></dd>
                </div>
                <div className="flex justify-between text-ash">
                  <dt>SHIPPING — EU / TR</dt>
                  <dd className="text-mark">
                    {shipping === 0 ? "FREE" : <Price value={shipping} />}
                  </dd>
                </div>
                <div className="flex justify-between text-ash">
                  <dt>TAX</dt>
                  <dd className="text-mark">INCLUDED</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-4 text-base text-mark">
                  <dt>TOTAL</dt>
                  <dd><Price value={subtotal + shipping} /></dd>
                </div>
              </dl>

              {subtotal < SHIPPING_THRESHOLD && (
                <div className="mt-5">
                  <div className="h-px w-full bg-line">
                    <div
                      className="h-px bg-mark transition-[width] duration-700 ease-editorial"
                      style={{
                        width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                    <Price value={SHIPPING_THRESHOLD - subtotal} /> MORE FOR FREE EU SHIPPING
                  </p>
                </div>
              )}

              <button type="button" onClick={handleCheckout} className="btn-solid mt-8 w-full">
                CHECKOUT
              </button>
              <button
                type="button"
                onClick={clear}
                className="link-wipe mt-5 font-mono text-[10px] uppercase tracking-wide2 text-ash hover:text-mark"
              >
                EMPTY CART
              </button>

              <p className="mt-8 border-t border-line pt-5 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                PROTOTYPE — NOTHING IS CHARGED
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
