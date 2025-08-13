export function redactNumber(n: number, precision = 0): string {
  if (!isFinite(n)) return "—";
  // Show a range, e.g., "$8.6k–$10.3k"
  const low = n * 0.9;
  const high = n * 1.1;
  const fmt = (x:number) => {
    const v = Math.round(x / 100) * 100; // round to hundreds
    return v.toLocaleString();
  };
  return `${fmt(low)}–${fmt(high)}`;
}

export function rangeCurrency(n: number) { 
  if (!isFinite(n)) return "—"; 
  const lo = Math.round((n * 0.9) / 100) * 100; 
  const hi = Math.round((n * 1.1) / 100) * 100; 
  return `$${lo.toLocaleString()}–$${hi.toLocaleString()}`; 
}

export function hideCurrency(s: string) {
  return s.replace(/\$[\d,]+(\.\d+)?/g, "$—,——");
}
