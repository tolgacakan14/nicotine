"use client";

import { useCallback, useRef, useState } from "react";

type View = "FRONT" | "SIDE" | "BACK";

const VIEWS: View[] = ["FRONT", "SIDE", "BACK", "SIDE"];

function ModelView({ view }: { view: View }) {
  const side = view === "SIDE";
  const back = view === "BACK";
  const body = side
    ? "M219 108 C246 111 258 143 250 178 L246 224 C254 278 251 353 245 414 L245 688 L215 688 L205 414 C198 345 197 276 204 224 L203 174 C196 139 200 113 219 108Z"
    : "M210 108 C248 108 269 136 263 179 L254 222 C278 263 277 348 263 414 L250 688 L218 688 L210 446 L202 688 L170 688 L157 414 C143 348 142 263 166 222 L157 179 C151 136 172 108 210 108Z";
  const tank = side
    ? "M210 216 Q223 202 242 218 L249 248 L245 404 Q229 414 208 405 L201 252 Q202 226 210 216Z"
    : "M173 216 L190 209 Q193 247 210 260 Q227 247 230 209 L247 216 Q259 228 260 253 L255 405 Q210 416 165 405 L160 253 Q161 228 173 216Z";

  return (
    <svg viewBox="0 0 420 760" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`fit-body-${view}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b2926" />
          <stop offset="0.55" stopColor="#11110f" />
          <stop offset="1" stopColor="#393632" />
        </linearGradient>
        <linearGradient id={`fit-rib-${view}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9d8d4" />
          <stop offset="0.28" stopColor="#faf9f6" />
          <stop offset="0.7" stopColor="#e5e3df" />
          <stop offset="1" stopColor="#bdbbb7" />
        </linearGradient>
        <pattern id={`fit-lines-${view}`} width="7" height="7" patternUnits="userSpaceOnUse">
          <path d="M1 0 V7" stroke="#9c9a96" strokeWidth="0.6" opacity="0.45" />
        </pattern>
        <filter id={`fit-shadow-${view}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.18" />
        </filter>
      </defs>
      <ellipse cx="210" cy="702" rx={side ? 48 : 82} ry="10" fill="#111" opacity="0.13" />
      <path d={body} fill={`url(#fit-body-${view})`} />
      <ellipse cx={side ? 222 : 210} cy="118" rx={side ? 28 : 42} ry="54" fill="#171614" />
      {!back && !side && <><circle cx="194" cy="112" r="3.5" fill="#f5f4f0" /><circle cx="226" cy="112" r="3.5" fill="#f5f4f0" /></>}
      <g filter={`url(#fit-shadow-${view})`}>
        <path d={tank} fill={`url(#fit-rib-${view})`} stroke="#151411" strokeWidth="1.5" />
        <path d={tank} fill={`url(#fit-lines-${view})`} opacity="0.72" />
        {!side && !back && (
          <g>
            <ellipse cx="210" cy="311" rx="25" ry="12" fill="#151411" />
            <text x="210" y="314" textAnchor="middle" fill="#f6f5f1" fontSize="5.4" letterSpacing="1.2">NICOTINE</text>
          </g>
        )}
        {back && <path d="M184 216 Q210 234 236 216" fill="none" stroke="#888681" strokeWidth="2" />}
      </g>
    </svg>
  );
}

export default function FitView360() {
  const [angle, setAngle] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const startRef = useRef({ x: 0, angle: 0 });
  const draggingRef = useRef(false);

  const normalized = ((angle % 360) + 360) % 360;
  const segment = normalized / 90;
  const current = Math.floor(segment) % 4;
  const next = (current + 1) % 4;
  const blend = segment - Math.floor(segment);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const delta = event.clientX - startRef.current.x;
    setDragDelta(delta);
    setAngle(startRef.current.angle + delta * 0.72);
  }, []);

  const finish = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const snapped = Math.round(angle / 90) * 90;
    setAngle(snapped);
    setDragDelta(0);
  }, [angle]);

  const label = VIEWS[Math.round(normalized / 90) % 4];

  return (
    <section className="mb-3 border border-line bg-[#efeeea]" aria-label="PURE RIB TANK 360 degree fit view">
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-wide2 text-mark">360 FIT VIEW — PROTOTYPE</span>
        <span className="font-mono text-[10px] uppercase tracking-wide2 text-ash">{String(Math.round(normalized)).padStart(3, "0")}° / {label}</span>
      </header>

      <div
        className="relative aspect-[4/5] cursor-ew-resize touch-none select-none overflow-hidden"
        style={{ transform: `rotate(${Math.max(-2, Math.min(2, dragDelta / 90))}deg)`, transition: draggingRef.current ? "none" : "transform 300ms ease" }}
        onPointerDown={(event) => {
          draggingRef.current = true;
          startRef.current = { x: event.clientX, angle };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={finish}
        onPointerCancel={finish}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-5 sm:p-10">
          <div className="absolute inset-0" style={{ opacity: 1 - blend }}><ModelView view={VIEWS[current]} /></div>
          <div className="absolute inset-0" style={{ opacity: blend }}><ModelView view={VIEWS[next]} /></div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-5 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-mark/30" />
          <span className="font-mono text-[9px] uppercase tracking-brand text-haze">DRAG TO ROTATE</span>
          <span className="h-px w-12 bg-mark/30" />
        </div>
      </div>
    </section>
  );
}
