export const SkeletonRow = ({ cols = 5 }) => (
  <div className="flex items-center gap-5 px-5 py-4 border-b border-white/4 last:border-0">
    {Array(cols).fill(0).map((_, i) => (
      <div
        key={i}
        className="flex-1 h-3.5 rounded-lg bg-white/5 shimmer"
        style={{ animationDelay: `${i * 80}ms` }}
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className="card p-6 animate-pulse">
    <div className="flex items-start justify-between mb-5">
      <div className="h-3 w-24 bg-white/5 rounded-lg shimmer" />
      <div className="w-8 h-8 bg-white/5 rounded-xl shimmer" />
    </div>
    <div className="h-9 w-20 bg-white/5 rounded-xl mb-3 shimmer" />
    <div className="h-2.5 w-16 bg-white/5 rounded shimmer" />
    <div className="mt-5 h-1 bg-white/5 rounded-full shimmer" />
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2.5 ${className}`}>
    {Array(lines).fill(0).map((_, i) => (
      <div
        key={i}
        className="h-3 bg-white/5 rounded shimmer"
        style={{ width: `${100 - i * 15}%`, animationDelay: `${i * 100}ms` }}
      />
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="card p-6">
    <div className="h-4 w-32 bg-white/5 rounded shimmer mb-6" />
    <div className="flex items-end gap-3 h-40">
      {[65, 80, 45, 90, 55, 70, 85, 40, 75, 95].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-white/5 rounded-t-lg shimmer"
          style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  </div>
);
