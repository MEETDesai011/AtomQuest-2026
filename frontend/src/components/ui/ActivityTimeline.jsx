import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MessageSquare, AlertTriangle, Edit3, Zap } from 'lucide-react';

const TYPE_CONFIG = {
  APPROVAL:   { icon: CheckCircle,   iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', line: 'bg-emerald-500/20', dot: 'bg-emerald-400', label: 'Approved' },
  COMMENT:    { icon: MessageSquare, iconBg: 'bg-blue-500/15',    iconColor: 'text-blue-400',    line: 'bg-blue-500/20',    dot: 'bg-blue-400',    label: 'Comment' },
  ESCALATION: { icon: AlertTriangle, iconBg: 'bg-rose-500/15',    iconColor: 'text-rose-400',    line: 'bg-rose-500/20',    dot: 'bg-rose-400',    label: 'Escalation' },
  EDIT:       { icon: Edit3,         iconBg: 'bg-indigo-500/15',  iconColor: 'text-indigo-400',  line: 'bg-indigo-500/20',  dot: 'bg-indigo-400',  label: 'Edited' },
  DEFAULT:    { icon: Zap,           iconBg: 'bg-slate-500/15',   iconColor: 'text-slate-400',   line: 'bg-slate-500/20',   dot: 'bg-slate-400',   label: 'Event' },
};

export function ActivityTimeline({ activities }) {
  if (!activities?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-10 h-10 rounded-xl bg-white/4 flex items-center justify-center mb-3">
          <Zap className="w-5 h-5 text-slate-700" />
        </div>
        <p className="text-sm text-slate-600">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="space-y-0">
        {activities.map((activity, idx) => {
          const cfg = TYPE_CONFIG[activity.type] || TYPE_CONFIG.DEFAULT;
          const Icon = cfg.icon;
          return (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative pb-5">
                {idx !== activities.length - 1 && (
                  <span className={`absolute left-4 top-8 -ml-px h-full w-px ${cfg.line} opacity-40`} aria-hidden="true" />
                )}
                <motion.div
                  className="relative flex items-start gap-3"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.15 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-xl ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center ring-4 ring-[#070b16]`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </motion.div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-slate-400 leading-snug">
                      {activity.content}{' '}
                      <span className="font-semibold text-indigo-400">{activity.target}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} opacity-60`} />
                      <time className="text-[11px] text-slate-600">{activity.date}</time>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.iconBg} ${cfg.iconColor} uppercase tracking-wider`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
