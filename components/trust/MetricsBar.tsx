interface Metric {
  label: string;
  value: string;
}

interface MetricsBarProps {
  items: Metric[];
  className?: string;
}

export default function MetricsBar({ items, className = "" }: MetricsBarProps) {
  return (
    <div className={`py-12 bg-white border-t border-gray-200 ${className}`} data-testid="metrics-bar">
      <div className="max-w-5xl mx-auto section-spacing">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
            {items.map((item, index) => (
              <div key={index} className="text-center" data-testid="metric-item">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {item.value}
                </div>
                <div className="text-xs font-medium text-gray-600">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}