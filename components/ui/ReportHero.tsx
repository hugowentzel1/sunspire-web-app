'use client';

import { ReactNode } from 'react';
import { FadeIn, Rise } from './motion';

interface ReportHeroProps {
  title: string;
  subtitle: string;
  badges?: string[];
}

export default function ReportHero({ title, subtitle, badges = [] }: ReportHeroProps) {
  return (
    <div className="text-center space-y-8">
      <FadeIn>
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full blur-3xl opacity-60"></div>
          </div>
          <div className="relative">
            <div className="icon-chip mx-auto mb-6">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </FadeIn>

      <Rise delay={0.1}>
        <h1 className="text-4xl md:text-5xl font-black text-[var(--ink)] leading-tight">
          {title}
        </h1>
      </Rise>

      <Rise delay={0.2}>
        <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
          {subtitle}
        </p>
      </Rise>

      {badges.length > 0 && (
        <Rise delay={0.3}>
          <div className="flex flex-wrap justify-center gap-3">
            {badges.map((badge, index) => (
              <div key={index} className="chip">
                {badge}
              </div>
            ))}
          </div>
        </Rise>
      )}
    </div>
  );
}
