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
  TrendingUp, Zap, Circle
} from 'lucide-react';

const QUICK_NAV = [
  { to: '/admin/cycles',              title: 'Cycle Manager',     desc: 'Create & manage goal cycles',          icon: RefreshCcw, accent: 'cyan'    },
  { to: '/admin/reports',             title: 'Reports',           desc: 'Achievement reports & exports',         icon: FileBarChart, accent: 'emerald'},
  { to: '/admin/audit',               title: 'Audit Log',         desc: 'Track all system changes',              icon: ScrollText, accent: 'violet'  },
  { to: '/admin/analytics',           title: 'Analytics',         desc: 'QoQ trends & performance heatmaps',     icon: BarChart3, accent: 'indigo'   },
  { to: '/admin/escalations',         title: 'Escalation Logs',  desc: 'Proactive alerts & system warnings',     icon: AlertTriangle, accent: 'rose' },
  { to: '/admin/escalation-dashboard',title: 'Escalation Ops',   desc: 'Operational mission control center',     icon: Activity, accent: 'rose'      },
  { to: '/admin/departments',         title: 'Dept. Comparison',  desc: 'Cross-department benchmarking',          icon: Users, accent: 'amber'        },
  { to: '/admin/dependencies',        title: 'Goal Graph',        desc: 'Visualize goal dependencies',            icon: GitBranch, accent: 'cyan'     },
];

const ACCENT_CFG = {
  indigo:  { icon: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/15',  hover: 'hover:border-indigo-400/40' },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/15',    hover: 'hover:border-cyan-400/40' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', hover: 'hover:border-emerald-400/40' },
  violet:  { icon: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/15',  hover: 'hover:border-violet-400/40' },
  rose:    { icon: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/15',    hover: 'hover:border-rose-400/40' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/15',   hover: 'hover:border-amber-400/40' },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: users, loading: loadingUsers } = useApi('/admin/users');
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

  const employees   = users?.filter(u => u.role === 'EMPLOYEE') || [];
  const managers    = users?.filter(u => u.role === 'MANAGER')  || [];
  const activeCycles = cycles?.filter(c => c.isActive) || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  const mockActivities = [
    { id: 1, type: 'APPROVAL',   content: 'Manager approved goals for', target: 'John Doe',    date: '10 mins ago', datetime: '2023-01-01' },
    { id: 2, type: 'COMMENT',    content: 'Check-in comment left by',   target: 'Sarah Smith', date: '1 hour ago',  datetime: '2023-01-01' },
    { id: 3, type: 'ESCALATION', content: 'System escalated goals for', target: 'Mike Johnson',date: '3 hours ago', datetime: '2023-01-01' },
    { id: 4, type: 'EDIT',       content: 'Inline edit performed by',   target: 'Jane Doe',    date: '1 day ago',   datetime: '2023-01-01' },
  ];

  return (
    <PageWrapper
      title={`${greeting}, ${firstName} 🛡️`}
      subtitle="Enterprise Analytics Control Center — investor-demo quality insights."
    >
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Employees" value={employees.length} icon={Users}      accent="indigo"  sub="Active workforce"  trend={8}  />
        <StatCard label="Total Managers"  value={managers.length}  icon={ShieldCheck} accent="violet"  sub="Team leads"        trend={2}  />
        <StatCard label="Active Cycles"   value={activeCycles.length} icon={RefreshCcw} accent="cyan" sub="Goal cycles open"          />
        <StatCard label="Total Users"     value={users?.length || 0}  icon={TrendingUp} accent="emerald" sub="Platform-wide"  trend={12} />
      </div>

      {/* ── Active Cycles + Activity Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active cycles */}
        <div className="lg:col-span-2 animate-fade-up delay-100">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCcw className="w-4 h-4 text-cyan-400" />
            <h3 className="heading-md text-slate-200">Active Cycles</h3>
          </div>
          {activeCycles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCycles.map(cycle => (
                <div
                  key={cycle.id}
                  className="card border-cyan-500/15 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                  <div className="relative p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm font-bold text-slate-200">{cycle.year}</div>
                        <div className="label-xs text-slate-500 mt-0.5">{cycle.phase?.replace(/_/g,' ')}</div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/12 border border-emerald-500/20">
                        <Circle className="w-2 h-2 text-emerald-400 fill-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400">ACTIVE</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Window Open</span>
                        <span className="text-slate-300 font-medium">
                          {new Date(cycle.windowOpen).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Window Close</span>
                        <span className="text-slate-300 font-medium">
                          {new Date(cycle.windowClose).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/4 flex items-center justify-center mx-auto mb-3">
                <RefreshCcw className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-sm text-slate-500">No active cycles. Create one in Cycle Manager.</p>
              <Link to="/admin/cycles" className="mt-4 btn-secondary inline-flex text-xs">
                Open Cycle Manager
              </Link>
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="animate-fade-up delay-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="heading-md text-slate-200">Live Activity</h3>
          </div>
          <div className="card p-5">
            <ActivityTimeline activities={mockActivities} />
          </div>
        </div>
      </div>

      {/* ── Quick Navigation ── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-indigo-400" />
          <h3 className="heading-md text-slate-200">Quick Navigation</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_NAV.map((card, idx) => {
            const a = ACCENT_CFG[card.accent] || ACCENT_CFG.indigo;
            return (
              <Link
                key={card.to}
                to={card.to}
                className={`
                  card card-lift p-5 flex flex-col
                  border ${a.border} ${a.hover}
                  group animate-fade-up
                `}
                style={{ animationDelay: `${idx * 50}ms`, opacity: 0 }}
              >
                <div className={`w-10 h-10 rounded-xl ${a.bg} ${a.icon} flex items-center justify-center mb-4`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <h4 className={`text-sm font-semibold text-slate-200 group-hover:${a.icon} transition-colors mb-1`}>
                  {card.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{card.desc}</p>
                <div className={`flex items-center gap-1 mt-4 text-xs ${a.icon} opacity-0 group-hover:opacity-100 transition-all`}>
                  <span>Navigate</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
