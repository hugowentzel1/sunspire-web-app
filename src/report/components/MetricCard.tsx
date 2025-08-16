"use client";
import React from "react";
import { motion } from "framer-motion";
import LockedOverlay from "@/components/LockedOverlay";
import { teaseCurrency } from "@/src/demo/redaction";
import { IconBadge } from "@/components/ui/IconBadge";

interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  icon: string;
  blur?: boolean;
  hint?: string;
  blurId?: string;
}

export default function MetricCard({ 
  label, 
  value, 
  unit = "", 
  icon, 
  blur = false, 
  hint,
  blurId 
}: MetricCardProps) {
  const displayValue = blur ? teaseCurrency(value) : `${value.toLocaleString()}${unit}`;
  
  const cardContent = (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-center mb-4">
        <IconBadge>{icon}</IconBadge>
      </div>
      <div className="text-3xl font-black text-gray-900 mb-2">{displayValue}</div>
      <div className="text-gray-600 font-semibold">{label}</div>
      {hint && (
        <div className="text-sm text-gray-500 mt-2">{hint}</div>
      )}
    </div>
  );

  if (blur) {
    return (
      <div className="relative locked-blur">
        {cardContent}
        <LockedOverlay onUnlock={() => document.dispatchEvent(new CustomEvent("openInstall"))} />
      </div>
    );
  }

  return cardContent;
}
