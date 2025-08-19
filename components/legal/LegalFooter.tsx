'use client';

import { useState } from 'react';

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="card p-6 max-w-2xl w-full relative bg-white">
        <button className="absolute right-4 top-4 p-2 text-[var(--muted)]" onClick={onClose}>✕</button>
        <div className="h2 mb-3">{title}</div>
        <div className="p">{children}</div>
      </div>
    </div>
  );
}

export default function LegalFooter({ showPoweredBy = true, brand }: { showPoweredBy?: boolean; brand?: string }) {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <div className="space-x-2">
          <span>Estimates generated using NREL PVWatts® v8.</span>
          <span>•</span>
          <span>Mapping & location data © Google</span>
        </div>
        <div className="space-x-3">
          <button className="underline" onClick={() => setShowTerms(true)}>Terms</button>
          <button className="underline" onClick={() => setShowPrivacy(true)}>Privacy</button>
          <a className="underline" href="/methodology">Methodology</a>
          {showPoweredBy && (
            <>
              <span>•</span>
              <span>Powered by Your Company</span>
            </>
          )}
        </div>
      </div>

      {showTerms && (
        <Modal title="Terms of Use" onClose={() => setShowTerms(false)}>
          Your Terms of Use content goes here.
        </Modal>
      )}
      {showPrivacy && (
        <Modal title="Privacy Policy" onClose={() => setShowPrivacy(false)}>
          Your Privacy Policy content goes here.
        </Modal>
      )}
    </>
  );
}
