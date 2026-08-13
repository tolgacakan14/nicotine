"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/* ============================================================================
   CURRENCY
   ----------------------------------------------------------------------------
   Prices live in `drops.ts` as whole EUR integers — that stays the single base
   currency. Everything else is presentation: pick a currency, and every <Price>
   on the page converts and formats against the table below.

   The rate is hard-coded for the prototype. In production, fetch it daily from
   your PSP or a rates API and cache it — never convert on every render against
   a live call, and never let the displayed price drift from what the payment
   provider will actually charge.
   ========================================================================== */

export const CURRENCIES = {
  EUR: { code: "EUR", symbol: "€", rate: 1, locale: "de-DE", label: "EUR €" },
  TRY: { code: "TRY", symbol: "₺", rate: 47.5, locale: "tr-TR", label: "TRY ₺" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

const STORAGE_KEY = "nicotine.currency.v1";

interface CurrencyApi {
  code: CurrencyCode;
  setCode: (next: CurrencyCode) => void;
  /** Converts a base-EUR amount and formats it for the active currency. */
  format: (eur: number) => string;
  /** True once the stored preference has been read — avoids a flash of EUR. */
  ready: boolean;
}

const CurrencyContext = createContext<CurrencyApi | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCodeState] = useState<CurrencyCode>("EUR");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && stored in CURRENCIES) setCodeState(stored as CurrencyCode);
    setReady(true);
  }, []);

  const value = useMemo<CurrencyApi>(() => {
    const cfg = CURRENCIES[code];
    return {
      code,
      ready,
      setCode: (next) => {
        setCodeState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      },
      format: (eur: number) => {
        const converted = eur * cfg.rate;
        // Lira amounts are large and never have meaningful minor units here, so
        // both currencies round to whole numbers — cleaner on a fashion grid.
        return `${cfg.symbol}${Math.round(converted).toLocaleString(cfg.locale)}`;
      },
    };
  }, [code, ready]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyApi {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>");
  return ctx;
}
