import { CheckCircle, MessageSquare, AlertTriangle, Edit3, Zap } from 'lucide-react';

const TYPE_CONFIG = {
  APPROVAL: {
    icon: CheckCircle,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    dot: 'bg-emerald-400',
    line: 'bg-emerald-500/20',
  },
  COMMENT: {
    icon: MessageSquare,
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    dot: 'bg-blue-400',
    line: 'bg-blue-500/20',
  },
  ESCALATION: {
    icon: AlertTriangle,
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    dot: 'bg-rose-400',
    line: 'bg-rose-500/20',
  },
  EDIT: {
    icon: Edit3,
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
    dot: 'bg-indigo-400',
    line: 'bg-indigo-500/20',
  },
  DEFAULT: {
    icon: Zap,
    iconBg: 'bg-slate-500/15',
    iconColor: 'text-slate-400',
    dot: 'bg-slate-400',
    line: 'bg-slate-500/20',
  },
};

export function ActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3">
          <Zap className="w-5 h-5 text-slate-600" />
        </div>
        <p className="text-sm text-slate-600">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-6 space-y-0">
        {activities.map((activity, idx) => {
          const cfg = TYPE_CONFIG[activity.type] || TYPE_CONFIG.DEFAULT;
          const Icon = cfg.icon;

          return (
            <li key={activity.id} className="animate-fade-up" style={{ animationDelay: `${idx * 60}ms`, opacity: 0 }}>
              <div className="relative pb-6">
                {/* Connector line */}
                {idx !== activities.length - 1 && (
                  <span
                    className={`absolute left-4 top-8 -ml-px h-full w-px ${cfg.line} opacity-40`}
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex items-start gap-3">
                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-xl
                    ${cfg.iconBg} ${cfg.iconColor}
                    flex items-center justify-center
                    ring-4 ring-[#080d1a]
                  `}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-slate-300 leading-snug">
                      {activity.content}{' '}
                      <span className="font-semibold text-indigo-400">{activity.target}</span>
                    </p>
                    <time className="mt-1 block text-[11px] text-slate-600" dateTime={activity.datetime}>
                      {activity.date}
                    </time>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
