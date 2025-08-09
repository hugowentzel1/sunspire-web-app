import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        background: 'linear-gradient(180deg,#FFFFFF 0%, #FFF6F7 100%)', fontFamily: 'Inter'
      }}>
        <div style={{ width: 140, height: 140, borderRadius: 999, background: 'linear-gradient(140deg, #FF7A3D, #FF4D6D, #FF7CA8)' }} />
        <div style={{ fontSize: 64, fontWeight: 900, color: '#0F172A', marginTop: 24 }}>Solar Intelligence in Seconds</div>
        <div style={{ marginTop: 14, padding: '10px 16px', borderRadius: 999, fontWeight: 700, background: '#fff', color: '#667085', border: '1px solid #E6EAF2' }}>Brandable in 24h</div>
      </div>
    ),
    { ...size }
  );
}
