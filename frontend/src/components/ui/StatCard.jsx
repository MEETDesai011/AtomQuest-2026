import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ACCENT_MAP = {
  indigo:  { iconBg: 'bg-indigo-500/15', iconColor: 'text-indigo-400', border: 'border-indigo-500/20', glow: 'rgba(99,102,241,0.15)', bar: 'from-indigo-500 to-violet-500', pill: 'bg-indigo-500/10 text-indigo-400', orb: 'rgba(99,102,241,0.06)' },
  cyan:    { iconBg: 'bg-cyan-500/15',   iconColor: 'text-cyan-400',   border: 'border-cyan-500/20',   glow: 'rgba(34,211,238,0.12)',  bar: 'from-cyan-500 to-blue-500',    pill: 'bg-cyan-500/10 text-cyan-400',    orb: 'rgba(34,211,238,0.05)' },
  emerald: { iconBg: 'bg-emerald-500/15',iconColor: 'text-emerald-400',border: 'border-emerald-500/20',glow: 'rgba(52,211,153,0.12)',  bar: 'from-emerald-500 to-cyan-500', pill: 'bg-emerald-500/10 text-emerald-400', orb: 'rgba(52,211,153,0.05)' },
  violet:  { iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', border: 'border-violet-500/20', glow: 'rgba(139,92,246,0.15)', bar: 'from-violet-500 to-purple-500', pill: 'bg-violet-500/10 text-violet-400',  orb: 'rgba(139,92,246,0.06)' },
  rose:    { iconBg: 'bg-rose-500/15',   iconColor: 'text-rose-400',   border: 'border-rose-500/20',   glow: 'rgba(251,113,133,0.12)', bar: 'from-rose-500 to-orange-500',  pill: 'bg-rose-500/10 text-rose-400',    orb: 'rgba(251,113,133,0.05)' },
  amber:   { iconBg: 'bg-amber-500/15',  iconColor: 'text-amber-400',  border: 'border-amber-500/20',  glow: 'rgba(251,191,36,0.12)',  bar: 'from-amber-500 to-orange-500', pill: 'bg-amber-500/10 text-amber-400',  orb: 'rgba(251,191,36,0.05)' },
};

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const numVal = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const suffix = String(value).replace(/[0-9.]/g, '');
  const rafRef = useRef(null);

  useEffect(() => {
    const start = 0;
    const end = numVal;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [numVal]);

  if (isNaN(numVal) || value === '—') return <span className="text-slate-600">—</span>;
  return <>{display}{suffix}</>;
}

export const StatCard = ({ label, value, sub, icon: Icon, accent = 'indigo', trend, progress, delay = 0 }) => {
  const a = ACCENT_MAP[accent] || ACCENT_MAP.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl p-6 cursor-default border ${a.border} transition-all duration-300`}
      style={{
        background: 'rgba(12,18,32,0.85)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Hover glow overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${a.orb} 0%, transparent 70%)` }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        {Icon && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`${a.iconBg} ${a.iconColor} p-2.5 rounded-xl`}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        )}
      </div>

      {/* Value */}
      <div className="mb-3 relative z-10">
        <span className={`text-3xl font-bold tracking-tight ${a.iconColor}`}>
          <AnimatedNumber value={value} />
        </span>
      </div>

      {/* Sub + trend row */}
      <div className="flex items-center justify-between relative z-10">
        {sub && <span className="text-xs text-slate-600 leading-snug">{sub}</span>}
        {trend !== undefined && trend !== null && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend > 0 ? 'bg-emerald-500/10 text-emerald-400' :
              trend < 0 ? 'bg-rose-500/10 text-rose-400' :
              'bg-slate-500/10 text-slate-500'
            }`}
          >
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </motion.span>
        )}
      </div>

      {/* Progress bar */}
      {typeof progress === 'number' && (
        <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden relative z-10">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${a.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      )}

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px opacity-40 rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${a.glow.replace('0.15', '0.6')}, transparent)` }}
      />
    </motion.div>
  );
};
