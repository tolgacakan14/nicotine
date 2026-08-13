"use client";

import { useEffect, useState } from "react";

export default function SpotlightMode() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("spotlight-active", active);
    return () => document.body.classList.remove("spotlight-active");
  }, [active]);

  return (
    <>
      <button
        type="button"
        aria-pressed={active}
        onClick={() => setActive((value) => !value)}
        className="spotlight-toggle"
      >
        <span className="spotlight-toggle__lamp" aria-hidden />
        {active ? "EXIT SPOTLIGHT" : "SPOTLIGHT"}
      </button>
      <div className="spotlight-blackout" aria-hidden />
    </>
  );
}
