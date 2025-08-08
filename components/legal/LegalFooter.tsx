'use client';

import { useState } from 'react';
import PVWattsBadge from './PVWattsBadge';
import GoogleAttribution from './GoogleAttribution';
import LegalModal from './LegalModal';

interface LegalFooterProps {
  showGoogle?: boolean;
}

export default function LegalFooter({ showGoogle = false }: LegalFooterProps) {
  const [showLegalModal, setShowLegalModal] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
        <div className="flex items-center gap-6">
          <PVWattsBadge />
          {showGoogle && <GoogleAttribution />}
        </div>
        
        <button
          onClick={() => setShowLegalModal(true)}
          className="text-[var(--brand-2)] hover:underline"
        >
          Terms & Privacy
        </button>
      </div>
      
      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
      />
    </>
  );
}
