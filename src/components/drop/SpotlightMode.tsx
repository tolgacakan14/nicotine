"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SpotlightMode() {
  const [active, setActive] = useState(false);
  const flagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.toggle("spotlight-active", active);
    const cards = gsap.utils.toArray<HTMLElement>(".drop-grid-card");

    if (active) {
      const timeline = gsap.timeline();
      timeline
        .fromTo(
          ".spotlight-blackout",
          { opacity: 0 },
          { opacity: 0.965, duration: 0.75, ease: "power2.inOut" }
        )
        .fromTo(
          flagRef.current,
          { yPercent: -125, xPercent: 7, rotation: -6, opacity: 0 },
          { yPercent: 0, xPercent: 0, rotation: 0, opacity: 1, duration: 1.25, ease: "expo.out" },
          0.18
        )
        .fromTo(
          cards,
          { opacity: 0, y: 24, scale: 0.965 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.075, ease: "power3.out" },
          0.52
        );
      return () => {
        timeline.kill();
        document.body.classList.remove("spotlight-active");
      };
    }

    gsap.set(cards, { clearProps: "opacity,transform" });
    gsap.set(flagRef.current, { clearProps: "all" });
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
      <div className="spotlight-flag-anchor" aria-hidden>
        <div ref={flagRef} className="spotlight-flag">
          <div className="spotlight-flag__shadow" />
          <div className="spotlight-flag__cloth">
            {/* Kept as an img rather than a CSS background so the original alpha
                edge and high-resolution campaign print stay intact. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/editorial/drop-001-spotlight-flag.webp" alt="" />
            <span className="spotlight-flag__shine" />
          </div>
        </div>
      </div>
    </>
  );
}
