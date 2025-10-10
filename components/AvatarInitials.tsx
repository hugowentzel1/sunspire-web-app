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

  // OPTION 2: Gradient Border Ring - premium gradient replaces solid ring (Stripe/Notion style)
  const skin = `bg-white text-gray-800 relative`;
  
  // No shadow for clean gradient focus
  const shadowStyle = {};

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
      style={{
        ...style,
        padding: '2px', // Space for gradient border
      }}
      aria-label={`Avatar for ${name}`}
      data-testid="avatar-initials"
    >
      {/* Gradient border pseudo-element */}
      <div 
        className="absolute inset-0 rounded-full -z-10"
        style={{
          background: `linear-gradient(135deg, var(--brand-primary, #e11d48), color-mix(in srgb, var(--brand-primary, #e11d48) 50%, transparent))`,
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {/* Inner content */}
      <div 
        className="rounded-full bg-white w-full h-full flex items-center justify-center"
        style={{
          fontSize: Math.round(size * 0.42),
        }}
      >
        {initials}
      </div>
    </div>
  );
}
