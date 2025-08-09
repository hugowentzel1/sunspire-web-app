'use client';

export default function TrustBar() {
  const items = [
    { label: 'Trusted by 50+ Solar Companies', icon: '🏢' },
    { label: 'Bank-Level Security', icon: '🔒' },
    { label: 'SOC 2 Compliant', icon: '✅' },
  ];
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
      {items.map((it) => (
        <div key={it.label} className="badge">
          <span className="text-xl" aria-hidden>{it.icon}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}
