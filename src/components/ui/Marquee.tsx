/**
 * Infinite ticker strip. The content is rendered twice and the track is
 * translated -50%, so the loop is seamless.
 */
export default function Marquee({
  items,
  className = "",
  invert = false,
}: {
  items: string[];
  className?: string;
  invert?: boolean;
}) {
  const strip = [...items, ...items];

  return (
    <div
      className={`group relative flex overflow-hidden border-y py-3 ${
        invert ? "border-ground bg-mark text-ground" : "border-line bg-ground text-mark"
      } ${className}`}
      aria-hidden
    >
      <div className="flex min-w-max animate-marquee group-hover:[animation-play-state:paused]">
        {strip.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 px-8 font-mono text-[11px] uppercase tracking-wide2"
          >
            {item}
            <span className={invert ? "text-ground/40" : "text-ash"}>✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
