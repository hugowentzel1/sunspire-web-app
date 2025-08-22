"use client";

import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import LegalFooter from '@/components/legal/LegalFooter';

export default function StatusPage() {
  const b = useBrandTakeover();

  // Mock status data - in production this would come from an API
  const systemStatus = {
    overall: 'operational',
    services: [
      { name: 'Solar Calculator', status: 'operational', uptime: '99.9%' },
      { name: 'API Services', status: 'operational', uptime: '99.8%' },
      { name: 'Database', status: 'operational', uptime: '99.9%' },
      { name: 'Payment Processing', status: 'operational', uptime: '99.7%' }
    ],
    incidents: [
      {
        id: 1,
        title: 'Scheduled Maintenance - API Updates',
        status: 'resolved',
        date: '2024-01-15',
        description: 'API endpoints were updated with new solar calculation algorithms.'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'outage': return 'text-red-600 bg-red-100';
              case 'maintenance': return 'text-[var(--brand-primary)] bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '✅';
      case 'degraded': return '⚠️';
      case 'outage': return '❌';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <a 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">System Status</h1>
          <p className="text-xl text-gray-600">
            Real-time status of Sunspire services and infrastructure
          </p>
        </motion.div>

        {/* Overall Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Systems Operational</h2>
            <p className="text-gray-600">Last updated: {new Date().toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Service Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemStatus.services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)} {service.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Incidents */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Incidents</h2>
          <div className="space-y-4">
            {systemStatus.incidents.map((incident) => (
              <div key={incident.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(incident.status)}`}>
                    {getStatusIcon(incident.status)} {incident.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Date: {incident.date}</p>
                <p className="text-gray-700">{incident.description}</p>
              </div>
            ))}
          </div>
          
          {systemStatus.incidents.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-800">No recent incidents reported. All systems are running smoothly.</p>
            </div>
          )}
        </motion.div>

        {/* Performance Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
                              <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">99.9%</div>
              <p className="text-gray-600">Average Uptime</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">&lt;200ms</div>
              <p className="text-gray-600">Response Time</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <p className="text-gray-600">Monitoring</p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <LegalFooter brand={b.enabled ? b.brand : undefined} />
    </div>
  );
}
