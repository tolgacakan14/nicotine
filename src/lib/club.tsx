"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MISSIONS, REWARDS, resolveTier } from "@/data/club";

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

const STORAGE_KEY = "nicotine.club.v2";

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
  /** Mission ids already claimed, with when. Repeatables can recur. */
  claimed: ClaimedMission[];
  /** Vouchers the member is holding, newest first. */
  vouchers: Voucher[];
  /** Membership number, generated at sign-up. */
  memberNo: string;
}

export interface ClaimedMission {
  id: string;
  at: string;
  points: number;
}

export interface Voucher {
  /** The reward this came from. */
  rewardId: string;
  /** What the member types at checkout. */
  code: string;
  issuedAt: string;
  cost: number;
}

interface ClubApi {
  member: Member | null;
  /** False until localStorage has been read — prevents a hydration flash. */
  ready: boolean;
  tier: ReturnType<typeof resolveTier> | null;
  join: (name: string, email: string) => void;
  leave: () => void;
  addPoints: (amount: number, reason?: string) => void;
  /** Claims a mission's points. Returns false if it was already spent. */
  claimMission: (missionId: string) => boolean;
  /** Turns points into a voucher. Returns the code, or null if unaffordable. */
  redeem: (rewardId: string) => string | null;
  /** Last action feedback, for toasts in the UI. */
  lastEvent: string | null;
}

const ClubContext = createContext<ClubApi | null>(null);

/** NIC-9F2A-4417 style voucher code, printed on the member's reward. */
function makeVoucherCode(rewardId: string): string {
  const block = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${rewardId.toUpperCase().replace(/[^A-Z0-9]/g, "")}-${block()}`;
}

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
        setMember({
          ...stored,
          lifetimePoints: stored.lifetimePoints ?? stored.points,
          claimed: stored.claimed ?? [],
          vouchers: stored.vouchers ?? [],
        });
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
      // Joining IS the first mission, so it is banked as one.
      claimed: [{ id: "join", at: new Date().toISOString(), points: 100 }],
      vouchers: [],
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

  const claimMission = useCallback((missionId: string) => {
    const mission = MISSIONS.find((m) => m.id === missionId);
    if (!mission) return false;

    let ok = false;
    setMember((m) => {
      if (!m) return m;
      // A `once` mission is spent for good; `repeat` and `auto` can recur.
      if (mission.kind === "once" && m.claimed.some((c) => c.id === missionId)) return m;
      ok = true;

      // The tier multiplier is read from lifetime earnings BEFORE this claim,
      // so a mission cannot pay itself at a tier it is about to unlock.
      const { current } = resolveTier(m.lifetimePoints);
      const award = Math.round(mission.points * current.multiplier);

      return {
        ...m,
        points: m.points + award,
        lifetimePoints: m.lifetimePoints + award,
        claimed: [{ id: missionId, at: new Date().toISOString(), points: award }, ...m.claimed],
      };
    });
    return ok;
  }, []);

  const redeem = useCallback((rewardId: string) => {
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!reward) return null;

    let code: string | null = null;
    setMember((m) => {
      if (!m || m.points < reward.cost) return m;
      // A one-shot reward cannot be held twice.
      if (!reward.repeatable && m.vouchers.some((v) => v.rewardId === rewardId)) return m;

      code = makeVoucherCode(rewardId);
      return {
        ...m,
        // Only the spendable balance moves. Lifetime stays put, so redeeming
        // never costs a member their tier.
        points: m.points - reward.cost,
        vouchers: [
          { rewardId, code, issuedAt: new Date().toISOString(), cost: reward.cost },
          ...m.vouchers,
        ],
      };
    });
    return code;
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
      claimMission,
      redeem,
      lastEvent,
    }),
    [member, ready, join, leave, addPoints, claimMission, redeem, lastEvent]
  );

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export function useClub(): ClubApi {
  const ctx = useContext(ClubContext);
  if (!ctx) throw new Error("useClub must be used inside <ClubProvider>");
  return ctx;
}
