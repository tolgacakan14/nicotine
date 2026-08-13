/* ============================================================================
   NICOTINE LOGO
   ----------------------------------------------------------------------------
   Rebuilt from the brand sheet (public/brand/logo-reference.png) as vector
   rather than shipping the PNG: it stays crisp at hangtag size, inherits
   `currentColor` so it works on ink or paper, and — the reason it matters here
   — the ring can be split out and animated on its own (see RingOnly / Hero).

   The wordmark is И I C O T I И E: the first and seventh letters are mirrored,
   which is the mark's whole signature. Each glyph is positioned individually so
   the tracking matches the sheet exactly and the mirrored pair can be flipped
   without disturbing the others.
   ========================================================================== */

const LETTERS = ["N", "I", "C", "O", "T", "I", "N", "E"] as const;
/** Indices of the two mirrored N's. */
const MIRRORED = new Set([0, 6]);

const VIEW_W = 600;
const VIEW_H = 200;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const FIRST_X = 78;
const STEP = 63;
const BASELINE = 122;

/** Stroke weights lifted from the sheet's variants (02 / 03 / 04 / 08). */
const WEIGHTS = {
  thin: { ring: 2.5, text: 400 },
  medium: { ring: 5, text: 500 },
  bold: { ring: 9, text: 700 },
  thick: { ring: 13, text: 700 },
} as const;

export type LogoWeight = keyof typeof WEIGHTS;

/** The elliptical ring on its own — exported so the hero can spin it in 3D. */
export function LogoRing({
  className = "",
  weight = "medium",
  double = false,
  style,
  /** Supply an id to stroke the ring in polished silver instead of currentColor. */
  gradientId,
}: {
  className?: string;
  weight?: LogoWeight;
  /** Variant 09 on the sheet: a second, inset hairline. */
  double?: boolean;
  style?: React.CSSProperties;
  gradientId?: string;
}) {
  const w = WEIGHTS[weight];
  const stroke = gradientId ? `url(#${gradientId})` : "currentColor";
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={className}
      style={style}
      fill="none"
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      {gradientId && (
        <defs>
          {/* The house silver, with the blush stop that stops it going flat. */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="12%" stopColor="#D7DADE" />
            <stop offset="28%" stopColor="#8E949C" />
            <stop offset="42%" stopColor="#F3F4F6" />
            <stop offset="52%" stopColor="#D8A9B4" />
            <stop offset="64%" stopColor="#6F757D" />
            <stop offset="78%" stopColor="#E9EBED" />
            <stop offset="92%" stopColor="#9AA0A8" />
            <stop offset="100%" stopColor="#CFD3D8" />
          </linearGradient>
        </defs>
      )}
      <ellipse
        cx={CX}
        cy={CY}
        rx={CX - w.ring}
        ry={CY - w.ring}
        stroke={stroke}
        strokeWidth={w.ring}
        vectorEffect="non-scaling-stroke"
      />
      {double && (
        <ellipse
          cx={CX}
          cy={CY}
          rx={CX - w.ring * 4}
          ry={CY - w.ring * 4}
          stroke={stroke}
          strokeWidth={w.ring * 0.5}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

export default function Logo({
  className = "",
  weight = "medium",
  double = false,
  /** Extra horizontal tracking, as on variants 06 / 07. */
  tracking = 0,
  title = "NICOTINE",
}: {
  className?: string;
  weight?: LogoWeight;
  double?: boolean;
  tracking?: number;
  title?: string;
}) {
  const w = WEIGHTS[weight];
  const step = STEP + tracking;
  // Re-centre the row whenever tracking changes so the word stays in the ring.
  const rowWidth = step * (LETTERS.length - 1);
  const startX = CX - rowWidth / 2;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={className}
      fill="none"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <ellipse
        cx={CX}
        cy={CY}
        rx={CX - w.ring}
        ry={CY - w.ring}
        stroke="currentColor"
        strokeWidth={w.ring}
      />
      {double && (
        <ellipse
          cx={CX}
          cy={CY}
          rx={CX - w.ring * 4}
          ry={CY - w.ring * 4}
          stroke="currentColor"
          strokeWidth={w.ring * 0.5}
        />
      )}

      <g
        fill="currentColor"
        fontFamily="var(--font-body), Helvetica Neue, Arial, sans-serif"
        fontSize="62"
        fontWeight={w.text}
      >
        {LETTERS.map((ch, i) => {
          const x = startX + i * step;
          // Mirrored glyphs are flipped about their own centre via a local
          // translate → scale(-1,1); everything else is drawn normally.
          return MIRRORED.has(i) ? (
            <text
              key={i}
              x={0}
              y={0}
              transform={`translate(${x} ${BASELINE}) scale(-1 1)`}
              textAnchor="middle"
            >
              {ch}
            </text>
          ) : (
            <text key={i} x={x} y={BASELINE} textAnchor="middle">
              {ch}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

export { FIRST_X, STEP, VIEW_W, VIEW_H };
