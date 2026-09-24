"use client";

import { useState } from "react";
import Link from "next/link";
import QtyStepper from "./QtyStepper";
import { lineKey, useCart, SHIPPING_THRESHOLD, type VoucherError } from "@/lib/cart";
import { useClub } from "@/lib/club";
import { getProduct } from "@/data/drops";
import { scrollToTop } from "@/lib/scroll";
import ProductVisual from "@/components/product/ProductVisual";
import Price from "@/components/ui/Price";

/**
 * Full cart page — the drawer's roomier sibling, plus a mock checkout step so
 * the flow has an ending. Wire `handleCheckout` to Stripe / your PSP later.
 */
export default function CartView() {
  const {
    lines, subtotal, discount, shipping, total, remove, setQty, clear, count,
    voucherCode, voucherName, applyVoucher, removeVoucher, checkout,
  } = useCart();
  const { member } = useClub();
  const [placed, setPlaced] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState<VoucherError | null>(null);

  /** Unspent vouchers this member could put on the basket right now. */
  const available = (member?.vouchers ?? []).filter((v) => !v.usedAt);

  function handleApply(e: React.FormEvent) {
    e.preventDefault();
    const err = applyVoucher(codeInput);
    setCodeError(err);
    if (!err) setCodeInput("");
  }

  function handleCheckout() {
    // PROTOTYPE: no payment provider is connected. Replace with a call that
    // creates a checkout session and redirects to it. `checkout()` already
    // does the part that must happen either way — spending the voucher so it
    // cannot be used twice — and empties the basket.
    setPlaced(true);
    checkout();
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
                {discount > 0 && (
                  <div className="flex justify-between text-ash">
                    <dt className="text-blush">{voucherName}</dt>
                    <dd className="text-blush">
                      − <Price value={discount} />
                    </dd>
                  </div>
                )}
                <div className="flex justify-between text-ash">
                  <dt>SHIPPING — EU / TR</dt>
                  <dd className={shipping === 0 && voucherCode ? "text-blush" : "text-mark"}>
                    {shipping === 0 ? "FREE" : <Price value={shipping} />}
                  </dd>
                </div>
                <div className="flex justify-between text-ash">
                  <dt>TAX</dt>
                  <dd className="text-mark">INCLUDED</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-4 text-base text-mark">
                  <dt>TOTAL</dt>
                  <dd><Price value={total} /></dd>
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

              {/* ---- Club voucher ----
                  Only shown to a member holding one. A code box on an empty
                  account is a box that can only ever say no. */}
              {(voucherCode || available.length > 0) && (
                <div className="mt-8 border-t border-line pt-6">
                  <p className="eyebrow">CLUB VOUCHER</p>

                  {voucherCode ? (
                    <div className="mt-4 flex items-center justify-between gap-4 border border-blush px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-display text-sm font-black uppercase tracking-tight2 text-blush">
                          {voucherName}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] tracking-wide2 text-ash">
                          {voucherCode}
                        </p>
                      </div>
                      {/* Not just "REMOVE": every line in the basket already has
                          one of those, and two controls with the same word doing
                          different jobs is how someone deletes a jacket while
                          trying to take a voucher off. */}
                      <button
                        type="button"
                        onClick={removeVoucher}
                        className="link-wipe shrink-0 font-mono text-[10px] uppercase tracking-wide2 text-ash hover:text-mark"
                      >
                        REMOVE VOUCHER
                      </button>
                    </div>
                  ) : (
                    <>
                      <form onSubmit={handleApply} className="mt-4 flex gap-2">
                        <input
                          value={codeInput}
                          onChange={(e) => {
                            setCodeInput(e.target.value);
                            setCodeError(null);
                          }}
                          placeholder="CODE"
                          aria-label="Club voucher code"
                          className="min-w-0 flex-1 border-b border-line bg-transparent pb-2 font-mono text-[11px] uppercase tracking-wide2 text-mark placeholder:text-line focus:border-blush focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="shrink-0 border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-mark transition-colors hover:border-blush hover:text-blush"
                        >
                          APPLY
                        </button>
                      </form>

                      {codeError && (
                        <p role="alert" className="mt-3 font-mono text-[10px] uppercase tracking-wide2 text-blush">
                          {codeError === "UNKNOWN" && "NO SUCH CODE ON YOUR ACCOUNT."}
                          {codeError === "USED" && "THAT ONE IS ALREADY SPENT."}
                          {codeError === "NOT_AT_TILL" &&
                            "THAT REWARD IS ARRANGED BY HAND — WE WILL BE IN TOUCH."}
                        </p>
                      )}

                      {/* Typing a code you are already holding is busywork. */}
                      {available.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {available.map((v) => (
                            <li key={v.code} className="flex items-center justify-between gap-3">
                              <span className="font-mono text-[10px] tracking-wide2 text-ash">
                                {v.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => setCodeError(applyVoucher(v.code))}
                                className="link-wipe shrink-0 font-mono text-[10px] uppercase tracking-wide2 text-mark"
                              >
                                USE
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
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
