import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sizing", description: "NICOTINE sizing and garment measurement guide." };

export default function SizingPage() {
  return <section className="shell min-h-[70dvh] pb-28 pt-[calc(var(--nav-h)+5rem)]"><p className="eyebrow">INFO — SIZING</p><h1 className="mt-6 font-display text-mega font-black uppercase leading-[0.82] text-mark">SIZE<br />GUIDE</h1><div className="mt-16 max-w-2xl border-t border-line"><p className="py-6 text-sm leading-relaxed text-haze">Available sizes are listed on each product page. Final garment measurements will appear there after production grading.</p>{[["CHEST","Measure straight across the garment, pit to pit."],["LENGTH","Measure from the highest shoulder point to the hem."],["SHOULDER","Measure seam to seam across the back."],["SLEEVE","Measure from the shoulder seam to the cuff."]].map(([a,b])=><div key={a} className="grid gap-2 border-t border-line py-5 sm:grid-cols-3"><p className="eyebrow">{a}</p><p className="text-sm text-haze sm:col-span-2">{b}</p></div>)}</div></section>;
}
