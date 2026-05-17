import { AnimatedCounter } from './AnimatedCounter';

const ACCENT_MAP = {
  indigo:  {
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
    border: 'border-indigo-500/15',
    glow: 'hover:shadow-indigo',
    bar: 'from-indigo-500 to-violet-500',
    pill: 'bg-indigo-500/10 text-indigo-400',
  },
  cyan: {
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    border: 'border-cyan-500/15',
    glow: 'hover:shadow-cyan',
    bar: 'from-cyan-500 to-blue-500',
    pill: 'bg-cyan-500/10 text-cyan-400',
  },
  emerald: {
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/15',
    glow: 'hover:shadow-emerald',
    bar: 'from-emerald-500 to-cyan-500',
    pill: 'bg-emerald-500/10 text-emerald-400',
  },
  violet: {
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    border: 'border-violet-500/15',
    glow: 'hover:shadow-violet',
    bar: 'from-violet-500 to-purple-500',
    pill: 'bg-violet-500/10 text-violet-400',
  },
  rose: {
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    border: 'border-rose-500/15',
    glow: 'hover:shadow-rose',
    bar: 'from-rose-500 to-orange-500',
    pill: 'bg-rose-500/10 text-rose-400',
  },
  amber: {
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    border: 'border-amber-500/15',
    glow: 'hover:shadow-amber',
    bar: 'from-amber-500 to-orange-500',
    pill: 'bg-amber-500/10 text-amber-400',
  },
};

export const StatCard = ({ label, value, sub, icon: Icon, accent = 'indigo', trend, progress }) => {
  const a = ACCENT_MAP[accent] || ACCENT_MAP.indigo;

  return (
    <div className={`
      card relative overflow-hidden p-6
      ${a.glow} hover:border-opacity-50
      transition-all duration-300 cursor-default
      animate-fade-up
    `}
      style={{ borderColor: 'rgba(99,102,241,0.12)' }}
    >
      {/* Background accent gradient */}
      <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${a.bar} opacity-[0.03]`} />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
        {Icon && (
          <div className={`${a.iconBg} ${a.iconColor} p-2 rounded-xl`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span className={`text-3xl font-bold tracking-tight ${a.iconColor}`}>
          {value === '—' || value === undefined ? (
            <span className="text-slate-600">—</span>
          ) : (
            <AnimatedCounter value={value} />
          )}
        </span>
      </div>

      {/* Sub / trend */}
      <div className="flex items-center justify-between mt-2">
        {sub && <span className="text-xs text-slate-600">{sub}</span>}
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend > 0 ? 'bg-emerald-500/10 text-emerald-400' :
            trend < 0 ? 'bg-rose-500/10 text-rose-400' :
            'bg-slate-500/10 text-slate-500'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      {/* Optional progress bar */}
      {typeof progress === 'number' && (
        <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${a.bar} animate-progress-fill`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
