"use client";

import { TIERS } from "@/data/club";
import { useClub } from "@/lib/club";
import Reveal from "@/components/ui/Reveal";

/**
 * The four tiers as a ladder. A member's current tier is marked; visitors see
 * the same grid with nothing highlighted.
 */
export default function TierLadder() {
  const { tier } = useClub();
  const currentId = tier?.current.id;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {TIERS.map((t, i) => {
        const active = t.id === currentId;
        return (
          <Reveal key={t.id} delay={0.06 * i}>
            <article
              className={`club-card h-full transition-colors duration-500 ${
                active ? "bg-shade" : "bg-transparent"
              }`}
              style={active ? { borderColor: t.accent } : undefined}
            >
              {active && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{ background: `radial-gradient(110% 90% at 80% 0%, ${t.accent} 0%, transparent 60%)` }}
                />
              )}
              <div className="relative flex h-full flex-col">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10px] tracking-wide2 text-line">
                    0{i + 1}
                  </span>
                  {active && (
                    <span
                      className="font-mono text-[10px] uppercase tracking-wide2"
                      style={{ color: t.accent }}
                    >
                      YOU ARE HERE
                    </span>
                  )}
                </div>

                <h3
                  className="mt-4 font-display text-3xl font-black uppercase leading-none tracking-tight2"
                  style={{ color: t.accent }}
                >
                  {t.name}
                </h3>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                  {t.threshold === 0
                    ? "FREE TO JOIN"
                    : `FROM ${t.threshold.toLocaleString("de-DE")} POINTS`}
                </p>
                {/* The discount is the headline benefit, so it leads. */}
                <p
                  className="mt-5 font-display text-5xl font-black leading-none tracking-tight2"
                  style={{ color: t.accent }}
                >
                  {t.discount}%
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                  OFF EVERY ORDER — {t.access}
                </p>

                {t.events && (
                  <p
                    className="mt-4 border border-current px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-wide2"
                    style={{ color: t.accent }}
                  >
                    + EVENT ACCESS
                  </p>
                )}

                <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
                  {t.perks.map((perk) => (
                    <li key={perk} className="flex gap-2.5 text-xs leading-relaxed text-haze">
                      <span style={{ color: t.accent }}>—</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
