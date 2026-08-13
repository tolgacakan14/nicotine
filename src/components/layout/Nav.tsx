"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useClub } from "@/lib/club";
import { CURRENT_DROP } from "@/data/drops";
import Logo from "@/components/brand/Logo";
import CurrencySwitch from "./CurrencySwitch";
import DropsMenu from "./DropsMenu";

const LINKS = [
  { href: "/archive", label: "ARCHIVE" },
  { href: "/#dressroom", label: "DRESSROOM" },
  { href: "/club", label: "CLUB" },
];

/**
 * Fixed top navigation. Transparent over the hero, then it picks up a blurred
 * ink background once the page has scrolled — keeps the landing frame clean.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();
  const { member, tier } = useClub();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet whenever the route changes
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-editorial ${
        scrolled || menuOpen ? "bg-ground/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="shell flex h-[var(--nav-h)] items-center justify-between gap-6"
      >
        <Link href="/" aria-label="NICOTINE — home" className="shrink-0 text-mark">
          <Logo className="h-7 w-auto sm:h-8" weight="medium" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 md:flex">
          <DropsMenu />
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="link-wipe font-mono text-[11px] uppercase tracking-wide2 text-haze transition-colors hover:text-mark"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          {/* Member badge replaces the drop ticker once you're in the club */}
          {member && tier ? (
            <Link
              href="/club"
              className="hidden font-mono text-[11px] uppercase tracking-wide2 transition-opacity hover:opacity-70 lg:block"
              style={{ color: tier.current.accent }}
            >
              {tier.current.name} — {member.points.toLocaleString("de-DE")} PTS
            </Link>
          ) : (
            <span className="hidden font-mono text-[11px] uppercase tracking-wide2 text-ash lg:block">
              {CURRENT_DROP.code} LIVE
            </span>
          )}
          <CurrencySwitch className="hidden sm:flex" />
          <button
            type="button"
            onClick={openCart}
            className="link-wipe font-mono text-[11px] uppercase tracking-wide2 text-mark"
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            CART ({String(count).padStart(2, "0")})
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="font-mono text-[11px] uppercase tracking-wide2 text-mark md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-line transition-[max-height] duration-500 ease-editorial md:hidden ${
          menuOpen ? "max-h-72" : "max-h-0 border-transparent"
        }`}
      >
        <ul className="shell flex flex-col gap-1 py-5">
          <li>
            <Link
              href="/drop"
              className="block py-3 font-display text-2xl font-black uppercase tracking-tight2 text-mark"
            >
              DROPS
            </Link>
          </li>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block py-3 font-display text-2xl font-black uppercase tracking-tight2 text-mark"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
