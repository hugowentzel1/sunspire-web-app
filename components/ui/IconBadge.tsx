export function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="brand-gradient text-white rounded-2xl w-12 h-12 grid place-items-center shadow-[0_8px_30px_rgba(0,0,0,.08)]">
      {children}
    </div>
  );
}
