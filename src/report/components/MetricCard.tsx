"use client";
import React from "react";
import { motion } from "framer-motion";
import BlurMask from "@/src/demo/BlurMask";
import { teaseCurrency } from "@/src/demo/redaction";

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
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-2xl">{icon}</span>
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
      <BlurMask id={blurId} cta="Unlock Full Report">
        {cardContent}
      </BlurMask>
    );
  }

  return cardContent;
}
