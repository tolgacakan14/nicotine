import Link from "next/link";

export default function Manifesto() {
  return (
    <section className="border-t border-line py-28 sm:py-40">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <p className="eyebrow lg:col-span-2">(03) — ISTANBUL</p>
        <div className="lg:col-span-8 lg:col-start-4">
          <h2 className="font-display text-huge font-black uppercase leading-[0.9] text-mark">
            NICOTINE IS MADE<br />IN ISTANBUL.
          </h2>
          <p className="mt-10 max-w-md font-mono text-[11px] uppercase leading-6 tracking-wide2 text-haze">
            Two-month drops.<br />No permanent collection.<br />When it&apos;s gone, it&apos;s archived.
          </p>
          <Link href="/club" className="link-wipe mt-10 inline-block font-mono text-[11px] uppercase tracking-wide2 text-mark">
            ABOUT NICOTINE →
          </Link>
        </div>
      </div>
    </section>
  );
}
