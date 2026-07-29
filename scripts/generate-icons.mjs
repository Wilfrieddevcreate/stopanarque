import sharp from "sharp";
import { readFileSync } from "fs";

const svg = readFileSync("app/icon.svg");

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(`public/icons/${name}`);
  console.log(`Generated public/icons/${name}`);
}

// Generate favicon.ico (32x32 PNG, browsers accept PNG as ico)
await sharp(svg)
  .resize(32, 32)
  .png()
  .toFile("public/favicon.ico");
console.log("Generated public/favicon.ico");

// Generate OG image (1200x630)
const ogSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect y="0" width="1200" height="6" fill="#008751"/>
  <rect y="6" width="1200" height="6" fill="#FCD116"/>
  <rect y="12" width="1200" height="6" fill="#E8112D"/>
  <text x="600" y="280" text-anchor="middle" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="#1a1a2e">Stop<tspan fill="#E8112D">Arnaque</tspan></text>
  <text x="600" y="340" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" fill="#64748b">Plateforme béninoise de signalement d'arnaques</text>
  <text x="600" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#94a3b8">Signalez · Vérifiez · Protégez</text>
</svg>`;

await sharp(Buffer.from(ogSvg))
  .resize(1200, 630)
  .png()
  .toFile("public/og-image.png");
console.log("Generated public/og-image.png");
