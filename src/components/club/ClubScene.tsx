"use client";

import { useEffect, useId, useRef, useState } from "react";

/* ============================================================================
   CLUB SCENES
   ----------------------------------------------------------------------------
   One staged picture per mission and per reward.

   The reference for this page photographs a cast of teddy bears in rooms. That
   warmth is theirs; NICOTINE's equivalent is a studio with the lights on and
   nobody in it, so all seventeen are lit and staged identically and only the
   subject changes:

     a cyclorama with light falling from the upper left,
     context drawn thin and held back,
     the subject drawn heavy and forward,
     one detail in blush — never more than one,
     a contact shadow so nothing floats.

   Keeping that grammar fixed is what makes seventeen drawings read as one shoot
   rather than seventeen icons. Depth comes from stroke weight, not from colour:
   the far things are 1px at a third opacity, the near things are 2px at full,
   which is how a technical flat shows distance without shading.
   ========================================================================== */

export type SceneMotif =
  | "join" | "newsletter" | "refer" | "instagram" | "tiktok" | "youtube"
  | "first-24" | "review" | "lookbook" | "birthday" | "anniversary"
  | "ship" | "off-10" | "off-20" | "hold" | "archive" | "studio";

const FLOOR = 132;
const BLUSH = "rgb(var(--c-blush))";

/** Far detail: thin, held back, never competing with the subject. */
function Ctx({ children, o = 0.32 }: { children: React.ReactNode; o?: number }) {
  return (
    <g strokeWidth="1" opacity={o}>
      {children}
    </g>
  );
}

/** The one warm detail in the frame. */
function Hot({ children }: { children: React.ReactNode }) {
  return <g stroke={BLUSH}>{children}</g>;
}

/**
 * The wordmark as the brand actually sets it: И I C O T I И E, with the first
 * and seventh letters mirrored. Drawn per glyph rather than as a string,
 * because that mirroring is the mark's signature and a plain "NICOTINE"
 * contradicts every garment the label has ever made.
 */
function Oval({
  x,
  y,
  w = 34,
  label = true,
  stroke,
}: {
  x: number;
  y: number;
  w?: number;
  label?: boolean;
  stroke?: string;
}) {
  const h = w * 0.38;
  const letters = "NICOTINE".split("");
  const size = w * 0.15;
  const step = w * 0.098;
  const start = x - (step * (letters.length - 1)) / 2;

  return (
    <g stroke={stroke}>
      <ellipse cx={x} cy={y} rx={w / 2} ry={h / 2} fill="none" strokeWidth="1.1" />
      {label && (
        <g
          fill={stroke ?? "currentColor"}
          stroke="none"
          fontFamily="var(--font-mono), monospace"
          fontSize={size}
          fontWeight="600"
        >
          {letters.map((ch, i) =>
            i === 0 || i === 6 ? (
              <text
                key={i}
                transform={`translate(${start + i * step} ${y + size * 0.36}) scale(-1 1)`}
                textAnchor="middle"
              >
                {ch}
              </text>
            ) : (
              <text key={i} x={start + i * step} y={y + size * 0.36} textAnchor="middle">
                {ch}
              </text>
            )
          )}
        </g>
      )}
    </g>
  );
}

/** A garment on a hanger — the studio's default furniture. */
function Hanging({ x, top, w = 30, h = 46 }: { x: number; top: number; w?: number; h?: number }) {
  const half = w / 2;
  return (
    <g>
      <path d={`M${x} ${top - 7} C${x} ${top - 12} ${x + 5} ${top - 12} ${x + 5} ${top - 8}`} />
      <path d={`M${x} ${top - 6} L${x - half} ${top + 7} L${x - half + 3} ${top + h} L${x + half - 3} ${top + h} L${x + half} ${top + 7} Z`} />
      <path d={`M${x - half + 3} ${top + h - 7} H${x + half - 3}`} opacity="0.45" />
    </g>
  );
}

function Subject({ motif }: { motif: SceneMotif }) {
  switch (motif) {
    // ---- The way in --------------------------------------------------------
    case "join":
      return (
        <g>
          <Ctx>
            <path d={`M34 44 H60 V${FLOOR} H34 Z`} />
            <path d={`M140 52 H176 V${FLOOR} H140 Z`} />
          </Ctx>
          {/* A door left open, and the light coming through it */}
          <path d={`M64 36 H106 V${FLOOR} H64 Z`} />
          <path d={`M106 42 L130 28 V${FLOOR} L106 ${FLOOR}`} />
          <Ctx o={0.5}>
            <path d={`M106 42 L150 ${FLOOR} M130 28 L176 ${FLOOR}`} />
          </Ctx>
          <circle cx="101" cy="90" r="1.8" />
          <Hot>
            <g transform="translate(46 92) rotate(-16)">
              <circle cx="0" cy="0" r="8" />
              <path d="M8 0 H36" />
              <path d="M27 0 V7" />
              <path d="M34 0 V8" />
            </g>
          </Hot>
        </g>
      );

    // ---- Community ---------------------------------------------------------
    case "newsletter":
      return (
        <g>
          <Ctx>
            <path d={`M28 96 H172`} />
            <path d="M44 96 V78 H80 V96" />
          </Ctx>
          {/* An envelope propped on the counter, stamped */}
          <path d={`M56 74 H144 V${FLOOR} H56 Z`} />
          <path d="M56 74 L100 106 L144 74" />
          <Ctx o={0.55}>
            <path d="M56 132 L92 104 M144 132 L108 104" />
          </Ctx>
          <Hot>
            <Oval x={124} y={87} w={28} label={false} stroke={BLUSH} />
          </Hot>
        </g>
      );

    case "refer":
      return (
        <g>
          <Ctx>
            <path d={`M20 ${FLOOR} V70 H50 V${FLOOR}`} />
            <path d={`M150 ${FLOOR} V64 H180 V${FLOOR}`} />
          </Ctx>
          {/* Two of the committee, both wearing it */}
          <circle cx="76" cy="56" r="12" />
          <path d={`M60 ${FLOOR} V88 Q60 75 76 75 Q92 75 92 88 V${FLOOR}`} />
          <Oval x={76} y={95} w={21} label={false} />
          <circle cx="124" cy="56" r="12" />
          <path d={`M108 ${FLOOR} V88 Q108 75 124 75 Q140 75 140 88 V${FLOOR}`} />
          <Hot>
            <Oval x={124} y={95} w={21} label={false} stroke={BLUSH} />
          </Hot>
        </g>
      );

    case "instagram":
      return (
        <g>
          <Ctx>
            <path d="M30 40 H70 V72 H30 Z" />
            <path d={`M150 44 V${FLOOR} M162 44 V${FLOOR} M150 44 H162`} />
          </Ctx>
          {/* A phone on a stand, the oval filling the frame */}
          <path d="M78 32 H122 A5 5 0 0 1 127 37 V116 A5 5 0 0 1 122 121 H78 A5 5 0 0 1 73 116 V37 A5 5 0 0 1 78 32 Z" />
          <path d="M92 39 H108" />
          <Ctx o={0.5}>
            <path d="M82 52 H118 V100 H82 Z" />
          </Ctx>
          <Hot>
            <Oval x={100} y={76} w={32} stroke={BLUSH} />
          </Hot>
          <path d={`M100 121 V${FLOOR}`} />
          <path d={`M84 ${FLOOR} H116`} />
        </g>
      );

    case "tiktok":
      return (
        <g>
          <Ctx>
            <path d={`M26 ${FLOOR} V62 H58 V${FLOOR}`} />
            <path d="M144 48 H176 V86 H144 Z" />
          </Ctx>
          {/* The same phone, turned, playing something */}
          <g transform="rotate(-9 100 76)">
            <path d="M78 32 H122 A5 5 0 0 1 127 37 V116 A5 5 0 0 1 122 121 H78 A5 5 0 0 1 73 116 V37 A5 5 0 0 1 78 32 Z" />
            <path d="M92 39 H108" />
            <path d="M94 102 V56 L118 50 V90" />
            <circle cx="94" cy="102" r="7" />
            <Hot>
              <circle cx="118" cy="90" r="7" />
            </Hot>
          </g>
          <path d={`M88 ${FLOOR} H116`} />
        </g>
      );

    case "youtube":
      return (
        <g>
          <Ctx>
            <path d={`M22 ${FLOOR} H178`} />
            <path d="M32 54 H62 V84 H32 Z" />
            <path d="M156 60 L166 44 L176 60 Z" />
          </Ctx>
          {/* A monitor on the studio desk */}
          <path d="M50 36 H150 V102 H50 Z" />
          <Ctx o={0.45}>
            <path d="M58 44 H142 V94 H58 Z" />
          </Ctx>
          <Hot>
            <path d="M89 60 L116 73 L89 86 Z" />
          </Hot>
          <path d="M100 102 V114" />
          <path d={`M78 ${FLOOR} H122 L118 114 H82 Z`} />
        </g>
      );

    // ---- Drop rituals ------------------------------------------------------
    case "first-24":
      return (
        <g>
          <Ctx>
            <path d={`M16 ${FLOOR} H184`} />
            <path d="M30 34 V58 M170 34 V58" />
          </Ctx>
          {/* The rail, and the clock that decides who gets there first */}
          <path d="M30 58 H170" />
          <Ctx o={0.42}>
            <Hanging x={52} top={58} w={26} h={40} />
            <Hanging x={148} top={58} w={26} h={40} />
          </Ctx>
          <Hanging x={86} top={58} />
          <Hanging x={114} top={58} />
          <Hot>
            <g transform="translate(100 24)">
              <circle cx="0" cy="0" r="15" />
              <path d="M0 0 V-10" />
              <path d="M0 0 L8 4" />
            </g>
          </Hot>
        </g>
      );

    case "review":
      return (
        <g>
          <Ctx>
            <path d={`M24 ${FLOOR} H176`} />
            <path d="M28 40 H64 V96 H28 Z" />
          </Ctx>
          {/* A care label, written on */}
          <path d="M100 26 V44" />
          <path d="M66 44 H134 V116 H66 Z" />
          <Oval x={100} y={58} w={40} />
          <Ctx o={0.62}>
            <path d="M78 76 H122 M78 86 H122 M78 96 H106" />
          </Ctx>
          <Hot>
            <path d={`M122 100 L142 ${FLOOR - 4}`} />
            <path d="M138 120 L146 124 L142 128 Z" />
          </Hot>
        </g>
      );

    case "lookbook":
      return (
        <g>
          <Ctx>
            <path d={`M16 ${FLOOR} H184`} />
            <path d="M150 30 V70 H178" />
          </Ctx>
          {/* A camera on a tripod, pointed at someone wearing it */}
          <circle cx="132" cy="54" r="11" />
          <path d={`M116 ${FLOOR} V84 Q116 71 132 71 Q148 71 148 84 V${FLOOR}`} />
          <Oval x={132} y={92} w={20} label={false} />
          <path d="M40 60 H82 V92 H40 Z" />
          <path d="M50 60 L54 51 H68 L72 60" />
          <Hot>
            <circle cx="61" cy="76" r="9" />
          </Hot>
          <path d={`M61 92 L48 ${FLOOR} M61 92 L74 ${FLOOR} M61 92 V${FLOOR}`} />
        </g>
      );

    // ---- The dates ---------------------------------------------------------
    case "birthday":
      return (
        <g>
          <Ctx>
            <path d={`M24 ${FLOOR} H176`} />
            <path d="M34 34 V54 M52 28 V54 M148 28 V54 M166 34 V54" />
          </Ctx>
          {/* One candle, one cake, nobody else in the room */}
          <path d="M100 76 V60" />
          <Hot>
            <path d="M100 60 C95 54 100 46 100 44 C100 46 105 54 100 60 Z" />
          </Hot>
          <path d="M64 88 H136 V116 H64 Z" />
          <path d="M64 96 C76 88 84 103 100 96 C116 89 124 103 136 96" />
          <Ctx o={0.5}>
            <path d={`M56 116 H144 V${FLOOR} H56 Z`} />
          </Ctx>
        </g>
      );

    case "anniversary":
      return (
        <g>
          <Ctx>
            <path d={`M24 ${FLOOR} H176`} />
            <path d="M30 46 H52 V74 H30 Z" />
            <path d="M148 46 H170 V74 H148 Z" />
          </Ctx>
          {/* A year, marked */}
          <path d="M62 42 H138 V118 H62 Z" />
          <path d="M62 62 H138" />
          <path d="M80 42 V32" />
          <path d="M120 42 V32" />
          <Hot>
            <circle cx="100" cy="90" r="14" />
            <path d="M94 90 L99 95 L107 84" />
          </Hot>
          <Ctx o={0.5}>
            <path d={`M62 118 V${FLOOR} M138 118 V${FLOOR}`} />
          </Ctx>
        </g>
      );

    // ---- Rewards -----------------------------------------------------------
    case "ship":
      return (
        <g>
          <Ctx>
            <path d={`M18 ${FLOOR} H182`} />
            <path d="M26 92 H58 V124 H26 Z" />
            <path d="M152 100 H178 V124 H152 Z" />
          </Ctx>
          {/* A parcel, taped with the mark */}
          <path d={`M60 72 H140 V${FLOOR} H60 Z`} />
          <path d="M60 72 L74 54 H126 L140 72" />
          <Ctx o={0.5}>
            <path d={`M100 72 V${FLOOR}`} />
            <path d="M100 54 V72" />
          </Ctx>
          <Hot>
            <Oval x={100} y={98} w={44} stroke={BLUSH} />
          </Hot>
        </g>
      );

    case "off-10":
    case "off-20":
      return (
        <g>
          <Ctx>
            <path d={`M16 ${FLOOR} H184`} />
            <path d="M24 38 H68 V66 H24 Z" />
            <path d="M138 34 H180 V70 H138 Z" />
          </Ctx>
          {/* The members card, on the counter */}
          <g transform="rotate(-8 100 84)">
            <path d="M44 50 H156 A7 7 0 0 1 163 57 V111 A7 7 0 0 1 156 118 H44 A7 7 0 0 1 37 111 V57 A7 7 0 0 1 44 50 Z" />
            <Ctx o={0.4}>
              <path d="M37 72 H163" />
            </Ctx>
            <text
              x="104"
              y="105"
              textAnchor="middle"
              className="font-display"
              style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.6 }}
              fill="currentColor"
              stroke="none"
            >
              {motif === "off-10" ? "10%" : "20%"}
            </text>
            <Hot>
              <Oval x={66} y={62} w={40} stroke={BLUSH} />
            </Hot>
          </g>
        </g>
      );

    case "hold":
      return (
        <g>
          <Ctx>
            <path d={`M16 ${FLOOR} H184`} />
            <path d="M30 32 V54 M170 32 V54" />
          </Ctx>
          {/* One piece pulled off the rail and kept back */}
          <path d="M30 54 H170" />
          <Ctx o={0.38}>
            <Hanging x={54} top={54} w={26} h={40} />
            <Hanging x={82} top={54} w={26} h={40} />
            <Hanging x={146} top={54} w={26} h={40} />
          </Ctx>
          <Hanging x={116} top={54} w={38} h={56} />
          <Oval x={116} y={78} w={24} label={false} />
          <Hot>
            <path d="M133 96 L150 106" />
            <path d="M150 100 H172 V116 H150 L144 108 Z" />
            <circle cx="166" cy="108" r="2" />
          </Hot>
        </g>
      );

    case "archive":
      return (
        <g>
          {/* What sold through, still hanging behind the grille */}
          <Ctx o={0.5}>
            <path d="M42 54 H158" />
            <Hanging x={72} top={54} w={24} h={38} />
            <Hanging x={100} top={54} w={24} h={38} />
            <Hanging x={128} top={54} w={24} h={38} />
          </Ctx>
          <path d="M32 30 H168 V124 H32 Z" />
          <Ctx o={0.34}>
            <path d="M50 30 V124 M68 30 V124 M86 30 V124 M104 30 V124 M122 30 V124 M140 30 V124 M158 30 V124" />
          </Ctx>
          <Hot>
            <path d="M84 116 H116 V128 H84 Z" />
            <path d="M100 116 V110" />
          </Hot>
          <Ctx o={0.5}>
            <path d={`M32 124 V${FLOOR} M168 124 V${FLOOR}`} />
          </Ctx>
        </g>
      );

    case "studio":
      return (
        <g>
          <Ctx>
            <path d={`M14 ${FLOOR} H186`} />
            <path d="M24 40 H58 V78 H24 Z" />
            <path d="M160 36 V92" />
          </Ctx>
          {/* The cutting table, mid-drop */}
          <path d="M28 96 H172 V104 H28 Z" />
          <path d={`M42 104 V${FLOOR} M158 104 V${FLOOR}`} />
          <path d="M58 96 L72 58 H108 L122 96 Z" />
          <Ctx o={0.55}>
            <path d="M72 58 Q90 67 108 58" />
            <path d="M66 78 H114" />
          </Ctx>
          <Hot>
            <g transform="translate(144 72) rotate(14)">
              <circle cx="-8" cy="15" r="6" />
              <circle cx="8" cy="15" r="6" />
              <path d="M-5 10 L9 -15" />
              <path d="M5 10 L-9 -15" />
            </g>
          </Hot>
        </g>
      );
  }
}

export default function ClubScene({
  motif,
  className = "",
}: {
  motif: SceneMotif;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 160"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      <defs>
        {/* Light from the upper left, the same in every scene */}
        {/* Light, not shading. Held well down so the card reads as an airy
            frame with a drawing in it rather than a dark tile. */}
        <radialGradient id={`key-${uid}`} cx="20%" cy="2%" r="88%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.07" />
          <stop offset="56%" stopColor="currentColor" stopOpacity="0.015" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        {/* The cyclorama: floor meeting wall without a seam */}
        <linearGradient id={`cyc-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.035" />
        </linearGradient>
        <radialGradient id={`cast-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.17" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="200" height="160" fill={`url(#key-${uid})`} />
      <rect y={FLOOR - 34} width="200" height={160 - FLOOR + 34} fill={`url(#cyc-${uid})`} />

      <g
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0) scale(1)" : "translateY(7px) scale(0.982)",
          transformOrigin: "100px 90px",
          transition:
            "opacity 780ms cubic-bezier(0.16,1,0.3,1), transform 780ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <ellipse cx="100" cy={FLOOR + 3} rx="64" ry="7" fill={`url(#cast-${uid})`} />
        <path
          d={`M10 ${FLOOR} H190`}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
          fill="none"
        />
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Subject motif={motif} />
        </g>
      </g>
    </svg>
  );
}
