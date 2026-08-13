/**
 * FIGURE v3 — the character at the centre of the scroll film.
 *
 * WHY IT IS BUILT THIS WAY
 * ----------------------------------------------------------------------------
 * v2 generated sleeves as separate strips anchored to a skeleton. Sharp joints
 * plus wide widths made the polygons flare at the shoulder, so garments read as
 * winged boxes with detached arms.
 *
 * v3 draws every garment the way a technical flat is drawn in a real studio:
 * ONE closed silhouette containing the body panel AND both sleeves. There is no
 * seam between sleeve and body, so there is nothing to misalign — a garment
 * cannot come apart from itself. Each layer is simply cut wider than the one
 * beneath it, which is also how real layering works.
 *
 * Reveal is handled by clip rects (see `<clipPath>` defs), NOT by moving the
 * garment. The garment is always at its final coordinates; the timeline only
 * wipes it into view. That is what keeps the fit perfect at every scroll frame.
 *
 * Layer groups keep their `data-layer` names so `film.ts` stays the storyboard.
 */

const CX = 210;

/* ----------------------------------------------------------- body metrics */
const HEAD = { cy: 112, rx: 46, ry: 58 };
const SHOULDER_Y = 214;
const ARM = {
  topOuter: 60, // half-width of the arm's outer edge at the shoulder
  topInner: 34,
  wristOuter: 54,
  wristInner: 40,
  wristY: 556,
};
const LEG = { hipY: 478, ankleY: 886 };

/* ------------------------------------------------------------- generators */

interface Flat {
  /** Half-width of the shoulder point — the widest part of the silhouette. */
  shoulder: number;
  /** Half-widths of the cuff, outer then inner edge. */
  cuffOuter: number;
  cuffInner: number;
  cuffY: number;
  /** Half-width of the body panel at the underarm, and at the hem. */
  bodyUnderarm: number;
  bodyHem: number;
  underarmY: number;
  hemY: number;
  topY: number;
  neckHalf: number;
  neckDrop: number;
}

/**
 * A garment silhouette: neck → shoulder → sleeve → cuff → underarm → hem, then
 * mirrored back up the other side and closed across the neckline. Corners are
 * softened with quadratics so the shape reads as fabric, not cardboard.
 */
function garmentBody(g: Flat): string {
  const { shoulder: s, bodyUnderarm: bu, bodyHem: bh } = g;
  const { underarmY: uy, hemY: hy, topY: ty, neckHalf: nh, neckDrop: nd } = g;
  return [
    `M${CX - nh},${ty}`,
    `L${CX - s + 6},${ty - 4}`,
    `Q${CX - s},${ty - 3} ${CX - s},${ty + 6}`, // shoulder point, rounded
    `L${CX - bu},${uy}`, // back up into the underarm
    `L${CX - bh},${hy - 6}`,
    `Q${CX - bh},${hy} ${CX - bh + 8},${hy}`, // hem corner
    `L${CX + bh - 8},${hy}`,
    `Q${CX + bh},${hy} ${CX + bh},${hy - 6}`,
    `L${CX + bu},${uy}`,
    `L${CX + s},${ty + 6}`,
    `Q${CX + s},${ty - 3} ${CX + s - 6},${ty - 4}`,
    `L${CX + nh},${ty}`,
    `Q${CX},${ty + nd} ${CX - nh},${ty}`, // neckline scoop
    "Z",
  ].join(" ");
}

/** Sleeve separated from the body panel so it rotates around the exact same
 * shoulder joint as the character's arm during the catwalk. */
function garmentSleeve(g: Flat, side: -1 | 1): string {
  const outerShoulder = CX + side * g.shoulder;
  const innerShoulder = CX + side * (g.shoulder - 20);
  const outerCuff = CX + side * g.cuffOuter;
  const innerCuff = CX + side * g.cuffInner;
  const underarm = CX + side * g.bodyUnderarm;
  return [
    `M${innerShoulder},${g.topY + 5}`,
    `Q${outerShoulder},${g.topY - 2} ${outerShoulder},${g.topY + 8}`,
    `L${outerCuff},${g.cuffY - 6}`,
    `Q${outerCuff},${g.cuffY} ${CX + side * (g.cuffOuter - 6)},${g.cuffY}`,
    `L${innerCuff},${g.cuffY}`,
    `L${underarm},${g.underarmY}`,
    `L${innerShoulder},${g.topY + 5}`,
    "Z",
  ].join(" ");
}

/* --------------------------------------------------------------- garments */

/**
 * I NEED NICOTINE LONGSLEEVE — the label's first design and the first thing the
 * figure puts on. Cut boxy and wide, so it reads as outerwear-adjacent when worn
 * alone and still stacks under the tee and hoodie that follow.
 */
const NEED_LS: Flat = {
  shoulder: 88, cuffOuter: 68, cuffInner: 46, cuffY: 566,
  bodyUnderarm: 80, bodyHem: 78, underarmY: 330, hemY: 488,
  topY: 204, neckHalf: 32, neckDrop: 22,
};

const LONGSLEEVE: Flat = {
  shoulder: 66, cuffOuter: 60, cuffInner: 38, cuffY: 562,
  bodyUnderarm: 58, bodyHem: 55, underarmY: 300, hemY: 502,
  topY: 210, neckHalf: 26, neckDrop: 18,
};
const TEE: Flat = {
  shoulder: 82, cuffOuter: 76, cuffInner: 46, cuffY: 348,
  bodyUnderarm: 74, bodyHem: 72, underarmY: 352, hemY: 468,
  topY: 206, neckHalf: 31, neckDrop: 22,
};
const HOODIE: Flat = {
  shoulder: 96, cuffOuter: 78, cuffInner: 52, cuffY: 560,
  bodyUnderarm: 88, bodyHem: 84, underarmY: 332, hemY: 514,
  topY: 202, neckHalf: 33, neckDrop: 24,
};
/**
 * ARMOR JACKET — cropped zip bomber. Cut wider than the hoodie beneath it and
 * stopped at the waist, so the trousers read below it rather than being buried.
 */
const JACKET: Flat = {
  shoulder: 112, cuffOuter: 100, cuffInner: 72, cuffY: 552,
  bodyUnderarm: 88, bodyHem: 90, underarmY: 310, hemY: 500,
  topY: 200, neckHalf: 26, neckDrop: 8,
};

/**
 * NICOTINE set inside the SVG, carrying the mark's mirrored N's (letters 1 and
 * 7). Used for the chest print and the oval logo, so the figure's garments read
 * the same as the wordmark everywhere else on the site.
 */
function SvgWordmark({
  x, y, size, tracking, fill, opacity = 1,
}: {
  x: number; y: number; size: number; tracking: number; fill: string; opacity?: number;
}) {
  const letters = "NICOTINE".split("");
  const step = size * 0.7 + tracking;
  const start = x - (step * (letters.length - 1)) / 2;
  return (
    <g
      fill={fill}
      opacity={opacity}
      fontFamily="var(--font-body), Helvetica Neue, Arial, sans-serif"
      fontSize={size}
      fontWeight="700"
    >
      {letters.map((ch, i) =>
        i === 0 || i === 6 ? (
          <text key={i} transform={`translate(${start + i * step} ${y}) scale(-1 1)`} textAnchor="middle">
            {ch}
          </text>
        ) : (
          <text key={i} x={start + i * step} y={y} textAnchor="middle">
            {ch}
          </text>
        )
      )}
    </g>
  );
}

/**
 * RIB TANK — the drop's base layer. Drawn bespoke rather than through `flat()`,
 * which always generates sleeves: here the armholes are the whole point.
 */
const TANK_PATH = [
  `M${CX - 31},211`,
  `L${CX - 46},207`,
  `Q${CX - 56},210 ${CX - 58},226`,
  `Q${CX - 60},268 ${CX - 72},302`,
  `Q${CX - 66},310 ${CX - 61},313`,
  `L${CX - 58},472`,
  `Q${CX - 58},480 ${CX - 50},480`,
  `L${CX + 50},480`,
  `Q${CX + 58},480 ${CX + 58},472`,
  `L${CX + 61},313`,
  `Q${CX + 66},310 ${CX + 72},302`,
  `Q${CX + 60},268 ${CX + 58},226`,
  `Q${CX + 56},210 ${CX + 46},207`,
  `L${CX + 31},211`,
  `C${CX + 31},260 ${CX + 27},296 ${CX},300`,
  `C${CX - 27},296 ${CX - 31},260 ${CX - 31},211`,
  "Z",
].join(" ");

/** Black women's tank — slightly narrower through the shoulder and waist than
 * the espresso base, with the squared scoop visible in the product photography. */
const BLACK_TANK_PATH = [
  `M${CX - 30},214`,
  `L${CX - 43},212`,
  `Q${CX - 53},216 ${CX - 55},232`,
  `L${CX - 59},304`,
  `L${CX - 56},466`,
  `Q${CX - 56},476 ${CX - 48},476`,
  `L${CX + 48},476`,
  `Q${CX + 56},476 ${CX + 56},466`,
  `L${CX + 59},304`,
  `L${CX + 55},232`,
  `Q${CX + 53},216 ${CX + 43},212`,
  `L${CX + 30},214`,
  `Q${CX + 31},257 ${CX + 27},278`,
  `Q${CX},294 ${CX - 27},278`,
  `Q${CX - 31},257 ${CX - 30},214`,
  "Z",
].join(" ");

const NEED_LS_PATH = garmentBody(NEED_LS);
const LS_PATH = garmentBody(LONGSLEEVE);
const TEE_PATH = garmentBody(TEE);
const HOODIE_PATH = garmentBody(HOODIE);
const JACKET_PATH = garmentBody(JACKET);

/**
 * Wide-leg trouser drawn as ONE silhouette with a single crotch point — the
 * same reason the tops are single flats: two separate legs left a gap at the
 * seat where the body showed through.
 */
const PANT_SEAT = [
  `M${CX - 62},466`,
  `L${CX + 62},466`,
  `L${CX + 60},572`,
  `L${CX},588`, // the seat dips at the crotch
  `L${CX - 60},572`,
  "Z",
].join(" ");

/** One trouser leg. `side` is -1 for the left, +1 for the right. */
const pantLeg = (side: 1 | -1) =>
  [
    `M${CX + 60 * side},545`,
    `L${CX + 58 * side},876`,
    `Q${CX + 58 * side},884 ${CX + 52 * side},884`,
    `L${CX + 16 * side},884`,
    `Q${CX + 10 * side},884 ${CX + 10 * side},876`,
    `L${CX + 6 * side},545`,
    "Z",
  ].join(" ");

const PANT_LEG_L = pantLeg(-1);
const PANT_LEG_R = pantLeg(1);

/* The figure is printed dark on the light ground. FIG is the body/garment
   ink; CUT is the ground colour, used to knock shapes back out of it. */
/* Garment colourways, as they read against the light ground. Pale garments get
   a dark outline so they don't dissolve into the paper; dark ones carry a
   silver edge instead. */
const TANK = "#3B322C";      // rib tank — washed espresso
const TANK_RIB = "#584C43";  // its ribbing and tonal oval
const BLACK_TANK = "#0B0B0B";
const BLACK_TANK_RIB = "#303030";
const OFFWHITE = "#FBFAF8";  // I NEED NICOTINE longsleeve
const BONE = "#E2DED5";      // null scarf
const SOOT = "#26241F";      // second skin base knit
const TAR_CLOTH = "#332F29"; // washed hoodie
const ASH_CLOTH = "#8E8A80"; // ash work jacket
const BLACK_CLOTH = "#1B1913"; // static cargo pant
const ARMOR = "#1E1C1A";       // armor jacket — corded black
const ARMOR_CORD = "#3D3A36";  // the cording that runs through it
const ARMOR_RIB = "#2A2724";   // ribbed hem and cuffs
const NEON = "#5BE83C";        // the jacket's oval — the drop's only colour
const CAT_TEE = "#121110";     // eyes on cat tee — black
const CAT_TEE_EDGE = "#3A3733"; // its edge, so it reads against a dark figure
const VIOLET = "#7B5CE0";       // the tee's chest embroidery
const CAP_CLOTH = "#7A7772";  // washed grey twill
const CAP_BRIM = "#615E5A";   // the brim reads a shade deeper
const OUTLINE = "#14130F";
const FIG = "#14130F";
const CUT = "#F7F6F3";

export default function Figure({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 940"
      className={className}
      role="img"
      aria-label="Monochrome figure wearing the current NICOTINE drop"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Chrome — the drop's metal. Used on every garment edge. */}
        <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDFDFE" />
          <stop offset="18%" stopColor="#9AA0A7" />
          <stop offset="38%" stopColor="#EDEFF1" />
          <stop offset="58%" stopColor="#6C7278" />
          <stop offset="78%" stopColor="#D3D7DB" />
          <stop offset="100%" stopColor="#868C93" />
        </linearGradient>
        <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4E7EA" />
          <stop offset="30%" stopColor="#878D94" />
          <stop offset="52%" stopColor="#F2F4F5" />
          <stop offset="74%" stopColor="#767C83" />
          <stop offset="100%" stopColor="#B4B9BF" />
        </linearGradient>
        {/* The body dissolves into the ground at the ankles */}
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={FIG} stopOpacity="0.95" />
          <stop offset="72%" stopColor={FIG} stopOpacity="0.72" />
          <stop offset="100%" stopColor={FIG} stopOpacity="0.14" />
        </linearGradient>
        {/* A light rim down one side of the head, knocked out of the dark */}
        <linearGradient id="face-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={CUT} stopOpacity="0.2" />
          <stop offset="55%" stopColor={CUT} stopOpacity="0" />
        </linearGradient>
        <pattern id="dot" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1" fill={FIG} opacity="0.35" />
        </pattern>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" />
        </filter>

        {/* ---- Reveal clips. The timeline animates these rects, never the
             garments themselves, so fit is identical at every frame. ---- */}
        <clipPath id="clip-tank">
          <rect data-clip="tank" x="0" y="206" width="420" height="0" />
        </clipPath>
        <clipPath id="clip-blacktank">
          <rect data-clip="blacktank" x="0" y="206" width="420" height="0" />
        </clipPath>
        <clipPath id="clip-needls">
          <rect data-clip="needls" x="0" y="196" width="420" height="0" />
        </clipPath>
        <clipPath id="clip-longsleeve">
          <rect data-clip="longsleeve" x="0" y="190" width="420" height="0" />
        </clipPath>
        <clipPath id="clip-tee">
          <rect data-clip="tee" x="0" y="186" width="420" height="0" />
        </clipPath>
        <clipPath id="clip-hoodie">
          <rect data-clip="hoodie" x="0" y="150" width="420" height="0" />
        </clipPath>
        {/* The jacket's own outline, used to clip its vertical cording. */}
        <clipPath id="armor-shape">
          <path d={JACKET_PATH} />
        </clipPath>
        <clipPath id="clip-jacket">
          <rect data-clip="jacket" x="0" y="178" width="420" height="0" />
        </clipPath>
        <clipPath id="clip-cap">
          <rect data-clip="cap" x="0" y="28" width="420" height="0" />
        </clipPath>
        <clipPath id="clip-scarf">
          <rect data-clip="scarf" x="0" y="168" width="420" height="0" />
        </clipPath>
        {/* Trousers are stepped into — this one wipes upward from the hem. */}
        <clipPath id="clip-pant">
          <rect data-clip="pant" x="0" y="888" width="420" height="0" />
        </clipPath>
      </defs>

      {/* Studio light + floor */}
      {/* Contact shadow under the figure — it lands on the runway */}
      <ellipse data-shadow cx="210" cy="900" rx="104" ry="11" fill={FIG} opacity="0.18" filter="url(#soft)" />
      <ellipse data-shadow cx="210" cy="900" rx="62" ry="6" fill={FIG} opacity="0.25" />

      {/* ================================ BODY ================================ */}
      <g data-layer="body">
        {/* Legs. Each is its own group with the hip as its transform origin, so
            the walk cycle can swing it. Garment legs carry the same
            `data-swing` key and pivot about the same point, which keeps trouser
            and leg registered to each other while walking. */}
        <g data-swing="l">
          <path d={`M172,${LEG.hipY} L176,${LEG.ankleY} L206,${LEG.ankleY} L208,${LEG.hipY} Z`} fill="url(#skin)" />
        </g>
        <g data-swing="r">
          <path d={`M212,${LEG.hipY} L214,${LEG.ankleY} L244,${LEG.ankleY} L248,${LEG.hipY} Z`} fill="url(#skin)" />
        </g>

        {/* Torso */}
        <path
          d={`M154,${SHOULDER_Y + 4} Q154,${SHOULDER_Y - 8} 172,${SHOULDER_Y - 10} L248,${SHOULDER_Y - 10} Q266,${SHOULDER_Y - 8} 266,${SHOULDER_Y + 4} L258,486 L162,486 Z`}
          fill={FIG}
          opacity="0.92"
        />

        {/* Arms — they counter-swing against the legs */}
        <g data-arm="l">
          <path
            d={`M${CX - ARM.topOuter},${SHOULDER_Y + 6} L${CX - ARM.wristOuter},${ARM.wristY} L${CX - ARM.wristInner},${ARM.wristY} L${CX - ARM.topInner},${SHOULDER_Y + 20} Z`}
            fill={FIG}
            opacity="0.88"
          />
          <ellipse cx="163" cy="578" rx="13" ry="22" fill={FIG} opacity="0.9" />
        </g>
        <g data-arm="r">
          <path
            d={`M${CX + ARM.topOuter},${SHOULDER_Y + 6} L${CX + ARM.wristOuter},${ARM.wristY} L${CX + ARM.wristInner},${ARM.wristY} L${CX + ARM.topInner},${SHOULDER_Y + 20} Z`}
            fill={FIG}
            opacity="0.88"
          />
          <ellipse cx="257" cy="578" rx="13" ry="22" fill={FIG} opacity="0.9" />
        </g>

        {/* Neck + head */}
        <rect x="195" y="160" width="30" height="56" fill={FIG} opacity="0.7" />
        <ellipse cx={CX} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} fill={FIG} opacity="0.95" />
        {/* Face — knocked out of the dark head. Deadpan. */}
        <ellipse cx="194" cy="106" rx="4" ry="6.4" fill={CUT} opacity="0.9" />
        <ellipse cx="226" cy="106" rx="4" ry="6.4" fill={CUT} opacity="0.9" />
        <path d="M201 143 L223 142" stroke={CUT} strokeWidth="2.2" opacity="0.7" />
        <path d="M164 112 C164 62 186 50 210 50 C198 68 181 86 178 168 Z" fill="url(#face-shade)" />
      </g>

      {/* ====================== GARMENTS — base to outerwear ==================== */}

      {/* RIB TANK — the base layer. Washed espresso rib with a tonal oval. */}
      <g data-layer="tank" opacity="0">
        <g clipPath="url(#clip-tank)">
          <path d={TANK_PATH} fill={TANK} stroke={OUTLINE} strokeWidth="1.2" />
          {/* Rib texture */}
          <g stroke={TANK_RIB} strokeWidth="0.65" opacity="0.2">
            {Array.from({ length: 7 }, (_, i) => {
              const x = 174 + i * 12;
              return <path key={i} d={`M${x},306 L${x},475`} />;
            })}
          </g>
          {/* Bound neck and armholes */}
          <path d={`M${CX - 31},213 C${CX - 31},260 ${CX - 27},296 ${CX},300 C${CX + 27},296 ${CX + 31},260 ${CX + 31},213`} fill="none" stroke="#75675D" strokeWidth="3" opacity="0.8" />
          <path d="M153 222 Q151 270 139 303" fill="none" stroke="#75675D" strokeWidth="3" opacity="0.75" />
          <path d="M267 222 Q269 270 281 303" fill="none" stroke="#75675D" strokeWidth="3" opacity="0.75" />
          {/* The tonal oval */}
          <ellipse cx={CX} cy="348" rx="36" ry="11" fill="none" stroke="#79685E" strokeWidth="1.5" />
          <SvgWordmark x={CX} y={352} size={8.5} tracking={1.7} fill="#79685E" />
        </g>
      </g>

      {/* BLACK RIB TANK — the second base layer, fitted over espresso. */}
      <g data-layer="blacktank" opacity="0">
        <g clipPath="url(#clip-blacktank)">
          <path d={BLACK_TANK_PATH} fill={BLACK_TANK} stroke="url(#chrome)" strokeWidth="1.15" />
          <g stroke={BLACK_TANK_RIB} strokeWidth="0.85" opacity="0.72">
            {Array.from({ length: 13 }, (_, i) => {
              const x = 162 + i * 8;
              return <path key={i} d={`M${x},246 L${x},472`} />;
            })}
          </g>
          <path d={`M${CX - 30},216 Q${CX - 30},278 ${CX},292 Q${CX + 30},278 ${CX + 30},216`} fill="none" stroke="#777" strokeWidth="2" opacity="0.72" />
          <path d="M155 228 L151 304 M265 228 L269 304" stroke="#777" strokeWidth="1.8" opacity="0.55" />
          <ellipse cx={CX} cy="350" rx="39" ry="12" fill="none" stroke="#F2F2F2" strokeWidth="1.5" />
          <SvgWordmark x={CX} y={354} size={9} tracking={1.8} fill="#F2F2F2" />
        </g>
      </g>

      {/* I NEED NICOTINE LONGSLEEVE — off-white, oval mark on the chest.
          The back print (the sketch) is not visible from the front, so the
          garment carries only what a front view would actually show. */}
      <g data-layer="needls" opacity="0">
        <g clipPath="url(#clip-needls)">
          <g data-garment-arm="l"><path d={garmentSleeve(NEED_LS, -1)} fill={OFFWHITE} stroke={OUTLINE} strokeWidth="1.4" /></g>
          <g data-garment-arm="r"><path d={garmentSleeve(NEED_LS, 1)} fill={OFFWHITE} stroke={OUTLINE} strokeWidth="1.4" /></g>
          <path d={NEED_LS_PATH} fill={OFFWHITE} stroke={OUTLINE} strokeWidth="1.4" />
          {/* Ribbed crew collar */}
          <path d={`M${CX - 32},204 Q${CX},228 ${CX + 32},204`} fill="none" stroke={FIG} strokeWidth="2.4" opacity="0.35" />
          {/* The oval mark, printed small and high on the chest */}
          <ellipse cx={CX} cy="308" rx="42" ry="15" fill="none" stroke={OUTLINE} strokeWidth="1.8" opacity="0.95" />
          <SvgWordmark x={CX} y={313} size={10} tracking={2.2} fill={OUTLINE} opacity={0.95} />
          {/* Cuff and hem ribbing */}
          <path d={`M${CX - 78},472 H${CX + 78}`} stroke={FIG} strokeWidth="1" opacity="0.18" />
        </g>
      </g>

      {/* SECOND SKIN LONGSLEEVE */}
      <g data-layer="longsleeve" opacity="0">
        <g clipPath="url(#clip-longsleeve)">
          <g data-garment-arm="l"><path d={garmentSleeve(LONGSLEEVE, -1)} fill={SOOT} stroke="url(#chrome)" strokeWidth="1.5" /></g>
          <g data-garment-arm="r"><path d={garmentSleeve(LONGSLEEVE, 1)} fill={SOOT} stroke="url(#chrome)" strokeWidth="1.5" /></g>
          <path d={LS_PATH} fill={SOOT} stroke="url(#chrome)" strokeWidth="1.5" />
          <path d="M162 306 H258 M162 340 H258 M162 374 H258" stroke="url(#chrome)" strokeWidth="0.7" opacity="0.3" />
          <path d={`M${CX - 26},210 Q${CX},232 ${CX + 26},210`} fill="none" stroke="url(#chrome)" strokeWidth="1.8" opacity="0.75" />
        </g>
      </g>

      {/* STATIC CARGO PANT */}
      <g data-layer="pant" opacity="0">
        <g clipPath="url(#clip-pant)">
          {/* Legs first, seat over the top: the seat hides both leg tops, so the
              inseam never opens up as they swing. */}
          <g data-swing="l">
            <path d={PANT_LEG_L} fill={BLACK_CLOTH} stroke="url(#chrome-v)" strokeWidth="1.4" />
            <rect x="152" y="606" width="42" height="58" fill="none" stroke="url(#chrome-v)" strokeWidth="1.3" opacity="0.75" />
            <path d="M152 838 h44 M154 858 h42" stroke="url(#chrome)" strokeWidth="1.1" opacity="0.5" />
          </g>
          <g data-swing="r">
            <path d={PANT_LEG_R} fill={BLACK_CLOTH} stroke="url(#chrome-v)" strokeWidth="1.4" />
            <rect x="226" y="606" width="42" height="58" fill="none" stroke="url(#chrome-v)" strokeWidth="1.3" opacity="0.75" />
            <path d="M224 838 h44 M224 858 h42" stroke="url(#chrome)" strokeWidth="1.1" opacity="0.5" />
          </g>
          <path d={PANT_SEAT} fill={BLACK_CLOTH} stroke="url(#chrome-v)" strokeWidth="1.4" />
          {/* Waistband */}
          <rect x="148" y="462" width="124" height="26" fill={BLACK_CLOTH} stroke="url(#chrome)" strokeWidth="1.4" />
          <rect x="150" y="466" width="120" height="18" fill="url(#dot)" opacity="0.3" />
        </g>
      </g>

      {/* EYES ON CAT TEE — black boxed tee, violet oval on the chest.
          The photographic back print is not visible from the front, so the
          garment carries only what a front view would actually show. */}
      <g data-layer="tee" opacity="0">
        <g clipPath="url(#clip-tee)">
          <g data-garment-arm="l"><path d={garmentSleeve(TEE, -1)} fill={CAT_TEE} stroke={CAT_TEE_EDGE} strokeWidth="1.2" /></g>
          <g data-garment-arm="r"><path d={garmentSleeve(TEE, 1)} fill={CAT_TEE} stroke={CAT_TEE_EDGE} strokeWidth="1.2" /></g>
          <path d={TEE_PATH} fill={CAT_TEE} stroke={CAT_TEE_EDGE} strokeWidth="1.2" />
          {/* Ribbed crew */}
          <path d={`M${CX - 31},206 Q${CX},228 ${CX + 31},206`} fill="none" stroke={CAT_TEE_EDGE} strokeWidth="2" opacity="0.7" />
          {/* The violet oval, small and high on the chest */}
          <ellipse cx={CX} cy="306" rx="40" ry="13" fill="none" stroke={VIOLET} strokeWidth="1.8" />
          <SvgWordmark x={CX} y={310} size={9} tracking={2} fill={VIOLET} />
          {/* Hem */}
          <path d="M140 458 H280" stroke={CAT_TEE_EDGE} strokeWidth="1" opacity="0.5" />
        </g>
      </g>

      {/* WASHED HOODIE — hood bunched behind the neck, never over the face */}
      <g data-layer="hoodie" opacity="0">
        <g clipPath="url(#clip-hoodie)">
          <path
            d="M156 216 Q160 178 176 172 L244 172 Q260 178 264 216 Z"
            fill="#3D3933"
            stroke="url(#chrome)"
            strokeWidth="1.4"
          />
          <g data-garment-arm="l"><path d={garmentSleeve(HOODIE, -1)} fill={TAR_CLOTH} stroke="url(#chrome)" strokeWidth="1.5" /></g>
          <g data-garment-arm="r"><path d={garmentSleeve(HOODIE, 1)} fill={TAR_CLOTH} stroke="url(#chrome)" strokeWidth="1.5" /></g>
          <path d={HOODIE_PATH} fill={TAR_CLOTH} stroke="url(#chrome)" strokeWidth="1.5" />
          {/* Broken overdye across the shoulders */}
          <path d="M126 230 L294 230 L288 288 C244 276 178 284 132 294 Z" fill="url(#dot)" opacity="0.35" />
          {/* Kangaroo pocket + drawcords */}
          <path d="M162 384 L258 384 L264 458 L156 458 Z" fill="none" stroke="url(#chrome)" strokeWidth="1.5" opacity="0.85" />
          <path d="M197 216 L193 292 M223 216 L227 292" stroke="url(#chrome)" strokeWidth="2.2" />
          {/* Ribbed hem + cuffs */}
          <rect x="126" y="492" width="168" height="22" fill={SOOT} stroke="url(#chrome)" strokeWidth="1" opacity="0.9" />
          <rect x="132" y="538" width="46" height="22" fill={SOOT} stroke="url(#chrome)" strokeWidth="1" opacity="0.9" />
          <rect x="242" y="538" width="46" height="22" fill={SOOT} stroke="url(#chrome)" strokeWidth="1" opacity="0.9" />
        </g>
      </g>

      {/* ARMOR JACKET — cropped zip bomber, worn closed. Vertical cording runs
          the full body and both sleeves, which is the garment's whole character;
          the neon oval is the only colour anywhere in the drop. */}
      <g data-layer="jacket" opacity="0">
        <g clipPath="url(#clip-jacket)">
          <g data-garment-arm="l"><path d={garmentSleeve(JACKET, -1)} fill={ARMOR} stroke={OUTLINE} strokeWidth="1.6" /></g>
          <g data-garment-arm="r"><path d={garmentSleeve(JACKET, 1)} fill={ARMOR} stroke={OUTLINE} strokeWidth="1.6" /></g>
          <path d={JACKET_PATH} fill={ARMOR} stroke={OUTLINE} strokeWidth="1.6" />

          {/* Vertical cording. Generated rather than hand-listed so the spacing
              stays even across body and sleeves at any width. */}
          <g stroke={ARMOR_CORD} strokeWidth="1.5" opacity="0.85" clipPath="url(#armor-shape)">
            {Array.from({ length: 21 }, (_, i) => {
              const x = 112 + i * 9.7;
              return <path key={i} d={`M${x},190 L${x},570`} />;
            })}
          </g>

          {/* Armhole seams — where the sleeve is set into the body */}
          <path d="M104 212 Q114 262 122 312" fill="none" stroke={OUTLINE} strokeWidth="1.7" opacity="0.9" />
          <path d="M316 212 Q306 262 298 312" fill="none" stroke={OUTLINE} strokeWidth="1.7" opacity="0.9" />

          {/* Stand collar — the funnel neck, ribbed */}
          <path
            d="M176 202 Q210 190 244 202 L246 168 Q210 156 174 168 Z"
            fill={ARMOR}
            stroke={OUTLINE}
            strokeWidth="1.5"
          />
          <path d="M176 178 Q210 168 244 178 M177 190 Q210 180 243 190" stroke={ARMOR_CORD} strokeWidth="1.2" fill="none" opacity="0.8" />

          {/* Centre zip, running from the collar to the hem */}
          <path d={`M${CX},166 L${CX},496`} stroke={OUTLINE} strokeWidth="3.4" />
          <path d={`M${CX},166 L${CX},496`} stroke="url(#chrome-v)" strokeWidth="1.6" opacity="0.7" />
          <rect x={CX - 3.5} y="196" width="7" height="13" rx="1.5" fill="url(#chrome)" stroke={OUTLINE} strokeWidth="0.6" />

          {/* Slanted hand pockets set into the seam */}
          <path d="M132 356 L166 400" stroke={OUTLINE} strokeWidth="1.6" opacity="0.85" />
          <path d="M288 356 L254 400" stroke={OUTLINE} strokeWidth="1.6" opacity="0.85" />

          {/* Ribbed hem and cuffs */}
          <rect x="120" y="474" width="180" height="26" fill={ARMOR_RIB} stroke={OUTLINE} strokeWidth="1.3" />
          <path d="M126 481 h168 M126 490 h168" stroke={ARMOR_CORD} strokeWidth="1" opacity="0.7" />
          <rect x="108" y="526" width="32" height="26" fill={ARMOR_RIB} stroke={OUTLINE} strokeWidth="1.3" />
          <rect x="280" y="526" width="32" height="26" fill={ARMOR_RIB} stroke={OUTLINE} strokeWidth="1.3" />

          {/* The neon oval, stitched on the left chest */}
          <ellipse cx="246" cy="288" rx="26" ry="9" fill={OUTLINE} stroke={NEON} strokeWidth="1.6" />
          <SvgWordmark x={246} y={291} size={6.5} tracking={1.1} fill={NEON} />
        </g>
      </g>

      {/* WE HAVE A STORY CAP — washed six-panel, long pre-curved brim.
          The crown is drawn to the skull's own curve (cx 210, ry 58 at cy 112)
          so it sits ON the head rather than floating above it, and the brim
          throws a shadow onto the brow, which is what makes it read as worn. */}
      <g data-layer="cap" opacity="0">
        <g clipPath="url(#clip-cap)">
          {/* Crown — follows the skull (cx 210, top y 54), seated on it */}
          <path
            d="M163 84 C163 50 183 36 210 36 C237 36 257 50 257 84 Z"
            fill={CAP_CLOTH}
            stroke={OUTLINE}
            strokeWidth="1.3"
          />
          {/* Panel seams + eyelets */}
          <path d="M210 37 L210 84" stroke={OUTLINE} strokeWidth="0.9" opacity="0.38" />
          <path d="M188 41 C181 56 178 71 178 84" stroke={OUTLINE} strokeWidth="0.8" opacity="0.28" />
          <path d="M232 41 C239 56 242 71 242 84" stroke={OUTLINE} strokeWidth="0.8" opacity="0.28" />
          <circle cx="194" cy="64" r="1.5" fill={OUTLINE} opacity="0.4" />
          <circle cx="226" cy="64" r="1.5" fill={OUTLINE} opacity="0.4" />
          <circle cx="210" cy="35" r="3" fill={CAP_CLOTH} stroke={OUTLINE} strokeWidth="0.9" />

          {/* The embroidery, tonal on the front panel */}
          <text
            x="210"
            y="62"
            textAnchor="middle"
            fill={OUTLINE}
            fontFamily="var(--font-body), Helvetica Neue, Arial, sans-serif"
            fontSize="7.5"
            fontWeight="500"
            opacity="0.92"
          >
            we have
          </text>
          <text
            x="210"
            y="72"
            textAnchor="middle"
            fill={OUTLINE}
            fontFamily="var(--font-body), Helvetica Neue, Arial, sans-serif"
            fontSize="7.5"
            fontWeight="500"
            opacity="0.92"
          >
            a story
          </text>

          {/* Brim. Worn straight on, so it projects TOWARD the viewer and reads
              foreshortened: a wide shallow arc spanning the crown, not a shape
              off to one side. Drawn after the crown so it overlaps the brow. */}
          <path
            d="M160 83 C175 79 245 79 260 83 C266 94 242 104 210 104 C178 104 154 94 160 83 Z"
            fill={CAP_BRIM}
            stroke={OUTLINE}
            strokeWidth="1.2"
          />
          {/* Topstitch rows following the curve */}
          <path d="M167 88 C182 97 238 97 253 88" stroke={OUTLINE} strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M173 93 C186 100 234 100 247 93" stroke={OUTLINE} strokeWidth="0.8" fill="none" opacity="0.3" />
          {/* Front edge catching light */}
          <path d="M160 83 C175 79 245 79 260 83" stroke={CAP_CLOTH} strokeWidth="1.1" fill="none" opacity="0.6" />
        </g>
      </g>

      {/* NULL SCARF — sits low around the neck, clear of the face */}
      <g data-layer="scarf" opacity="0">
        <g clipPath="url(#clip-scarf)">
          <path
            d="M180 182 Q210 202 240 182 Q252 196 246 212 Q210 226 174 212 Q168 196 180 182 Z"
            fill={BONE}
            stroke="url(#chrome)"
            strokeWidth="1"
          />
          {/* One short tail, thrown to the side — never a column down the centre */}
          <path d="M238 210 L256 306 L232 310 L222 212 Z" fill={BONE} stroke={OUTLINE} strokeWidth="1" opacity="0.95" />
          <path d="M232 310 L256 306 L259 326 L235 330 Z" fill="url(#dot)" opacity="0.5" />
        </g>
      </g>

      {/* SOFT ARMOR BAG — animated separately (flies into the hand, then worn) */}
      <g data-layer="bag" opacity="0">
        <path d="M160 224 L268 424" stroke={FIG} strokeWidth="14" />
        <path d="M160 224 L268 424" stroke="url(#chrome)" strokeWidth="10" />
        <rect x="238" y="400" width="86" height="62" rx="5" fill={FIG} stroke="url(#chrome)" strokeWidth="1.8" />
        <rect x="238" y="400" width="86" height="62" rx="5" fill="url(#dot)" opacity="0.25" />
        <path d="M238 420 H324 M238 442 H324 M266 400 V462 M296 400 V462" stroke="url(#chrome)" strokeWidth="0.8" opacity="0.5" />
        <rect x="250" y="410" width="22" height="8" fill="url(#chrome)" />
      </g>
    </svg>
  );
}
