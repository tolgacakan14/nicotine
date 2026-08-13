"use client";

import { useClub } from "@/lib/club";
import { CLUB_EVENTS, EARN_RULES, TIERS } from "@/data/club";

/**
 * What a signed-in member sees: their card, tier progress, the reward
 * catalogue with live affordability, and a points ledger demo.
 */
export default function MemberDashboard() {
  const { member, tier, addPoints, leave } = useClub();
  if (!member || !tier) return null;

  const { current, next, progress, toNext } = tier;
  const tierIndex = TIERS.findIndex((t) => t.id === current.id);

  return (
    <div className="space-y-16">
      {/* ---------- Membership card ---------- */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div
            className="club-card"
            style={{ borderColor: `${current.accent}55` }}
          >
            {/* Tier wash */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.09]"
              style={{ background: `radial-gradient(120% 100% at 85% 0%, ${current.accent} 0%, transparent 62%)` }}
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow">NICOTINE CLUB — MEMBER</p>
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
                  <p className="eyebrow">POINTS EARNED</p>
                  <p className="mt-1 font-display text-5xl font-black leading-none text-mark">
                    {member.points.toLocaleString("de-DE")}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                    {member.lifetimePoints.toLocaleString("de-DE")} EARNED ALL TIME
                  </p>
                </div>
                <div className="text-right">
                  <p className="eyebrow">MEMBER NO.</p>
                  <p className="mt-1 font-mono text-sm tracking-wide2 text-haze">{member.memberNo}</p>
                </div>
              </div>

              {/* Tier progress */}
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
                    ? `${toNext.toLocaleString("de-DE")} POINTS TO ${next.name} — YOUR DISCOUNT GOES UP WITH IT`
                    : "YOU'RE AT THE TOP. NOTHING LEFT TO CLIMB."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active perks */}
        <div className="lg:col-span-5">
          <p className="eyebrow border-b border-line pb-4">YOUR PERKS — {current.name}</p>
          <ul className="mt-6 space-y-3">
            {current.perks.map((perk) => (
              <li key={perk} className="flex gap-3 text-sm text-haze">
                <span style={{ color: current.accent }}>✳</span>
                {perk}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-wide2 text-ash">
            DROP ACCESS — {current.access}
          </p>
          <button
            type="button"
            onClick={leave}
            className="link-wipe mt-8 font-mono text-[10px] uppercase tracking-wide2 text-ash hover:text-mark"
          >
            SIGN OUT
          </button>
        </div>
      </div>

      {/* ---------- Earn points (demo actions) ---------- */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
          <h2 className="font-display text-big font-black uppercase leading-none text-mark">
            EARN POINTS
          </h2>
          <p className="eyebrow">1 POINT PER €1 — PLUS THESE</p>
        </div>
        <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {EARN_RULES.map((rule) => (
            <li key={rule.action} className="border-t border-line pt-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-sm font-black uppercase tracking-tight2 text-mark">
                  {rule.action}
                </p>
                <span className="shrink-0 font-mono text-[11px] tracking-wide2 text-blush">
                  {rule.points}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Prototype helper — lets the flow be demonstrated without a backend */}
        <div className="mt-10 flex flex-wrap items-center gap-3 border border-dashed border-line p-5">
          <p className="mr-2 font-mono text-[10px] uppercase tracking-wide2 text-ash">
            PROTOTYPE — SIMULATE ACTIVITY:
          </p>
          <button
            type="button"
            onClick={() => addPoints(95, "Order placed")}
            className="border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-haze transition-colors hover:border-blush hover:text-blush"
          >
            PLACE A €95 ORDER (+95)
          </button>
          <button
            type="button"
            onClick={() => addPoints(100, "Birthday")}
            className="border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-haze transition-colors hover:border-blush hover:text-blush"
          >
            BIRTHDAY (+100)
          </button>
          <button
            type="button"
            onClick={() => addPoints(1000, "Demo boost")}
            className="border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-wide2 text-haze transition-colors hover:border-blush hover:text-blush"
          >
            BOOST (+1000)
          </button>
        </div>
      </section>

      {/* ---------- What the tier gives you ---------- */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
          <h2 className="font-display text-big font-black uppercase leading-none text-mark">
            YOUR DISCOUNT
          </h2>
          <p className="eyebrow">APPLIED AT CHECKOUT</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* The standing discount is the reward — there is nothing to redeem,
              which is why the points-spending flow is gone. */}
          <div className="club-card lg:col-span-5">
            <p className="eyebrow">EVERY ORDER</p>
            <p
              className="mt-3 font-display text-[5rem] font-black leading-none tracking-tight2"
              style={{ color: current.accent }}
            >
              {current.discount}%
            </p>
            <p className="mt-4 text-sm leading-relaxed text-haze">
              Off automatically, on everything, for as long as you hold {current.name}.
            </p>
            {next && (
              <p className="mt-6 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                {toNext.toLocaleString("de-DE")} POINTS TO {next.discount}% — {next.name}
              </p>
            )}
          </div>

          {/* Events: the one thing the top tier gets that isn't a discount. */}
          <div className="lg:col-span-7">
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
              <p className="eyebrow">EVENTS</p>
              <p className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
                {current.events ? "YOU'RE ON THE LIST" : `${TIERS[TIERS.length - 1].name} ONLY`}
              </p>
            </div>
            <ul className={`mt-5 space-y-4 ${current.events ? "" : "opacity-45"}`}>
              {CLUB_EVENTS.map((event) => (
                <li key={event.name} className="flex gap-4 border-b border-line pb-4">
                  <span className="mt-0.5 shrink-0" style={{ color: current.accent }}>
                    {current.events ? "✳" : "—"}
                  </span>
                  <div>
                    <p className="font-display text-sm font-black uppercase tracking-tight2 text-mark">
                      {event.name}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-haze">{event.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            {!current.events && (
              <p className="mt-5 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                REACH {TIERS[TIERS.length - 1].name} TO BE INVITED
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
