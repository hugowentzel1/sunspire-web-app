import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function PrimaryButton({ 
  children, 
  className, 
  size = "md", 
  disabled = false,
  ...props 
}: PrimaryButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold text-white",
        "bg-[var(--primary)] shadow-md hover:bg-[var(--primary-hover)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)]",
        "transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none",
        sizeClasses[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
