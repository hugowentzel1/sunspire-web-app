'use client';

import { ReactNode } from 'react';
import { FadeIn } from './motion';

interface SunsetHeroProps {
  title: string;
  highlight: string;
  subtitle: string;
  badges?: string[];
  children?: ReactNode;
}

export default function SunsetHero({ title, highlight, subtitle, badges = [], children }: SunsetHeroProps) {
  return (
    <section className="space-y-8">
      <FadeIn>
        <div className="mx-auto emblem" />
      </FadeIn>

      <FadeIn delay={0.05}>
        <h1 className="h1">
          {title} <span className="hl">{highlight}</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="p text-center max-w-2xl mx-auto">{subtitle}</p>
      </FadeIn>

      {badges.length > 0 && (
        <FadeIn delay={0.15}>
          <div className="flex flex-wrap justify-center gap-3">
            {badges.map((b, i) => (
              <span key={i} className="badge">
                {i === 0 && <span className="dot" />} {b}
              </span>
            ))}
          </div>
        </FadeIn>
      )}

      {children && <FadeIn delay={0.2}><div className="max-w-3xl mx-auto">{children}</div></FadeIn>}
    </section>
  );
}
