"use client";

import { useState } from "react";
import { REWARDS, type Reward } from "@/data/club";
import { useClub } from "@/lib/club";
import ClubScene, { type SceneMotif } from "./ClubScene";
import Reveal from "@/components/ui/Reveal";

/* ============================================================================
   REWARDS — where the points go
   ----------------------------------------------------------------------------
   The catalogue is priced in points and paid in percentages, shipping and
   access rather than fixed euros: the storefront runs in EUR and TRY, and a
   fixed "€5 OFF" needs a parallel reward table per currency, kept in sync
   forever.

   Every card shows its price whether or not the member can afford it, and an
   unaffordable one says how far off it is instead of hiding. The gap IS the
   reason to come back; concealing it just makes the page shorter.
   ========================================================================== */

const KIND_LABEL: Record<Reward["kind"], string> = {
  discount: "ON ONE ORDER",
  shipping: "ON ONE ORDER",
  access: "ACCESS",
};

export default function RewardGrid({ onJoin }: { onJoin?: () => void }) {
  const { member, redeem } = useClub();
  const [issued, setIssued] = useState<Record<string, string>>({});

  const balance = member?.points ?? 0;

  function handleRedeem(reward: Reward) {
    const code = redeem(reward.id);
    if (code) setIssued((prev) => ({ ...prev, [reward.id]: code }));
  }

  return (
    <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {REWARDS.map((reward, i) => {
        const held = member?.vouchers.find((v) => v.rewardId === reward.id);
        const oneShotTaken = Boolean(held) && !reward.repeatable;
        const code = issued[reward.id] ?? (oneShotTaken ? held?.code : undefined);
        const affordable = balance >= reward.cost;
        const short = reward.cost - balance;
        const pct = Math.min(100, (balance / reward.cost) * 100);

        return (
          <Reveal key={reward.id} delay={0.03 * (i % 3)}>
            <article className="group/card flex h-full flex-col bg-ground">
              {/* ---- Plate ---- */}
              {/* Shorter on a phone: eleven full-width 5:4 plates is a lot of
                  thumb-scrolling before the first reward comes into view. */}
              <div className="relative aspect-[16/9] overflow-hidden bg-shade sm:aspect-[5/4]">
                <div
                  className={`absolute inset-0 transition-[transform,color] duration-700 ease-editorial group-hover/card:scale-[1.05] ${
                    code
                      ? "text-blush"
                      : affordable
                        ? "text-mark group-hover/card:text-blush"
                        : "text-line"
                  }`}
                >
                  <ClubScene motif={reward.id as SceneMotif} className="h-full w-full" />
                </div>

                <div
                  aria-hidden
                  className="grain-layer pointer-events-none absolute inset-0 opacity-[0.12]"
                />

                <p className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                  {KIND_LABEL[reward.kind]}
                </p>

                {/* How close the member is, drawn on the plate itself so the
                    gap is visible before the card is even read. */}
                {member && !affordable && !code && (
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-line">
                    <div
                      className="h-[2px] bg-blush transition-[width] duration-1000 ease-editorial"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>

              {/* ---- Name + action ---- */}
              <div className="flex items-start justify-between gap-4 border-t border-line px-4 py-3">
                <div className="min-w-0">
                  <h3 className="font-display text-base font-black uppercase leading-tight tracking-tight2 text-mark">
                    {reward.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-haze">{reward.detail}</p>
                </div>

                <div className="shrink-0 pt-0.5">
                  {code ? (
                    <span className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
                      ISSUED
                    </span>
                  ) : !member ? (
                    <button
                      type="button"
                      onClick={onJoin}
                      className="link-wipe font-mono text-[10px] uppercase tracking-wide2 text-mark"
                    >
                      SIGN UP
                    </button>
                  ) : affordable ? (
                    <button
                      type="button"
                      onClick={() => handleRedeem(reward)}
                      className="font-mono text-[10px] uppercase tracking-wide2 text-mark underline-offset-4 transition-colors duration-300 hover:text-blush hover:underline"
                    >
                      REDEEM
                    </button>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
                      LOCKED
                    </span>
                  )}
                </div>
              </div>

              {/* ---- Cost band ---- */}
              <div className="mt-auto flex items-center justify-between gap-4 border-t border-line px-4 py-2.5">
                <span className="font-mono text-xs tracking-wide2 text-mark">
                  {reward.cost.toLocaleString("de-DE")} POINTS
                </span>
                {code ? (
                  <span className="shrink-0 font-mono text-[10px] tracking-wide2 text-blush">
                    {code}
                  </span>
                ) : member && !affordable ? (
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                    {short.toLocaleString("de-DE")} SHORT
                  </span>
                ) : null}
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
