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
          <button type="button" className="unlock-pill" onClick={onUnlock}>
            {unlockLabel}
          </button>
        </>
      )}
    </div>
  );
}
