import { useState } from 'react';
import { PVWattsBadge } from './PVWattsBadge';
import { GoogleAttribution } from './GoogleAttribution';
import { LegalModal } from './LegalModal';

interface LegalFooterProps {
  showGoogleAttribution?: boolean;
}

export function LegalFooter({ showGoogleAttribution = false }: LegalFooterProps) {
  const [showLegalModal, setShowLegalModal] = useState(false);

  return (
    <>
      <footer className="border-t border-[var(--border)] bg-white/50 backdrop-blur-sm">
        <div className="container-premium py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <PVWattsBadge />
              {showGoogleAttribution && <GoogleAttribution />}
            </div>
            <button
              onClick={() => setShowLegalModal(true)}
              className="text-sm text-muted-premium hover:text-premium underline"
            >
              Terms & Privacy
            </button>
          </div>
        </div>
      </footer>

      <LegalModal 
        isOpen={showLegalModal} 
        onClose={() => setShowLegalModal(false)} 
      />
    </>
  );
}
