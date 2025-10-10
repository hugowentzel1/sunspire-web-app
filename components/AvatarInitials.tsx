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

  // OPTION 5: Double Ring System - concentric rings with layered opacity (luxury watch aesthetic)
  const skin = `bg-white text-gray-800`;
  
  // Three concentric rings using box-shadow (white → brand middle → brand outer)
  const shadowStyle = {
    boxShadow: `
      0 0 0 2px white,
      0 0 0 4px color-mix(in srgb, var(--brand-primary, #e11d48) 15%, transparent),
      0 0 0 6px color-mix(in srgb, var(--brand-primary, #e11d48) 8%, transparent),
      0 4px 12px rgba(0, 0, 0, 0.1)
    `,
  };

  const style: React.CSSProperties = { 
    width: size, 
    height: size,
    fontSize: Math.round(size * 0.42), // 42% for optimal readability
    lineHeight: `${size}px`, // Match container height for perfect vertical centering
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle // Apply 3D depth shadow
  };
  
  return (
    <div
      className={`rounded-full font-semibold tracking-tight ${skin} ${className}`}
      style={style}
      aria-label={`Avatar for ${name}`}
      data-testid="avatar-initials"
    >
      {initials}
    </div>
  );
}
