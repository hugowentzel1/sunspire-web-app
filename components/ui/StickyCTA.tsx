'use client';

interface StickyCTAProps {
  text: string;
  cta: string;
  href: string;
}

export default function StickyCTA({ text, cta, href }: StickyCTAProps) {
  return (
    <div className="sticky bottom-0 z-40 bg-white/90 backdrop-blur border border-[var(--border)] rounded-2xl my-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        <div className="p">{text}</div>
        <a className="btn-sunset" href={href}>{cta}</a>
      </div>
    </div>
  );
}
