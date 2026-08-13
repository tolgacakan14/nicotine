import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80dvh] flex-col items-start justify-center py-32">
      <p className="eyebrow">ERROR 404</p>
      <h1 className="mt-6 font-display text-mega font-black uppercase leading-[0.8] text-mark">
        GONE
      </h1>
      <p className="mt-8 max-w-md text-base leading-relaxed text-haze">
        This piece was part of a closed drop, or it never existed. Neither one
        gets restocked.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/drop" className="btn-ghost">
          <span>CURRENT DROP</span>
        </Link>
        <Link href="/archive" className="btn-ghost">
          <span>ARCHIVE</span>
        </Link>
      </div>
    </div>
  );
}
