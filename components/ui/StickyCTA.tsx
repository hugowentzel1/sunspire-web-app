'use client';

interface StickyCTAProps {
  summary: string;
  buttonText: string;
  mailto?: string;
  calendlyHref?: string;
}

export default function StickyCTA({ summary, buttonText, mailto, calendlyHref }: StickyCTAProps) {
  return (
    <div className="sticky bottom-0 z-40 bg-white/90 backdrop-blur-xl border-t border-[var(--border)] py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-[var(--muted)] truncate max-w-xs sm:max-w-md">
          {summary}
        </div>
        
        <div className="flex items-center gap-3">
          {calendlyHref && (
            <a 
              href={calendlyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--brand-2)] hover:underline"
            >
              Book 15-min setup
            </a>
          )}
          
          {mailto ? (
            <a href={mailto} className="btn-primary">
              {buttonText}
            </a>
          ) : (
            <button className="btn-primary">
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
