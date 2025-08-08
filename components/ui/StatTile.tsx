import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatTileProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatTile({ label, value, icon, className, trend }: StatTileProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white">
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend === "up" && "text-green-600 bg-green-50",
            trend === "down" && "text-red-600 bg-red-50",
            trend === "neutral" && "text-gray-600 bg-gray-50"
          )}>
            {trend === "up" && "↗"}
            {trend === "down" && "↘"}
            {trend === "neutral" && "→"}
          </div>
        )}
      </div>
      
      <div className="text-3xl font-bold text-[var(--accent-dark)] mb-1">
        {value}
      </div>
      
      <div className="text-sm text-gray-600 font-medium">
        {label}
      </div>
    </div>
  );
}
