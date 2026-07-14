import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#FAF9F6" />
  <path d="M16 5a11 11 0 1 1-7.8 3.2" fill="none" stroke="#1C1B18" stroke-width="2.5" stroke-linecap="round" />
  <path d="M16 11v10" fill="none" stroke="#C1440E" stroke-width="2.5" stroke-linecap="round" />
</svg>`;
const svgBuf = Buffer.from(svg);

// apple-icon: 180×180 PNG (iOS home screen — no SVG support, Pitfall 6)
await sharp(svgBuf, { density: 512 }).resize(180, 180).png().toFile('src/app/apple-icon.png');

// favicon.ico: render 16/32/48 PNGs to a temp dir, then pack with png-to-ico
const sizes = [16, 32, 48];
const tmpFiles = [];
for (const s of sizes) {
  const f = join(tmpdir(), `favicon-${s}.png`);
  await sharp(svgBuf, { density: 512 }).resize(s, s).png().toFile(f);
  tmpFiles.push(f);
}
const ico = execFileSync('npx', ['--yes', 'png-to-ico', ...tmpFiles]);
await writeFile('src/app/favicon.ico', ico);

console.log('Generated src/app/apple-icon.png and src/app/favicon.ico');
