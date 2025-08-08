import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegalModal({ isOpen, onClose }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[22px] max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-[0_20px_80px_rgba(15,23,42,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-premium">Legal Information</h2>
                <button
                  onClick={onClose}
                  className="text-muted-premium hover:text-premium"
                >
                  ✕
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === 'terms'
                      ? 'bg-[var(--brand)] text-white'
                      : 'text-muted-premium hover:text-premium'
                  }`}
                >
                  Terms of Use
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === 'privacy'
                      ? 'bg-[var(--brand)] text-white'
                      : 'text-muted-premium hover:text-premium'
                  }`}
                >
                  Privacy Policy
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'terms' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-premium mb-2">Disclaimer</h3>
                    <p className="text-sm text-muted-premium leading-relaxed">
                      Solar estimates provided are approximate and for informational purposes only. 
                      Actual system performance, costs, and savings may vary based on site-specific 
                      conditions, equipment selection, and market factors. These estimates do not 
                      constitute guarantees or warranties.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-premium mb-2">Data Use</h3>
                    <p className="text-sm text-muted-premium leading-relaxed">
                      Your address and contact information are used solely to generate solar estimates 
                      and connect you with qualified installers. Data is processed by NREL PVWatts® 
                      for solar calculations and Google Maps for location services.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-premium mb-2">Consent</h3>
                    <p className="text-sm text-muted-premium leading-relaxed">
                      By using this service, you consent to the collection and processing of your 
                      information as described in our Privacy Policy. You may withdraw consent at any time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-premium mb-2">Information We Collect</h3>
                    <p className="text-sm text-muted-premium leading-relaxed">
                      We collect address information for solar calculations, contact details for 
                      installer connections, and usage data to improve our service.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-premium mb-2">How We Use Your Data</h3>
                    <p className="text-sm text-muted-premium leading-relaxed">
                      Your information is used to generate solar estimates, connect you with 
                      qualified installers, and improve our service. We do not sell your personal data.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-premium mb-2">Data Sharing</h3>
                    <p className="text-sm text-muted-premium leading-relaxed">
                      We share your information only with qualified solar installers you choose 
                      to connect with, and as required by law.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
