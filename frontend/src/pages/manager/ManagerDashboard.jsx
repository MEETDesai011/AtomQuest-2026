import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { StatCard } from '../../components/ui/StatCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { DataTable } from '../../components/ui/DataTable';
import { Link } from 'react-router-dom';
import { ActivityTimeline } from '../../components/ui/ActivityTimeline';
import { Users, ClipboardCheck, BarChart3, TrendingUp, ArrowRight, ChevronRight } from 'lucide-react';

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

  const teamSize        = team?.length || 0;
  const pendingApprovals = team?.reduce((sum, m) => sum + (m._count?.goals > 0 ? 1 : 0), 0) || 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'Manager';

  const mockActivities = [
    { id: 1, type: 'APPROVAL', content: 'You approved goals for', target: 'John Doe', date: 'Just now', datetime: '2023-01-01' },
    { id: 2, type: 'COMMENT',  content: 'You left a comment on',  target: 'Sarah Smith', date: '2 hours ago', datetime: '2023-01-01' },
    { id: 3, type: 'EDIT',     content: 'Inline edit performed on', target: 'Project Alpha', date: '1 day ago', datetime: '2023-01-01' },
  ];

  const columns = [
    {
      label: 'Team Member',
      key: 'name',
      render: r => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-indigo-violet flex items-center justify-center text-white text-xs font-bold shrink-0">
            {r.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">{r.name}</div>
            <div className="text-xs text-slate-500">{r.department || 'No department'}</div>
          </div>
        </div>
      )
    },
    {
      label: 'Goals',
      key: 'goals',
      render: r => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200">{r._count?.goals || 0}</span>
          <span className="text-xs text-slate-600">total</span>
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
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20
              hover:bg-indigo-500/20 hover:border-indigo-400/40 transition-all duration-200
            "
          >
            Review Goals
            <ChevronRight className="w-3 h-3" />
          </Link>
          <Link
            to={`/manager/checkin/${r.id}`}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20
              hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all duration-200
            "
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
      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Team Size"           value={teamSize}         icon={Users}         accent="indigo"  sub="Direct reports" />
        <StatCard label="Pending Approvals"   value={pendingApprovals} icon={ClipboardCheck} accent="amber"  sub="Estimated" trend={-2} />
        <StatCard label="Check-ins Done"      value="—"                icon={BarChart3}     accent="emerald" sub="This quarter" />
        <StatCard label="Team Progress"       value="—"                icon={TrendingUp}    accent="violet"  sub="Goal completion" />
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Table */}
        <div className="lg:col-span-2 animate-fade-up delay-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h3 className="heading-md text-slate-200">My Team</h3>
              {teamSize > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
                  {teamSize}
                </span>
              )}
            </div>
            <Link
              to="/manager/effectiveness"
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View Effectiveness
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <DataTable
            columns={columns}
            data={team}
            loading={loading}
            emptyMessage="You don't have any direct reports assigned."
          />
        </div>

        {/* Activity Feed */}
        <div className="animate-fade-up delay-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <h3 className="heading-md text-slate-200">Recent Activity</h3>
          </div>
          <div className="card p-5">
            <ActivityTimeline activities={mockActivities} />
          </div>
        </div>
      </div>

      {/* ── Quick Action Cards ── */}
      <div>
        <h3 className="heading-md text-slate-200 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              to: '/manager/effectiveness',
              title: 'Effectiveness Analytics',
              description: 'View your manager effectiveness score and team benchmarks',
              icon: TrendingUp,
              accent: 'violet',
            },
          ].map(card => (
            <Link
              key={card.to}
              to={card.to}
              className="card card-lift p-5 flex items-start gap-4 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                card.accent === 'violet' ? 'bg-violet-500/15 text-violet-400' : 'bg-indigo-500/15 text-indigo-400'
              }`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                  {card.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{card.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 mt-3" />
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
