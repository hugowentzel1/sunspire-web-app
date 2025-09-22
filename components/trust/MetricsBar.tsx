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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto section-spacing" role="list">
        {items.map((item, index) => (
          <div key={index} className="feature-card p-5 text-center" data-testid="metric-item">
            <div className="title text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {item.value}
            </div>
            <div className="desc text-sm font-medium text-gray-600">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}