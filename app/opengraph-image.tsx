import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #F7FAFF 0%, #EEF4FF 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Background gradient disc */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '900',
              color: '#111827',
              margin: '0 0 20px 0',
              lineHeight: 1.1,
            }}
          >
            Instant Solar Intelligence
          </h1>
          
          <p
            style={{
              fontSize: '28px',
              color: '#667085',
              margin: '0 0 40px 0',
              maxWidth: '800px',
            }}
          >
            PVWatts-powered, brandable in 24 hours
          </p>
          
          {/* Sunspire wordmark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 24px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              border: '1px solid rgba(230, 233, 240, 0.8)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #111827 0%, #4F46E5 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              S
            </div>
            <span
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#111827',
              }}
            >
              Sunspire
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
