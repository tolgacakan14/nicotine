"use client";

import Link from "next/link";
import { lineKey, useCart, SHIPPING_THRESHOLD } from "@/lib/cart";
import QtyStepper from "./QtyStepper";
import Price from "@/components/ui/Price";
import Image from "next/image";
import { getProduct } from "@/data/drops";

/**
 * Slide-in cart. Rendered once in the root layout so it is available from every
 * page; open/close state lives in the cart context.
 */
export default function CartDrawer() {
  const { lines, isOpen, closeCart, subtotal, shipping, remove, setQty, count } = useCart();

  return (
    <>
      {/* Scrim */}
      <div
        onClick={closeCart}
        aria-hidden
        className={`fixed inset-0 z-[60] bg-tar/70 backdrop-blur-sm transition-opacity duration-500 ease-editorial ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-[440px] flex-col border-l border-line bg-ground transition-transform duration-[600ms] ease-editorial ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-mono text-[11px] uppercase tracking-wide2 text-mark">
            CART ({String(count).padStart(2, "0")})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="link-wipe font-mono text-[11px] uppercase tracking-wide2 text-ash hover:text-mark"
          >
            CLOSE
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-display text-2xl font-black uppercase tracking-tight2 text-mark">
              NOTHING IN HERE
            </p>

            <Link href="/drop" onClick={closeCart} className="btn-ghost">
              <span>SHOP THE DROP</span>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto">
              {lines.map((line) => {
                const key = lineKey(line);
                const product = getProduct(line.slug);
                return (
                  <li key={key} className="flex gap-4 px-6 py-5">
                    <Link
                      href={`/product/${line.slug}`}
                      onClick={closeCart}
                      className="block h-24 w-20 shrink-0 bg-shade"
                      aria-label={line.name}
                    >
                      {product?.image ? (
                        <span className="relative block h-full w-full">
                          <Image src={product.image} alt="" fill sizes="80px" className="object-contain" />
                        </span>
                      ) : <span className="block h-full w-full bg-shade" />}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/product/${line.slug}`}
                            onClick={closeCart}
                            className="font-display text-sm font-black uppercase tracking-tight2 text-mark"
                          >
                            {line.name}
                          </Link>
                          <span className="font-mono text-[11px] text-mark">
                            <Price value={line.price * line.qty} />
                          </span>
                        </div>
                        <p className="eyebrow mt-1">
                          {line.dropCode} — SIZE {line.size}
                        </p>
                      </div>

                      <div className="flex items-end justify-between">
                        {/* min=0 → stepping below one removes the line */}
                        <QtyStepper
                          value={line.qty}
                          min={0}
                          onChange={(qty) => setQty(key, qty)}
                          compact
                        />
                        <button
                          type="button"
                          onClick={() => remove(key)}
                          className="link-wipe font-mono text-[10px] uppercase tracking-wide2 text-ash hover:text-mark"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-line px-6 py-6">
              <dl className="space-y-2 font-mono text-[11px] uppercase tracking-wide2">
                <div className="flex justify-between text-ash">
                  <dt>SUBTOTAL</dt>
                  <dd className="text-mark"><Price value={subtotal} /></dd>
                </div>
                <div className="flex justify-between text-ash">
                  <dt>SHIPPING</dt>
                  <dd className="text-mark">
                    {shipping === 0 ? "FREE" : <Price value={shipping} />}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-mark">
                  <dt>TOTAL</dt>
                  <dd><Price value={subtotal + shipping} /></dd>
                </div>
              </dl>

              {subtotal < SHIPPING_THRESHOLD && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                  <Price value={SHIPPING_THRESHOLD - subtotal} /> MORE FOR FREE EU SHIPPING
                </p>
              )}

              <Link
                href="/cart"
                onClick={closeCart}
                className="btn-solid mt-6 block w-full text-center"
              >
                CHECKOUT →
              </Link>

              <button type="button" onClick={closeCart} className="mt-4 w-full font-mono text-[10px] uppercase tracking-wide2 text-ash hover:text-mark">
                CONTINUE SHOPPING
              </button>

            </footer>
          </>
        )}
      </aside>
    </>
  );
}
