/* ============================================================================
   WORDMARK
   ----------------------------------------------------------------------------
   NICOTINE set as HTML text with the mark's mirrored N's — the first and the
   seventh letter — so headline type matches the logo instead of quietly
   contradicting it.

   Why a component rather than a font trick: the mirroring is a property of the
   brand, not of a typeface, and it has to survive every font size, weight and
   colour on the site. One component means there is exactly one definition of
   which letters flip.

   Each letter is wrapped in its own mask span. That is what lets the hero
   reveal the letters from below WITHOUT the parent clipping the glyphs: a
   single `overflow-hidden` on a line box tighter than the em box shaved the
   tops off the round letters (C and O overshoot the cap line, so they went
   first). The mask carries `leading-none`, which is exactly the em box, so a
   glyph can never fall outside it.

   `aria-label` carries the real word and the letters are hidden from the
   accessibility tree, so screen readers and SEO still read "NICOTINE".
   ========================================================================== */

/** Letter positions that render mirrored. Both are N's. */
const MIRRORED = new Set([0, 6]);
const LETTERS = "NICOTINE".split("");

export default function Wordmark({
  className = "",
  as: Tag = "span",
  /** Set when the letters need to spread edge to edge, as in the hero. */
  spread = false,
  /** Render the letters in polished silver rather than flat ink. */
  metal = false,
  /** Forwarded so callers (the hero timeline) can animate the letters. */
  ref,
  style,
}: {
  className?: string;
  as?: React.ElementType;
  spread?: boolean;
  metal?: boolean;
  ref?: React.Ref<HTMLElement>;
  style?: React.CSSProperties;
}) {
  return (
    <Tag
      ref={ref}
      style={style}
      className={`${spread ? "flex justify-between" : "inline-flex"} ${className}`}
      aria-label="NICOTINE"
    >
      {LETTERS.map((char, i) => (
        <span
          key={i}
          aria-hidden
          // The mask. `leading-none` sizes it to the em box, and `overflow-hidden`
          // gives the hero a clean edge to slide each letter out from.
          className="inline-block overflow-hidden leading-none"
        >
          <span
            data-letter
            // The metal is clipped per LETTER, not across the word: the mirrored
            // N's carry `scaleX(-1)`, which gives those spans their own stacking
            // context, and a parent's `background-clip: text` does not paint
            // through one — set on the parent, the whole word went invisible.
            className={`inline-block ${metal ? "type-mercury" : ""}`}
            style={MIRRORED.has(i) ? { transform: "scaleX(-1)" } : undefined}
          >
            {char}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export { MIRRORED as MIRRORED_LETTERS };
