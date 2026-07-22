// One-off generator for favicon set + default OG image, built from the
// existing logo artwork. Re-run with `node scripts/generate-images.mjs`
// whenever the source lockups change.
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DEEP_FOREST = "#04342C";

const MARK_SOURCE = path.join(ROOT, "public/images/logo-vertical-dark-transparent.png");
// R/W monogram bounding box within the 1418x1898 vertical lockup (wordmark starts at y:1569, excluded).
const MARK_CROP = { left: 209, top: 0, width: 1201 - 209, height: 1211 };

const WORDMARK_SOURCE = path.join(ROOT, "public/images/logo-horizontal-dark.png");

async function squareIcon(size, marginPct = 0.08) {
  const mark = sharp(MARK_SOURCE).extract(MARK_CROP);
  const inner = Math.round(size * (1 - marginPct * 2));
  const markBuffer = await mark
    .resize({ width: inner, height: inner, fit: "inside" })
    .png()
    .toBuffer();
  const markMeta = await sharp(markBuffer).metadata();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: DEEP_FOREST,
    },
  })
    .composite([
      {
        input: markBuffer,
        left: Math.round((size - (markMeta.width ?? inner)) / 2),
        top: Math.round((size - (markMeta.height ?? inner)) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function ogImage() {
  const width = 1200;
  const height = 630;
  const wordmark = await sharp(WORDMARK_SOURCE)
    .resize({ width: 760, fit: "inside" })
    .png()
    .toBuffer();
  const wordmarkMeta = await sharp(wordmark).metadata();

  return sharp({
    create: { width, height, channels: 4, background: DEEP_FOREST },
  })
    .composite([
      {
        input: wordmark,
        left: Math.round((width - (wordmarkMeta.width ?? 760)) / 2),
        top: Math.round((height - (wordmarkMeta.height ?? 238)) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function main() {
  const [icon16, icon32, icon180, icon512] = await Promise.all([
    squareIcon(16),
    squareIcon(32),
    squareIcon(180),
    squareIcon(512),
  ]);

  await writeFile(path.join(ROOT, "src/app/icon.png"), icon32);
  await writeFile(path.join(ROOT, "src/app/apple-icon.png"), icon180);
  await writeFile(path.join(ROOT, "public/icon-512.png"), icon512);

  const ico = await pngToIco([icon16, icon32]);
  await writeFile(path.join(ROOT, "src/app/favicon.ico"), ico);

  await mkdir(path.join(ROOT, "public/images"), { recursive: true });
  const og = await ogImage();
  await writeFile(path.join(ROOT, "public/images/og-default.png"), og);

  console.log("Generated: src/app/icon.png, src/app/apple-icon.png, src/app/favicon.ico, public/icon-512.png, public/images/og-default.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
