"use client";

import React from 'react';

interface AssumptionTrayProps {
  onOpenMethodology?: () => void;
}

export default function AssumptionTray({ onOpenMethodology }: AssumptionTrayProps) {
  const assumptions = [
    { label: 'ITC', value: '30%' },
    { label: 'Cost/W', value: '$3.50' },
    { label: 'O&M', value: '$25/yr' },
    { label: 'Degradation', value: '0.5%/yr' },
    { label: 'Rate increase', value: '3%/yr' },
    { label: 'Discount rate', value: '4%' },
    { label: 'Utility fees', value: '$12/mo' },
    { label: 'Export credits', value: '100%' },
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Key Assumptions</h3>
        {onOpenMethodology && (
          <button
            onClick={onOpenMethodology}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            View Methodology
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {assumptions.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg p-2.5 border border-gray-200">
            <div className="text-xs text-gray-500 mb-0.5">{label}</div>
            <div className="text-sm font-semibold text-gray-900">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
