"use client";

import { useState } from "react";
import { MISSIONS, type Mission } from "@/data/club";
import { useClub } from "@/lib/club";
import ClubPlate, { type PlateMotif } from "./ClubPlate";
import Reveal from "@/components/ui/Reveal";

/* ============================================================================
   LEVEL UP — the missions board
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
        const award = settled ? takes[0].points : Math.round(mission.points * multiplier);
        const boosted = !settled && award !== mission.points;
        const just = flash === mission.id;

        return (
          <Reveal key={mission.id} delay={0.03 * (i % 3)}>
            <article className="group/card flex h-full flex-col bg-ground">
              {/* ---- Plate ---- */}
              {/* Shorter on a phone: eleven full-width 5:4 plates is a lot of
                  thumb-scrolling before the first reward comes into view. */}
              <div className="relative aspect-[16/9] overflow-hidden bg-shade sm:aspect-[5/4]">
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-[transform,color] duration-700 ease-editorial group-hover/card:scale-[1.07] ${
                    spent ? "text-line" : just ? "text-blush" : "text-mark group-hover/card:text-blush"
                  }`}
                >
                  <ClubPlate motif={mission.id as PlateMotif} className="h-[46%] w-auto" />
                </div>

                <p className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                  {GROUP_LABEL[mission.group]}
                </p>

                {spent && (
                  <p className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                    ✳ COLLECTED
                  </p>
                )}
              </div>

              {/* ---- Name + action ---- */}
              <div className="flex items-start justify-between gap-4 border-t border-line px-4 py-3">
                <div className="min-w-0">
                  <h3 className="font-display text-sm font-black uppercase leading-tight tracking-tight2 text-mark">
                    {mission.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-haze">{mission.note}</p>
                </div>

                <div className="shrink-0 pt-0.5">
                  {mission.kind === "auto" ? (
                    <span className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
                      AUTOMATIC
                    </span>
                  ) : !member ? (
                    <button
                      type="button"
                      onClick={onJoin}
                      className="link-wipe font-mono text-[10px] uppercase tracking-wide2 text-mark"
                    >
                      SIGN UP
                    </button>
                  ) : spent ? (
                    <span className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
                      DONE
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleClaim(mission)}
                      className="font-mono text-[10px] uppercase tracking-wide2 text-mark underline-offset-4 transition-colors duration-300 hover:text-blush hover:underline"
                    >
                      {just ? "BANKED" : "COLLECT"}
                    </button>
                  )}
                </div>
              </div>

              {/* ---- Points band ---- */}
              <div className="mt-auto flex items-center justify-between gap-4 border-t border-line px-4 py-2.5">
                <p>
                  <span
                    className={`font-mono text-xs tracking-wide2 transition-colors duration-500 ${
                      just ? "text-blush" : "text-mark"
                    }`}
                  >
                    +{award.toLocaleString("de-DE")} POINTS
                  </span>
                  {boosted && (
                    // Show the base rate too, so the tier bonus reads as a
                    // bonus rather than looking like the price moved.
                    <span className="ml-2 font-mono text-[10px] tracking-wide2 text-ash line-through">
                      {mission.points.toLocaleString("de-DE")}
                    </span>
                  )}
                </p>
                {mission.kind === "repeat" && (
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                    {takenTimes > 0 ? `${takenTimes}× TAKEN` : "REPEATABLE"}
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
