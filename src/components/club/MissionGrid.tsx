"use client";

import { useState } from "react";
import { MISSIONS, type Mission } from "@/data/club";
import { useClub } from "@/lib/club";
import Reveal from "@/components/ui/Reveal";

/* ============================================================================
   LEVEL UP — the missions grid
   ----------------------------------------------------------------------------
   Every way points come in, on one board. Three kinds behave differently and
   the card has to say which without a legend:

     once   — a button, until it is taken; then it reads as spent
     repeat — a button that comes back, with a count of how often it has paid
     auto   — no button at all; the club awards these, so offering a control
              would be a lie the member discovers on their birthday

   Signed out, the board still shows everything with its price. Hiding the
   scheme behind a sign-up is the one thing guaranteed to stop someone joining.
   ========================================================================== */

const GROUP_LABEL: Record<Mission["group"], string> = {
  SOCIAL: "COMMUNITY",
  RITUAL: "EVERY DROP",
  DATE: "AUTOMATIC",
};

export default function MissionGrid({ onJoin }: { onJoin?: () => void }) {
  const { member, tier, claimMission } = useClub();
  const [flash, setFlash] = useState<string | null>(null);

  const multiplier = tier?.current.multiplier ?? 1;

  function handleClaim(mission: Mission) {
    if (claimMission(mission.id)) {
      setFlash(mission.id);
      window.setTimeout(() => setFlash((f) => (f === mission.id ? null : f)), 1800);
    }
  }

  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {MISSIONS.map((mission, i) => {
        const takes = member?.claimed.filter((c) => c.id === mission.id) ?? [];
        const takenTimes = takes.length;
        const spent = mission.kind === "once" && takenTimes > 0;

        // A mission that cannot pay again shows what it ACTUALLY paid, not
        // what today's multiplier would give — quoting a figure the member
        // will never receive is the kind of small lie that costs trust.
        const settled = takenTimes > 0 && mission.kind !== "repeat";
        const award = settled
          ? takes[0].points
          : Math.round(mission.points * multiplier);
        const boosted = !settled && award !== mission.points;

        return (
          <Reveal key={mission.id} delay={0.03 * (i % 3)}>
            <article className="flex h-full flex-col justify-between bg-ground p-6 sm:p-7">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <p className="eyebrow">{GROUP_LABEL[mission.group]}</p>
                  <p className="shrink-0 text-right">
                    <span className="font-mono text-sm tracking-wide2 text-blush">
                      +{award.toLocaleString("de-DE")}
                    </span>
                    {boosted && (
                      // Show the base rate too, so the tier bonus is legible as
                      // a bonus rather than looking like the price changed.
                      <span className="ml-2 font-mono text-[10px] tracking-wide2 text-ash line-through">
                        {mission.points.toLocaleString("de-DE")}
                      </span>
                    )}
                  </p>
                </div>

                <h3 className="mt-5 font-display text-lg font-black uppercase leading-[1.05] tracking-tight2 text-mark">
                  {mission.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-haze">{mission.note}</p>
              </div>

              <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-4">
                {mission.kind === "auto" ? (
                  <p className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
                    AWARDED AUTOMATICALLY
                  </p>
                ) : !member ? (
                  <button
                    type="button"
                    onClick={onJoin}
                    className="link-wipe font-mono text-[10px] uppercase tracking-wide2 text-mark"
                  >
                    JOIN TO COLLECT
                  </button>
                ) : spent ? (
                  <p className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
                    ✳ COLLECTED
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaim(mission)}
                    className="border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-mark transition-colors duration-300 hover:border-blush hover:text-blush"
                  >
                    {flash === mission.id ? `+${award} BANKED` : "COLLECT"}
                  </button>
                )}

                {mission.kind === "repeat" && (
                  <p className="shrink-0 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                    {takenTimes > 0 ? `${takenTimes}× TAKEN` : "EVERY DROP"}
                  </p>
                )}
                {mission.href && !member && (
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                    ↗
                  </span>
                )}
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
