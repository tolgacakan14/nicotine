import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import ProductCard from "@/components/product/ProductCard";
import AddToCart from "@/components/product/AddToCart";
import Reveal from "@/components/ui/Reveal";
import Price from "@/components/ui/Price";
import Logo from "@/components/brand/Logo";
import {
  ALL_PRODUCTS,
  getDropForProduct,
  getProduct,
  getRelatedProducts,
} from "@/data/drops";

type Params = { params: Promise<{ slug: string }> };

/** Pre-render every product across every drop at build time. */
export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  const drop = getDropForProduct(slug);
  if (!product || !drop) notFound();

  const related = getRelatedProducts(slug, 4);

  return (
    <>
      <div className="shell pt-[calc(var(--nav-h)+2.5rem)]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="eyebrow flex items-center gap-2">
          <Link href="/" className="hover:text-mark">
            HOME
          </Link>
          <span>/</span>
          <Link href="/drop" className="hover:text-mark">
            {drop.code}
          </Link>
          <span>/</span>
          <span className="text-mark">{product.name}</span>
        </nav>

        {/* Three rails: what it is on the left, the shots down the middle, how
            to buy it on the right. Both outer rails stick while the images
            scroll — the piece stays the thing that moves, and the price and
            size never leave the screen on a long product. */}
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* ---------- What it is ---------- */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
              <h1 className="font-display text-big font-black uppercase leading-[0.95] text-mark">
                {product.name}
              </h1>

              <ul className="mt-6 space-y-1.5">
                {product.specs?.map((spec) => (
                  <li
                    key={spec}
                    className="flex gap-2 font-mono text-[11px] uppercase tracking-wide2 text-haze"
                  >
                    <span className="text-ash">•</span>
                    {spec}
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-4">
                {product.description.map((paragraph, i) => (
                  <p key={i} className="max-w-[34ch] text-sm leading-relaxed text-haze">
                    {paragraph}
                  </p>
                ))}
              </div>

              <p className="mt-8 font-mono text-[10px] uppercase tracking-wide2 text-ash">
                {drop.code} — {drop.title}
              </p>
            </div>
          </div>

          {/* ---------- The shots ---------- */}
          <div className="lg:col-span-6">
            <ProductGallery product={product} />
          </div>

          {/* ---------- How to buy it ---------- */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
              <p className="font-mono text-lg tracking-wide2 text-mark">
                <Price value={product.price} />
              </p>
              <p className="eyebrow mt-1">{product.colorway}</p>

              <div className="mt-8">
                <AddToCart product={product} dropCode={drop.code} />
              </div>

              <dl className="mt-10 space-y-3 border-t border-line pt-5">
                <div className="flex gap-4">
                  <dt className="eyebrow w-20 shrink-0">MATERIAL</dt>
                  <dd className="text-xs leading-relaxed text-haze">{product.materials}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="eyebrow w-20 shrink-0">SHIPPING</dt>
                  <dd className="text-xs leading-relaxed text-haze">
                    2–4 working days from İstanbul. 14-day returns.
                  </dd>
                </div>
              </dl>

              {/* Woven-label detail — the mark as it appears inside the garment */}
              <div className="mt-8 flex items-center gap-3 border border-line px-4 py-3">
                <Logo className="h-6 w-auto text-mark opacity-70" weight="medium" />
                <span className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
                  MADE IN TÜRKİYE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="mt-28 border-t border-line py-20 sm:py-24">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-huge font-black uppercase leading-none text-mark">
                MORE FROM {drop.title}
              </h2>
              <Link
                href="/drop"
                className="link-wipe font-mono text-[11px] uppercase tracking-wide2 text-haze hover:text-mark"
              >
                FULL DROP →
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
              {related.map((item, i) => (
                <Reveal key={item.slug} delay={0.05 * i}>
                  <ProductCard product={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
