"use client";

/** Minimal −/+ quantity control, shared by the drawer, cart page and PDP. */
export default function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 9,
  compact = false,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  compact?: boolean;
}) {
  const size = compact ? "h-7 w-7 text-[11px]" : "h-12 w-12 text-xs";

  return (
    <div className="inline-flex items-center border border-line">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${size} font-mono text-ash transition-colors hover:bg-mark hover:text-ground`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className={`${compact ? "w-7 text-[11px]" : "w-12 text-xs"} text-center font-mono text-mark`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`${size} font-mono text-ash transition-colors hover:bg-mark hover:text-ground`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
