"use client";

import { useCurrency } from "@/lib/currency";

/**
 * The only place a price is rendered. Keeping it a tiny client component means
 * pages stay server-rendered — just these spans hydrate and re-render when the
 * shopper switches currency.
 *
 * `value` is always the base EUR integer from `drops.ts`.
 */
export default function Price({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const { format } = useCurrency();
  return <span className={className}>{format(value)}</span>;
}
