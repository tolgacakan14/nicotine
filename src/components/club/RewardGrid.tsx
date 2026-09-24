"use client";

import { useState } from "react";
import { REWARDS, type Reward } from "@/data/club";
import { useClub } from "@/lib/club";
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
        const affordable = balance >= reward.cost;
        const short = reward.cost - balance;

        return (
          <Reveal key={reward.id} delay={0.03 * (i % 3)}>
            <article className="flex h-full flex-col justify-between bg-ground p-6 sm:p-7">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <p className="eyebrow">{KIND_LABEL[reward.kind]}</p>
                  <p className="shrink-0 font-mono text-sm tracking-wide2 text-mark">
                    {reward.cost.toLocaleString("de-DE")} PTS
                  </p>
                </div>

                <h3 className="mt-5 font-display text-2xl font-black uppercase leading-[1.02] tracking-tight2 text-mark">
                  {reward.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-haze">{reward.detail}</p>
              </div>

              <div className="mt-7 border-t border-line pt-4">
                {/* A code the member is holding outranks everything else on the
                    card — it is the only state they need to act on. */}
                {issued[reward.id] || (held && oneShotTaken) ? (
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
                      YOUR CODE
                    </p>
                    <p className="font-mono text-xs tracking-wide2 text-blush">
                      {issued[reward.id] ?? held?.code}
                    </p>
                  </div>
                ) : !member ? (
                  <button
                    type="button"
                    onClick={onJoin}
                    className="link-wipe font-mono text-[10px] uppercase tracking-wide2 text-mark"
                  >
                    JOIN TO REDEEM
                  </button>
                ) : affordable ? (
                  <button
                    type="button"
                    onClick={() => handleRedeem(reward)}
                    className="w-full border border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide2 text-mark transition-colors duration-300 hover:border-blush hover:bg-blush hover:text-ground"
                  >
                    REDEEM
                  </button>
                ) : (
                  <div>
                    <div className="h-[2px] w-full bg-line">
                      <div
                        className="h-[2px] bg-blush transition-[width] duration-1000 ease-editorial"
                        style={{ width: `${Math.min(100, (balance / reward.cost) * 100)}%` }}
                      />
                    </div>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                      {short.toLocaleString("de-DE")} POINTS SHORT
                    </p>
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
