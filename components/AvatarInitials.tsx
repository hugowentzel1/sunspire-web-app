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

  // OPTION 4: Soft Neumorphism - embossed, tactile look with dual shadows (luxury product feel)
  const skin = `text-gray-800 relative`;
  
  // Dual shadow system: bottom-right shadow + top-left highlight
  const shadowStyle = {
    background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.08), -5px -5px 10px rgba(255, 255, 255, 0.9)',
    border: '1px solid color-mix(in srgb, var(--brand-primary, #e11d48) 15%, transparent)',
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
