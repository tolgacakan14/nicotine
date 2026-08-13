"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Figure from "./Figure";
import { FILM_ACTS } from "@/data/film";
import { CURRENT_DROP, getProduct } from "@/data/drops";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import Price from "@/components/ui/Price";

/* ============================================================================
   SCROLL FILM v3
   ----------------------------------------------------------------------------
   THE CHANGE THAT MATTERS: garments are no longer transformed into place.

   v2 tweened each garment from an offset position (y:-86, scaleY:1.18, …) down
   onto the body. For most of every tween the garment was therefore NOT on the
   body — which is exactly the "doesn't sit right" the eye picks up.

   v3 keeps every garment permanently at its fitted coordinates and reveals it
   with a clip rect that wipes across the body (see the <clipPath> defs in
   Figure.tsx). A top-down wipe reads as pulling a top on; the trousers wipe
   bottom-up, as if stepped into. Fit is pixel-identical at every frame, because
   nothing ever moves.

   The only element that still travels is the bag — it is *carried* into frame,
   which is the one gesture where movement is the point.

   Scrolling is interpolated by Lenis (components/layout/SmoothScroll), so the
   scrub reads as continuous motion rather than wheel notches.
   ========================================================================== */

const ACT_VH = 92; // scroll distance (vh) per act

/** Where each garment's wipe starts and ends, in SVG user units. */
const WIPE: Record<string, { from: number; to: number; up?: boolean }> = {
  needls: { from: 196, to: 580 },
  longsleeve: { from: 190, to: 580 },
  tee: { from: 186, to: 480 },
  hoodie: { from: 150, to: 580 },
  jacket: { from: 178, to: 590 },
  cap: { from: 28, to: 108 },
  scarf: { from: 168, to: 340 },
  pant: { from: 888, to: 455, up: true }, // stepped into, so it wipes upward
};

export default function ScrollFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const stage = stageRef.current;
    const section = sectionRef.current;
    if (!stage || !section) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage);
      const panels = q<HTMLElement>("[data-panel]");
      const ticks = q<HTMLElement>("[data-tick]");
      const layer = (name: string) => q<SVGGElement>(`[data-layer="${name}"]`)[0];
      const clip = (name: string) => q<SVGRectElement>(`[data-clip="${name}"]`)[0];

      /** Opens a garment's clip rect fully — its dressed state. */
      const setWorn = (name: string) => {
        const spec = WIPE[name];
        const rect = clip(name);
        if (!rect || !spec) return;
        const top = spec.up ? spec.to : spec.from;
        gsap.set(rect, { attr: { y: top, height: Math.abs(spec.to - spec.from) } });
      };

      /* ---- Reduced motion: the finished look, no pin, no scrub ---- */
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        FILM_ACTS.flatMap((a) => a.add).forEach((name) => {
          const el = layer(name);
          if (el) gsap.set(el, { autoAlpha: 1 });
          setWorn(name);
        });
        gsap.set(panels, { autoAlpha: 1, position: "relative", yPercent: 0 });
        // Stand still rather than walk.
        gsap.set('[data-swing="l"], [data-swing="r"], [data-arm="l"], [data-arm="r"]', { rotate: 0 });
        return;
      }

      /* ---- Initial state: bare figure, all clips closed ---- */
      FILM_ACTS.flatMap((a) => a.add).forEach((name) => {
        const el = layer(name);
        if (el) gsap.set(el, { autoAlpha: 0 });
        const rect = clip(name);
        const spec = WIPE[name];
        if (rect && spec) gsap.set(rect, { attr: { y: spec.from, height: 0 } });
      });
      gsap.set(panels, { autoAlpha: 0, yPercent: 8 });
      gsap.set(panels[0], { autoAlpha: 1, yPercent: 0 });

      /* ---- Master timeline: act `i` owns seconds [i, i+1) ---- */
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          // Lenis already interpolates the scroll, so the scrub only needs a
          // light lag. Heavier values fight the smoothing and feel rubbery.
          scrub: 0.45,
          pin: stage,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
            const active = Math.min(FILM_ACTS.length - 1, Math.floor(p * FILM_ACTS.length));
            if (counterRef.current) counterRef.current.textContent = String(active + 1).padStart(2, "0");
            ticks.forEach((tick, i) => {
              tick.style.opacity = i <= active ? "1" : "0.2";
            });
          },
        },
      });

      FILM_ACTS.forEach((act, i) => {
        const t = i;

        /* Panel cross-fade */
        if (i > 0) {
          tl.to(panels[i - 1], { autoAlpha: 0, yPercent: -6, duration: 0.3, ease: "power2.in" }, t);
          tl.to(panels[i], { autoAlpha: 1, yPercent: 0, duration: 0.36 }, t + 0.16);
        }

        /* --- Garments being put on --- */
        act.add.forEach((name, j) => {
          const el = layer(name);
          const rect = clip(name);
          const spec = WIPE[name];
          if (!el) return;
          const at = t + 0.1 + j * 0.06;

          if (act.gesture === "toHand") {
            /* The bag is carried in: it arrives low, lands in the hand, then is
               lifted across the chest. The only travelling element in the film. */
            tl.fromTo(
              el,
              { autoAlpha: 0, x: 140, y: 190, rotate: -24, scale: 0.6, transformOrigin: "50% 50%" },
              { autoAlpha: 1, x: -78, y: 96, rotate: -12, scale: 0.76, duration: 0.34, ease: "power3.out" },
              at
            )
              .to(el, { y: 106, rotate: -9, duration: 0.09, ease: "power1.inOut" }, at + 0.34) // hits the palm
              .to(el, { x: -30, y: -22, rotate: 6, scale: 0.92, duration: 0.28, ease: "power2.inOut" }, at + 0.5)
              .to(el, { x: 0, y: 0, rotate: 0, scale: 1, duration: 0.26, ease: "power2.out" }, at + 0.78)
              .to(el, { rotate: -1, duration: 0.1, ease: "sine.inOut" }, at + 1.02)
              .to(el, { rotate: 0, duration: 0.12, ease: "sine.out" }, at + 1.12);
            return;
          }

          if (!rect || !spec) return;

          // Fade the group in fast — the wipe does the real work.
          tl.to(el, { autoAlpha: 1, duration: 0.12 }, at);

          const distance = Math.abs(spec.to - spec.from);
          if (spec.up) {
            // Bottom-up: shrink `y` while growing `height` from the same edge.
            tl.fromTo(
              rect,
              { attr: { y: spec.from, height: 0 } },
              { attr: { y: spec.to, height: distance }, duration: 0.52, ease: "power2.inOut" },
              at
            );
          } else {
            tl.fromTo(
              rect,
              { attr: { height: 0 } },
              { attr: { height: distance }, duration: 0.52, ease: "power3.inOut" },
              at
            );
          }

          /* Settle — a whisper of weight as the fabric lands. Applied to the
             group, so the garment stays registered to the body throughout. */
          tl.to(el, { scaleY: 0.994, transformOrigin: "50% 20%", duration: 0.12, ease: "sine.inOut" }, at + 0.5)
            .to(el, { scaleY: 1, duration: 0.26, ease: "elastic.out(1, 0.55)" }, at + 0.62);
        });

        /* --- Garments coming off: the wipe runs in reverse, then they lift --- */
        act.remove.forEach((name, j) => {
          const el = layer(name);
          const rect = clip(name);
          const spec = WIPE[name];
          if (!el) return;
          const at = t + 0.05 + j * 0.08;

          if (rect && spec) {
            tl.to(rect, { attr: { height: 0 }, duration: 0.44, ease: "power2.in" }, at);
          }
          tl.to(
            el,
            { autoAlpha: 0, y: -60 - j * 18, duration: 0.44, ease: "power2.in" },
            at + 0.08
          );
        });
      });

      /* ---- The catwalk ----------------------------------------------------
         The figure walks on the spot while the runway travels underneath — the
         same trick a treadmill shot uses, and the reason the model can stay
         centred through nine acts without leaving frame.

         This cycle is NOT scrubbed. Tying it to scroll would freeze the walk
         whenever the reader stops, which reads as a mannequin; a catwalk has to
         keep moving. Legs and arms counter-swing, and the body lifts twice per
         stride so the contact points land with the steps. */
      const STRIDE = 0.62; // seconds per step

      /* Rotation origins in SVG user units. GSAP ignores CSS transform-origin
         on SVG nodes and pivots about the element's own bounding box unless
         told otherwise — which swung each limb from its middle and tore it off
         the body. `svgOrigin` pins the rotation to the actual joint. */
      const JOINT = {
        legL: "192 474",
        legR: "228 474",
        armL: "158 224",
        armR: "262 224",
      };

      const walk = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
      const SWING = 8; // degrees — a runway walk, not a march

      // Legs counter-swing; arms counter-swing against the legs.
      walk
        .fromTo('[data-swing="l"]', { rotate: SWING, svgOrigin: JOINT.legL },
          { rotate: -SWING, svgOrigin: JOINT.legL, duration: STRIDE }, 0)
        .fromTo('[data-swing="r"]', { rotate: -SWING, svgOrigin: JOINT.legR },
          { rotate: SWING, svgOrigin: JOINT.legR, duration: STRIDE }, 0)
        .fromTo('[data-arm="l"]', { rotate: -5, svgOrigin: JOINT.armL },
          { rotate: 5, svgOrigin: JOINT.armL, duration: STRIDE }, 0)
        .fromTo('[data-arm="r"]', { rotate: 5, svgOrigin: JOINT.armR },
          { rotate: -5, svgOrigin: JOINT.armR, duration: STRIDE }, 0)
        .to('[data-swing="l"]', { rotate: SWING, svgOrigin: JOINT.legL, duration: STRIDE }, STRIDE)
        .to('[data-swing="r"]', { rotate: -SWING, svgOrigin: JOINT.legR, duration: STRIDE }, STRIDE)
        .to('[data-arm="l"]', { rotate: -5, svgOrigin: JOINT.armL, duration: STRIDE }, STRIDE)
        .to('[data-arm="r"]', { rotate: 5, svgOrigin: JOINT.armR, duration: STRIDE }, STRIDE);

      // Body rise and fall — one lift per step.
      gsap.to(figureRef.current, {
        y: -7,
        duration: STRIDE / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // The runway travels toward the viewer at the pace of the stride, which
      // is what turns "walking on the spot" into "walking forward".
      gsap.to(runwayRef.current, {
        backgroundPositionY: "92px",
        duration: STRIDE,
        ease: "none",
        repeat: -1,
      });

      // The contact shadow tightens as the body lifts.
      gsap.to("[data-shadow]", {
        scaleX: 0.9,
        opacity: 0.6,
        svgOrigin: "210 900",
        duration: STRIDE / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      /* Slow continuous moves across the whole film */
      const total = FILM_ACTS.length;
      tl.fromTo(
        figureRef.current,
        { scale: 1.06, yPercent: 3 },
        { scale: 0.95, yPercent: -2, ease: "none", duration: total },
        0
      );
      tl.fromTo(ghostRef.current, { xPercent: 5 }, { xPercent: -32, ease: "none", duration: total }, 0);

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="dressroom"
      aria-label="Dressroom"
      className="relative bg-ground"
      style={{ height: `${FILM_ACTS.length * ACT_VH + 100}vh` }}
    >
      <div ref={stageRef} className="relative h-screen w-full overflow-hidden">
        <div
          ref={ghostRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/2 flex -translate-y-1/2 select-none whitespace-nowrap text-[26vw] font-display font-black leading-none tracking-tight2 text-mark/[0.04]"
        >
          <span className="px-8">{CURRENT_DROP.title}</span>
          <span className="px-8">{CURRENT_DROP.title}</span>
        </div>

        {/* ---- The runway ----------------------------------------------------
            A plane laid down in perspective: rotateX tips it away from the
            viewer, and the line pattern scrolls toward the camera. Because the
            figure walks on the spot, this is what supplies the travel. The mask
            fades it out at the horizon so it never meets a hard edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] overflow-hidden"
          style={{ perspective: "440px", perspectiveOrigin: "50% 0%" }}
        >
          <div
            ref={runwayRef}
            className="absolute inset-x-[-60%] bottom-[-40%] top-0"
            style={{
              transform: "rotateX(74deg)",
              transformOrigin: "50% 0%",
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(14,19,15,0.16) 0 2px, transparent 2px 92px)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 26%, black 72%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 26%, black 72%, transparent 100%)",
            }}
          />
        </div>

        {/* Vignette, soft on a light ground */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(247,246,243,0.9)_100%)]"
        />

        <div className="shell relative flex h-full flex-col justify-between py-[calc(var(--nav-h)+1rem)] lg:py-20">
          {/* Top rail */}
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-1">(02)</p>
              <h2 className="font-display text-big font-black uppercase leading-none text-mark">
                DRESSROOM
              </h2>
            </div>
            <p className="eyebrow hidden sm:block">SCROLL TO DRESS</p>
          </div>

          {/* Stage */}
          <div className="relative grid flex-1 grid-cols-1 items-center gap-4 lg:grid-cols-12">
            {/* Left rail — one panel per act, stacked and cross-faded */}
            <div className="relative order-2 h-[132px] lg:order-1 lg:col-span-3 lg:h-[260px]">
              {FILM_ACTS.map((act) => {
                const product = act.slug ? getProduct(act.slug) : undefined;
                return (
                  <article
                    key={act.id}
                    data-panel
                    className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2"
                  >
                    <p className="eyebrow mb-2">{act.note}</p>
                    <h3 className="font-display text-big font-black uppercase leading-[0.9] text-mark">
                      {act.headline}
                    </h3>
                    <p className="mt-3 max-w-[24ch] text-sm leading-snug text-haze">{act.caption}</p>
                    {product && (
                      <p className="mt-4 flex items-center gap-4">
                        <span className="font-mono text-[11px] tracking-wide2 text-chrome">
                          <Price value={product.price} />
                        </span>
                        <Link
                          href={`/product/${product.slug}`}
                          className="link-wipe font-mono text-[11px] uppercase tracking-wide2 text-ash hover:text-mark"
                        >
                          Piece →
                        </Link>
                      </p>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Centre — the figure */}
            <div className="order-1 flex h-[48vh] items-center justify-center lg:order-2 lg:col-span-6 lg:h-full">
              <div ref={figureRef} className="h-full w-full max-w-[380px]">
                <Figure className="h-full w-full" />
              </div>
            </div>

            {/* Right rail */}
            <div className="order-3 hidden lg:col-span-3 lg:flex lg:justify-end">
              <p
                className="font-mono text-[10px] uppercase tracking-brand text-ash"
                style={{ writingMode: "vertical-rl" }}
              >
                {CURRENT_DROP.city} — {CURRENT_DROP.season}
              </p>
            </div>
          </div>

          {/* Progress rail */}
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="font-mono text-[11px] tracking-wide2 text-chrome">
              <span ref={counterRef}>01</span>
              <span className="text-ash">/{String(FILM_ACTS.length).padStart(2, "0")}</span>
            </span>
            <div className="relative h-px flex-1 bg-line">
              <span
                ref={barRef}
                className="chrome-plate absolute inset-0 origin-left scale-x-0"
                aria-hidden
              />
            </div>
            <div className="hidden gap-1.5 sm:flex" aria-hidden>
              {FILM_ACTS.map((act) => (
                <span key={act.id} data-tick className="h-1.5 w-1.5 bg-chrome opacity-20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
