"use client";
import React from "react";
import { motion } from "framer-motion";

interface EnvironmentalProps {
  co2OffsetPerYear: number;
  solarIrradiance: number;
  tilt: number;
  losses: number;
}

export default function Environmental({ 
  co2OffsetPerYear, 
  solarIrradiance, 
  tilt, 
  losses 
}: EnvironmentalProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.8, duration: 0.8 }} 
      className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Environmental Impact</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">CO₂ Offset/Year</span>
          <span className="font-bold text-gray-900">{co2OffsetPerYear.toLocaleString()} lbs</span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">Solar Irradiance</span>
          <span className="font-bold text-gray-900">{solarIrradiance} kWh/m²/day</span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">System Tilt</span>
          <span className="font-bold text-gray-900">{tilt}°</span>
        </div>
        <div className="flex justify-between items-center py-4">
          <span className="text-gray-600">System Losses</span>
          <span className="font-bold text-gray-900">{losses}%</span>
        </div>
      </div>
    </motion.div>
  );
}
