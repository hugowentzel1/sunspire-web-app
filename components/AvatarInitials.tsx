import * as React from "react";

// Modern B2B SaaS avatar with unique colors per person
// Based on industry standards from Google, Dropbox, Slack
export default function AvatarInitials({
  name,
  size = 40,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = React.useMemo(() => {
    if (!name?.trim()) return "??";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }, [name]);

  // Professional B2B color palette - unique per person
  // Colors chosen for trust, credibility, and differentiation
  const colorMap: Record<string, { bg: string; text: string }> = React.useMemo(() => ({
    // Brian Martin - Professional blue (trust, authority)
    "BM": { bg: "bg-blue-100", text: "text-blue-700" },
    // Dalyn Helms - Warm teal (approachable, modern)
    "DH": { bg: "bg-teal-100", text: "text-teal-700" },
    // Lensa Yohan - Sophisticated purple (creative, premium)
    "LY": { bg: "bg-purple-100", text: "text-purple-700" },
    // Noah Jones - Fresh green (growth, success)
    "NJ": { bg: "bg-emerald-100", text: "text-emerald-700" },
  }), []);

  const colors = colorMap[initials] || { bg: "bg-slate-100", text: "text-slate-700" };

  const style: React.CSSProperties = { 
    width: size, 
    height: size,
    fontSize: Math.round(size * 0.42), // Optimized for readability
    lineHeight: 1
  };
  
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full ${colors.bg} ${colors.text} font-semibold shadow-sm ${className}`}
      style={style}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
}
