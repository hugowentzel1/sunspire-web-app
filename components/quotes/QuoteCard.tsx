type Props = {
  headline: string;           // metric/outcome, short
  support?: string;           // one human sentence
  name: string;               // e.g., "Operations Manager"
  roleAndLocation: string;    // e.g., "Texas solar installer"
  verified?: boolean;         // default true
  logoSrc?: string;           // optional mono logo (small)
  logoAlt?: string;
};

export default function QuoteCard({
  headline, support, name, roleAndLocation, verified = true, logoSrc, logoAlt
}: Props) {
  return (
    <figure data-testid="quote-card"
      className="h-full rounded-2xl border border-neutral-200 bg-white p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow">
      <blockquote className="sun-quote">
        <p className="text-[17px] md:text-[18px] leading-[1.55] font-semibold text-neutral-900">{headline}</p>
        {support ? <p className="mt-1.5 text-[15px] leading-[1.6] text-neutral-700">{support}</p> : null}
      </blockquote>

      <figcaption className="mt-3 flex items-center justify-between gap-3">
        <div data-testid="quote-attribution-row" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-neutral-700">
          <span className="font-medium">{name}</span>
          <span className="text-neutral-400">•</span>
          <span>{roleAndLocation}</span>
          {verified && (
            <>
              <span className="text-neutral-400">•</span>
              <span data-testid="verified-chip"
                className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[12px] font-medium text-emerald-700">
                <span aria-hidden>✓</span> Verified
              </span>
            </>
          )}
        </div>
        {logoSrc ? <img src={logoSrc} alt={logoAlt || ""} className="h-5 opacity-60" /> : null}
      </figcaption>
    </figure>
  );
}

