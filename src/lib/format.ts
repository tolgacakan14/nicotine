/** Prices are stored as whole EUR integers and formatted in one place. */
export function formatPrice(value: number): string {
  return `€${value.toLocaleString("de-DE")}`;
}

/** "DROP 004" → "004" */
export function dropNumber(code: string): string {
  return code.replace(/[^0-9]/g, "");
}

export function padIndex(n: number): string {
  return String(n + 1).padStart(2, "0");
}
