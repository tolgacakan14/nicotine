"use client";

import { useState } from "react";
import { useClub } from "@/lib/club";

/**
 * Sign-up card. Prototype only — no password, no server call. Real
 * implementation should post to your customer-accounts endpoint.
 */
export default function JoinForm({ compact = false }: { compact?: boolean }) {
  const { join } = useClub();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Name required.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Valid email required.");
    if (!agreed) return setError("You have to accept the terms.");
    setError(null);
    join(name, email);
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "" : "max-w-md"} noValidate>
      <div className="space-y-4">
        <div>
          <label htmlFor="club-name" className="eyebrow mb-2 block">
            NAME
          </label>
          <input
            id="club-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="AS IT SHOULD APPEAR ON THE CARE LABEL"
            className="w-full border-b border-line bg-transparent pb-3 font-mono text-[11px] uppercase tracking-wide2 text-mark placeholder:text-line focus:border-blush focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="club-email" className="eyebrow mb-2 block">
            EMAIL
          </label>
          <input
            id="club-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOU@EXAMPLE.COM"
            className="w-full border-b border-line bg-transparent pb-3 font-mono text-[11px] uppercase tracking-wide2 text-mark placeholder:text-line focus:border-blush focus:outline-none"
          />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-line transition-colors checked:border-blush checked:bg-blush focus-visible:outline-1 focus-visible:outline-mark"
        />
        <span className="font-mono text-[10px] uppercase leading-relaxed tracking-wide2 text-ash">
          I want drop notices and club mail. I&apos;ve read the terms.
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-4 font-mono text-[10px] uppercase tracking-wide2 text-blush">
          {error}
        </p>
      )}

      <button type="submit" className="btn-club mt-8 w-full">
        BECOME A MEMBER — FREE
      </button>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wide2 text-ash">
        100 POINTS ADDED ON SIGN-UP
      </p>
    </form>
  );
}
