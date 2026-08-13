import Link from "next/link";
import { CURRENT_DROP } from "@/data/drops";
import Logo from "@/components/brand/Logo";
import CurrencySwitch from "./CurrencySwitch";

const COLUMNS = [
  {
    title: "SHOP",
    links: [
      { href: "/drop", label: "Current drop" },
      { href: "/archive", label: "Archive" },
      { href: "/club", label: "NICOTINE Club" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "INFO",
    links: [
      { href: "/drop", label: "Sizing" },
      { href: "/drop", label: "Shipping — EU / TR" },
      { href: "/drop", label: "Returns" },
    ],
  },
  {
    title: "CONTACT",
    links: [
      { href: "/", label: "Instagram" },
      { href: "/", label: "press@nicotine.store" },
      { href: "/", label: "Stockists" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ground">
      {/* Oversized wordmark — the last thing you see */}
      <div className="overflow-hidden border-b border-line">
        <div className="shell py-10 sm:py-16">
          <Logo className="mx-auto h-auto w-full max-w-5xl text-mark opacity-[0.16]" weight="thin" />
        </div>
      </div>

      <div className="shell grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo className="h-9 w-auto text-mark" weight="medium" />
          <p className="eyebrow mt-6">{CURRENT_DROP.code} — {CURRENT_DROP.season}</p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
            <p className="eyebrow mb-5">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="link-wipe text-sm text-haze transition-colors hover:text-mark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="lg:col-span-2">
          <p className="eyebrow mb-5">DROP LIST</p>
          {/* Prototype only — point `action` at your ESP (Klaviyo, Resend, Beehiiv…) */}
          <form className="flex items-center border-b border-line pb-2" action="#">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="EMAIL"
              className="w-full bg-transparent font-mono text-[11px] uppercase tracking-wide2 text-mark placeholder:text-ash focus:outline-none"
            />
            <button
              type="submit"
              className="font-mono text-[11px] uppercase tracking-wide2 text-mark"
            >
              →
            </button>
          </form>
        </div>
      </div>

      <div className="shell flex flex-col gap-3 border-t border-line py-6 font-mono text-[10px] uppercase tracking-wide2 text-ash sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} NICOTINE — İSTANBUL</span>
        <CurrencySwitch />
        <span>PROTOTYPE BUILD</span>
      </div>
    </footer>
  );
}
