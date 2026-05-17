import { PageWrapper } from '../../components/layout/PageWrapper';
import { StatCard } from '../../components/ui/StatCard';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { useApi } from '../../hooks/useApi';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ManagerEffectiveness() {
  const { data: team, loading } = useApi('/manager/team');

  if (loading) return <PageWrapper><div className="grid grid-cols-4 gap-6"><SkeletonCard/><SkeletonCard/><SkeletonCard/><SkeletonCard/></div></PageWrapper>;

  // Simulated effectiveness metrics (in production, this comes from a dedicated analytics API)
  const avgApprovalTurnaround = 1.8; // days
  const overdueReviews = 3;
  const reworkPercentage = 12;
  const completionRate = 87;

  const departmentData = [
    { name: 'Sales', completion: 92, color: 'var(--brand-primary)' },
    { name: 'Engineering', completion: 78, color: '#8b5cf6' },
    { name: 'HR', completion: 95, color: '#06b6d4' },
    { name: 'Marketing', completion: 84, color: '#f59e0b' },
    { name: 'Logistics', completion: 65, color: '#ef4444' },
  ];

  const teamMembers = [
    { name: 'John Doe', goalsApproved: 5, avgDays: 1.2, rework: 0, status: 'On Track' },
    { name: 'Sarah Lee', goalsApproved: 3, avgDays: 2.5, rework: 1, status: 'At Risk' },
    { name: 'Mike Chen', goalsApproved: 4, avgDays: 0.8, rework: 0, status: 'On Track' },
    { name: 'Emma Wilson', goalsApproved: 2, avgDays: 3.1, rework: 2, status: 'Needs Attention' },
  ];

  return (
    <PageWrapper title="Manager Effectiveness Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-[#c7c4d7] mb-1">Avg Approval Turnaround</div>
          <div className="text-3xl font-bold text-indigo-600 dark:text-[#c0c1ff]"><AnimatedCounter end={avgApprovalTurnaround} decimals={1} /> days</div>
          <div className="text-xs text-green-600 mt-1">↓ 0.5 days vs last quarter</div>
        </div>
        <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-[#c7c4d7] mb-1">Overdue Reviews</div>
          <div className="text-3xl font-bold text-red-600"><AnimatedCounter end={overdueReviews} /></div>
          <div className="text-xs text-red-500 mt-1">⚠ Requires immediate action</div>
        </div>
        <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-[#c7c4d7] mb-1">Rework Rate</div>
          <div className="text-3xl font-bold text-amber-600"><AnimatedCounter end={reworkPercentage} />%</div>
          <div className="text-xs text-gray-500 dark:text-[#c7c4d7] mt-1">Industry avg: 15%</div>
        </div>
        <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm p-6">
          <div className="text-sm font-medium text-gray-500 dark:text-[#c7c4d7] mb-1">Team Completion Rate</div>
          <div className="text-3xl font-bold text-emerald-600"><AnimatedCounter end={completionRate} />%</div>
          <div className="text-xs text-green-600 mt-1">↑ 4% vs last quarter</div>
        </div>
      </div>

      {/* Department Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#dae2fd] mb-4">Department Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(v) => [`${v}%`, 'Completion']} />
              <Bar dataKey="completion" radius={[0, 6, 6, 0]} barSize={24}>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 dark:border-[#c0c1ff]/20 p-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-4">🤖 AI Recommendations</h3>
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#0b1326] rounded-lg p-4 border border-indigo-200 dark:border-[#c0c1ff]/20">
              <div className="text-sm font-semibold text-red-700">⚠ High Priority</div>
              <p className="text-sm text-gray-900 dark:text-[#dae2fd] mt-1">Logistics department completion dropped 27% vs industry benchmark. Recommend scheduling 1:1 intervention with team lead.</p>
            </div>
            <div className="bg-white dark:bg-[#0b1326] rounded-lg p-4 border border-indigo-200 dark:border-[#c0c1ff]/20">
              <div className="text-sm font-semibold text-amber-700">📊 Trend Alert</div>
              <p className="text-sm text-gray-900 dark:text-[#dae2fd] mt-1">Emma Wilson's rework rate is 2x the team average. Consider adjusting goal complexity or providing additional mentorship.</p>
            </div>
            <div className="bg-white dark:bg-[#0b1326] rounded-lg p-4 border border-indigo-200 dark:border-[#c0c1ff]/20">
              <div className="text-sm font-semibold text-green-700">✅ Positive Signal</div>
              <p className="text-sm text-gray-900 dark:text-[#dae2fd] mt-1">Your average approval turnaround (1.8 days) is 40% faster than the organizational mean. Excellent!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Member Breakdown */}
      <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#464554]">
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#dae2fd]">Team Member Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-[#171f33]">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Goals Approved</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Avg Days</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Rework Count</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#464554]">
              {teamMembers.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:bg-[#171f33] transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-[#dae2fd]">{m.name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-[#c7c4d7]">{m.goalsApproved}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-[#c7c4d7]">{m.avgDays} days</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-[#c7c4d7]">{m.rework}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      m.status === 'On Track' ? 'bg-green-50 text-green-700' :
                      m.status === 'At Risk' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}
