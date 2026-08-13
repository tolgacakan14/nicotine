"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { resolveTier } from "@/data/club";

/* ============================================================================
   CLUB MEMBERSHIP STORE
   ----------------------------------------------------------------------------
   Prototype-grade auth: an email + name in localStorage, no password, no
   server. It exists so the membership *experience* is clickable end to end —
   join, see your tier, watch points move.

   To make this real, replace the three functions below (`join`, `addPoints`,
   `addPoints`) with calls to your commerce backend's customer + loyalty API
   (Shopify customer accounts, Medusa, Yotpo, Smile.io). The components only
   depend on the shape of `ClubApi`.
   ========================================================================== */

const STORAGE_KEY = "nicotine.club.v1";

export interface Member {
  name: string;
  email: string;
  /** ISO date the member joined. */
  joinedAt: string;
  /** Points earned. Tier is derived from this; nothing spends it. */
  points: number;
  /**
   * Total points ever EARNED. Tier is calculated from this, never from the
   * spendable balance — otherwise redeeming a reward would demote you, which
   * would punish members for using the programme.
   */
  lifetimePoints: number;
  /** Reward ids already redeemed. */
  redeemed: string[];
  /** Membership number, generated at sign-up. */
  memberNo: string;
}

interface ClubApi {
  member: Member | null;
  /** False until localStorage has been read — prevents a hydration flash. */
  ready: boolean;
  tier: ReturnType<typeof resolveTier> | null;
  join: (name: string, email: string) => void;
  leave: () => void;
  addPoints: (amount: number, reason?: string) => void;
  redeem: (rewardId: string, cost: number) => boolean;
  /** Last action feedback, for toasts in the UI. */
  lastEvent: string | null;
}

const ClubContext = createContext<ClubApi | null>(null);

/** NIC-4F2A-0261 style membership number. */
function makeMemberNo(): string {
  const block = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NIC-${block()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [ready, setReady] = useState(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as Member;
        // Migrate members saved before lifetimePoints existed.
        setMember({ ...stored, lifetimePoints: stored.lifetimePoints ?? stored.points });
      }
    } catch {
      /* corrupted storage — treat as signed out */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (member) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(member));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, [member, ready]);

  const join = useCallback((name: string, email: string) => {
    setMember({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      joinedAt: new Date().toISOString(),
      // Welcome bonus — mirrors the "JOIN THE CLUB +100" earn rule.
      points: 100,
      lifetimePoints: 100,
      redeemed: [],
      memberNo: makeMemberNo(),
    });
    setLastEvent("Welcome to the club — 100 points added.");
  }, []);

  const leave = useCallback(() => {
    setMember(null);
    setLastEvent(null);
  }, []);

  const addPoints = useCallback((amount: number, reason?: string) => {
    setMember((m) =>
      m
        ? {
            ...m,
            points: Math.max(0, m.points + amount),
            // Only earning moves the lifetime total; a negative adjustment
            // (a refund) claws back from it too.
            lifetimePoints: Math.max(0, m.lifetimePoints + amount),
          }
        : m
    );
    setLastEvent(reason ? `${reason} — ${amount > 0 ? "+" : ""}${amount} points.` : null);
  }, []);

  const redeem = useCallback((rewardId: string, cost: number) => {
    let ok = false;
    setMember((m) => {
      if (!m || m.points < cost || m.redeemed.includes(rewardId)) return m;
      ok = true;
      return { ...m, points: m.points - cost, redeemed: [...m.redeemed, rewardId] };
    });
    return ok;
  }, []);

  const value = useMemo<ClubApi>(
    () => ({
      member,
      ready,
      // Tier from lifetime earnings, not the spendable balance.
      tier: member ? resolveTier(member.lifetimePoints) : null,
      join,
      leave,
      addPoints,
      redeem,
      lastEvent,
    }),
    [member, ready, join, leave, addPoints, redeem, lastEvent]
  );

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export function useClub(): ClubApi {
  const ctx = useContext(ClubContext);
  if (!ctx) throw new Error("useClub must be used inside <ClubProvider>");
  return ctx;
}
