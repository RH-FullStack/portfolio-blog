import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const alt = 'Rasmus Hansen — Software Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [geistSemiBold, geistRegular] = await Promise.all([
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf')),
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF9F6',
          fontFamily: 'Geist',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M16 5a11 11 0 1 1-7.8 3.2" fill="none" stroke="#1C1B18" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 11v10" fill="none" stroke="#C1440E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: 64, fontWeight: 600, color: '#1C1B18', marginTop: 32 }}>Rasmus Hansen</div>
        <div style={{ fontSize: 32, color: '#C1440E', marginTop: 12 }}>Software Developer</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Geist', data: geistSemiBold, weight: 600, style: 'normal' },
        { name: 'Geist', data: geistRegular, weight: 400, style: 'normal' },
      ],
    }
  );
}
