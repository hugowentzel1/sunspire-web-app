export function BlurGate({
  children,
  blur = 8,
  footer
}: { 
  children: React.ReactNode; 
  blur?: number; 
  footer?: React.ReactNode 
}) {
  return (
    <div className="relative rounded-2xl ring-1 ring-black/5 bg-white/60 overflow-hidden">
      <div 
        className="pointer-events-none absolute inset-0 backdrop-blur-sm bg-white/40"
        style={{ backdropFilter: `blur(${blur}px)` }}
      />
      <div className="relative">{children}</div>
      {footer && (
        <div className="absolute left-4 bottom-4 z-10">
          {footer}
        </div>
      )}
    </div>
  );
}
