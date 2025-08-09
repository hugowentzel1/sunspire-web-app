'use client';

import { ReactNode } from 'react';
import { FadeIn, HoverLift } from './motion';

interface SunsetHeroProps {
  title: string;
  highlight: string;
  subtitle: string;
  badges?: string[];
  rightNote?: string;
  children?: ReactNode;
}

export default function SunsetHero({ title, highlight, subtitle, badges = [], rightNote, children }: SunsetHeroProps) {
  return (
    <section className="grid md:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <FadeIn>
          <div className="mx-auto md:mx-0 h-16 w-16 rounded-full"
               style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,122,61,.4), transparent), linear-gradient(140deg, var(--sun-1), var(--sun-2), var(--sun-3))' }} />
        </FadeIn>

        <FadeIn delay={0.05}>
          <h1 className="h1">
            {title} <span className="hl">{highlight}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="p">{subtitle}</p>
        </FadeIn>

        {badges.length > 0 && (
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap gap-2">
              {badges.map((b, i) => (
                <span key={i} className="badge">
                  {i === 0 && <span className="dot" />} {b}
                </span>
              ))}
            </div>
          </FadeIn>
        )}

        {children && <FadeIn delay={0.2}>{children}</FadeIn>}
      </div>

      <FadeIn delay={0.15}>
        <HoverLift>
          <div className="card p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center text-4xl"
                 style={{ background: 'linear-gradient(140deg, var(--sun-1), var(--sun-2), var(--sun-3))', color: '#fff' }}>
              ☀️
            </div>
            <div className="h2 mt-4">Instant Solar Analysis</div>
            <p className="p mt-2">{rightNote || 'AI-powered results in seconds, using trusted PVWatts® data.'}</p>
          </div>
        </HoverLift>
      </FadeIn>
    </section>
  );
}
