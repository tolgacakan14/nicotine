"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SpotlightMode() {
  const [active, setActive] = useState(false);
  const flagRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    document.body.classList.toggle("spotlight-active", active);
    const cards = gsap.utils.toArray<HTMLElement>(".drop-grid-card");

    if (active) {
      hasOpenedRef.current = true;
      const timeline = gsap.timeline();
      timeline
        .fromTo(
          blackoutRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.75, ease: "power2.inOut" }
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

    // The first effect run happens while spotlight is closed; no exit motion is
    // needed then. After a real opening, fade the GSAP inline opacity out and
    // remove every inline transform so the normal four-column shop is restored.
    if (!hasOpenedRef.current) return;

    const exitTimeline = gsap.timeline({
      onComplete: () => {
        gsap.set(blackoutRef.current, { clearProps: "all" });
        gsap.set(flagRef.current, { clearProps: "all" });
        gsap.set(cards, { clearProps: "opacity,transform" });
      },
    });
    exitTimeline
      .to(flagRef.current, { yPercent: -20, opacity: 0, duration: 0.45, ease: "power2.in" })
      .to(blackoutRef.current, { opacity: 0, duration: 0.55, ease: "power2.out" }, 0.08);

    return () => exitTimeline.kill();
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
      <div ref={blackoutRef} className="spotlight-blackout" aria-hidden />
      <div className="spotlight-flag-anchor" aria-hidden>
        <div ref={flagRef} className="spotlight-flag">
          {/* The rigid pole and fabric are separate physical layers. The pole
              stays still while the cloth bends in perspective around its seam. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="spotlight-flag__pole" src="/editorial/drop-001-flag-pole.webp" alt="" />
          <div className="spotlight-flag__cloth-stage">
            <div className="spotlight-flag__cloth">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/editorial/drop-001-flag-cloth.webp" alt="" />
              <span className="spotlight-flag__folds" />
            </div>
            <span className="spotlight-flag__shine" />
          </div>
        </div>
      </div>
    </>
  );
}
