import * as React from "react";

// Consistent, trust-building avatar with brand-colored ring
// Research: consistent styling increases trust; white center ensures WCAG AA contrast
export default function AvatarInitials({
  name,
  size = 40,
  variant = "duo",
  className = "",
}: {
  name: string;
  size?: number;
  variant?: "duo";
  className?: string;
}) {
  const initials = React.useMemo(() => {
    if (!name?.trim()) return "??";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }, [name]);

  // Duo style: white fill + brand ring + dark initials (consistent, accessible, trust-building)
  const brandRing = "ring-2 ring-[color:var(--brand-primary,#e11d48)]/25";
  const skin = `bg-white text-gray-800 ${brandRing} shadow-sm`;

  const style: React.CSSProperties = { 
    width: size, 
    height: size,
    fontSize: Math.round(size * 0.42), // 42% for optimal readability
    lineHeight: 1
  };
  
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold tracking-tight ${skin} ${className}`}
      style={style}
      aria-label={`Avatar for ${name}`}
      data-testid="avatar-initials"
    >
      {initials}
    </div>
  );
}
