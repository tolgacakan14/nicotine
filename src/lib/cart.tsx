"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { CartLine, Product } from "@/data/types";
import { REWARDS } from "@/data/club";
import { useClub } from "./club";

/* ============================================================================
   CART STORE
   ----------------------------------------------------------------------------
   Prototype-grade: React context + reducer, persisted to localStorage. Swap the
   reducer for a real commerce SDK (Shopify Storefront, Medusa, Stripe) later —
   the component API (`useCart()`) is what the UI depends on, not the internals.
   ========================================================================== */

const STORAGE_KEY = "nicotine.cart.v1";
const VOUCHER_KEY = "nicotine.cart.voucher.v1";
const SHIPPING_THRESHOLD = 250; // free EU shipping over this amount

type Action =
  | { type: "add"; line: CartLine }
  | { type: "remove"; key: string }
  | { type: "qty"; key: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

/** A line is identified by product + size. */
export const lineKey = (l: Pick<CartLine, "slug" | "size">) => `${l.slug}::${l.size}`;

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const key = lineKey(action.line);
      const existing = state.find((l) => lineKey(l) === key);
      if (existing) {
        return state.map((l) =>
          lineKey(l) === key ? { ...l, qty: Math.min(9, l.qty + action.line.qty) } : l
        );
      }
      return [...state, action.line];
    }
    case "remove":
      return state.filter((l) => lineKey(l) !== action.key);
    case "qty":
      return state
        .map((l) => (lineKey(l) === action.key ? { ...l, qty: action.qty } : l))
        .filter((l) => l.qty > 0);
    case "clear":
      return [];
    default:
      return state;
  }
}

/** Why a code was refused, in the words the shopper needs. */
export type VoucherError =
  | "UNKNOWN"      // no such code on this account
  | "USED"         // already spent on an earlier order
  | "NOT_AT_TILL"; // an access reward — arranged by hand, not at checkout

interface CartApi {
  lines: CartLine[];
  count: number;
  subtotal: number;
  /** Money off, from an applied voucher. */
  discount: number;
  shipping: number;
  /** What the shopper pays: subtotal − discount + shipping. */
  total: number;
  /** The code currently on the basket, if any. */
  voucherCode: string | null;
  /** The reward that code came from, resolved. */
  voucherName: string | null;
  applyVoucher: (code: string) => VoucherError | null;
  removeVoucher: () => void;
  /** Completes the order: spends the voucher, then empties the basket. */
  checkout: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (product: Product, size: string, qty: number, dropCode: string) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [isOpen, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  // The cart sits inside ClubProvider, so it can check a code against the
  // member's own wallet instead of trusting whatever is typed into the box.
  const { member, spendVoucher } = useClub();

  /* Restore on mount */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) as CartLine[] });
      setVoucherCode(window.localStorage.getItem(VOUCHER_KEY));
    } catch {
      /* corrupted storage — start empty */
    }
    setReady(true);
  }, []);

  /* Persist on change (only after the initial restore, so we never wipe it) */
  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  useEffect(() => {
    if (!ready) return;
    if (voucherCode) window.localStorage.setItem(VOUCHER_KEY, voucherCode);
    else window.localStorage.removeItem(VOUCHER_KEY);
  }, [voucherCode, ready]);

  /* A voucher belongs to an account. Signing out, or a code that has been
     spent elsewhere, drops it from the basket rather than quietly discounting
     an order that is no longer entitled to it. */
  useEffect(() => {
    if (!ready || !voucherCode) return;
    const held = member?.vouchers.find((v) => v.code === voucherCode);
    if (!held || held.usedAt) setVoucherCode(null);
  }, [member, voucherCode, ready]);

  /* Lock body scroll + allow Esc to close while the drawer is open */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const add = useCallback(
    (product: Product, size: string, qty: number, dropCode: string) => {
      dispatch({
        type: "add",
        line: {
          slug: product.slug,
          name: product.name,
          price: product.price,
          size,
          qty,
          dropCode,
          tone: product.tone,
          texture: product.texture,
        },
      });
      setOpen(true);
    },
    []
  );

  const applyVoucher = useCallback(
    (code: string): VoucherError | null => {
      const clean = code.trim().toUpperCase();
      const held = member?.vouchers.find((v) => v.code === clean);
      if (!held) return "UNKNOWN";
      if (held.usedAt) return "USED";
      const reward = REWARDS.find((r) => r.id === held.rewardId);
      if (!reward || reward.kind === "access") return "NOT_AT_TILL";
      setVoucherCode(clean);
      return null;
    },
    [member]
  );

  const value = useMemo<CartApi>(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);

    const held = voucherCode ? member?.vouchers.find((v) => v.code === voucherCode) : undefined;
    const reward = held ? REWARDS.find((r) => r.id === held.rewardId) : undefined;

    // Rounded to the cent here so the line the shopper reads and the total they
    // are charged come from the same number.
    const discount =
      reward?.kind === "discount" && reward.percent
        ? Math.round(subtotal * reward.percent) / 100
        : 0;

    const baseShipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : 12;
    const shipping = reward?.kind === "shipping" ? 0 : baseShipping;

    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal,
      discount,
      shipping,
      total: Math.max(0, subtotal - discount) + shipping,
      voucherCode: reward ? voucherCode : null,
      voucherName: reward?.name ?? null,
      applyVoucher,
      removeVoucher: () => setVoucherCode(null),
      checkout: () => {
        if (voucherCode) spendVoucher(voucherCode);
        setVoucherCode(null);
        dispatch({ type: "clear" });
      },
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add,
      remove: (key) => dispatch({ type: "remove", key }),
      setQty: (key, qty) => dispatch({ type: "qty", key, qty }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [lines, isOpen, add, voucherCode, member, applyVoucher, spendVoucher]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { SHIPPING_THRESHOLD };
