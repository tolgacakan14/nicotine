"use client";

import { useRef } from "react";
import gsap from "gsap";
import { LogoRing } from "./Logo";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/* ============================================================================
   ORBIT RINGS
   ----------------------------------------------------------------------------
   The logo's ellipse, lifted off the mark and set spinning around the hero
   wordmark in real 3D.

   How the depth is achieved:
   • The parent establishes a `perspective`, and every ring sits in a
     `preserve-3d` stage, so each is a real plane in space rather than a
     2D squash. As a ring turns edge-on it genuinely thins to a line.
   • Each ring gets its own random tilt (rotateX), roll (rotateZ), speed and
     direction on every page load, so the composition is never the same twice.
   • Rings spin on independent timelines at different rates. Because they cross
     each other's planes at changing angles, the interference between them is
     what actually sells the dimensionality — a single spinning ring reads flat.
   • Opacity and stroke weight are staggered so the far rings sit back.

   The wordmark itself is pushed forward on the Z axis by the hero, so the rings
   pass visibly in front of and behind the letters.
   ========================================================================== */

interface RingSpec {
  weight: "thin" | "medium" | "bold";
  /** Scale relative to the wordmark box. */
  scale: number;
  opacity: number;
  /** Seconds per full revolution — randomised within a band per ring. */
  speed: [number, number];
  /** Tilt band (deg) for rotateX. */
  tilt: [number, number];
  /** Roll band (deg) for rotateZ. */
  roll: [number, number];
  /** Which axis carries the spin. */
  axis: "rotationY" | "rotationX";
}

const RINGS: RingSpec[] = [
  { weight: "bold", scale: 1.06, opacity: 0.95, speed: [13, 20], tilt: [-16, 16], roll: [-7, 7], axis: "rotationY" },
  { weight: "medium", scale: 1.16, opacity: 0.5, speed: [19, 30], tilt: [-30, -12], roll: [4, 14], axis: "rotationY" },
  { weight: "thin", scale: 1.28, opacity: 0.3, speed: [26, 42], tilt: [10, 28], roll: [-16, -4], axis: "rotationX" },
];

export default function OrbitRings({ className = "" }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {
      // A spinning ring is decorative motion — hold it still if that's the ask.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-ring]", { rotationX: -14, rotationZ: 6 });
        return;
      }

      const rings = gsap.utils.toArray<HTMLElement>("[data-ring]");

      rings.forEach((ring, i) => {
        const spec = RINGS[i];
        const duration = gsap.utils.random(spec.speed[0], spec.speed[1]);
        const direction = Math.random() > 0.5 ? 1 : -1;

        // Fixed attitude: the plane each ring lives on.
        gsap.set(ring, {
          rotationX: gsap.utils.random(spec.tilt[0], spec.tilt[1]),
          rotationZ: gsap.utils.random(spec.roll[0], spec.roll[1]),
          transformPerspective: 1400,
          transformOrigin: "50% 50%",
        });

        // The spin itself, starting from a random phase so the rings never
        // line up on load.
        gsap.fromTo(
          ring,
          { [spec.axis]: gsap.utils.random(0, 360) },
          {
            [spec.axis]: `+=${360 * direction}`,
            duration,
            ease: "none",
            repeat: -1,
          }
        );

        // A slow wobble on the tilt keeps it from reading as a rigid turntable.
        gsap.to(ring, {
          rotationZ: `+=${gsap.utils.random(-9, 9)}`,
          duration: gsap.utils.random(7, 13),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {RINGS.map((spec, i) => (
        <div
          key={i}
          data-ring
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {/* LogoRing sets preserveAspectRatio="none", so the ellipse stretches
              to whatever box the wordmark needs.

              The stroke is a real gradient, not a flat grey: as the ring turns,
              different parts of the ramp face the viewer, so the metal appears
              to catch and lose light. The blush stop mid-ramp is what keeps it
              from reading as plain silver while it moves. */}
          <LogoRing
            weight={spec.weight}
            gradientId={`ring-metal-${i}`}
            className="h-full w-full"
            style={{ opacity: spec.opacity, transform: `scale(${spec.scale})` }}
          />
        </div>
      ))}
    </div>
  );
}
