import { ReactNode } from 'react';
import { FadeIn } from './motion';

interface StickyCTAProps {
  summary: ReactNode;
  ctaText: string;
  onCtaClick: () => void;
  className?: string;
}

export function StickyCTA({ summary, ctaText, onCtaClick, className }: StickyCTAProps) {
  return (
    <FadeIn>
      <div className={`
        fixed bottom-0 left-0 right-0 z-50 
        bg-white/95 backdrop-blur-xl border-t border-[var(--border)] 
        shadow-[0_-12px_60px_rgba(15,23,42,.07)]
        ${className}
      `}>
        <div className="container-premium py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-premium">
              {summary}
            </div>
            <button
              onClick={onCtaClick}
              className="btn-primary"
            >
              {ctaText}
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
