"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that travels to its new value instead of jumping.
 *
 * Points are the whole currency of this page, and a balance that snaps from
 * 563 to 63 reads as a glitch — the same balance counting down reads as a
 * price being paid. It animates on every change, not just on mount, so
 * collecting and redeeming both land.
 */
export default function Counter({
  value,
  className = "",
  duration = 900,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      fromRef.current = value;
      return;
    }

    const from = fromRef.current;
    const delta = value - from;
    if (delta === 0) return;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Same easing curve as the rest of the site's motion.
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(from + delta * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = value;
    };
  }, [value, duration]);

  return (
    <span className={className} suppressHydrationWarning>
      {shown.toLocaleString("de-DE")}
    </span>
  );
}
