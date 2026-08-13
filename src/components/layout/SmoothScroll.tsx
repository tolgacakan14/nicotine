"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/scroll";

/* ============================================================================
   SMOOTH SCROLL
   ----------------------------------------------------------------------------
   Lenis replaces the browser's native scroll with an interpolated one, then
   drives ScrollTrigger from GSAP's own ticker. Two things this buys us:

   1. The film's scrub stops being tied to the OS wheel's coarse, steppy deltas
      — the whole dressing sequence glides instead of jumping notch to notch.
   2. Lenis and GSAP share a single RAF loop, so scroll position and the
      timeline are read in the same frame. No tearing between the pinned stage
      and the garments moving inside it.

   Wheel/touch multipliers are deliberately restrained: this is an editorial
   site, not a demo reel. Overscrolling past the end is disabled so the pinned
   film can't be flung through.
   ========================================================================== */
export default function SmoothScroll() {
  useEffect(() => {
    // Users who asked for less motion keep the native scroll.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      // Gentle exponential ease-out — long tail, no bounce.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      syncTouch: false, // native momentum on touch feels better than emulated
    });

    setLenis(lenis);

    // Let ScrollTrigger read Lenis's position rather than the raw scrollTop.
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page anchors (#dressroom) must go through Lenis or they fight it.
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      const target = url.hash && document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
