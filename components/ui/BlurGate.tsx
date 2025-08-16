'use client';
import React from 'react';

type Props = {
  locked?: boolean;
  onUnlock?: () => void;
  unlockLabel?: string;
  className?: string;
  children: React.ReactNode;
};

export default function BlurGate({
  locked,
  onUnlock,
  unlockLabel = 'Unlock Full Report →',
  className = '',
  children
}: Props) {
  return (
    <div className={`locked-container bg-white shadow-sm ${className}`}>
      {children}
      {locked && (
        <>
          <div className="blur-overlay" />
          <div className="unlock-button-container">
            <button type="button" className="unlock-pill" onClick={onUnlock}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="unlock-text">{unlockLabel}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
