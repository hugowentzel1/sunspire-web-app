import { ReactNode } from 'react';
import { HoverLift } from './motion';

interface ChartFrameProps {
  children: ReactNode;
  paybackYear?: number | null;
  className?: string;
}

export function ChartFrame({ children, paybackYear, className }: ChartFrameProps) {
  return (
    <HoverLift className={className}>
      <div className="card p-8 relative">
        {/* Zero Line */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-8 right-8 top-1/2 border-t border-gray-200/50"></div>
        </div>
        
        {/* Payback Marker */}
        {paybackYear && (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-[var(--brand)] to-transparent"
              style={{ 
                left: `${8 + (paybackYear / 25) * (100 - 16)}%`,
                opacity: 0.6
              }}
            >
              <div className="absolute -top-2 -left-1 w-2 h-2 bg-[var(--brand)] rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-16 text-xs text-[var(--brand)] font-medium text-center">
                Payback
              </div>
            </div>
          </div>
        )}
        
        {/* Chart Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </HoverLift>
  );
}
