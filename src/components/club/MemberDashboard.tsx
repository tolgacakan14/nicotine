"use client";

import { REWARDS, TIERS } from "@/data/club";
import { useClub } from "@/lib/club";

/* ============================================================================
   THE MEMBER'S OWN PAGE
   ----------------------------------------------------------------------------
   Card, balance, tier progress and the vouchers they are holding. The two
   numbers are kept visually apart on purpose: the big one is spendable, the
   small one is lifetime, and confusing them is how a member ends up believing
   that redeeming cost them their tier.
   ========================================================================== */

export default function MemberDashboard() {
  const { member, tier, addPoints, leave } = useClub();
  if (!member || !tier) return null;

  const { current, next, progress, toNext } = tier;
  const topTier = TIERS[TIERS.length - 1];

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* ---------- Membership card ---------- */}
      <div className="lg:col-span-7">
        <div className="club-card h-full" style={{ borderColor: `${current.accent}55` }}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{
              background: `radial-gradient(120% 100% at 85% 0%, ${current.accent} 0%, transparent 62%)`,
            }}
          />
          <div className="relative">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow">NICOTINE CLUB — COMMITTEE</p>
                <p className="mt-3 font-display text-3xl font-black uppercase tracking-tight2 text-mark sm:text-4xl">
                  {member.name}
                </p>
              </div>
              <span
                className="shrink-0 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide2"
                style={{ borderColor: current.accent, color: current.accent }}
              >
                {current.name}
              </span>
            </div>

            <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">POINTS TO SPEND</p>
                <p className="mt-1 font-display text-5xl font-black leading-none text-mark">
                  {member.points.toLocaleString("de-DE")}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                  {member.lifetimePoints.toLocaleString("de-DE")} EARNED ALL TIME — SETS YOUR TIER
                </p>
              </div>
              <div className="text-right">
                <p className="eyebrow">MEMBER NO.</p>
                <p className="mt-1 font-mono text-sm tracking-wide2 text-haze">{member.memberNo}</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wide2 text-ash">
                <span>{current.name}</span>
                <span>{next ? next.name : "TOP TIER"}</span>
              </div>
              <div className="mt-2 h-[3px] w-full bg-line">
                <div
                  className="h-[3px] transition-[width] duration-1000 ease-editorial"
                  style={{ width: `${progress * 100}%`, background: current.accent }}
                />
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wide2 text-haze">
                {next
                  ? `${toNext.toLocaleString("de-DE")} POINTS TO ${next.name} — ${next.access}`
                  : "YOU'RE AT THE TOP. NOTHING LEFT TO CLIMB."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Perks + wallet ---------- */}
      <div className="lg:col-span-5">
        <p className="eyebrow border-b border-line pb-4">YOUR ACCESS — {current.name}</p>
        <ul className="mt-6 space-y-3">
          {current.perks.map((perk) => (
            <li key={perk} className="flex gap-3 text-sm text-haze">
              <span style={{ color: current.accent }}>✳</span>
              {perk}
            </li>
          ))}
        </ul>
        {!current.events && (
          <p className="mt-6 font-mono text-[10px] uppercase tracking-wide2 text-ash">
            REACH {topTier.name} FOR EVENT INVITATIONS
          </p>
        )}

        {/* The wallet only appears once there is something in it. */}
        {member.vouchers.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow border-b border-line pb-4">
              YOUR VOUCHERS — {member.vouchers.length}
            </p>
            <ul className="mt-5 space-y-3">
              {member.vouchers.map((voucher) => {
                const reward = REWARDS.find((r) => r.id === voucher.rewardId);
                return (
                  <li
                    key={voucher.code}
                    className="flex items-center justify-between gap-4 border-b border-line pb-3"
                  >
                    <div>
                      <p className="font-display text-sm font-black uppercase tracking-tight2 text-mark">
                        {reward?.name ?? voucher.rewardId}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                        ISSUED {new Date(voucher.issuedAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <p className="shrink-0 font-mono text-xs tracking-wide2 text-blush">
                      {voucher.code}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Prototype helper — lets the flow be walked without a commerce backend */}
        <div className="mt-10 border border-dashed border-line p-4">
          <p className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
            PROTOTYPE — SIMULATE SPEND:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addPoints(Math.round(95 * current.multiplier), "Order placed")}
              className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide2 text-haze transition-colors hover:border-blush hover:text-blush"
            >
              €95 ORDER
            </button>
            <button
              type="button"
              onClick={() => addPoints(1000, "Demo boost")}
              className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide2 text-haze transition-colors hover:border-blush hover:text-blush"
            >
              +1000
            </button>
            <button
              type="button"
              onClick={leave}
              className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide2 text-ash transition-colors hover:border-mark hover:text-mark"
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
