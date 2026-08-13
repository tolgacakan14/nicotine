"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CURRENT_DROP } from "@/data/drops";
import OrbitRings from "@/components/brand/OrbitRings";
import Wordmark from "@/components/brand/Wordmark";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * Landing frame. One thing on screen: the wordmark in polished mercury, dead
 * centre, with the logo's ring orbiting it in 3D.
 *
 * The mark is absolutely centred rather than sitting in a flex flow — a hero
 * this reduced only works if the wordmark is at the true optical centre of the
 * viewport, and flow layout kept pushing it above centre as the meta rows
 * changed height.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const letters = wordRef.current?.querySelectorAll("[data-letter]");

      if (!reduced && letters) {
        /* `fromTo`, not `from`: React StrictMode mounts effects twice in dev, and
           `from()` infers its end state from whatever the DOM holds at build
           time. On the second pass that was the first pass's start value — 0 —
           so the meta row animated to invisible and stayed there. Stating both
           ends makes the tween independent of when it happens to be created. */
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .fromTo(letters, { yPercent: 120 }, { yPercent: 0, duration: 1.2, stagger: 0.06 })
          .fromTo(
            "[data-hero-meta]",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
            "-=0.5"
          );
      }

      // The mark sinks and fades as the page moves on.
      gsap.to("[data-hero-inner]", {
        yPercent: 14,
        autoAlpha: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-dvh min-h-[600px] overflow-hidden">
      {/* A single soft light source, top-left, like a studio strobe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_-10%,rgba(255,255,255,0.95)_0%,transparent_60%)]"
      />

      <div data-hero-inner className="absolute inset-0">
        {/* ---- The mark, centred in the viewport ---- */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <div
            className="shell relative py-[9vw]"
            style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
          >
            <OrbitRings />
            <Wordmark
              as="h1"
              spread
              metal
              ref={wordRef}
              className="relative font-body text-mega font-black uppercase leading-none tracking-tight2"
              style={{ transform: "translateZ(60px)" }}
            />
          </div>
        </div>

        {/* ---- Bottom rail ---- */}
        <div className="shell absolute inset-x-0 bottom-0 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div data-hero-meta>
              <p className="eyebrow mb-2">NOW LIVE — {CURRENT_DROP.code}</p>
              <p className="font-display text-big font-black uppercase leading-none text-mark">
                {CURRENT_DROP.title}
              </p>
            </div>

            <div data-hero-meta className="flex flex-wrap items-center gap-5">
              <Link href="/drop" className="btn-ghost">
                <span>SHOP THE DROP</span>
              </Link>
              <Link
                href="#dressroom"
                className="link-wipe font-mono text-[11px] uppercase tracking-wide2 text-ash hover:text-mark"
              >
                ↓ DRESSROOM
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
