import { motion, AnimatePresence } from 'framer-motion';

export const StatusBadge = ({ status }) => {
  const CONFIG = {
    DRAFT:       { cls: 'badge-draft',      label: 'Draft',       dot: 'bg-slate-400' },
    SUBMITTED:   { cls: 'badge-submitted',  label: 'Submitted',   dot: 'bg-amber-400' },
    APPROVED:    { cls: 'badge-approved',   label: 'Approved',    dot: 'bg-emerald-400' },
    REWORK:      { cls: 'badge-rework',     label: 'Rework',      dot: 'bg-rose-400' },
    ESCALATION:  { cls: 'badge-escalation', label: 'Escalation',  dot: 'bg-red-400', pulse: true },
    NOT_STARTED: { cls: 'badge-draft',      label: 'Not Started', dot: 'bg-slate-400' },
    ON_TRACK:    { cls: 'badge-submitted',  label: 'On Track',    dot: 'bg-amber-400' },
    COMPLETED:   { cls: 'badge-approved',   label: 'Completed',   dot: 'bg-emerald-400' },
    BLOCKED:     { cls: 'badge-rework',     label: 'Blocked',     dot: 'bg-rose-400' },
  };

  const config = CONFIG[status] || { cls: 'badge-draft', label: status?.replace(/_/g, ' '), dot: 'bg-slate-400' };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide ${config.cls}`}
    >
      <span className={`relative flex w-1.5 h-1.5`}>
        {config.pulse && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        )}
        <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${config.dot} opacity-80`} />
      </span>
      {config.label}
    </motion.span>
  );
};
