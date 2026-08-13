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

/* ============================================================================
   CART STORE
   ----------------------------------------------------------------------------
   Prototype-grade: React context + reducer, persisted to localStorage. Swap the
   reducer for a real commerce SDK (Shopify Storefront, Medusa, Stripe) later —
   the component API (`useCart()`) is what the UI depends on, not the internals.
   ========================================================================== */

const STORAGE_KEY = "nicotine.cart.v1";
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

interface CartApi {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
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

  /* Restore on mount */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) as CartLine[] });
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

  const value = useMemo<CartApi>(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal,
      shipping: subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : 12,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add,
      remove: (key) => dispatch({ type: "remove", key }),
      setQty: (key, qty) => dispatch({ type: "qty", key, qty }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [lines, isOpen, add]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { SHIPPING_THRESHOLD };
