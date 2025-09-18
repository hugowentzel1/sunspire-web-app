type Company = {
  name: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
};
export default function FooterPaid({ company }: { company: Company }) {
  return (
    <footer
      className="mt-20 bg-white/60 ring-1 ring-black/5"
      role="contentinfo"
      data-e2e="paid-footer"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex items-start gap-3">
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="h-10 w-10 rounded-lg ring-1 ring-black/10"
            />
          )}
          <div>
            <div className="font-semibold text-slate-900">{company.name}</div>
            <div className="text-sm text-slate-600">Solar Intelligence</div>
          </div>
        </div>

        {/* Legal */}
        <nav
          aria-label="Legal"
          className="grid grid-cols-2 gap-3 text-sm text-slate-700"
        >
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="/accessibility" className="hover:underline">
            Accessibility
          </a>
          <a href="/cookies" className="hover:underline">
            Cookies
          </a>
        </nav>

        {/* Questions */}
        <div className="text-sm text-slate-700">
          <div className="font-medium text-slate-900 mb-1">Questions?</div>
          {company.email && (
            <div>
              <a href={`mailto:${company.email}`} className="hover:underline">
                Email {company.name}
              </a>
            </div>
          )}
          {company.phone && <div className="mt-1">{company.phone}</div>}
          <div className="mt-3 text-slate-500 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-sky-500"
              aria-hidden="true"
            />
            Powered by{" "}
            <a
              href="https://getsunspire.com"
              className="underline decoration-dotted"
            >
              Sunspire
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
