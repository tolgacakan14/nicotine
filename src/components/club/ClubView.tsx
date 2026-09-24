"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useClub } from "@/lib/club";
import { CLUB_EVENTS, CLUB_FAQ, MISSIONS, REWARDS, TIERS } from "@/data/club";
import JoinForm from "./JoinForm";
import MemberDashboard from "./MemberDashboard";
import ClubScene, { type SceneMotif } from "./ClubScene";
import MissionGrid from "./MissionGrid";
import RewardGrid from "./RewardGrid";
import TierLadder from "./TierLadder";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/ui/Marquee";
import Wordmark from "@/components/brand/Wordmark";
import { CURRENT_DROP } from "@/data/drops";

/* ============================================================================
   /club — THE COMMITTEE
   ----------------------------------------------------------------------------
   One page, five panels, and the same page whether or not you are a member.

   The panels are tabs rather than a long scroll because the four questions a
   visitor actually has — what is it, how do I earn, what can I get, what is
   at the top — are asked in any order and each deserves a whole screen. A
   member arriving to redeem should not have to scroll past the manifesto.

   The board is fully legible signed out. Every mission and every reward shows
   its price to a stranger; the only thing sign-up changes is whether the
   buttons do anything.
   ========================================================================== */

const TABS = [
  { id: "access", label: "ACCESS" },
  { id: "earn", label: "LEVEL UP" },
  { id: "rewards", label: "REWARDS" },
  { id: "tiers", label: "TIERS" },
  { id: "faq", label: "FAQ" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Six plates for the landing panel — three ways in, three things to spend on. */
const PREVIEW: Array<{ id: string; label: string; figure: string; tab: TabId }> = [
  { id: "refer", label: "BRING SOMEONE IN", figure: "+500", tab: "earn" },
  { id: "newsletter", label: "TAKE THE LETTER", figure: "+400", tab: "earn" },
  { id: "lookbook", label: "SHOOT IT YOURSELF", figure: "+300", tab: "earn" },
  { id: "ship", label: "FREE SHIPPING", figure: "300", tab: "rewards" },
  { id: "off-20", label: "20% OFF", figure: "1.000", tab: "rewards" },
  { id: "studio", label: "STUDIO DAY", figure: "4.000", tab: "rewards" },
];

export default function ClubView() {
  const { member, ready, tier } = useClub();
  const [tab, setTab] = useState<TabId>("access");
  const panelRef = useRef<HTMLDivElement>(null);
  const publishedCount = CURRENT_DROP.products.filter((p) => Boolean(p.image)).length;

  /** Sends a "join to collect" button back to the sign-up form. */
  const goJoin = useCallback(() => {
    setTab("access");
    // Wait for the panel to swap before scrolling to it.
    window.requestAnimationFrame(() =>
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }, []);

  const totalOnOffer = MISSIONS.reduce((sum, m) => sum + m.points, 0);

  return (
    <>
      {/* ---------- Masthead ---------- */}
      <header className="relative flex min-h-[62dvh] flex-col justify-end overflow-hidden pb-12 pt-[calc(var(--nav-h)+5rem)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_20%_0%,rgba(233,196,203,0.16)_0%,transparent_62%)]"
        />
        <div className="shell relative">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="eyebrow">MEMBERSHIP — FREE TO JOIN</p>
            <p className="eyebrow">{CURRENT_DROP.code} MEMBERS GET IN FIRST</p>
          </div>
          <h1 className="mt-8 font-display text-mega font-black uppercase leading-[0.8] text-mark">
            <Wordmark className="block" />
            <span className="block text-blush">CLUB</span>
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-brand text-blush sm:text-sm">
            COMMITTEE
          </p>
          <div className="rule mt-8" />
          <p className="mt-8 font-display text-xl font-black uppercase leading-tight tracking-tight2 type-chrome lg:text-2xl">
            ACCESS IS EARNED.
          </p>
        </div>
      </header>

      <Marquee items={["EARLY ACCESS", "PRIVATE RELEASES", "EVENT INVITATIONS"]} />

      {/* ---------- Member strip: your standing, on every tab ---------- */}
      {ready && member && tier && (
        <div className="border-b border-line bg-shade">
          <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
            <p className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
              {member.name} — <span style={{ color: tier.current.accent }}>{tier.current.name}</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
              <span className="text-mark">{member.points.toLocaleString("de-DE")}</span> POINTS TO SPEND
              {tier.next && ` — ${tier.toNext.toLocaleString("de-DE")} TO ${tier.next.name}`}
            </p>
          </div>
        </div>
      )}

      {/* ---------- Tabs ---------- */}
      <nav className="sticky top-[var(--nav-h)] z-30 border-b border-line bg-ground/95 backdrop-blur">
        <div className="shell">
          <ul role="tablist" className="-mx-1 flex overflow-x-auto">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <li key={t.id} className="shrink-0">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className={`relative px-4 py-4 font-mono text-[10px] uppercase tracking-wide2 transition-colors duration-300 sm:px-6 ${
                      active ? "text-mark" : "text-ash hover:text-haze"
                    }`}
                  >
                    {t.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3 bottom-0 h-[2px] origin-left bg-blush transition-transform duration-500 ease-editorial sm:inset-x-5 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div
        ref={panelRef}
        key={tab}
        className="club-panel shell scroll-mt-[calc(var(--nav-h)+4rem)] py-16 sm:py-20"
      >
        {/* ================= ACCESS ================= */}
        {tab === "access" && (
          <section id="panel-access" role="tabpanel">
            {!ready ? (
              <p className="eyebrow">LOADING MEMBERSHIP…</p>
            ) : member ? (
              <MemberDashboard />
            ) : (
              <div className="grid gap-14 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <p className="eyebrow">(01) — JOIN</p>
                  <h2 className="mt-4 font-display text-huge font-black uppercase leading-none text-mark">
                    GET IN
                  </h2>
                  <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-haze">
                    Free, and free of the usual bargain: nothing is sold to you for joining. You
                    collect points by buying and by turning up, and you spend them on the things
                    that are hard to get rather than on money off.
                  </p>
                  <div className="mt-10">
                    <JoinForm />
                  </div>
                </div>

                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="eyebrow">(02) — THE DEAL</p>
                  <h2 className="mt-4 font-display text-huge font-black uppercase leading-none text-mark">
                    HOW IT RUNS
                  </h2>
                  <ol className="mt-10 space-y-6">
                    {[
                      {
                        n: "01",
                        t: "COLLECT",
                        d: `One point per €1 spent, plus ${MISSIONS.length} missions worth ${totalOnOffer.toLocaleString("de-DE")} points between them.`,
                      },
                      {
                        n: "02",
                        t: "SPEND",
                        d: `${REWARDS.length} rewards, from free shipping at 300 points to a day in the İstanbul studio at 4,000.`,
                      },
                      {
                        n: "03",
                        t: "CLIMB",
                        d: "Everything you ever earn sets your tier — so spending points never costs you your standing.",
                      },
                    ].map((step) => (
                      <li key={step.n} className="flex gap-6 border-b border-line pb-6">
                        <span className="shrink-0 font-mono text-[10px] tracking-wide2 text-blush">
                          {step.n}
                        </span>
                        <div>
                          <p className="font-display text-lg font-black uppercase tracking-tight2 text-mark">
                            {step.t}
                          </p>
                          <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-haze">
                            {step.d}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
            {/* ---- What's on the board ----
                A preview of the real thing, on the panel everyone lands on.
                Tabs were hiding every drawing behind a click, so arriving at
                the club meant meeting a form and a paragraph — the least
                persuasive things this page owns. */}
            <div className="mt-20 border-t border-line pt-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h3 className="font-display text-big font-black uppercase leading-none text-mark">
                  ON THE BOARD
                </h3>
                <button
                  type="button"
                  onClick={() => setTab("earn")}
                  className="link-wipe font-mono text-[10px] uppercase tracking-wide2 text-mark"
                >
                  ALL {MISSIONS.length} MISSIONS →
                </button>
              </div>

              <div className="mt-8 grid gap-px border border-line bg-line grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {PREVIEW.map((item, i) => (
                  <Reveal key={item.id} delay={0.04 * i}>
                    <button
                      type="button"
                      onClick={() => setTab(item.tab)}
                      className="group/p flex h-full w-full flex-col bg-ground text-left"
                    >
                      <span className="relative block aspect-square w-full overflow-hidden bg-shade">
                        <span className="absolute inset-0 text-mark transition-[transform,color] duration-700 ease-editorial group-hover/p:scale-[1.06] group-hover/p:text-blush">
                          <ClubScene motif={item.id as SceneMotif} className="h-full w-full" />
                        </span>
                        <span
                          aria-hidden
                          className="grain-layer pointer-events-none absolute inset-0 opacity-[0.12]"
                        />
                      </span>
                      <span className="flex flex-1 items-start justify-between gap-2 border-t border-line px-3 py-2.5">
                        <span className="font-mono text-[10px] uppercase leading-tight tracking-wide2 text-haze">
                          {item.label}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] tracking-wide2 text-blush">
                          {item.figure}
                        </span>
                      </span>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================= LEVEL UP ================= */}
        {tab === "earn" && (
          <section id="panel-earn" role="tabpanel">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">(01) — COLLECT</p>
                <h2 className="mt-4 font-display text-huge font-black uppercase leading-none text-mark">
                  LEVEL UP
                </h2>
              </div>
              <p className="max-w-[40ch] text-sm leading-relaxed text-haze">
                Every way points come in. Each one moves you up the ladder, and the ladder pays a
                multiplier that makes the next one worth more.
              </p>
            </div>
            <div className="mt-12">
              <MissionGrid onJoin={goJoin} />
            </div>
          </section>
        )}

        {/* ================= REWARDS ================= */}
        {tab === "rewards" && (
          <section id="panel-rewards" role="tabpanel">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">(02) — SPEND</p>
                <h2 className="mt-4 font-display text-huge font-black uppercase leading-none text-mark">
                  REWARDS
                </h2>
              </div>
              <p className="max-w-[40ch] text-sm leading-relaxed text-haze">
                What points are for. Redeeming never touches your tier — that is set by everything
                you have ever earned, not by what is left in the balance.
              </p>
            </div>
            <div className="mt-12">
              <RewardGrid onJoin={goJoin} />
            </div>
          </section>
        )}

        {/* ================= TIERS ================= */}
        {tab === "tiers" && (
          <section id="panel-tiers" role="tabpanel">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">(03) — THE LADDER</p>
                <h2 className="mt-4 font-display text-huge font-black uppercase leading-none text-mark">
                  {TIERS.length === 3 ? "THREE" : TIERS.length} TIERS
                </h2>
              </div>
              <p className="max-w-[40ch] text-sm leading-relaxed text-haze">
                Tiers pay in access and in a points multiplier, not in a standing discount — so the
                rewards stay the only thing the club discounts.
              </p>
            </div>
            <div className="mt-12">
              <TierLadder />
            </div>

            {/* Events — the thing at the top of the ladder */}
            <div className="mt-16 border-t border-line pt-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h3 className="font-display text-big font-black uppercase leading-none text-mark">
                  THE ROOM
                </h3>
                <p className="eyebrow">{TIERS[TIERS.length - 1].name} — AND ANYONE WHO REDEEMS IN</p>
              </div>
              <ul className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-3">
                {CLUB_EVENTS.map((event) => (
                  <li key={event.name} className="bg-ground p-6">
                    <p className="font-display text-base font-black uppercase tracking-tight2 text-mark">
                      {event.name}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-haze">{event.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ================= FAQ ================= */}
        {tab === "faq" && (
          <section id="panel-faq" role="tabpanel" className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">(04) — QUESTIONS</p>
              <h2 className="mt-4 font-display text-huge font-black uppercase leading-none text-mark">
                FAQ
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              {CLUB_FAQ.map((item, i) => (
                <Reveal key={item.q} delay={0.04 * i}>
                  <details className="group border-b border-line py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                      <span className="font-display text-base font-black uppercase tracking-tight2 text-mark sm:text-lg">
                        {item.q}
                      </span>
                      <span className="shrink-0 font-mono text-sm text-blush transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-haze">{item.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ---------- Foot ---------- */}
      <section className="border-t border-line py-20 sm:py-28">
        <div className="shell flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">{member ? "YOU'RE IN" : "STILL READING"}</p>
            <h2 className="mt-4 font-display text-huge font-black uppercase leading-none text-mark">
              {member ? "SHOP THE DROP" : "JOIN THE CLUB"}
            </h2>
          </div>
          <Link href="/drop" className="btn-ghost">
            <span>
              {CURRENT_DROP.title} — {String(publishedCount).padStart(2, "0")} PIECES
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
