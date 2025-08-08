'use client';

import { motion } from 'framer-motion';

interface PremiumKPICardsProps {
  estimate: any;
}

export default function PremiumKPICards({ estimate }: PremiumKPICardsProps) {
  const kpis = [
    {
      label: "System Size",
      value: `${estimate.systemSizeKW} kW`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-secondary to-accent"
    },
    {
      label: "Annual Production",
      value: `${estimate.annualProductionKWh.toLocaleString()} kWh`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-blue to-purple"
    },
    {
      label: "Net Cost (After ITC)",
      value: `$${estimate.netCostAfterITC.toLocaleString()}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: "from-accent to-green-500"
    },
    {
      label: "Year 1 Savings",
      value: `$${estimate.year1Savings.toLocaleString()}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {kpis.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="stat-premium group hover:scale-105 transition-transform duration-300"
        >
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">
              {kpi.icon}
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <div className="stat-value mb-2">
              {kpi.value}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {kpi.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}


