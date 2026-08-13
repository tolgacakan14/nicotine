import type { ProductCategory } from "@/data/types";

/**
 * Flat monochrome garment silhouettes used inside the placeholder product
 * visuals. They keep the prototype legible without photography — once real
 * imagery exists, `ProductVisual` renders the photo and these disappear.
 */
const PATHS: Record<ProductCategory, string> = {
  "T-SHIRT":
    "M60 34 L88 22 C92 32 108 32 112 22 L140 34 L152 62 L132 72 L128 62 L128 158 L72 158 L72 62 L68 72 L48 62 Z",
  KNIT:
    "M58 40 L88 24 C92 36 108 36 112 24 L142 40 L156 96 L136 104 L130 76 L130 164 L70 164 L70 76 L64 104 L44 96 Z",
  OUTERWEAR:
    "M56 40 L86 22 L100 46 L114 22 L144 40 L156 104 L138 110 L134 82 L134 168 L66 168 L66 82 L62 110 L44 104 Z",
  BOTTOMS: "M68 26 H132 L138 174 H108 L100 92 L92 174 H62 Z",
  HEADWEAR: "M56 104 C56 58 74 40 100 40 C126 40 144 58 144 104 Z M56 104 L34 116 L36 126 L64 118 Z",
  BAGS: "M52 74 H148 L156 156 H44 Z M74 74 C74 44 86 34 100 34 C114 34 126 44 126 74",
  ACCESSORIES:
    "M62 46 C78 66 122 66 138 46 C150 62 146 82 128 88 L142 168 L112 172 L102 92 C86 92 66 84 62 68 Z",
};

export default function GarmentGlyph({
  category,
  className = "",
}: {
  category: ProductCategory;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden focusable="false">
      <path d={PATHS[category]} fill="currentColor" />
    </svg>
  );
}
