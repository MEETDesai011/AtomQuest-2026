import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { StatCard } from '../../components/ui/StatCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { DataTable } from '../../components/ui/DataTable';
import { Link } from 'react-router-dom';
import { ActivityTimeline } from '../../components/ui/ActivityTimeline';
import { Users, ClipboardCheck, BarChart3, TrendingUp, ArrowRight, ChevronRight, Shield } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { data: team, loading } = useApi('/manager/team');

  if (loading) {
    return (
      <PageWrapper title="Team Dashboard">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </PageWrapper>
    );
  }

  const teamSize         = team?.length || 0;
  const pendingApprovals = team?.reduce((sum, m) => sum + (m._count?.goals > 0 ? 1 : 0), 0) || 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'Manager';

  const mockActivities = [
    { id: 1, type: 'APPROVAL', content: 'You approved goals for', target: 'John Doe',    date: 'Just now',   datetime: '2023-01-01' },
    { id: 2, type: 'COMMENT',  content: 'You left a comment on',  target: 'Sarah Smith', date: '2 hours ago', datetime: '2023-01-01' },
    { id: 3, type: 'EDIT',     content: 'Inline edit on',         target: 'Project Alpha',date: '1 day ago',  datetime: '2023-01-01' },
  ];

  const columns = [
    {
      label: 'Team Member',
      key: 'name',
      render: r => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {r.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">{r.name}</div>
            <div className="text-xs text-slate-600">{r.department || 'No department'}</div>
          </div>
        </div>
      )
    },
    {
      label: 'Goals',
      key: 'goals',
      render: r => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-200">{r._count?.goals || 0}</span>
          <span className="text-xs text-slate-600">goals</span>
        </div>
      )
    },
    {
      label: 'Actions',
      key: 'actions',
      render: r => (
        <div className="flex items-center gap-2">
          <Link
            to={`/manager/approve/${r.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-400 bg-indigo-500/8 border border-indigo-500/20 hover:bg-indigo-500/15 hover:border-indigo-400/40 transition-all duration-200"
          >
            Review Goals <ChevronRight className="w-3 h-3" />
          </Link>
          <Link
            to={`/manager/checkin/${r.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 bg-cyan-500/8 border border-cyan-500/20 hover:bg-cyan-500/15 hover:border-cyan-400/40 transition-all duration-200"
          >
            Check-in
          </Link>
        </div>
      )
    }
  ];

  return (
    <PageWrapper
      title={`${greeting}, ${firstName} 👋`}
      subtitle="Your team performance command center — real-time and data-rich."
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Team Size"         value={teamSize}         icon={Users}         accent="indigo"  sub="Direct reports"    delay={0.05} />
        <StatCard label="Pending Approvals" value={pendingApprovals} icon={ClipboardCheck} accent="amber"  sub="Estimated" trend={-2} delay={0.12} />
        <StatCard label="Check-ins Done"    value="—"                icon={BarChart3}     accent="emerald" sub="This quarter"       delay={0.19} />
        <StatCard label="Team Progress"     value="—"                icon={TrendingUp}    accent="violet"  sub="Goal completion"    delay={0.26} />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team table */}
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-slate-200">My Team</h3>
              {teamSize > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                  {teamSize}
                </span>
              )}
            </div>
            <Link
              to="/manager/effectiveness"
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View Effectiveness <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <DataTable
            columns={columns}
            data={team}
            loading={loading}
            emptyMessage="You don't have any direct reports assigned."
          />
        </motion.div>

        {/* Activity feed */}
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base font-bold text-slate-200">Recent Activity</h3>
          </div>
          <div
            className="rounded-2xl p-5 border border-white/[0.06]"
            style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
          >
            <ActivityTimeline activities={mockActivities} />
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
        <h3 className="text-base font-bold text-slate-200 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              to: '/manager/effectiveness',
              title: 'Effectiveness Analytics',
              description: 'View your manager effectiveness score and team benchmarks',
              icon: TrendingUp,
              accent: { icon: 'text-violet-400', bg: 'bg-violet-500/15', border: 'border-violet-500/20', hover: 'hover:border-violet-400/40' },
            },
            {
              to: '/manager/dashboard',
              title: 'Team Compliance',
              description: 'Monitor submission rates and goal setting compliance',
              icon: Shield,
              accent: { icon: 'text-indigo-400', bg: 'bg-indigo-500/15', border: 'border-indigo-500/20', hover: 'hover:border-indigo-400/40' },
            },
          ].map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={`group rounded-2xl p-5 flex items-start gap-4 border ${card.accent.border} ${card.accent.hover} transition-all duration-200`}
              style={{ background: 'rgba(12,18,32,0.85)', backdropFilter: 'blur(20px)' }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.accent.bg} ${card.accent.icon}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold text-slate-200 group-hover:${card.accent.icon} transition-colors`}>
                  {card.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 mt-3" />
            </Link>
          ))}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
