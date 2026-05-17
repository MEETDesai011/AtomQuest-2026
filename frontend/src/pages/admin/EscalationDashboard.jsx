import { useState } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2, ChevronDown } from 'lucide-react';

export default function EscalationDashboard() {
  const [filter, setFilter] = useState('ALL');

  const escalations = [
    { id: 1, type: 'OVERDUE_APPROVAL', severity: 'CRITICAL', employee: 'John Doe', manager: 'Sarah Smith', dept: 'Sales', daysPending: 12, goal: 'Q4 Revenue Target', status: 'UNRESOLVED' },
    { id: 2, type: 'MISSING_SUBMISSION', severity: 'HIGH', employee: 'Emma Wilson', manager: 'David Park', dept: 'Engineering', daysPending: 7, goal: 'Cloud Migration', status: 'UNRESOLVED' },
    { id: 3, type: 'OVERDUE_APPROVAL', severity: 'HIGH', employee: 'Mike Chen', manager: 'Lisa Chen', dept: 'HR', daysPending: 5, goal: 'Employee Retention', status: 'RESOLVED' },
    { id: 4, type: 'MISSING_SUBMISSION', severity: 'CRITICAL', employee: 'Tom Lee', manager: 'Tom Wilson', dept: 'Logistics', daysPending: 15, goal: 'Supply Chain Optimization', status: 'UNRESOLVED' },
    { id: 5, type: 'OVERDUE_APPROVAL', severity: 'LOW', employee: 'Anna Park', manager: 'Sarah Smith', dept: 'Marketing', daysPending: 3, goal: 'Brand Refresh Campaign', status: 'RESOLVED' },
  ];

  const filtered = filter === 'ALL' ? escalations : escalations.filter(e => e.status === filter);
  const criticalCount = escalations.filter(e => e.severity === 'CRITICAL' && e.status === 'UNRESOLVED').length;
  const highCount = escalations.filter(e => e.severity === 'HIGH' && e.status === 'UNRESOLVED').length;
  const resolvedCount = escalations.filter(e => e.status === 'RESOLVED').length;
  const unresolvedCount = escalations.filter(e => e.status === 'UNRESOLVED').length;

  return (
    <PageWrapper title="Escalation Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-red-50 rounded-xl border border-red-100 p-6">
          <div className="flex items-center gap-2 text-red-700 mb-2"><ShieldAlert className="w-5 h-5" /><span className="text-sm font-bold">Critical</span></div>
          <div className="text-3xl font-bold text-red-700"><AnimatedCounter end={criticalCount} /></div>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
          <div className="flex items-center gap-2 text-amber-700 mb-2"><AlertTriangle className="w-5 h-5" /><span className="text-sm font-bold">High Severity</span></div>
          <div className="text-3xl font-bold text-amber-700"><AnimatedCounter end={highCount} /></div>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-100 p-6">
          <div className="flex items-center gap-2 text-orange-700 mb-2"><Clock className="w-5 h-5" /><span className="text-sm font-bold">Unresolved</span></div>
          <div className="text-3xl font-bold text-orange-700"><AnimatedCounter end={unresolvedCount} /></div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-6">
          <div className="flex items-center gap-2 text-green-700 mb-2"><CheckCircle2 className="w-5 h-5" /><span className="text-sm font-bold">Resolved</span></div>
          <div className="text-3xl font-bold text-green-700"><AnimatedCounter end={resolvedCount} /></div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['ALL', 'UNRESOLVED', 'RESOLVED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === f ? 'bg-indigo-600 dark:bg-[#c0c1ff] text-white' : 'bg-white dark:bg-[#0b1326] text-gray-500 dark:text-[#c7c4d7] border border-gray-200 dark:border-[#464554] hover:bg-gray-50 dark:bg-[#171f33]'
            }`}
          >{f}</button>
        ))}
      </div>

      {/* Escalation Table */}
      <div className="bg-white dark:bg-[#0b1326] rounded-xl border border-gray-200 dark:border-[#464554] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-[#171f33]">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Type</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Severity</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Employee</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Manager</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Goal</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Days Pending</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#464554]">
              {filtered.map(e => (
                <tr key={e.id} className={`hover:bg-gray-50 dark:bg-[#171f33] transition-colors ${e.severity === 'CRITICAL' && e.status === 'UNRESOLVED' ? 'bg-red-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium bg-gray-50 dark:bg-[#171f33] text-gray-900 dark:text-[#dae2fd] px-2.5 py-1 rounded-full">
                      {e.type === 'OVERDUE_APPROVAL' ? '⏰ Overdue Approval' : '📋 Missing Submission'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      e.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      e.severity === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{e.severity}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-[#dae2fd]">{e.employee}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-[#c7c4d7]">{e.manager}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-[#dae2fd] font-medium max-w-[200px] truncate">{e.goal}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${e.daysPending > 10 ? 'text-red-600' : e.daysPending > 5 ? 'text-amber-600' : 'text-gray-500 dark:text-[#c7c4d7]'}`}>
                      {e.daysPending} days
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      e.status === 'RESOLVED' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                    }`}>{e.status}</span>
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
