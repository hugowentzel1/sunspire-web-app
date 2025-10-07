type Props = {
  headline: string;            // concise metric/outcome
  support?: string;            // single sentence
  name: string;                // e.g., "Operations Manager"
  roleAndLocation: string;     // e.g., "Texas solar installer"
  verified?: boolean;          // default true
  logoSrc?: string;            // optional mono logo on right
  logoAlt?: string;
};

export default function QuoteCard({
  headline, support, name, roleAndLocation, verified = true, logoSrc, logoAlt,
}: Props) {
  return (
    <figure
      data-testid="quote-card"
      className="h-full flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow"
    >
      <blockquote className="sun-quote">
        <p className="text-left text-[17px] md:text-[18px] leading-[1.55] font-semibold text-neutral-900">
          {headline}
        </p>
        {support && (
          <p className="mt-2 text-left text-[15px] leading-[1.6] text-neutral-700">
            {support}
          </p>
        )}
      </blockquote>

      {/* keep captions aligned across all cards */}
      <figcaption className="mt-4 md:mt-5 flex items-center justify-between gap-3">
        <div
          data-testid="quote-attribution-row"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-neutral-700"
        >
          <span className="font-medium">{name}</span>
          <span className="sep-dot" aria-hidden />
          <span>{roleAndLocation}</span>

          {verified && (
            <>
              <span className="sep-dot" aria-hidden />
              {/* RESTORED older visual: soft green pill with green check */}
              <span
                data-testid="verified-chip"
                title="Verified installer quote"
                className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[12px] font-medium text-emerald-700"
              >
                <span className="text-emerald-600" aria-hidden>✓</span>
                Verified
              </span>
            </>
          )}
        </div>
        {logoSrc ? (
          <img src={logoSrc} alt={logoAlt || ""} className="h-5 opacity-60" />
        ) : null}
      </figcaption>
    </figure>
  );
}

