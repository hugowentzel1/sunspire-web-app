'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "PVWatts® Powered",
    description: "Industry-standard solar calculations using NREL's PVWatts® v8 algorithm for maximum accuracy.",
    stat: "99.9%",
    statLabel: "Accuracy Rate"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Bank-Level Security",
    description: "Enterprise-grade security with end-to-end encryption and SOC 2 compliance.",
    stat: "256-bit",
    statLabel: "Encryption"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
    ),
    title: "White-Label Ready",
    description: "Fully customizable with your branding, colors, and domain. Ready in 24 hours.",
    stat: "24h",
    statLabel: "Setup Time"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Results",
    description: "Get comprehensive solar reports in seconds, not hours. Real-time calculations.",
    stat: "<3s",
    statLabel: "Response Time"
  }
];

export default function PremiumFeatures() {
  return (
    <section id="features" className="py-20 bg-premium-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Enterprise-Grade Solar Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for solar companies that demand the highest quality estimates and the most professional presentation.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="stat-premium group hover:scale-105 transition-transform duration-300"
            >
              {/* Icon */}
              <div className="icon-premium group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Stat */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="stat-value">
                    {feature.stat}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {feature.statLabel}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="card-premium p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Solar Business?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Join 500+ solar companies using our platform to close more deals and increase revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-premium">
                Get Your White-Label Demo
              </button>
              <button className="btn-outline-premium">
                Schedule a Call
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


