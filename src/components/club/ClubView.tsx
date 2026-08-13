"use client";

import Link from "next/link";
import { useClub } from "@/lib/club";
import { CLUB_FAQ, EARN_RULES, TIERS } from "@/data/club";
import JoinForm from "./JoinForm";
import MemberDashboard from "./MemberDashboard";
import TierLadder from "./TierLadder";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/ui/Marquee";
import Wordmark from "@/components/brand/Wordmark";
import { CURRENT_DROP } from "@/data/drops";

/**
 * /club — one page that serves both states:
 *  - signed out → manifesto, how it works, tiers, join form, FAQ
 *  - signed in  → membership card + points + rewards, then the same tiers/FAQ
 */
export default function ClubView() {
  const { member, ready } = useClub();

  return (
    <>
      {/* ---------- Masthead ---------- */}
      <header className="relative flex min-h-[70dvh] flex-col justify-end overflow-hidden pb-14 pt-[calc(var(--nav-h)+5rem)]">
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
          {/* The club's formal name, set as a plate under the mark */}
          <p className="mt-4 font-mono text-[11px] uppercase tracking-brand text-blush sm:text-sm">
            COMMITTEE
          </p>
          <div className="rule mt-8" />
          <p className="mt-8 font-display text-xl font-black uppercase leading-tight tracking-tight2 type-chrome lg:text-2xl">
            SHOP MORE, PAY LESS, GET IN FIRST
          </p>
        </div>
      </header>

      <Marquee
        items={["10 / 15 / 20% OFF", "MEMBERS GET IN FIRST", "FREE TO JOIN"]}
      />

      {/* ---------- Signed-in dashboard OR join flow ---------- */}
      <section className="shell py-20 sm:py-28">
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

              <div className="mt-10">
                <JoinForm />
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="eyebrow">(02) — HOW POINTS WORK</p>
              <h2 className="mt-4 font-display text-huge font-black uppercase leading-none text-mark">
                EARN
              </h2>
              <ul className="mt-10">
                {EARN_RULES.map((rule) => (
                  <li
                    key={rule.action}
                    className="flex items-baseline justify-between gap-6 border-b border-line py-4"
                  >
                    <p className="font-display text-sm font-black uppercase tracking-tight2 text-mark">
                      {rule.action}
                    </p>
                    <span className="shrink-0 font-mono text-sm tracking-wide2 text-blush">
                      {rule.points}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* ---------- Tiers ---------- */}
      <section className="border-t border-line py-20 sm:py-28">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">(03) — THE LADDER</p>
              <h2 className="mt-4 font-display text-huge font-black uppercase leading-none text-mark">
                {TIERS.length === 3 ? "THREE" : TIERS.length} TIERS
              </h2>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-wide2 text-ash">
              THE DISCOUNT IS THE TIER — NO CODES
            </p>
          </div>
          <div className="mt-14">
            <TierLadder />
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-line py-20 sm:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12">
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
        </div>
      </section>

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
            <span>{CURRENT_DROP.title} — {String(CURRENT_DROP.products.length).padStart(2, "0")} PIECES</span>
          </Link>
        </div>
      </section>
    </>
  );
}
