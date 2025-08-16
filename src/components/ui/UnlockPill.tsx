import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export default function UnlockPill({ label = "Unlock Full Report", className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={[
        // size + layout (keeps lock + text centered and on one line)
        "inline-flex items-center justify-center gap-2",
        "h-9 min-w-[180px] px-4 rounded-full",
        "whitespace-nowrap leading-none text-sm font-semibold",
        "text-white text-center",
        // color: SOLID brand
        "pill-brand no-blur",
        // subtle elevation + hover
        "shadow-[0_6px_22px_rgba(0,0,0,.12)] hover:brightness-95 active:brightness-90",
        "transition-[filter,opacity,transform]",
        className,
      ].join(" ")}
    >
      <span aria-hidden className="leading-none">🔒</span>
      <span className="leading-none">{label} <span aria-hidden>→</span></span>
    </button>
  );
}
