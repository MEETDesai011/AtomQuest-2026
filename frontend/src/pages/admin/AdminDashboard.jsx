import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { StatCard } from '../../components/ui/StatCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { ActivityTimeline } from '../../components/ui/ActivityTimeline';
import {
  Users, ShieldCheck, RefreshCcw, BarChart3, ScrollText,
  FileBarChart, AlertTriangle, ArrowRight, Activity, GitBranch,
  TrendingUp, Zap, Circle, Sparkles
} from 'lucide-react';

const QUICK_NAV = [
  { to: '/admin/cycles',               title: 'Cycle Manager',     desc: 'Create & manage goal cycles',          icon: RefreshCcw,    accent: 'cyan'    },
  { to: '/admin/reports',              title: 'Reports',           desc: 'Achievement reports & exports',         icon: FileBarChart,  accent: 'emerald' },
  { to: '/admin/audit',                title: 'Audit Log',         desc: 'Track all system changes',              icon: ScrollText,    accent: 'violet'  },
  { to: '/admin/analytics',            title: 'Analytics',         desc: 'QoQ trends & performance heatmaps',    icon: BarChart3,     accent: 'indigo'  },
  { to: '/admin/escalations',          title: 'Escalation Logs',   desc: 'Proactive alerts & system warnings',   icon: AlertTriangle, accent: 'rose'    },
  { to: '/admin/escalation-dashboard', title: 'Escalation Ops',    desc: 'Operational mission control center',   icon: Activity,     accent: 'rose'    },
  { to: '/admin/departments',          title: 'Dept. Comparison',  desc: 'Cross-department benchmarking',         icon: Users,        accent: 'amber'   },
  { to: '/admin/dependencies',         title: 'Goal Graph',        desc: 'Visualize goal dependencies',           icon: GitBranch,    accent: 'cyan'    },
];

const ACCENT_CFG = {
  indigo:  { icon: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/15',  hover: 'hover:border-indigo-400/40',  glow: 'rgba(99,102,241,0.08)' },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/15',    hover: 'hover:border-cyan-400/40',    glow: 'rgba(34,211,238,0.06)' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', hover: 'hover:border-emerald-400/40', glow: 'rgba(52,211,153,0.06)' },
  violet:  { icon: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/15',  hover: 'hover:border-violet-400/40',  glow: 'rgba(139,92,246,0.08)' },
  rose:    { icon: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/15',    hover: 'hover:border-rose-400/40',    glow: 'rgba(251,113,133,0.06)' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/15',   hover: 'hover:border-amber-400/40',   glow: 'rgba(251,191,36,0.06)' },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: users,  loading: loadingUsers  } = useApi('/admin/users');
  const { data: cycles, loading: loadingCycles } = useApi('/cycles');

  if (loadingUsers || loadingCycles) {
    return (
      <PageWrapper title="Admin Control Center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </PageWrapper>
    );
  }

  const employees    = users?.filter(u => u.role === 'EMPLOYEE') || [];
  const managers     = users?.filter(u => u.role === 'MANAGER')  || [];
  const activeCycles = cycles?.filter(c => c.isActive) || [];

  const hour = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  const mockActivities = [
    { id: 1, type: 'APPROVAL',   content: 'Manager approved goals for', target: 'John Doe',     date: '10 mins ago',  datetime: '2023-01-01' },
    { id: 2, type: 'COMMENT',    content: 'Check-in comment left by',   target: 'Sarah Smith',  date: '1 hour ago',   datetime: '2023-01-01' },
    { id: 3, type: 'ESCALATION', content: 'System escalated goals for', target: 'Mike Johnson', date: '3 hours ago',  datetime: '2023-01-01' },
    { id: 4, type: 'EDIT',       content: 'Inline edit performed by',   target: 'Jane Doe',     date: '1 day ago',    datetime: '2023-01-01' },
  ];

  return (
    <PageWrapper
      title={`${greeting}, ${firstName} 🛡️`}
      subtitle="Enterprise Analytics Control Center — investor-demo quality insights."
    >
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Employees" value={employees.length}   icon={Users}      accent="indigo"  sub="Active workforce"  trend={8}  delay={0.05} />
        <StatCard label="Total Managers"  value={managers.length}    icon={ShieldCheck} accent="violet"  sub="Team leads"        trend={2}  delay={0.12} />
        <StatCard label="Active Cycles"   value={activeCycles.length} icon={RefreshCcw} accent="cyan"   sub="Goal cycles open"             delay={0.19} />
        <StatCard label="Total Users"     value={users?.length || 0}  icon={TrendingUp} accent="emerald" sub="Platform-wide"     trend={12} delay={0.26} />
      </div>

      {/* Active Cycles + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active cycles */}
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <RefreshCcw className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Active Cycles</h3>
            {activeCycles.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                {activeCycles.length}
              </span>
            )}
          </div>
          {activeCycles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCycles.map((cycle, i) => (
                <motion.div
                  key={cycle.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="rounded-2xl overflow-hidden relative border border-cyan-500/15"
                  style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                  <div className="relative p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-base font-bold text-slate-200">{cycle.year}</div>
                        <div className="text-[10px] font-bold text-slate-600 mt-0.5 uppercase tracking-widest">{cycle.phase?.replace(/_/g, ' ')}</div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <Circle className="w-2 h-2 text-emerald-400 fill-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-slate-500">
                      <div className="flex justify-between items-center">
                        <span>Window Open</span>
                        <span className="text-slate-300 font-semibold">
                          {new Date(cycle.windowOpen).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Window Close</span>
                        <span className="text-slate-300 font-semibold">
                          {new Date(cycle.windowClose).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-2xl p-8 text-center border border-white/[0.06]"
              style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/4 flex items-center justify-center mx-auto mb-3">
                <RefreshCcw className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-sm text-slate-500">No active cycles. Create one in Cycle Manager.</p>
              <Link to="/admin/cycles" className="mt-4 btn-secondary inline-flex text-xs">
                Open Cycle Manager
              </Link>
            </div>
          )}
        </motion.div>

        {/* Live Activity */}
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="relative flex">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-60 top-0.5 left-0.5" />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400 mt-0.5 ml-0.5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">Live Activity</h3>
          </div>
          <div
            className="rounded-2xl p-5 border border-white/[0.06]"
            style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
          >
            <ActivityTimeline activities={mockActivities} />
          </div>
        </motion.div>
      </div>

      {/* AI Insights panel */}
      <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible"
        className="rounded-2xl overflow-hidden relative border border-violet-500/15"
        style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/3 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">AtomQuest AI Insights</h3>
            <span className="flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Anomaly', text: 'Logistics completion dropped 12% in Q3, deviating from their historical 88% average.', color: 'text-rose-400', bg: 'bg-rose-500/8', border: 'border-rose-500/15' },
              { label: 'Prediction', text: '3 employees in Sales have "DRAFT" goals mathematically unlikely to be met by Q4.', color: 'text-amber-400', bg: 'bg-amber-500/8', border: 'border-amber-500/15' },
              { label: 'Suggestion', text: 'Consider unlocking "Cloud Migration" goals for Product — 40% are marked REWORK.', color: 'text-indigo-400', bg: 'bg-indigo-500/8', border: 'border-indigo-500/15' },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                className={`p-4 rounded-xl border ${item.bg} ${item.border}`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.label}</span>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Navigation */}
      <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Quick Navigation</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_NAV.map((card, idx) => {
            const a = ACCENT_CFG[card.accent] || ACCENT_CFG.indigo;
            return (
              <motion.div key={card.to} custom={idx} variants={cardVariants} initial="hidden" animate="visible"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Link
                  to={card.to}
                  className={`group rounded-2xl p-5 flex flex-col border ${a.border} ${a.hover} transition-all duration-200 h-full`}
                  style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
                >
                  <div className={`w-10 h-10 rounded-xl ${a.bg} ${a.icon} flex items-center justify-center mb-4`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h4 className={`text-sm font-bold text-slate-200 group-hover:${a.icon} transition-colors mb-1`}>
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed flex-1">{card.desc}</p>
                  <div className={`flex items-center gap-1 mt-4 text-xs ${a.icon} opacity-0 group-hover:opacity-100 transition-all`}>
                    <span>Navigate</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
