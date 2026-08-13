"use client";

import { CURRENCIES, useCurrency, type CurrencyCode } from "@/lib/currency";

/**
 * EUR / TRY toggle. Two currencies is a switch, not a dropdown — a select would
 * be more chrome than the choice deserves.
 */
export default function CurrencySwitch({ className = "" }: { className?: string }) {
  const { code, setCode } = useCurrency();
  const codes = Object.keys(CURRENCIES) as CurrencyCode[];

  return (
    <div
      className={`flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide2 ${className}`}
      role="group"
      aria-label="Currency"
    >
      {codes.map((c, i) => (
        <span key={c} className="flex items-center gap-1">
          {i > 0 && <span className="text-line">/</span>}
          <button
            type="button"
            onClick={() => setCode(c)}
            aria-pressed={code === c}
            className={`transition-colors ${
              code === c ? "text-mark" : "text-ash hover:text-haze"
            }`}
          >
            {CURRENCIES[c].symbol} {c}
          </button>
        </span>
      ))}
    </div>
  );
}
