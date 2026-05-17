export const ProgressBar = ({ score, label, color }) => {
  const safeScore = score ?? 0;
  
  const gradientClass = 
    color === 'indigo'  ? 'from-indigo-500 to-violet-500'   :
    color === 'cyan'    ? 'from-cyan-500 to-blue-500'        :
    color === 'emerald' ? 'from-emerald-500 to-cyan-500'     :
    color === 'rose'    ? 'from-rose-500 to-orange-500'      :
    color === 'amber'   ? 'from-amber-500 to-orange-500'     :
    safeScore >= 80 ? 'from-emerald-500 to-cyan-500'         :
    safeScore >= 50 ? 'from-amber-500 to-orange-500'         :
                     'from-rose-500 to-pink-500';

  return (
    <div className="w-full">
      {(label || score !== undefined) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-xs text-slate-500">{label}</span>}
          <span className={`text-xs font-bold ml-auto ${
            safeScore >= 80 ? 'text-emerald-400' :
            safeScore >= 50 ? 'text-amber-400' :
            'text-rose-400'
          }`}>
            {safeScore.toFixed(1)}%
          </span>
        </div>
      )}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradientClass} animate-progress-fill relative`}
          style={{ width: `${Math.min(safeScore, 100)}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
};
