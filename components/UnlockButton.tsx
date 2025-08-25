import { Lock } from "lucide-react";

type Props = {
  label?: string;           // e.g., "Unlock Full Report" / "See exact cost"
  onClick?: () => void;
  className?: string;       // for positioning (absolute bottom-center on cards)
  ariaLabel?: string;
};

export default function UnlockButton({
  label = "Unlock Full Report",
  onClick,
  className = "",
  ariaLabel,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={[
        // layout - match c548b88 exactly
        "unlock-pill",
        "inline-flex items-center justify-center gap-2",
        "h-11 px-5 min-w-[220px] whitespace-nowrap rounded-full",
        // solid company color + depth - match c548b88 exactly
        "bg-[color:var(--brand)] text-white shadow-md",
        // interaction - match c548b88 exactly
        "transition-all duration-200",
        "hover:shadow-lg hover:brightness-110",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2",
        className,
      ].join(" ")}
    >
      <span role="img" aria-label="locked">🔒</span>
      <span className="font-semibold">{label}</span>
      <span aria-hidden>→</span>
    </button>
  );
}
