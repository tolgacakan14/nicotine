"use client";

import { useEffect, useId, useRef, useState } from "react";

/* ============================================================================
   CLUB SCENES
   ----------------------------------------------------------------------------
   One staged picture per mission and per reward.

   The reference for this page photographs a cast of teddy bears in rooms —
   an office, a pool, a podcast booth. That warmth is theirs. NICOTINE's
   equivalent is a studio with the lights still on and nobody in it, so these
   are staged the same way every time and the subject is the only thing that
   changes:

     a backdrop with light falling from the upper left,
     a floor the subject stands on,
     a contact shadow so nothing floats,
     the subject, drawn like a pattern piece,
     grain over the whole thing.

   Keeping that grammar fixed is what makes seventeen drawings read as one
   shoot rather than seventeen icons. The oval appears wherever a real garment
   would carry it — stamped, woven, printed — never as decoration.
   ========================================================================== */

export type SceneMotif =
  | "join" | "newsletter" | "refer" | "instagram" | "tiktok" | "youtube"
  | "first-24" | "review" | "lookbook" | "birthday" | "anniversary"
  | "ship" | "off-10" | "off-20" | "hold" | "archive" | "studio";

const FLOOR = 132;

/** The wordmark, as it sits on a garment: an outlined oval with the name. */
function Oval({ x, y, w = 34, label = true }: { x: number; y: number; w?: number; label?: boolean }) {
  const h = w * 0.36;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={w / 2} ry={h / 2} fill="none" strokeWidth="1.1" />
      {label && (
        <text
          x={x}
          y={y + h * 0.17}
          textAnchor="middle"
          className="font-mono"
          style={{ fontSize: w * 0.17, letterSpacing: w * 0.012 }}
          fill="currentColor"
          stroke="none"
        >
          NICOTINE
        </text>
      )}
    </g>
  );
}

/** A garment hanging on a rail — the studio's default furniture. */
function Hanging({ x, top, w = 30, h = 46 }: { x: number; top: number; w?: number; h?: number }) {
  const half = w / 2;
  return (
    <g>
      <path d={`M${x} ${top - 7} C${x} ${top - 12} ${x + 5} ${top - 12} ${x + 5} ${top - 8}`} />
      <path d={`M${x} ${top - 6} L${x - half} ${top + 6} L${x - half + 3} ${top + h} L${x + half - 3} ${top + h} L${x + half} ${top + 6} Z`} />
    </g>
  );
}

function Subject({ motif }: { motif: SceneMotif }) {
  switch (motif) {
    // ---- The way in --------------------------------------------------------
    case "join":
      return (
        <g>
          {/* A door left open, and the key that opened it */}
          <path d={`M62 40 H104 V${FLOOR} H62 Z`} opacity="0.5" />
          <path d={`M104 46 L126 34 V${FLOOR} L104 ${FLOOR}`} />
          <circle cx="100" cy="92" r="1.8" />
          <g transform="translate(126 86) rotate(-14)">
            <circle cx="0" cy="0" r="9" />
            <path d="M9 0 H40" />
            <path d="M30 0 V8" />
            <path d="M38 0 V9" />
          </g>
        </g>
      );

    // ---- Community ---------------------------------------------------------
    case "newsletter":
      return (
        <g>
          {/* An envelope propped up, stamped with the oval */}
          <path d={`M56 74 H144 V${FLOOR} H56 Z`} />
          <path d="M56 74 L100 106 L144 74" />
          <g transform="translate(0 0)">
            <Oval x={124} y={88} w={26} label={false} />
          </g>
        </g>
      );

    case "refer":
      return (
        <g>
          {/* Two of the committee, shoulder to shoulder */}
          <circle cx="76" cy="58" r="12" />
          <path d={`M60 ${FLOOR} V88 Q60 76 76 76 Q92 76 92 88 V${FLOOR}`} />
          <Oval x={76} y={96} w={20} label={false} />
          <circle cx="124" cy="58" r="12" />
          <path d={`M108 ${FLOOR} V88 Q108 76 124 76 Q140 76 140 88 V${FLOOR}`} />
          <Oval x={124} y={96} w={20} label={false} />
        </g>
      );

    case "instagram":
      return (
        <g>
          {/* A phone on a stand, the oval filling the frame */}
          <path d={`M78 34 H122 A5 5 0 0 1 127 39 V118 A5 5 0 0 1 122 123 H78 A5 5 0 0 1 73 118 V39 A5 5 0 0 1 78 34 Z`} />
          <path d="M92 41 H108" />
          <path d="M84 56 H116 A5 5 0 0 1 121 61 V93 A5 5 0 0 1 116 98 H84 A5 5 0 0 1 79 93 V61 A5 5 0 0 1 84 56 Z" opacity="0.55" />
          <Oval x={100} y={77} w={30} />
          <path d={`M100 123 V${FLOOR}`} />
          <path d={`M86 ${FLOOR} H114`} />
        </g>
      );

    case "tiktok":
      return (
        <g>
          {/* The same phone, turned, playing something */}
          <g transform="rotate(-8 100 78)">
            <path d="M78 34 H122 A5 5 0 0 1 127 39 V118 A5 5 0 0 1 122 123 H78 A5 5 0 0 1 73 118 V39 A5 5 0 0 1 78 34 Z" />
            <path d="M92 41 H108" />
            <path d="M94 104 V58 L118 52 V92" />
            <circle cx="94" cy="104" r="7" />
            <circle cx="118" cy="92" r="7" />
          </g>
          <path d={`M88 ${FLOOR} H116`} />
        </g>
      );

    case "youtube":
      return (
        <g>
          {/* A monitor on the studio desk */}
          <path d={`M48 40 H152 V104 H48 Z`} />
          <path d="M88 60 L114 72 L88 84 Z" />
          <path d="M100 104 V116" />
          <path d={`M78 ${FLOOR} H122 L118 116 H82 Z`} />
        </g>
      );

    // ---- Drop rituals ------------------------------------------------------
    case "first-24":
      return (
        <g>
          {/* The rail, and the clock that decides who gets there first */}
          <path d="M40 58 H160" />
          <Hanging x={72} top={58} />
          <Hanging x={100} top={58} />
          <Hanging x={128} top={58} />
          <circle cx="100" cy="44" r="0" />
          <g transform="translate(150 36)">
            <circle cx="0" cy="0" r="17" />
            <path d="M0 0 V-11" />
            <path d="M0 0 L9 5" />
          </g>
          <path d={`M40 ${FLOOR} H160`} opacity="0.4" />
        </g>
      );

    case "review":
      return (
        <g>
          {/* A care label, written on */}
          <path d="M100 32 V48" />
          <path d={`M62 48 H138 V118 H62 Z`} />
          <Oval x={100} y={62} w={40} />
          <path d="M74 80 H126" opacity="0.7" />
          <path d="M74 90 H126" opacity="0.7" />
          <path d="M74 100 H108" opacity="0.7" />
          <path d={`M126 108 L140 ${FLOOR}`} />
        </g>
      );

    case "lookbook":
      return (
        <g>
          {/* A camera on a tripod, pointed at someone wearing it */}
          <circle cx="132" cy="56" r="11" />
          <path d={`M116 ${FLOOR} V84 Q116 72 132 72 Q148 72 148 84 V${FLOOR}`} />
          <path d="M44 62 H84 V92 H44 Z" />
          <path d="M54 62 L58 54 H70 L74 62" />
          <circle cx="64" cy="77" r="9" />
          <path d={`M64 92 L52 ${FLOOR} M64 92 L76 ${FLOOR} M64 92 V${FLOOR}`} />
        </g>
      );

    // ---- The dates ---------------------------------------------------------
    case "birthday":
      return (
        <g>
          {/* One candle, one cake, nobody else in the room */}
          <path d="M100 74 V58" />
          <path d="M100 58 C95 52 100 44 100 42 C100 44 105 52 100 58 Z" />
          <path d="M62 86 H138 V118 H62 Z" />
          <path d="M62 94 C74 86 82 102 100 94 C118 86 126 102 138 94" />
          <path d={`M56 118 H144 V${FLOOR} H56 Z`} opacity="0.5" />
        </g>
      );

    case "anniversary":
      return (
        <g>
          {/* A year, marked */}
          <path d="M58 44 H142 V120 H58 Z" />
          <path d="M58 64 H142" />
          <path d="M78 44 V34" />
          <path d="M122 44 V34" />
          <circle cx="100" cy="92" r="14" />
          <path d="M94 92 L99 97 L107 87" />
          <path d={`M58 120 V${FLOOR} M142 120 V${FLOOR}`} opacity="0.5" />
        </g>
      );

    // ---- Rewards -----------------------------------------------------------
    case "ship":
      return (
        <g>
          {/* A parcel, taped with the oval */}
          <path d={`M54 70 H146 V${FLOOR} H54 Z`} />
          <path d="M54 70 L70 52 H130 L146 70" />
          <path d={`M100 70 V${FLOOR}`} opacity="0.5" />
          <path d="M100 52 V70" opacity="0.5" />
          <Oval x={100} y={96} w={42} />
        </g>
      );

    case "off-10":
    case "off-20":
      return (
        <g>
          {/* The members card, at an angle on the counter */}
          <g transform="rotate(-9 100 84)">
            <path d="M46 52 H154 A6 6 0 0 1 160 58 V110 A6 6 0 0 1 154 116 H46 A6 6 0 0 1 40 110 V58 A6 6 0 0 1 46 52 Z" />
            <text
              x="100"
              y="94"
              textAnchor="middle"
              className="font-display"
              style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.6 }}
              fill="currentColor"
              stroke="none"
            >
              {motif === "off-10" ? "10%" : "20%"}
            </text>
            <Oval x={64} y={64} w={24} label={false} />
          </g>
          <path d={`M52 ${FLOOR} H148`} opacity="0.4" />
        </g>
      );

    case "hold":
      return (
        <g>
          {/* One piece pulled off the rail and kept back */}
          <path d="M40 54 H160" />
          <Hanging x={68} top={54} />
          <Hanging x={132} top={54} />
          <g>
            <Hanging x={100} top={54} w={38} h={56} />
            <Oval x={100} y={78} w={24} label={false} />
          </g>
          <path d="M116 96 L136 110" />
          <path d="M136 104 H156 V120 H136 L130 112 Z" />
          <path d={`M40 ${FLOOR} H160`} opacity="0.4" />
        </g>
      );

    case "archive":
      return (
        <g>
          {/* What sold through, still hanging behind the grille */}
          <path d="M34 36 H166 V124 H34 Z" />
          <path d="M52 36 V124 M72 36 V124 M92 36 V124 M112 36 V124 M132 36 V124 M152 36 V124" opacity="0.28" />
          <path d="M44 58 H156" opacity="0.6" />
          <g opacity="0.85">
            <Hanging x={72} top={58} w={26} h={40} />
            <Hanging x={100} top={58} w={26} h={40} />
            <Hanging x={128} top={58} w={26} h={40} />
          </g>
          <path d={`M34 124 V${FLOOR} M166 124 V${FLOOR}`} opacity="0.5" />
        </g>
      );

    case "studio":
      return (
        <g>
          {/* The cutting table, mid-drop */}
          <path d={`M30 96 H170 V104 H30 Z`} />
          <path d={`M44 104 V${FLOOR} M156 104 V${FLOOR}`} />
          <path d="M62 96 L74 62 H106 L118 96 Z" opacity="0.75" />
          <path d="M74 62 Q90 70 106 62" opacity="0.6" />
          <g transform="translate(140 74) rotate(12)">
            <circle cx="-9" cy="16" r="6" />
            <circle cx="9" cy="16" r="6" />
            <path d="M-6 11 L10 -16" />
            <path d="M6 11 L-10 -16" />
          </g>
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
        <radialGradient id={`key-${uid}`} cx="22%" cy="4%" r="86%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
          <stop offset="58%" stopColor="currentColor" stopOpacity="0.03" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        {/* The contact shadow that stops the subject floating */}
        <radialGradient id={`cast-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="200" height="160" fill={`url(#key-${uid})`} />

      <g
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0) scale(1)" : "translateY(6px) scale(0.985)",
          transformOrigin: "100px 90px",
          transition: "opacity 760ms cubic-bezier(0.16,1,0.3,1), transform 760ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <ellipse cx="100" cy={FLOOR + 3} rx="62" ry="7" fill={`url(#cast-${uid})`} />
        <path d={`M14 ${FLOOR} H186`} stroke="currentColor" strokeWidth="1" opacity="0.28" fill="none" />
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Subject motif={motif} />
        </g>
      </g>
    </svg>
  );
}
