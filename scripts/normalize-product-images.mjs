import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = path.join(root, "public/products");
const outputDir = path.join(sourceDir, "catalog");

// Only approved, single-subject images belong in the storefront. Originals are
// left untouched; these derivatives provide one consistent transparent canvas.
const files = [
  "pure-rib-tank-1.png", "pure-rib-tank-2.png", "pure-rib-tank-3.png", "pure-rib-tank-4.png", "pure-rib-tank-5.png", "pure-rib-tank-6.png",
  "pale-signal-shorts-1.png", "pale-signal-shorts-2.png", "pale-signal-shorts-3.png", "pale-signal-shorts-4.png", "pale-signal-shorts-5.png", "pale-signal-shorts-6.png", "pale-signal-shorts-7.png",
  "rib-tank-front.png", "rib-tank-back.png", "tank-2-body.png", "tank-3-back.png",
  "black-tank-1.png", "black-tank-2.png", "black-tank-3.png", "black-tank-4.png", "black-tank-5.png", "black-tank-6.png",
  "ls-1-front.png", "ls-3-body.png", "ls-5-body.png", "ls-6-detail.png",
  "sugar-static-1.png", "sugar-static-2.png", "sugar-static-3.png", "sugar-static-4.png", "sugar-static-5.png", "sugar-static-6.png", "sugar-static-7.png", "sugar-static-8.png", "sugar-static-9.png",
  "cat-1-front.png", "cat-2-back.png", "cat-3-body.png", "cat-4-chest.png", "cat-5-photo.png",
  "story-flag-tee-front.png", "story-flag-tee-back.png", "story-flag-tee-2.png", "story-flag-tee-3.png",
  "cap-1-front.png", "cap-4-side.png", "cap-2-oval.png", "cap-3-closure.png",
  "story-boxers-1.png", "story-boxers-2.png", "story-boxers-3.png", "story-boxers-4.png", "story-boxers-5.png", "story-boxers-6.png",
  "story-ashtray-1.png", "story-ashtray-2.png",
  "armor-1-front.png", "armor-2-back.png", "armor-3-body.png", "armor-4-collar.png", "armor-5-body.png", "armor-6-patch.png",
];

await fs.mkdir(outputDir, { recursive: true });

for (const file of files) {
  const input = path.join(sourceDir, file);
  let image = sharp(input, { failOn: "none" }).ensureAlpha();

  // Two supplied files were flattened onto white. Recover transparency from
  // near-white pixels while preserving the garment itself and its soft edges.
  if (file === "black-tank-1.png") {
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += info.channels) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const lightness = Math.min(r, g, b);
      if (lightness > 220) data[i + 3] = 0;
      else if (lightness > 190) data[i + 3] = Math.round(255 * (220 - lightness) / 30);
    }
    image = sharp(data, { raw: info });
  }

  const subject = await image
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
    .resize({ width: 1248, height: 1600, fit: "inside", withoutEnlargement: false, kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  const meta = await sharp(subject).metadata();

  await sharp({
    create: { width: 1600, height: 2000, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: subject, left: Math.round((1600 - meta.width) / 2), top: Math.round((2000 - meta.height) / 2) }])
    .webp({ quality: 92, alphaQuality: 100, smartSubsample: true, effort: 3 })
    .toFile(path.join(outputDir, file.replace(/\.png$/i, ".webp")));
}

console.log(`Normalized ${files.length} transparent catalog images.`);
