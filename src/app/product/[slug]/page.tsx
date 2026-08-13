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

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ---------- Gallery ---------- */}
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>

          {/* ---------- Buy column ---------- */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
              <p className="eyebrow">
                {drop.code} — {drop.title}
              </p>
              <h1 className="mt-4 font-display text-big font-black uppercase leading-none text-mark">
                {product.name}
              </h1>
              <p className="mt-4 flex items-center gap-4">
                <span className="font-mono text-sm tracking-wide2 text-mark">
                  <Price value={product.price} />
                </span>
                <span className="eyebrow">{product.colorway}</span>
              </p>

              <div className="rule my-8" />

              <AddToCart product={product} dropCode={drop.code} />

              <div className="rule my-8" />

              {/* One line of description, then the spec that actually matters */}
              <p className="text-sm leading-relaxed text-haze">{product.description[0]}</p>

              <dl className="mt-8 flex gap-6 border-t border-line pt-6">
                <dt className="eyebrow w-24 shrink-0">MATERIAL</dt>
                <dd className="text-sm text-haze">{product.materials}</dd>
              </dl>

              {/* Woven-label detail — the mark as it appears inside the garment */}
              <div className="mt-10 flex items-center gap-4 border border-line bg-shade px-5 py-4">
                <Logo className="h-7 w-auto text-mark opacity-70" weight="medium" />
                <span className="font-mono text-[10px] uppercase tracking-wide2 text-ash">
                  {drop.code} — MADE IN TÜRKİYE
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
